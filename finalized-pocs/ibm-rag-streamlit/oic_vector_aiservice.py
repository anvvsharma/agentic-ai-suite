params = {
    "space_id": "69ab49b6-389c-4f98-92e1-cec425d1a88b", 
    "vector_index_id": "5680c864-2261-49c6-b689-d9274ae5c238"
}

def gen_ai_service(context, params = params, **custom):
    # import dependencies
    import json
    from ibm_watsonx_ai.foundation_models import ModelInference
    from ibm_watsonx_ai.foundation_models.utils import Tool, Toolkit
    from ibm_watsonx_ai import APIClient, Credentials
    import os
    import requests
    import re

    vector_index_id = params.get("vector_index_id")
    space_id = params.get("space_id")

    def proximity_search( query, api_client ):
        document_search_tool = Toolkit(
            api_client=api_client
        ).get_tool("RAGQuery")

        config = {
            "vectorIndexId": vector_index_id,
            "spaceId": space_id
        }

        results = document_search_tool.run(
            input=query,
            config=config
        )

        return results.get("output")


    def get_api_client(context):
        credentials = Credentials(
            url="https://eu-de.ml.cloud.ibm.com",
            token=context.get_token()
        )

        api_client = APIClient(
            credentials = credentials,
            space_id = space_id
        )

        return api_client

    def text_detection(context, text, detectors):
        if (not text):
            return []
        body = {
            "detectors": detectors,
            "input": text,
            "space_id": space_id
        }
    
        query_params = {
            "version": "2023-05-23"
        }
    
        headers  = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f'Bearer {context.get_token()}'
        }
        
        #detection_url = "https://private.eu-de.ml.cloud.ibm.com"
        detection_url = "https://eu-de.ml.cloud.ibm.com"
        detection_response = requests.post(f'{detection_url}/ml/v1/text/detection', headers = headers, json = body, params = query_params)
        
        if (detection_response.status_code > 400):
            raise Exception(f'Error doing text detection: {detection_response.json()}' )
        
        return detection_response.json().get("detections")
    
    def moderate_stream(response_stream):
        regex = r'^[^?.!\n].*[?.!\n]$'
    
        sentence = ""
    
        for chunk in response_stream:
            if (len(chunk["choices"])):
                sentence = f'{sentence}{chunk["choices"][0]["delta"]["content"]}'
                if (not bool(re.match(regex, sentence))):
                    continue
                    
            detectors = {
                "hap": {
                    "enabled": True,
                    "threshold": 0.5
                }
            }
    
            detections = text_detection(context, sentence, detectors)
    
            if (len(detections)):
                for detection in detections:
                    if (detection["detection_type"] == "pii"):
                        sentence = sentence.replace(detection["text"], "[Possibly personal information removed]")
                    elif (detection["detection_type"] == "hap"):
                        sentence = sentence.replace(detection["text"], "[Potentially harmful text removed]")
            
            chunk_response = {
                "choices": [{
                    "index": 0,
                    "delta": {
                        "role": "assistant",
                        "content": sentence
                    }
                    
                }]
            }
    
            yield chunk_response
            sentence = ""
        
    def moderation_input(mask):
        return {
            "choices": [{
                "index": 0,
                "message": {
                "role": "assistant",
                "content": mask
                }
            }]
        }
    
    def moderation_input_stream(mask):
        yield {
            "choices": [{
                "index": 0,
                "delta": {
                    "role": "assistant",
                    "content": mask
                }
                
            }]
        }
    
    def get_moderation_input_mask(detections):
        mask = ""
        if (detections[0]["detection_type"] == "pii"):
            mask = "[The input was rejected for containing personal information]."
        elif (detections[0]["detection_type"] == "hap"):
            mask = "[The input was rejected as inappropriate]."
        elif (detections[0]["detection_type"] == "risk"):
            mask = "[The input was rejected as harmful by granite guardian]."
        return mask
        

    def inference_model( messages, context, stream ):
        query = messages[-1].get("content")
        api_client = get_api_client(context)

        grounding_context = proximity_search(query, api_client)

        grounding = grounding_context
        question = query
        messages[-1]["content"] = f"""Use the following pieces of context to answer the question.

{grounding}

Question: {question}"""
        messages.insert(0, {
            "role": f"system",
            "content": f"You are Granite, an AI language model developed by IBM in 2024. You are a cautious assistant. You carefully follow instructions. You are helpful and harmless and you follow ethical guidelines and promote positive behavior. You are a AI language model designed to function as a specialized Retrieval Augmented Generation (RAG) assistant. When generating responses, prioritize correctness, i.e., ensure that your response is correct given the context and user query, and that it is grounded in the context. Furthermore, make sure that the response is supported by the given document or context. Always make sure that your response is relevant to the question. If an explanation is needed, first provide the explanation or reasoning, and then give the final answer. Avoid repeating information unless asked."
        })

        # moderate input
        system_prompt_content = "".join(map(lambda message: message.get("content"), list(filter(lambda message: message.get("role") == "system", messages))))
        
        detectors = {
                "hap": {
                    "enabled": True,
                    "threshold": 0.5
                }
            }
        detections = text_detection(context, f'{system_prompt_content}{query}', detectors)
        if (len(detections)):
            mask = get_moderation_input_mask(detections)
            if (stream):
                return moderation_input_stream(mask)
            else:
                return moderation_input(mask)
            
        model_id = "ibm/granite-3-8b-instruct"
        parameters =  {
            "frequency_penalty": 0,
            "max_tokens": 2000,
            "presence_penalty": 0,
            "temperature": 0,
            "top_p": 1
        }
        model = ModelInference(
            model_id = model_id,
            api_client = api_client,
            params = parameters,
        )
        # Generate grounded response
        if (stream == True):
            generated_response = model.chat_stream(messages=messages)
        else:
            generated_response = model.chat(messages=messages)

        return generated_response


    def generate(context):
        payload = context.get_json()
        messages = payload.get("messages")
        
        # Grounded inferencing
        generated_response = inference_model(messages, context, False)

        execute_response = {
            "headers": {
                "Content-Type": "application/json"
            },
            "body": generated_response
        }

        return execute_response

    def generate_stream(context):
        payload = context.get_json()
        messages = payload.get("messages")

        # Grounded inferencing
        response_stream = inference_model(messages, context, True)

        moderated_stream = moderate_stream(response_stream)

        for chunk in moderated_stream:
            yield chunk

    return generate, generate_stream
