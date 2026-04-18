# Frameworks

📚 Framework-specific learning and implementations for AI agent development.

## Overview

This directory contains hands-on implementations and learning materials for popular AI agent frameworks. Each framework has its own subdirectory with examples, tutorials, and best practices.

## Available Frameworks

### 1. AutoGen
Microsoft's multi-agent conversation framework for building autonomous agents.

**Directory**: `autogen/`

**Current Content**:
- `basic/` - Foundational AutoGen concepts and implementations
  - `00.autogen-agent.ipynb` - Basic agent setup
  - `00.autogen-open-router.ipynb` - Integration with OpenRouter
  - `01.async-functionality.ipynb` - Asynchronous operations
  - `01.autogen-agent-async.ipynb` - Async agent patterns
  - `01.autogen-agent-tool.ipynb` - Tool integration

**Key Features**:
- Conversable agents
- Group chat capabilities
- Multi-agent coordination
- Code execution
- Human-in-the-loop workflows

**Learning Path**: Phase 8 (AutoGen & CrewAI)

**Use Cases**:
- Multi-agent collaboration
- Automated code generation
- Complex problem-solving workflows
- Research and analysis tasks

[View AutoGen Documentation](./autogen/README.md)

---

### 2. CrewAI
Role-based multi-agent orchestration framework for collaborative AI systems.

**Directory**: `crewai/`

**Current Content**:
- Framework setup and configuration
- Agent role definitions
- Task automation examples

**Key Features**:
- Role-based agent design
- Task automation
- Crew coordination
- Sequential and parallel workflows
- Built-in memory and context management

**Learning Path**: Phase 8 (AutoGen & CrewAI)

**Use Cases**:
- Content creation pipelines
- Research and analysis teams
- Business process automation
- Multi-step workflows

[View CrewAI Documentation](./crewai/README.md)

---

### 3. LangChain
Comprehensive framework for building LLM-powered applications with chains and agents.

**Directory**: `langchain/`

**Current Content**:
- LangChain basics and setup
- Chain composition patterns
- Agent implementations

**Key Features**:
- Chains and prompts
- LangGraph for stateful workflows
- LangSmith for debugging and monitoring
- Memory management
- Tool integration
- Vector store integrations

**Learning Path**: Phase 7 (LangChain & LangGraph)

**Use Cases**:
- RAG systems
- Chatbots and conversational AI
- Document processing
- Data analysis pipelines

[View LangChain Documentation](./langchain/README.md)

---

## Framework Comparison

| Feature | AutoGen | CrewAI | LangChain |
|---------|---------|--------|-----------|
| **Focus** | Multi-agent conversations | Role-based orchestration | LLM application framework |
| **Complexity** | Medium | Low-Medium | Medium-High |
| **Best For** | Agent collaboration | Task automation | General LLM apps |
| **Learning Curve** | Moderate | Easy | Moderate |
| **Community** | Growing | Growing | Large |

## Learning Approach

### 1. Start with Basics
- Read official documentation
- Understand core concepts
- Run simple examples

### 2. Hands-On Practice
- Follow tutorials in `learning-path/`
- Implement examples in framework directories
- Experiment with different configurations

### 3. Build Projects
- Create small POCs in `projects/`
- Combine multiple frameworks
- Document learnings

### 4. Compare and Contrast
- Note strengths and weaknesses
- Identify best use cases
- Create comparison notes

### 5. Production Implementation
- Polish POCs for `finalized-pocs/`
- Apply best practices
- Optimize for performance

## Getting Started

### Prerequisites
- Python 3.8+
- Basic understanding of LLMs
- Familiarity with async programming (for AutoGen)

### Installation

Each framework has its own installation requirements. Generally:

```bash
# AutoGen
pip install pyautogen

# CrewAI
pip install crewai

# LangChain
pip install langchain langchain-community
```

### Environment Setup

Create a `.env` file with necessary API keys:

```env
OPENAI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
# Add other API keys as needed
```

## Best Practices

1. **Start Simple**: Begin with basic examples before complex implementations
2. **Version Control**: Track your experiments and learnings
3. **Documentation**: Document your findings and patterns
4. **Testing**: Test agents thoroughly before production use
5. **Error Handling**: Implement robust error handling
6. **Cost Management**: Monitor API usage and costs
7. **Security**: Never commit API keys to version control

## Resources

### Official Documentation
- [AutoGen Documentation](https://microsoft.github.io/autogen/)
- [CrewAI Documentation](https://docs.crewai.com/)
- [LangChain Documentation](https://python.langchain.com/)

### Learning Path
- See `learning-path/07-langchain-langgraph/` for LangChain tutorials
- See `learning-path/08-autogen-crewai/` for AutoGen and CrewAI tutorials

### Related Directories
- `projects/` - Work-in-progress implementations
- `finalized-pocs/` - Production-ready examples
- `learning-path/` - Structured learning materials

## Contributing

When adding new framework examples:

1. Create a descriptive directory name
2. Include a README.md with overview and setup
3. Add requirements.txt for dependencies
4. Document key learnings and patterns
5. Include example code with comments

## Next Steps

1. Choose a framework based on your use case
2. Complete the relevant learning path modules
3. Build a small POC in `projects/`
4. Iterate and improve
5. Move to `finalized-pocs/` when ready
