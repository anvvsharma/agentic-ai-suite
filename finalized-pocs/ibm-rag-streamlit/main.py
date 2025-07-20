from oic_vector_aiservice import gen_ai_service

class MyContext:
    def __init__(self, token, messages):
        self._token = token
        self._messages = messages

    def get_token(self):
        # Return your IBM watsonx.ai API bearer token here
        return self._token

    def get_json(self):
        # Return the input payload with messages for the AI model
        return {
            "messages": self._messages
        }

if __name__ == "__main__":
    # Your IBM watsonx.ai API bearer token (replace with your actual token)
    my_token = "eyJraWQiOiIyMDE5MDcyNCIsImFsZyI6IlJTMjU2In0.eyJpYW1faWQiOiJJQk1pZC02OTYwMDBNSEdXIiwiaWQiOiJJQk1pZC02OTYwMDBNSEdXIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiM2Q0MjY5MjgtMDBkZC00OTI2LWJmM2EtNjJlNjIzNDZjMWRlIiwiaWRlbnRpZmllciI6IjY5NjAwME1IR1ciLCJnaXZlbl9uYW1lIjoiVmVlcmFiaGFkcmEiLCJmYW1pbHlfbmFtZSI6IlNoYXJtYSIsIm5hbWUiOiJWZWVyYWJoYWRyYSBTaGFybWEiLCJlbWFpbCI6InZlZXJhYmhhZHJhLnNoYXJtYUBhY2NlbGFscGhhLmNvbSIsInN1YiI6InZlZXJhYmhhZHJhLnNoYXJtYUBhY2NlbGFscGhhLmNvbSIsImF1dGhuIjp7InN1YiI6InZlZXJhYmhhZHJhLnNoYXJtYUBhY2NlbGFscGhhLmNvbSIsImlhbV9pZCI6IklCTWlkLTY5NjAwME1IR1ciLCJuYW1lIjoiVmVlcmFiaGFkcmEgU2hhcm1hIiwiZ2l2ZW5fbmFtZSI6IlZlZXJhYmhhZHJhIiwiZmFtaWx5X25hbWUiOiJTaGFybWEiLCJlbWFpbCI6InZlZXJhYmhhZHJhLnNoYXJtYUBhY2NlbGFscGhhLmNvbSJ9LCJhY2NvdW50Ijp7InZhbGlkIjp0cnVlLCJic3MiOiJmYTFlMGZmNDNjODQ0YWQyOWJlZWUzMDdkN2U4ZjQ1ZCIsImZyb3plbiI6dHJ1ZX0sImlhdCI6MTc1MzAyNjY0NiwiZXhwIjoxNzUzMDMwMjQ2LCJpc3MiOiJodHRwczovL2lhbS5jbG91ZC5pYm0uY29tL2lkZW50aXR5IiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.fjGHjjg-Dgi-VXDSH1VpbyOZHCPbkke81FcUGJsjrxOZD-wRZqWwun5kcv8yS7QQ6kClxp-T-GDLo1RvaBf78XqJmplGZ9BFy5nIM4lYGLgRG4Z47BmOtFZdMvbujVsySmslbgfY2xeXqrf4xiyyfbcplClAK0CAr4zFc5iAlGPalNK-2WdDiUe4136U13tmRRnqcKOcrZG50DgSwKAmWTqVuObima0nO_rT7cauDYmDE-9TbzKBMonF8mZvfWf7XiK18xqhtLZX-ew7QOIpwS19g2f6FirFQ3MEcgBdX_vZSJQgfVExU81ycHH53P1fueZG5UQgknx11iM2UdkWMA"

    # Messages to send to the AI model
    my_messages = [
        {"role": "user", "content": "Explain LangChain in simple terms."}
    ]

    # Create context instance
    context = MyContext(token=my_token, messages=my_messages)

    # Import or define gen_ai_service from your code
    generate, generate_stream = gen_ai_service(context)
    #generate_stream = gen_ai_service(context)
    # Call generate to get full response
    '''
    response = generate(context)
    print("Full response:", response)
    '''
    # Or call generate_stream to get streaming response chunks
    
    print("Streaming response:")
    for chunk in generate_stream(context):
        print(chunk)
    