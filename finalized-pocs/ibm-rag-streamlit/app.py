import streamlit as st
from oic_vector_aiservice import gen_ai_service

class MyContext:
    def __init__(self, token, messages):
        self._token = token
        self._messages = messages

    def get_token(self):
        return self._token

    def get_json(self):
        return {"messages": self._messages}


def main():

    st.title("IBM watsonx.ai RAG Assistant")

    try:
        my_token = st.secrets.get("WATSONX_API_TOKEN")
    except Exception:
        my_token = None  # st.secrets not available or error occurred

    if not my_token:
        st.error("Please set your IBM watsonx.ai API token in Streamlit secrets or in the code.")
        return

    # Input your IBM watsonx.ai API bearer token here or via Streamlit secrets/env

    user_input = st.text_area("Enter your question:", height=100)

    if st.button("Ask AI") and user_input.strip():
        # Prepare messages for the AI model
        messages = [{"role": "user", "content": user_input.strip()}]

        # Create context instance
        context = MyContext(token=my_token, messages=messages)

        # Get generate and generate_stream functions
        generate, generate_stream = gen_ai_service(context)

        # Choose streaming or non-streaming mode
        stream_mode = st.checkbox("Stream response", value=True)

        if stream_mode:
            st.write("Streaming response:")
            response_placeholder = st.empty()
            full_response = ""

            # Stream chunks and update UI
            for chunk in generate_stream(context):
                # Extract content from chunk
                try:
                    content = chunk["choices"][0]["delta"].get("content", "")
                except Exception:
                    content = ""
                full_response += content
                response_placeholder.markdown(full_response)
        else:
            st.write("Full response:")
            response = generate(context)
            # response["body"] contains the full generated response
            st.markdown(response["body"])

if __name__ == "__main__":
    main()
