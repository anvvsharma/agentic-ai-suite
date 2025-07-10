import os
from groq import Groq
from dotenv import load_dotenv
import argparse

load_dotenv()

# --- API Key Management ---

try: 
    groq_api_key = os.environ.get("GROQ_API_KEY")

except Exception as e:
    print(f"Error: {e}")

# Check if the API key is available
if not groq_api_key:
    print("GROQ_API_KEY is not set! Please set it in your environment variables or Streamlit secrets.")
    exit()

# --- Initialize Groq Client ---
client = Groq(api_key=groq_api_key)

class Chatbot:
    def __init__(self):
        self.messages = []

    def get_assistant_response(self, prompt):
        self.messages.append({"role": "user", "content": prompt})
        
        try:
             
            # Create a streaming chat completion
            stream = client.chat.completions.create(
                messages=[
                    {"role": m["role"], "content": m["content"]}
                    for m in self.messages
                ],
                model="llama3-8b-8192",
                stream=True,
            )

            # Initialize response
            response = ""

            # Iterate over the streamed response chunks
            for chunk in stream:
                # Get the content of the chunk
                content = chunk.choices[0].delta.content
                
                # If the content is not None, add it to the response
                if content is not None:
                    response += content

            # Add assistant's response to session state
            self.messages.append({"role": "assistant", "content": response})
            
            return response 
        
        except Exception as e:
            print(f"An error occured : {e}")
            response = "Sorry, I encountered an error."
            return response

def main():
    chatbot = Chatbot()

    while True:
        prompt = input("You: ")
        if prompt.lower() == "quit":
            break

        response = chatbot.get_assistant_response(prompt)
        print("Assistant: ", response)
        print("\n")
        
if __name__ == "__main__":
    main()