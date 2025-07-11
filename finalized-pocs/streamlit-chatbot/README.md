

### Table of Contents

1. [Overview of the Code](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#overview-of-the-code)
2. [Step 1: Importing Libraries](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#step-1-importing-libraries)
3. [Step 2: Setting Page Configuration](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#step-2-setting-page-configuration)
4. [Step 3: Displaying Page Title and Description](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#step-3-displaying-page-title-and-description)
5. [Step 4: API Key Management](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#step-4-api-key-management)
6. [Step 5: Checking API Key Availability](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#step-5-checking-api-key-availability)
7. [Step 6: Initializing Groq Client](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#step-6-initializing-groq-client)
8. [Step 7: Session State for Chat History](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#step-7-session-state-for-chat-history)
9. [Step 8: Displaying Existing Chat Messages](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#step-8-displaying-existing-chat-messages)
10. [Step 9: Chat Input and Logic](https://eu-de.dataplatform.cloud.ibm.com/wx/prompts?context=wx&project_id=79dd9808-6381-480c-bf56-08d07270adee&grounding_index=6035fd2b-9aa8-4e20-9c76-9c66a0a3b4f6#step-9-chat-input-and-logic)

# Overview of the Code

The provided code is a simple implementation of a chatbot using the Groq API and Streamlit. It allows users to interact with the chatbot by providing input, and the chatbot responds accordingly.

## Step 1: Importing Libraries

```python
import streamlit as st
import os
from groq import Groq
from dotenv import load_dotenv
```

The code starts by importing the necessary libraries:

- `streamlit`: for building the chatbot interface
- `os`: for interacting with the operating system and accessing environment variables
- `groq`: for using the Groq API
- `dotenv`: for loading environment variables from a `.env` file

## Step 2: Setting Page Configuration

```python
st.set_page_config(page_title="Simple Chatbot", page_icon="⚡")
load_dotenv()
```

The code sets the page configuration for the Streamlit app:

- `page_title`: sets the title of the page to "Simple Chatbot"
- `page_icon`: sets the icon of the page to "⚡"
- `load_dotenv()`: loads environment variables from a `.env` file

## Step 3: Displaying Page Title and Description

```python
st.title("⚡ Groq Chat")
st.caption("A Simple and blazing fast chatbot powered by Groq and LLaMA3.")
```

The code displays the page title and description:

- `st.title()`: displays the title of the page
- `st.caption()`: displays a caption or description of the page

## Step 4: API Key Management

### Retrieving the API Key

```python
try: 
    groq_api_key = st.secrets["GROQ_API_KEY"]

except (KeyError, FileNotFoundError):
    groq_api_key = os.environ.get("GROQ_API_KEY")
```

The code attempts to retrieve the Groq API key from the Streamlit secrets or environment variables. If an error occurs during this process, it is caught and handled.

## Step 5: Checking API Key Availability

```python
if not groq_api_key:
    st.error("GROQ_API_KEY is not set! Please set it in your environment variables or Streamlit secrets.")
    st.stop()
```

The code checks if the API key is available. If it is not, an error message is displayed, and the app stops.

## Step 6: Initializing Groq Client

```python
client = Groq(api_key=groq_api_key)
```

The Groq client is initialized using the retrieved API key.

## Step 7: Session State for Chat History

### Initializing Chat History

```python
if "messages" not in st.session_state:
    st.session_state.messages = []
```

The code initializes the chat history if it doesn't exist in the session state.

## Step 8: Displaying Existing Chat Messages

```python
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
```

The code loops through the messages in the session state and displays them in the chat interface.

## Step 9: Chat Input and Logic

### Getting User Input

```python
if prompt := st.chat_input("what is up?"):
```

The code gets the user's input from the chat input field.

### Adding User Message to Session State

```python
st.session_state.messages.append({"role": "user", "content": prompt})
```

The code adds the user's message to the session state.

### Displaying User Message in Chat

```python
with st.chat_message("user"):
    st.markdown(prompt)
```

The code displays the user's message in the chat interface.

### Getting Assistant Response

```python
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
        with st.empty() as container:   
            for chunk in stream:
                # Get the content of the chunk
                content = chunk.choices[0].delta.content
                
                # If the content is not None, add it to the response
                if content is not None:
                    response += content
                    
                    # Display the current response
                    st.markdown(response)

            # Add assistant's response to session state
            st.session_state.messages.append({"role": "assistant", "content": response})

    except Exception as e:
        st.error(f"An error occured : {e}", icon="🚨")
        response = "Sorry, I encountered an error." 

    # Add assistant's response to session state
    st.session_state.messages.append({"role": "assistant", "content": response})
```

The code gets the assistant's response using the Groq API and displays it in the chat interface.
