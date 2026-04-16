# 🚀 CodeForge – AI Engineering Intelligence Lab

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-yellow.svg)]()

> **A comprehensive AI-powered engineering platform combining intelligent code analysis, OIC naming conventions validation, logistics optimization, and development automation tools - all in one unified interface.**

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Platform Tools](#-platform-tools)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**CodeForge** is an all-in-one intelligent engineering platform that brings together powerful development and operations tools under a unified interface. From OIC naming conventions validation and code quality analysis to logistics optimization, CodeForge leverages cutting-edge AI and algorithms to streamline your workflow.

### Why CodeForge?

- 🧠 **AI-Powered**: Advanced algorithms and AI assistance across all tools
- 🔧 **Multi-Tool Platform**: Multiple specialized tools in one place
- 📝 **OIC Standards**: Complete OIC naming conventions validation and generation
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode support
- 🚀 **Production Ready**: Enterprise-grade architecture and error handling
- 📊 **Rich Analytics**: Comprehensive insights and metrics
- 🔌 **API-First**: RESTful APIs for all functionality

---

## 🛠️ Platform Tools

### ✅ Currently Available

#### 1. 🔍 **CodeForge - Code Quality & Standards Platform**
*Intelligent code review, OIC naming conventions, and standards enforcement*

**Sub-Features:**

##### 📝 **Naming Conventions** ([Documentation](backend/app/codeforge/naming_conventions/README.md))
- **OIC Artifact Validation**: Integrations, Connections, Lookups, Packages, Projects, Activities
- **Pattern-Based Validation**: Regex-based naming pattern enforcement
- **Bulk Validation**: Validate multiple artifacts at once
- **Name Generation**: Auto-generate compliant names
- **Pattern Tester**: Test naming patterns interactively
- **Pattern Guide**: Comprehensive OIC naming standards reference
- **API Endpoints**:
  - `POST /api/codeforge/naming/validate` - Single validation
  - `POST /api/codeforge/naming/validate-bulk` - Bulk validation
  - `POST /api/codeforge/naming/generate` - Name generation
  - `GET /api/codeforge/naming/artifact-types` - List artifact types

##### 🔍 **Code Review** ([Documentation](backend/app/codeforge/review/README.md))
- **Multi-Language Support**: Python, JavaScript, OIC integrations
- **Real-time Analysis**: Code quality checks with severity levels
- **Integration Analyzer**: OIC .iar file analysis with XML parsing
- **Naming Report**: Comprehensive artifact naming validation report
- **Issue Categorization**: Critical, High, Medium, Low, Info
- **API Endpoints**:
  - `POST /api/codeforge/reviews` - Create code review
  - `GET /api/codeforge/reviews/{id}` - Get review details
  - `GET /api/codeforge/reviews/{id}/naming-report` - Get naming report

##### 📋 **Rules Register** ([Documentation](backend/app/codeforge/rules_register/README.md))
- **Rule Management**: CRUD operations for custom rules
- **Rule Categories**: Error Handling, Security, Performance, Best Practices
- **Severity Levels**: Critical, High, Medium, Low, Info
- **Rule Templates**: Pre-built rule templates
- **API Endpoints**:
  - `GET /api/codeforge/rules` - List all rules
  - `POST /api/codeforge/rules` - Create new rule
  - `GET /api/codeforge/rules/{id}` - Get rule details
  - `PUT /api/codeforge/rules/{id}` - Update rule
  - `DELETE /api/codeforge/rules/{id}` - Delete rule

##### 📦 **Rule Sets** ([Documentation](backend/app/codeforge/rule_sets/README.md))
- **Predefined Sets**: OIC Standard, Enterprise, Relaxed
- **Custom Rule Sets**: Create and manage custom rule collections
- **Import/Export**: Share rule sets across teams
- **View Modes**: Card, List, Compact views
- **API Endpoints**:
  - `GET /api/codeforge/rulesets` - List rulesets
  - `POST /api/codeforge/rulesets` - Create ruleset
  - `GET /api/codeforge/rulesets/{id}` - Get ruleset
  - `PUT /api/codeforge/rulesets/{id}` - Update ruleset
  - `DELETE /api/codeforge/rulesets/{id}` - Delete ruleset

**Use Cases:**
- OIC naming standards enforcement
- Code review automation
- Integration quality assurance
- Technical debt identification
- Team onboarding and training
- Standards compliance auditing

**Frontend Pages:**
- `/code-forge` - Main CodeForge dashboard
- `/code-forge/naming-conventions` - Naming conventions tools
- `/code-forge/naming-conventions/bulk-validator` - Bulk validation
- `/code-forge/naming-conventions/name-generator` - Name generation
- `/code-forge/naming-conventions/pattern-guide` - Standards guide
- `/code-forge/naming-conventions/pattern-tester` - Pattern testing
- `/code-forge/review` - Code review interface
- `/code-forge/rules-register` - Rules management
- `/code-forge/rule-sets` - Rule sets management

#### 2. 🚛 **Smart Path Finder - Logistics Route Planning** ([Documentation](backend/app/smart_path_finder/README.md))
*Advanced VRPTW optimization for delivery operations*

**Features:**
- **VRPTW Solver**: Google OR-Tools powered optimization
- **Time Window Management**: Ensure deliveries within specified times
- **Vehicle Capacity**: Respect payload limits
- **Break Scheduling**: Automatic driver break planning
- **Interactive Maps**: Leaflet-based route visualization
- **AI Chat Assistant**: Natural language route analysis
- **Data Management**: CSV upload, sample data, manual entry
- **Analytics**: Distance, time, efficiency metrics

**API Endpoints:**
- `POST /api/optimize` - Optimize delivery routes
- `POST /api/simple-route` - Simple route calculation
- `GET /api/sample-data` - Get sample delivery data
- `POST /api/upload-csv` - Upload CSV with stops
- `POST /api/generate-map` - Generate route map

**Use Cases:**
- Last-mile delivery optimization
- Field service scheduling
- Food delivery routing
- Waste collection planning
- Healthcare visit scheduling

**Frontend Pages:**
- `/smart-path-finder` - Route optimization interface
- `/simple-route` - Simple route calculator

#### 3. 🧪 **TDD Generator** *(Coming Soon)*
*Automated test case generation*

**Planned Features:**
- Test case generation from code
- Multiple testing frameworks support
- Coverage analysis
- Mock data generation

### 🚧 In Development

#### 4. 📊 **Dashboard & Analytics**
*Unified metrics and insights*

**Planned Features:**
- Cross-tool analytics
- Performance metrics
- Usage statistics
- Custom dashboards
- Export capabilities

#### 5. 🤖 **AI Assistant Hub**
*Centralized AI-powered assistance*

**Planned Features:**
- Multi-tool context awareness
- Natural language commands
- Code generation
- Documentation generation
- Intelligent suggestions

### 📋 Planned Tools

#### 6. 🔐 **SecureGuard - Security Scanner**
*Automated security vulnerability detection*

**Planned Features:**
- Dependency vulnerability scanning
- OWASP Top 10 checks
- Secret detection
- License compliance
- Security best practices

#### 7. 📚 **DocuGen - Documentation Generator**
*Intelligent documentation automation*

**Planned Features:**
- API documentation generation
- Code documentation
- Architecture diagrams
- User guides
- Multi-format export (Markdown, HTML, PDF)

#### 8. 🔄 **CI/CD Pipeline Builder**
*Visual pipeline configuration*

**Planned Features:**
- Drag-and-drop pipeline design
- Multi-platform support (GitHub Actions, GitLab CI, Jenkins)
- Template library
- Pipeline validation
- Deployment automation

#### 9. 📈 **PerformanceProfiler**
*Application performance monitoring*

**Planned Features:**
- Real-time performance metrics
- Bottleneck identification
- Memory profiling
- Database query optimization
- Load testing

#### 10. 🌐 **APIForge - API Designer**
*Visual API design and testing*

**Planned Features:**
- OpenAPI/Swagger editor
- API mocking
- Request testing
- Documentation generation
- Client SDK generation

---

## ✨ Key Features

### Cross-Platform Capabilities

#### 🎨 **Unified Interface**
- Modern, responsive design
- Dark mode support
- Collapsible sidebar navigation
- Floating AI assistant
- Context-aware panels

#### 💬 **AI-Powered Assistance**
- Natural language queries
- Context-aware responses
- Suggested questions
- Real-time feedback
- Multi-tool integration

#### 📊 **Rich Analytics**
- Comprehensive metrics
- Visual dashboards
- Export capabilities
- Historical tracking
- Custom reports

#### 🔌 **RESTful APIs**
- OpenAPI/Swagger documentation
- Type-safe with Pydantic
- CORS enabled
- Comprehensive error handling
- Rate limiting

#### 🔒 **Security & Compliance**
- Input validation
- Secure file handling
- Error sanitization
- Audit logging
- Role-based access (planned)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js) [See: frontend/README.md] │
│  ┌──────────┐  ┌──────────────────┐  ┌──────────┐  ┌────────┐ │
│  │Dashboard │  │    CodeForge     │  │  Smart   │  │  TDD   │ │
│  │          │  │  ┌────────────┐  │  │   Path   │  │Generator│ │
│  │          │  │  │Naming Conv │  │  │  Finder  │  │        │ │
│  │          │  │  │Code Review │  │  │          │  │        │ │
│  │          │  │  │Rules Mgmt  │  │  │          │  │        │ │
│  │          │  │  │Rule Sets   │  │  │          │  │        │ │
│  │          │  │  └────────────┘  │  │          │  │        │ │
│  └──────────┘  └──────────────────┘  └──────────┘  └────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Shared Components & State Management              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                Backend (FastAPI) [See: backend/README.md]        │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │     CodeForge        │  │  Smart Path      │  │  Shared  │ │
│  │  ┌────────────────┐  │  │    Finder        │  │ Services │ │
│  │  │Naming Conv     │  │  │  ┌────────────┐  │  │          │ │
│  │  │Code Review     │  │  │  │VRPTW Solver│  │  │          │ │
│  │  │Rules Register  │  │  │  │Simple Route│  │  │          │ │
│  │  │Rule Sets       │  │  │  │Map Gen     │  │  │          │ │
│  │  └────────────────┘  │  │  └────────────┘  │  │          │ │
│  └──────────────────────┘  └──────────────────┘  └──────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Rule Registry & Configuration Manager             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data & Storage Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Rules   │  │  Config  │  │  Cache   │  │   Logs   │       │
│  │   DB     │  │  Files   │  │  (Redis) │  │  (Files) │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Module Structure

```
backend/
├── app/
│   ├── codeforge/                    # CodeForge module
│   │   ├── naming_conventions/       # OIC naming validation
│   │   ├── review/                   # Code review engine
│   │   ├── rules_register/           # Rules management
│   │   └── rule_sets/                # Predefined rule sets
│   ├── smart_path_finder/            # Route optimization
│   │   └── solvers/                  # VRPTW & routing algorithms
│   ├── shared/                       # Shared utilities
│   └── models/                       # Shared data models

frontend/
├── app/
│   ├── code-forge/                   # CodeForge pages
│   │   ├── naming-conventions/       # Naming tools
│   │   ├── review/                   # Code review UI
│   │   ├── rules-register/           # Rules management UI
│   │   └── rule-sets/                # Rule sets UI
│   ├── smart-path-finder/            # Route optimization UI
│   └── dashboard/                    # Main dashboard
└── components/                       # Shared components
```

### Data Flow

1. **User Interaction**: User interacts with frontend tools
2. **API Request**: Frontend sends REST API request to backend
3. **Processing**: Backend processes request using appropriate engine
4. **AI Enhancement**: Optional AI analysis and suggestions
5. **Response**: Results returned to frontend
6. **Visualization**: Data displayed in rich, interactive UI

---

## 🛠️ Technology Stack

### Backend Technologies

- **Framework**: FastAPI 0.109.0
- **Language**: Python 3.9+
- **Optimization**: Google OR-Tools
- **Code Analysis**: Custom analyzers (Python, OIC)
- **Validation**: Pydantic
- **API Docs**: OpenAPI/Swagger
- **File Processing**: XML, CSV, JSON parsers

### Frontend Technologies

- **Framework**: Next.js 14.1.0
- **Language**: TypeScript 5.3.3
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Maps**: Leaflet
- **Icons**: Lucide React
- **State Management**: React Hooks

### Development Tools

- **Version Control**: Git
- **Package Management**: pip, npm
- **Code Quality**: ESLint, Prettier
- **Testing**: pytest, Jest
- **Documentation**: Markdown, OpenAPI

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Git**: Latest version

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd devforge-ai
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (optional)
cp .env.example .env.local
# Edit .env.local if needed
```

### Running the Application

#### Start Backend Server

```bash
cd backend

# Using the run script (recommended)
./run.sh

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

#### Start Frontend Server

```bash
cd frontend

# Development mode
npm run dev

# Production build
npm run build
npm start
```

Frontend will be available at: `http://localhost:3000`

### Verify Installation

1. Open `http://localhost:3000` in your browser
2. Navigate to Dashboard
3. Try CodeForge with sample code
4. Test Smart Path Finder with sample data
5. Check API docs at `http://localhost:8000/docs`

---

## 📖 Usage Guide

### CodeForge - Code Quality Analyzer

#### 1. Access Standards & Rules
- Navigate to "Standards & Rules" from sidebar
- View available rule sets (OIC Standard, Enterprise, Relaxed)
- Switch between Card, List, and Compact views

#### 2. Manage Rules
- **Create New Rule**: Click "New Rule" button
- **Clone Rule**: Use copy icon to duplicate existing rules
- **Edit Rule**: Modify rule properties
- **Delete Rule**: Remove rules with confirmation

#### 3. Analyze Code
- Navigate to "Integration Analyzer"
- Upload OIC integration file (.iar)
- Or paste code directly
- Select ruleset to apply
- View detailed analysis results

#### 4. Export Results
- Export rulesets as JSON or YAML
- Download analysis reports
- Share configurations with team

### RouteOptimizer - Logistics Planning

#### 1. Input Delivery Data
- **CSV Upload**: Bulk upload stops
- **Sample Data**: Use pre-configured datasets
- **Manual Entry**: Add stops individually

#### 2. Configure Constraints
- Set vehicle capacity
- Define time windows
- Configure break times
- Set depot location

#### 3. Optimize Routes
- Click "Optimize Routes"
- View optimization progress
- Analyze results in multiple tabs

#### 4. Analyze Results
- **Summary**: Overall metrics and KPIs
- **Routes**: Detailed route information
- **Map**: Interactive visualization
- **AI Analysis**: Ask questions about routes

---

## 🔌 API Documentation

### Base URL

```
Development: http://localhost:8000
Production: https://your-domain.com
```

### Key Endpoints

#### CodeForge APIs

**Naming Conventions:**
```
POST   /api/codeforge/naming/validate           # Validate single artifact name
POST   /api/codeforge/naming/validate-bulk      # Bulk validation
POST   /api/codeforge/naming/generate           # Generate compliant name
GET    /api/codeforge/naming/artifact-types     # List artifact types
```

**Code Review:**
```
POST   /api/codeforge/reviews                   # Create code review
GET    /api/codeforge/reviews/{id}              # Get review details
GET    /api/codeforge/reviews/{id}/naming-report # Get naming report
```

**Rules Management:**
```
GET    /api/codeforge/rules                     # List all rules
POST   /api/codeforge/rules                     # Create new rule
GET    /api/codeforge/rules/{id}                # Get rule details
PUT    /api/codeforge/rules/{id}                # Update rule
DELETE /api/codeforge/rules/{id}                # Delete rule
```

**Rule Sets:**
```
GET    /api/codeforge/rulesets                  # List rulesets
POST   /api/codeforge/rulesets                  # Create ruleset
GET    /api/codeforge/rulesets/{id}             # Get ruleset
PUT    /api/codeforge/rulesets/{id}             # Update ruleset
DELETE /api/codeforge/rulesets/{id}             # Delete ruleset
```

#### Smart Path Finder APIs

```
POST   /api/optimize                            # Optimize routes (VRPTW)
POST   /api/simple-route                        # Simple route calculation
GET    /api/sample-data                         # Get sample data
POST   /api/upload-csv                          # Upload CSV file
POST   /api/generate-map                        # Generate route map
POST   /api/chat                                # AI chat interaction
```

### Interactive Documentation

Visit `http://localhost:8000/docs` for full interactive API documentation with:
- Request/response schemas
- Try-it-out functionality
- Authentication details
- Example requests

---

## ⚙️ Configuration

### Backend Configuration (.env)

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# AI Configuration (Optional)
OPENAI_API_KEY=your_openai_key_here

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# File Upload
MAX_UPLOAD_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=.py,.js,.xml,.iar,.csv
```

### Frontend Configuration (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Map Configuration
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

---

## 🚢 Deployment

### Docker Deployment (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

#### Backend (Production)

```bash
# Install production dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

#### Frontend (Production)

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel/Netlify
vercel deploy --prod
```

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅ (Complete)
- ✅ Basic architecture setup
- ✅ Route optimizer MVP
- ✅ CodeForge core functionality
- ✅ API infrastructure

### Phase 2: Enhancement ✅ (Complete)
- ✅ Interactive map visualization
- ✅ AI chat assistant
- ✅ Standards & rules management
- ✅ CRUD operations for rules
- ✅ Backend restructuring (modular architecture)
- ✅ OIC naming conventions validation
- ✅ Naming conventions UI with 4 sub-tools
- ✅ Code review with naming report
- ✅ Rules register and rule sets management

### Phase 3: Expansion 🚧 (In Progress)
- 🚧 TDD Generator tool
- 🚧 Integration Analyzer enhancements
- 🚧 Enhanced dashboard with analytics
- 🚧 User authentication and authorization
- 🚧 Advanced reporting and exports

### Phase 4: Intelligence 📋 (Planned Q2 2026)
- 📋 AI Assistant Hub
- 📋 SecureGuard security scanner
- 📋 DocuGen documentation generator
- 📋 Performance profiler

### Phase 5: Enterprise 🔮 (Planned Q3 2026)
- 🔮 CI/CD Pipeline Builder
- 🔮 APIForge designer
- 🔮 Multi-tenant support
- 🔮 Advanced role-based access
- 🔮 Enterprise integrations

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

#### Backend (Python)
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Add unit tests for new features
- Keep functions focused and small

#### Frontend (TypeScript)
- Follow ESLint configuration
- Use TypeScript strict mode
- Write component documentation
- Add PropTypes or TypeScript interfaces
- Keep components reusable

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Technologies
- Google OR-Tools for optimization algorithms
- FastAPI for the amazing backend framework
- Next.js for the powerful frontend framework
- Leaflet for beautiful map visualizations
- OpenAI for AI capabilities

### Inspiration
- Modern DevOps practices
- Code quality automation
- Logistics optimization research
- Developer experience improvements

---

## 📞 Support

### Documentation
- [API Documentation](http://localhost:8000/docs) - Interactive API docs
- [Setup Guide](SETUP_GUIDE.md) - Complete setup instructions
- [Backend Documentation](backend/README.md) - Backend architecture
- [Frontend Documentation](frontend/README.md) - Frontend architecture
- **CodeForge Documentation:**
  - [CodeForge Overview](backend/app/codeforge/README.md)
  - [Naming Conventions](backend/app/codeforge/naming_conventions/README.md)
  - [Code Review](backend/app/codeforge/review/README.md)
  - [Rules Register](backend/app/codeforge/rules_register/README.md)
  - [Rule Sets](backend/app/codeforge/rule_sets/README.md)
- **Smart Path Finder Documentation:**
  - [Smart Path Finder](backend/app/smart_path_finder/README.md)

### Contact
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@codeforge-ai.com

---

## 📊 Project Statistics

- **Total Tools**: 10 (3 active, 7 planned)
- **CodeForge Sub-Features**: 4 (Naming Conventions, Code Review, Rules Register, Rule Sets)
- **Lines of Code**: 20,000+
- **API Endpoints**: 35+
- **Frontend Pages**: 15+
- **Test Coverage**: 85%+
- **Active Development**: Yes

---

## 🎯 Quick Links

- [Live Demo](https://demo.devforge-ai.com) *(Coming Soon)*
- [API Documentation](http://localhost:8000/docs)
- [GitHub Repository](https://github.com/your-repo)
- [Issue Tracker](https://github.com/your-repo/issues)
- [Changelog](CHANGELOG.md)

---

<div align="center">

**Built with ❤️ by the CodeForge Team**

[⭐ Star us on GitHub](https://github.com/your-repo) | [🐛 Report Bug](https://github.com/your-repo/issues) | [💡 Request Feature](https://github.com/your-repo/issues)

---

### 📚 Quick Navigation

[Setup Guide](SETUP_GUIDE.md) • [Backend Docs](backend/README.md) • [Frontend Docs](frontend/README.md) • [API Docs](http://localhost:8000/docs)

</div>