# IBM watsonx.ai RAG Assistant

A production-ready Retrieval-Augmented Generation (RAG) system built with IBM watsonx.ai, Streamlit, and Oracle Cloud Infrastructure (OCI) Vector AI Service.

## 📋 Overview

This application demonstrates a complete RAG implementation that combines IBM's Granite language model with vector-based document retrieval. It features content moderation, streaming responses, and a user-friendly web interface built with Streamlit.

## ✨ Features

### Core Capabilities
- **RAG Implementation**: Retrieves relevant context from vector database before generating responses
- **Streaming Responses**: Real-time token-by-token response generation
- **Content Moderation**: Built-in detection for PII and harmful content
- **Vector Search**: Proximity search using OCI Vector AI Service
- **IBM Granite Model**: Uses `ibm/granite-3-8b-instruct` for generation

### Safety Features
- **Input Moderation**: Detects and blocks inappropriate or harmful inputs
- **Output Moderation**: Filters PII and harmful content from responses
- **Guardrails**: Configurable thresholds for content detection

### User Interface
- **Web-Based**: Clean Streamlit interface
- **Interactive**: Real-time question answering
- **Flexible**: Toggle between streaming and full response modes

## 🏗️ Architecture

```
┌─────────────────┐
│   Streamlit UI  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   app.py        │ ◄── User Interface Layer
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   oic_vector_aiservice.py           │ ◄── Core RAG Logic
│   - Vector Search                   │
│   - Content Moderation              │
│   - Model Inference                 │
└────────┬────────────────────────────┘
         │
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ IBM watsonx  │ │ OCI Vector   │ │ Granite LLM  │
│ API Client   │ │ AI Service   │ │ Model        │
└──────────────┘ └──────────────┘ └──────────────┘
```

## 📁 Project Structure

```
ibm-rag-streamlit/
├── app.py                    # Streamlit web application
├── main.py                   # CLI testing script
├── oic_vector_aiservice.py   # Core RAG service implementation
├── ibm-rag-streamlit.png     # Application screenshot
├── .streamlit/               # Streamlit configuration
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- IBM watsonx.ai account and API token
- OCI Vector AI Service access
- Vector index created in IBM watsonx.ai

### Installation

1. **Clone the repository**
   ```bash
   cd finalized-pocs/ibm-rag-streamlit
   ```

2. **Install dependencies**
   ```bash
   pip install streamlit ibm-watsonx-ai requests
   ```

3. **Configure credentials**

   Create `.streamlit/secrets.toml`:
   ```toml
   WATSONX_API_TOKEN = "your_ibm_watsonx_api_token"
   ```

   Or set environment variable:
   ```bash
   export WATSONX_API_TOKEN="your_token"
   ```

4. **Update configuration**

   Edit `oic_vector_aiservice.py` with your IDs:
   ```python
   params = {
       "space_id": "your_space_id",
       "vector_index_id": "your_vector_index_id"
   }
   ```

### Running the Application

#### Web Interface (Streamlit)

```bash
streamlit run app.py
```

Access at: `http://localhost:8501`

#### Command Line Interface

```bash
python main.py
```

## 💻 Usage

### Web Interface

1. **Launch Application**: Run `streamlit run app.py`
2. **Enter Question**: Type your question in the text area
3. **Choose Mode**: Toggle streaming on/off
4. **Get Response**: Click "Ask AI" button
5. **View Results**: See the AI-generated response with context

### Example Questions

```
- "Explain LangChain in simple terms"
- "What are the key features of RAG systems?"
- "How does vector search work?"
```

### Programmatic Usage

```python
from oic_vector_aiservice import gen_ai_service

class MyContext:
    def __init__(self, token, messages):
        self._token = token
        self._messages = messages
    
    def get_token(self):
        return self._token
    
    def get_json(self):
        return {"messages": self._messages}

# Initialize
context = MyContext(
    token="your_token",
    messages=[{"role": "user", "content": "Your question"}]
)

# Get functions
generate, generate_stream = gen_ai_service(context)

# Full response
response = generate(context)
print(response["body"])

# Streaming response
for chunk in generate_stream(context):
    print(chunk["choices"][0]["delta"]["content"])
```

## 🔧 Configuration

### Model Parameters

Located in `oic_vector_aiservice.py`:

```python
parameters = {
    "frequency_penalty": 0,      # Reduce repetition
    "max_tokens": 2000,          # Maximum response length
    "presence_penalty": 0,       # Encourage topic diversity
    "temperature": 0,            # Deterministic responses
    "top_p": 1                   # Nucleus sampling
}
```

### Content Moderation

```python
detectors = {
    "hap": {                     # Hate, Abuse, Profanity
        "enabled": True,
        "threshold": 0.5         # Sensitivity (0-1)
    }
}
```

### Vector Search

```python
params = {
    "space_id": "your_space_id",           # IBM watsonx space
    "vector_index_id": "your_index_id"     # Vector index ID
}
```

## 🔐 Security Features

### Input Moderation
- Detects PII (Personal Identifiable Information)
- Blocks harmful or inappropriate content
- Configurable sensitivity thresholds

### Output Moderation
- Sentence-level content filtering
- Real-time moderation during streaming
- Automatic masking of detected issues

### Token Management
- Secure token handling via Streamlit secrets
- No hardcoded credentials in code
- Environment variable support

## 📊 Key Components

### 1. Vector Search (`proximity_search`)
- Retrieves relevant documents from vector index
- Uses RAGQuery toolkit from IBM watsonx.ai
- Returns contextual information for grounding

### 2. Content Detection (`text_detection`)
- IBM watsonx.ai detection API
- Identifies PII and harmful content
- Configurable detection types and thresholds

### 3. Model Inference (`inference_model`)
- Combines user query with retrieved context
- Applies system prompt for RAG behavior
- Supports both streaming and non-streaming modes

### 4. Response Moderation (`moderate_stream`)
- Sentence-level moderation during streaming
- Masks detected issues in real-time
- Maintains response quality and safety

## 🎯 Use Cases

### Enterprise Applications
- Internal knowledge base Q&A
- Document search and summarization
- Customer support automation
- Compliance-aware information retrieval

### Research & Development
- RAG system prototyping
- Content moderation testing
- Vector search evaluation
- LLM integration patterns

### Educational
- Learning RAG implementation
- Understanding content moderation
- Exploring IBM watsonx.ai capabilities
- Streamlit application development

## 🐛 Troubleshooting

### Common Issues

**Authentication Error**
```
Error: Invalid token
Solution: Verify WATSONX_API_TOKEN is correct and not expired
```

**Vector Index Not Found**
```
Error: Vector index not accessible
Solution: Check space_id and vector_index_id in params
```

**Import Error**
```
Error: Module 'ibm_watsonx_ai' not found
Solution: pip install ibm-watsonx-ai
```

**Streaming Issues**
```
Error: Streaming response incomplete
Solution: Check network connection and API rate limits
```

## 📈 Performance Considerations

### Optimization Tips
1. **Caching**: Implement response caching for common queries
2. **Batch Processing**: Group similar queries when possible
3. **Token Limits**: Monitor and optimize max_tokens setting
4. **Vector Index**: Ensure proper indexing for fast retrieval

### Rate Limits
- IBM watsonx.ai has API rate limits
- Implement retry logic with exponential backoff
- Monitor usage in IBM Cloud dashboard

## 🔄 Future Enhancements

### Planned Features
- [ ] Multi-document support
- [ ] Conversation history management
- [ ] Custom vector index creation
- [ ] Advanced filtering options
- [ ] Response quality metrics
- [ ] A/B testing framework

### Potential Improvements
- Add user authentication
- Implement feedback mechanism
- Support multiple languages
- Add export functionality
- Create API endpoints

## 📚 Resources

### Official Documentation
- [IBM watsonx.ai Documentation](https://www.ibm.com/docs/en/watsonx-as-a-service)
- [Streamlit Documentation](https://docs.streamlit.io/)
- [OCI Vector AI Service](https://docs.oracle.com/en-us/iaas/Content/vector-ai/home.htm)

### Related Topics
- RAG Systems (learning-path/04-rag-systems/)
- Vector Databases (learning-path/03-embeddings-vectors/)
- LLM APIs (learning-path/02-llm-fundamentals/)

### IBM Granite Model
- Model: `ibm/granite-3-8b-instruct`
- Context Window: 8192 tokens
- Optimized for: RAG, instruction following, safety

## 🤝 Contributing

### How to Contribute
1. Test with different queries
2. Report issues or bugs
3. Suggest improvements
4. Share use cases
5. Improve documentation

### Code Style
- Follow PEP 8 guidelines
- Add docstrings to functions
- Include type hints
- Write unit tests

## 📝 License

This project is part of the agentic-ai-suite repository.
See main repository LICENSE for details.

## 🙏 Acknowledgments

- IBM watsonx.ai team for the platform
- Streamlit for the UI framework
- Oracle Cloud Infrastructure for vector services
- Open-source community for inspiration

---

**Note**: This is a production-ready POC. For enterprise deployment, consider additional security hardening, monitoring, and scalability improvements.

**Last Updated**: 2026-04-18