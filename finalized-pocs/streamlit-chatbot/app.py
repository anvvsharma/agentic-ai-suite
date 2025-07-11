import streamlit as st
import os
from groq import Groq
from dotenv import load_dotenv

# Set page configuration
st.set_page_config(page_title="Simple Chatbot", page_icon="⚡")
load_dotenv()

# --- Page Title and Description
st.title("⚡ Groq Chat")
st.caption("A Simple and blazing fast chatbot powered by Groq and LLaMA3.")

# --- API Key Management ---
# Try to get the API key from Streamlit secrets

try: 
    groq_api_key = st.secrets["GROQ_API_KEY"]

except (KeyError, FileNotFoundError):
    groq_api_key = os.environ.get("GROQ_API_KEY")

# Check if the API key is available
if not groq_api_key:
    st.error("GROQ_API_KEY is not set! Please set it in your environment variables or Streamlit secrets.")
    st.stop()

# --- Initialize Groq Client ---
client = Groq(api_key=groq_api_key)

# --- Session State for Chat History ---
# Initialize chat history if it doesn't exist
if "messages" not in st.session_state:
    st.session_state.messages = []

# --- Display Existing Chat Messages ---
# Loop through the messages in session state and display them
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# --- Chat Input and Logic ---
if prompt := st.chat_input("what is up?"):
    # Add users message to the session state
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Display users message in the chat
    with st.chat_message("user"):
        st.markdown(prompt)

    # Get Assistant Response
    with st.chat_message("assistant"):
        try:
            # Create a streaming chat completion
            stream = client.chat.completions.create(
                messages=[
                    {"role": m["role"], "content": m["content"]}
                    for m in st.session_state.messages
                ],
                model="llama3-8b-8192",
                stream=True,
            )

            # Initialize response
            response = ""

            # Iterate over the streamed response chunks
            with st.empty() as container:   # removes the \n space and prints just the final response 
                for chunk in stream:
                    # Get the content of the chunk
                    content = chunk.choices[0].delta.content
                    print(f" content :: {content}")
                    # If the content is not None, add it to the response
                    if content is not None:
                        response += content
                        print(f" response :: {response}")
                        # Display the current response
                        st.markdown(response)

                # Add assistant's response to session state
                st.session_state.messages.append({"role": "assistant", "content": response})

        except Exception as e:
            st.error(f"An error occured : {e}", icon="🚨")
            response = "Sorry, I encountered an error." # Fallback response

    # Add assistant's response to session state
    st.session_state.messages.append({"role": "assistant", "content": response})
