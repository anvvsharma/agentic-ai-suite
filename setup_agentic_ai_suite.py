#!/usr/bin/env python3
"""
Setup script for agentic-ai-suite repository structure
Creates the complete folder structure for AI/LLM POCs and learning (PUBLIC)

Usage:
    python3 setup_agentic_ai_suite.py [target_directory]
    
    If target_directory is not provided, creates structure in current directory
"""

import os
import sys
from pathlib import Path


def create_directory_structure(base_path: Path):
    """Create the agentic-ai-suite folder structure"""
    
    # Define the folder structure aligned with blog-activity topics (13 phases)
    folders = [
        # Finalized POCs
        "finalized-pocs/streamlit-chatbot",
        "finalized-pocs/python-chatbot",
        "finalized-pocs/ibm-rag-streamlit",
        
        # Projects (WIP)
        "projects/travel-planner-draft",
        
        # Learning Path - Phase 1: Prerequisites & Foundations
        "learning-path/01-prerequisites/pydantic",
        "learning-path/01-prerequisites/python-advanced",
        "learning-path/01-prerequisites/async-programming",
        "learning-path/01-prerequisites/data-engineering-basics",
        
        # Learning Path - Phase 2: LLM Fundamentals
        "learning-path/02-llm-fundamentals/llm-apis",
        "learning-path/02-llm-fundamentals/prompt-engineering",
        "learning-path/02-llm-fundamentals/tokenization",
        "learning-path/02-llm-fundamentals/context-window",
        "learning-path/02-llm-fundamentals/sampling-strategies",
        "learning-path/02-llm-fundamentals/langchain-basics",
        
        # Learning Path - Phase 3: Embeddings & Vectors
        "learning-path/03-embeddings-vectors/vector-basics",
        "learning-path/03-embeddings-vectors/embeddings-dimensionality",
        "learning-path/03-embeddings-vectors/similarity-search",
        "learning-path/03-embeddings-vectors/vector-databases",
        "learning-path/03-embeddings-vectors/vector-indexing",
        "learning-path/03-embeddings-vectors/hybrid-search",
        
        # Learning Path - Phase 4: RAG Systems
        "learning-path/04-rag-systems/document-processing",
        "learning-path/04-rag-systems/chunking-strategies",
        "learning-path/04-rag-systems/retrieval-methods",
        "learning-path/04-rag-systems/reranking",
        "learning-path/04-rag-systems/query-rewriting",
        "learning-path/04-rag-systems/multi-hop-retrieval",
        "learning-path/04-rag-systems/graph-rag",
        
        # Learning Path - Phase 5: Agents Fundamentals
        "learning-path/05-agents-fundamentals/agent-architecture",
        "learning-path/05-agents-fundamentals/reasoning-loops",
        "learning-path/05-agents-fundamentals/reasoning-frameworks",
        "learning-path/05-agents-fundamentals/memory-systems",
        "learning-path/05-agents-fundamentals/planning-decomposition",
        
        # Learning Path - Phase 6: Tool Calling
        "learning-path/06-tool-calling/function-calling",
        "learning-path/06-tool-calling/tool-integration",
        "learning-path/06-tool-calling/tool-validation",
        "learning-path/06-tool-calling/code-execution",
        
        # Learning Path - Phase 7: LangChain & LangGraph
        "learning-path/07-langchain-langgraph/langchain-basics",
        "learning-path/07-langchain-langgraph/lcel",
        "learning-path/07-langchain-langgraph/langgraph-workflows",
        "learning-path/07-langchain-langgraph/langsmith-debugging",
        "learning-path/07-langchain-langgraph/memory-management",
        
        # Learning Path - Phase 8: AutoGen & CrewAI
        "learning-path/08-autogen-crewai/autogen-basic",
        "learning-path/08-autogen-crewai/autogen-multi-agent",
        "learning-path/08-autogen-crewai/autogen-group-chat",
        "learning-path/08-autogen-crewai/crewai-basic",
        "learning-path/08-autogen-crewai/crewai-task-automation",
        "learning-path/08-autogen-crewai/crewai-crew-coordination",
        
        # Learning Path - Phase 9: Real-World Applications
        "learning-path/09-real-world-apps/chatbot-development",
        "learning-path/09-real-world-apps/document-qa",
        "learning-path/09-real-world-apps/automation-workflows",
        "learning-path/09-real-world-apps/external-integrations",
        "learning-path/09-real-world-apps/data-fusion",
        
        # Learning Path - Phase 10: Evaluation & Optimization
        "learning-path/10-evaluation-optimization/llm-evaluation",
        "learning-path/10-evaluation-optimization/ragas-metrics",
        "learning-path/10-evaluation-optimization/guardrails-security",
        "learning-path/10-evaluation-optimization/observability-tracing",
        "learning-path/10-evaluation-optimization/performance-optimization",
        "learning-path/10-evaluation-optimization/cost-optimization",
        
        # Learning Path - Phase 11: LLM Internals
        "learning-path/11-llm-internals/transformer-architecture",
        "learning-path/11-llm-internals/attention-mechanisms",
        "learning-path/11-llm-internals/fine-tuning",
        "learning-path/11-llm-internals/peft-lora",
        "learning-path/11-llm-internals/rlhf-dpo",
        "learning-path/11-llm-internals/quantization",
        
        # Learning Path - Phase 12: System Design & Production
        "learning-path/12-system-design/architecture-patterns",
        "learning-path/12-system-design/api-deployment",
        "learning-path/12-system-design/ci-cd-pipelines",
        "learning-path/12-system-design/model-versioning",
        "learning-path/12-system-design/scalability",
        
        # Learning Path - Phase 13: Advanced Topics
        "learning-path/13-advanced-topics/optimization-algorithms",
        "learning-path/13-advanced-topics/hybrid-ai-systems",
        "learning-path/13-advanced-topics/neuro-symbolic",
        "learning-path/13-advanced-topics/agent-benchmarking",
        
        # Prompts
        "prompts",
    ]
    
    # Create all folders
    print(f"Creating agentic-ai-suite structure in: {base_path}")
    for folder in folders:
        folder_path = base_path / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        print(f"  ✓ Created: {folder}")
    
    # Create placeholder files
    create_placeholder_files(base_path)
    
    print("\n✅ agentic-ai-suite structure created successfully!")


def create_placeholder_files(base_path: Path):
    """Create placeholder files and READMEs"""
    
    files = {
        # Root files
        "README.md": """# agentic-ai-suite

Your AI/LLM POCs, learning projects, and framework explorations (PUBLIC).

## 📁 Structure

### finalized-pocs/
Production-ready POCs for portfolio showcase.

- **streamlit-chatbot** - Chatbot with Streamlit UI
- **python-chatbot** - Python-based chatbot
- **ibm-rag-streamlit** - RAG system with IBM Watson

### projects/
🧪 Work-in-progress and experimental POCs.

- **travel-planner-draft** - Travel planning agent (WIP)
- **ai-engineering-lab** - Full-stack dev tool project

### learning-path/
🎓 Complete learning path for GenAI & Agentic AI (Phases 1-13).

#### Phase 1: Prerequisites & Foundations
- Python advanced, Pydantic, async programming, data engineering

#### Phase 2: LLM Fundamentals
- LLM APIs, prompt engineering, tokenization, context window, sampling

#### Phase 3: Embeddings & Vectors
- Vector basics, embeddings, similarity search, vector DBs, indexing, hybrid search

#### Phase 4: RAG Systems
- Document processing, chunking, retrieval, reranking, query rewriting, Graph-RAG

#### Phase 5: Agents Fundamentals
- Agent architecture, reasoning loops, reasoning frameworks (CoT, ReAct, ToT), memory, planning

#### Phase 6: Tool Calling
- Function calling, tool integration, validation, code execution

#### Phase 7: LangChain & LangGraph
- LangChain basics, LCEL, LangGraph workflows, LangSmith, memory management

#### Phase 8: AutoGen & CrewAI
- AutoGen (basic, multi-agent, group chat), CrewAI (basic, task automation, coordination)

#### Phase 9: Real-World Applications
- Chatbot development, document Q&A, automation workflows, external integrations, data fusion

#### Phase 10: Evaluation & Optimization
- LLM evaluation, RAGAS metrics, guardrails & security, observability, performance & cost optimization

#### Phase 11: LLM Internals
- Transformer architecture, attention mechanisms, fine-tuning, PEFT/LoRA, RLHF/DPO, quantization

#### Phase 12: System Design & Production
- Architecture patterns, API deployment, CI/CD pipelines, model versioning, scalability

#### Phase 13: Advanced Topics
- Optimization algorithms, hybrid AI systems, neuro-symbolic approaches, agent benchmarking

### prompts/
💬 Reusable prompt templates for LLMs.

## 🚀 Quick Start

1. Follow **learning-path/** (Phases 1-13) for complete GenAI/Agentic AI mastery
2. Build real-world apps in **projects/** and move to **finalized-pocs/**
3. Document learnings in **blog-activity** repo

## 📝 Workflow

1. **Learn** in learning-path/ (Phases 1-13: 70+ subtopics)
2. **Experiment** in projects/ (Work-in-progress POCs)
3. **Polish** and move to finalized-pocs/ (Portfolio-ready)
4. **Blog** about learnings in blog-activity repo

## 🎯 Learning Path Alignment

This repository's structure is **fully aligned** with **blog-activity/topics/** (13 phases):
- **All 13 phases** implemented in learning-path/
- **70+ subtopic folders** for hands-on learning
- **Perfect 1:1 mapping** with blog topics

## 🔗 Related Repositories

- **Blog Content**: [blog-activity](https://github.com/yourusername/blog-activity) - 13 phases, 146+ topics
- **ML Learning**: [ml-learning-journey](https://github.com/yourusername/ml-learning-journey) - Traditional ML/DL

## 📊 Repository Stats

- **Learning Path**: 13 phases, 70+ subtopics
- **Finalized POCs**: 3 production-ready projects
- **Total**: 13 phases, 74+ implementation folders

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
""",
        
        ".gitignore": """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/

# Environment variables
.env
.env.local
*.key

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
projects/.DS_Store
Thumbs.db

# Logs
*.log

# Build
dist/
build/
*.egg-info/

# Jupyter Notebook
.ipynb_checkpoints

# Data files
*.csv
*.xlsx
*.json
*.pkl

# Model files
*.pth
*.pt
*.ckpt
""",
        
        "requirements.txt": """# Core dependencies
python-dotenv>=0.20.0

# LLM and AI
openai>=1.0.0
langchain>=0.1.0
groq>=0.4.0

# Web frameworks
streamlit>=1.28.0
fastapi>=0.104.0

# Data handling
pydantic>=2.0.0
pandas>=1.5.0

# Vector databases
chromadb>=0.4.0

# Utilities
requests>=2.28.0
""",
        
        "run.sh": """#!/bin/bash

# Run your main demo or entrypoint here
# Example: streamlit run finalized-pocs/streamlit-chatbot/app.py

echo "🚀 Agentic AI Suite"
echo "Choose a POC to run:"
echo "1. Streamlit Chatbot"
echo "2. Python Chatbot"
echo "3. IBM RAG Streamlit"
echo ""
echo "Usage: Update this script with your preferred entrypoint"
""",
        
        "LICENSE": """MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
""",
        
        # Finalized POCs
        "finalized-pocs/README.md": """# Finalized POCs

Production-ready POCs for portfolio showcase.

## Available POCs

### streamlit-chatbot
Chatbot with Streamlit UI and Groq API.

**Features**:
- Interactive chat interface
- Conversation history
- Streamlit deployment ready

**Usage**: See [streamlit-chatbot/README.md](streamlit-chatbot/README.md)

### python-chatbot
Python-based chatbot with CLI interface.

**Features**:
- Command-line interface
- Groq API integration
- Simple and clean code

**Usage**: See [python-chatbot/README.md](python-chatbot/README.md)

### ibm-rag-streamlit
RAG system with IBM Watson and Streamlit.

**Features**:
- Document ingestion
- Vector search
- RAG-powered responses

**Usage**: See [ibm-rag-streamlit/README.md](ibm-rag-streamlit/README.md)

## Adding New POCs

1. Develop in `projects/` folder
2. Polish and test thoroughly
3. Add comprehensive README
4. Move to `finalized-pocs/`
5. Update this index
""",
        
        # Projects
        "projects/README.md": """# Projects

🧪 Work-in-progress and experimental POCs.

## Active Projects

### travel-planner-draft
Travel planning agent with HERE Maps API.

**Status**: 🚧 Work in Progress

**Features (Planned)**:
- Route planning
- Weather integration
- Multi-agent coordination

### ai-engineering-lab
Full-stack development tool for AI engineering.

**Status**: 🚧 Work in Progress

**Features**:
- Backend API
- Frontend dashboard
- Project management

## Project Lifecycle

1. **Draft**: Initial implementation
2. **Develop**: Add features and test
3. **Polish**: Clean code, add docs
4. **Finalize**: Move to `finalized-pocs/`

## Adding New Projects

1. Create folder with descriptive name
2. Add README.md with overview
3. Include requirements.txt
4. Document progress and learnings
""",
        
        "projects/travel-planner-draft/README.md": """# Travel Planner Draft

Travel planning agent with HERE Maps API integration.

## Status

🚧 Work in Progress

## Features (Planned)

- [ ] Route planning with HERE Maps
- [ ] Weather integration
- [ ] Multi-agent coordination
- [ ] Itinerary generation
- [ ] Cost estimation

## Tech Stack

- Python 3.11+
- LangChain
- HERE Maps API
- Weather API
- Groq/OpenAI

## Next Steps

1. Implement core routing logic
2. Add weather integration
3. Create agent coordination
4. Build UI
5. Polish for production
""",
        
        # Frameworks
        "frameworks/README.md": """# Frameworks

📚 Framework-specific learning (Phases 8-9).

## Available Frameworks

### LangChain (Phase 8)
LLM application framework with LangGraph and LangSmith.

**Topics**:
- Chains and prompts
- LangGraph workflows
- LangSmith debugging
- Memory management
- Tool integration

### AutoGen (Phase 9)
Microsoft's multi-agent framework.

**Topics**:
- Conversable agents
- Group chat
- Multi-agent coordination
- Code execution
- Human-in-the-loop

### CrewAI (Phase 9)
Multi-agent orchestration framework.

**Topics**:
- Agent creation
- Task automation
- Crew coordination
- Role-based agents

## Learning Approach

1. Start with official documentation
2. Follow tutorials in learning-path/
3. Build small examples
4. Create comparison notes
5. Apply in projects/
""",
        
        "frameworks/langchain/README.md": """# LangChain & LangGraph

LangChain framework learning (Phase 8).

## Topics Covered

### LangChain Basics
- Chains and prompts
- Memory systems
- Output parsers
- LCEL (LangChain Expression Language)

### LangGraph Workflows
- Stateful agent workflows
- Cyclic graphs
- Conditional routing
- Human-in-the-loop

### LangSmith Debugging
- Debugging tools
- Monitoring
- Evaluation

## Resources

- [LangChain Docs](https://python.langchain.com/)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [LangSmith](https://smith.langchain.com/)

## Examples

Add your LangChain and LangGraph examples here.
""",
        
        "frameworks/crewai/README.md": """# CrewAI

CrewAI multi-agent framework learning (Phase 9).

## Topics Covered

### CrewAI Basics
- Agent creation
- Task definition
- Role-based design

### Task Automation
- Sequential execution
- Parallel execution
- Crew coordination

## Resources

- [Official Docs](https://docs.crewai.com/)
- [GitHub](https://github.com/joaomdmoura/crewAI)

## Examples

Add your CrewAI examples here.
""",
        
        "frameworks/autogen/README.md": """# AutoGen

Microsoft AutoGen framework learning (Phase 9).

## Topics Covered

- Conversable agents
- Group chat
- Code execution
- Human-in-the-loop

## Resources

- [Official Docs](https://microsoft.github.io/autogen/)
- [GitHub](https://github.com/microsoft/autogen)

## Examples

Add your Autogen examples and experiments here.
""",
        
        # Prompts
        "prompts/README.md": """# Prompt Templates

💬 Reusable prompt templates for LLMs.

## Categories

- Blog writing prompts
- Code generation prompts
- Analysis prompts
- Summarization prompts
- Agent system prompts

## Usage

```python
from pathlib import Path

# Load prompt template
prompt_template = Path("prompts/blog-writer.txt").read_text()

# Format with variables
prompt = prompt_template.format(
    topic="AI Agents",
    audience="developers",
    tone="technical"
)
```

## Adding New Prompts

1. Create descriptive filename (e.g., `code-reviewer.txt`)
2. Use clear variable placeholders: `{variable_name}`
3. Add usage example in this README
4. Test with different inputs
""",
        
        "prompts/blog-writer.txt": """You are an expert technical blog writer.

Write a blog post about {topic} for {audience}.

Requirements:
- Tone: {tone}
- Length: {length} words
- Include code examples
- Use clear explanations
- Add practical examples

Structure:
1. Hook (engaging opening)
2. Problem statement
3. Solution explanation
4. Code examples
5. Key takeaways
6. Call to action

Begin writing:
""",
        
        "prompts/code-reviewer.txt": """You are an expert code reviewer.

Review the following code and provide feedback:

```{language}
{code}
```

Focus on:
- Code quality and readability
- Best practices
- Potential bugs
- Performance issues
- Security concerns
- Suggestions for improvement

Provide constructive feedback:
""",
    }
    
    # Create all files
    print("\nCreating placeholder files...")
    for file_path, content in files.items():
        full_path = base_path / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content)
        print(f"  ✓ Created: {file_path}")


def main():
    """Main execution function"""
    # Get target directory from command line or use current directory
    if len(sys.argv) > 1:
        target_dir = Path(sys.argv[1])
    else:
        target_dir = Path.cwd()
    
    # Create the structure
    create_directory_structure(target_dir)
    
    print(f"\n📁 Repository structure created in: {target_dir.absolute()}")
    print("\n🚀 Next steps:")
    print("  1. Review the created structure")
    print("  2. Add your POCs to finalized-pocs/")
    print("  3. Start new projects in projects/")
    print("  4. Study frameworks in frameworks/")
    print("  5. Initialize git: git init")
    print("  7. Make first commit: git add . && git commit -m 'Initial agentic-ai-suite structure'")
    print("\n💡 Place ai-engineering-lab in projects/ folder!")


if __name__ == "__main__":
    main()
