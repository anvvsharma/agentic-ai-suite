# CodeForge Backend API

Production-ready FastAPI backend for the CodeForge AI Engineering Intelligence Lab, featuring code quality analysis, OIC naming conventions validation, and logistics route optimization.

## 📋 Table of Contents

- [Overview](#overview)
- [Modules](#modules)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

The CodeForge backend is built with a modular architecture, organizing functionality into distinct, maintainable modules:

- **CodeForge Module**: Code quality analysis, OIC naming conventions, rules management
- **Smart Path Finder Module**: Route optimization and logistics planning
- **Shared Utilities**: Common functionality across modules

## Modules

### 🔍 CodeForge Module
[Detailed Documentation](app/codeforge/README.md)

Comprehensive code quality and standards enforcement platform with four sub-features:

1. **Naming Conventions** ([docs](app/codeforge/naming_conventions/README.md)) - OIC artifact naming validation and generation
2. **Code Review** ([docs](app/codeforge/review/README.md)) - Multi-language code analysis
3. **Rules Register** ([docs](app/codeforge/rules_register/README.md)) - Custom rules management
4. **Rule Sets** ([docs](app/codeforge/rule_sets/README.md)) - Predefined rule collections

### 🚛 Smart Path Finder Module
[Detailed Documentation](app/smart_path_finder/README.md)

Advanced VRPTW (Vehicle Routing Problem with Time Windows) optimization for logistics operations.

## Features

### CodeForge Features
- ✅ **OIC Naming Validation**: Validate Integration, Connection, Lookup, Package, Project, and Activity names
- ✅ **Bulk Validation**: Validate multiple artifacts simultaneously
- ✅ **Name Generation**: Auto-generate compliant artifact names
- ✅ **Code Review**: Multi-language code analysis (Python, JavaScript, OIC)
- ✅ **Rules Management**: CRUD operations for custom rules
- ✅ **Rule Sets**: Predefined rule collections (OIC Standard, Enterprise, Relaxed)
- ✅ **Naming Report**: Comprehensive artifact naming compliance reports

### Smart Path Finder Features
- ✅ **VRPTW Optimization**: Advanced route optimization with time windows and capacity constraints
- ✅ **Google OR-Tools**: Production-grade constraint programming solver
- ✅ **CSV Upload**: Bulk upload delivery stops
- ✅ **Interactive Maps**: Route visualization
- ✅ **AI Chat Assistant**: Natural language route analysis

### Cross-Module Features
- ✅ **RESTful API**: Clean, documented API endpoints
- ✅ **OpenAPI/Swagger**: Interactive API documentation
- ✅ **CORS Enabled**: Ready for frontend integration
- ✅ **Type Safety**: Pydantic data validation
- ✅ **Error Handling**: Comprehensive error responses

## Tech Stack

- **Framework**: FastAPI 0.109.0
- **Language**: Python 3.9+
- **Optimization**: Google OR-Tools 9.15+
- **Data Processing**: Pandas 2.2+
- **Validation**: Pydantic 2.5+
- **Server**: Uvicorn 0.27+
- **File Processing**: XML, CSV, JSON parsers

## Installation

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --port 8000

# Or using Python directly
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### CodeForge APIs

#### Naming Conventions
```
POST   /api/codeforge/naming/validate           # Validate single artifact name
POST   /api/codeforge/naming/validate-bulk      # Bulk validation
POST   /api/codeforge/naming/generate           # Generate compliant name
GET    /api/codeforge/naming/artifact-types     # List artifact types
```

#### Code Review
```
POST   /api/codeforge/reviews                   # Create code review
GET    /api/codeforge/reviews/{id}              # Get review details
GET    /api/codeforge/reviews/{id}/naming-report # Get naming report
```

#### Rules Management
```
GET    /api/codeforge/rules                     # List all rules
POST   /api/codeforge/rules                     # Create new rule
GET    /api/codeforge/rules/{id}                # Get rule details
PUT    /api/codeforge/rules/{id}                # Update rule
DELETE /api/codeforge/rules/{id}                # Delete rule
```

#### Rule Sets
```
GET    /api/codeforge/rulesets                  # List rulesets
POST   /api/codeforge/rulesets                  # Create ruleset
GET    /api/codeforge/rulesets/{id}             # Get ruleset
PUT    /api/codeforge/rulesets/{id}             # Update ruleset
DELETE /api/codeforge/rulesets/{id}             # Delete ruleset
```

### Smart Path Finder APIs

#### POST `/api/optimize`
Optimize delivery routes using VRPTW algorithm

**Request Body:**
```json
{
  "stops": [
    {
      "stop_id": 0,
      "stop_name": "Depot",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "demand": 0,
      "window_start": "2026-03-07T08:00:00",
      "window_end": "2026-03-07T18:00:00",
      "service_time": 0
    },
    {
      "stop_id": 1,
      "stop_name": "Stop 1",
      "latitude": 37.7849,
      "longitude": -122.4094,
      "demand": 10,
      "window_start": "2026-03-07T09:00:00",
      "window_end": "2026-03-07T11:00:00",
      "service_time": 15
    }
  ],
  "constraints": {
    "num_vehicles": 2,
    "vehicle_capacity": 50,
    "max_working_hours": 8.0,
    "max_deliveries": 20,
    "shift_start": "08:00",
    "shift_end": "18:00",
    "break_duration": 30,
    "break_after_hours": 4.0,
    "average_speed_kmh": 40.0
  }
}
```

**Response:**
```json
{
  "routes": [...],
  "dropped_stops": [...],
  "total_distance": 20.41,
  "total_time": 313,
  "num_vehicles_used": 1,
  "num_stops_assigned": 10,
  "num_stops_dropped": 0,
  "optimization_time": 2.45,
  "success": true,
  "message": "Successfully optimized 10 stops across 1 vehicles"
}
```

#### POST `/api/upload-csv`
Upload CSV file with delivery stops

**Form Data:**
- `file`: CSV file

**CSV Format:**
```csv
stop_id,stop_name,latitude,longitude,demand,window_start,window_end,service_time
0,Depot,37.7749,-122.4194,0,2026-03-07 08:00:00,2026-03-07 18:00:00,0
1,Stop 1,37.7849,-122.4094,10,2026-03-07 09:00:00,2026-03-07 11:00:00,15
```

#### GET `/api/sample-data`
Get sample delivery data for testing

### Simple Route Finder

#### POST `/api/simple-route`
Get point-to-point route options

**Request Body:**
```json
{
  "origin_lat": 37.7749,
  "origin_lon": -122.4194,
  "destination_lat": 37.7849,
  "destination_lon": -122.4094
}
```

### AI Chat

#### POST `/api/chat`
AI assistant for route analysis

**Request Body:**
```json
{
  "query": "Why was Stop 5 dropped?",
  "context": {...}
}
```

### Health Check

#### GET `/api/health`
Check API health status

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                          # FastAPI application entry point
│   │
│   ├── codeforge/                       # CodeForge module
│   │   ├── __init__.py
│   │   ├── routes.py                    # Main CodeForge router
│   │   ├── models.py                    # Shared models
│   │   ├── naming_conventions/          # Naming validation & generation
│   │   │   ├── __init__.py
│   │   │   ├── service.py               # Business logic
│   │   │   ├── routes.py                # API endpoints
│   │   │   ├── models.py                # Data models
│   │   │   ├── generator.py             # Name generation
│   │   │   ├── utils.py                 # Utilities
│   │   │   └── validators/
│   │   │       └── oic_naming_validator.py
│   │   ├── review/                      # Code review functionality
│   │   │   ├── __init__.py
│   │   │   ├── service.py               # Review logic
│   │   │   ├── routes.py                # API endpoints
│   │   │   ├── models.py                # Data models
│   │   │   └── reviewers/
│   │   │       ├── oic_code_reviewer.py
│   │   │       └── python_code_reviewer.py
│   │   ├── rules_register/              # Rule management system
│   │   │   ├── __init__.py
│   │   │   ├── service.py               # Rule CRUD operations
│   │   │   ├── routes.py                # API endpoints
│   │   │   ├── models.py                # Data models
│   │   │   ├── rule_config.py           # Rule configuration
│   │   │   ├── rule_manager.py          # Rule management
│   │   │   └── rule_registry.py         # Rule registry
│   │   └── rule_sets/                   # Predefined rule sets
│   │       ├── __init__.py
│   │       ├── service.py               # Ruleset operations
│   │       ├── routes.py                # API endpoints
│   │       └── rulesets/
│   │           ├── oic_standard.json
│   │           ├── oic_enterprise.json
│   │           └── oic_relaxed.json
│   │
│   ├── smart_path_finder/               # Route optimization module
│   │   ├── __init__.py
│   │   ├── service.py                   # Business logic
│   │   ├── routes.py                    # API endpoints
│   │   ├── models.py                    # Data models
│   │   └── solvers/
│   │       ├── __init__.py
│   │       ├── vrptw_solver.py          # OR-Tools VRPTW solver
│   │       ├── simple_route.py          # Simple routing
│   │       ├── map_generator.py         # Map generation
│   │       └── distance.py              # Distance calculations
│   │
│   ├── shared/                          # Shared utilities
│   │   ├── __init__.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── csv_parser.py            # CSV parsing
│   │
│   ├── models/                          # Shared data models
│   │   ├── __init__.py
│   │   └── schemas.py                   # Common Pydantic models
│   │
│   └── api/                             # Legacy API routes
│       ├── __init__.py
│       ├── routes.py                    # Smart Path Finder routes
│       └── chat.py                      # Chat assistant routes
│
├── unit_test/                           # Unit tests
│   ├── test_naming_fix.py
│   ├── test_oic_analyzer.py
│   ├── test_rule_system.py
│   └── test_summary_report.py
│
├── integration_test/                    # Integration tests
│   └── integration_test.sh
│
├── utilities_test/                      # Test utilities & data
│   ├── README.md
│   └── test_oic_sample.xml
│
├── requirements.txt                     # Python dependencies
├── .env.example                         # Environment variables template
├── .env                                 # Environment variables (gitignored)
├── run.sh                               # Server startup script
└── README.md                            # This file
```

### Module Organization

Each module follows a consistent structure:
- `service.py` - Business logic and core functionality
- `routes.py` - FastAPI route definitions
- `models.py` - Pydantic data models
- `README.md` - Module-specific documentation

## Module Details

### CodeForge Module

The CodeForge module provides comprehensive code quality and standards enforcement:

**Key Components:**
- **Naming Conventions**: OIC artifact naming validation and generation
- **Code Review**: Multi-language code analysis with severity-based categorization
- **Rules Register**: Custom rule creation and management with CRUD operations
- **Rule Sets**: Predefined rule collections for different compliance levels

**Supported Artifact Types:**
- Integrations, Connections, Lookups, Packages, Projects, Activities

**Validation Features:**
- Pattern-based validation using regex
- Bulk validation for multiple artifacts
- Auto-generation of compliant names
- Comprehensive naming reports

[See CodeForge Documentation](app/codeforge/README.md)

### Smart Path Finder Module

Advanced VRPTW (Vehicle Routing Problem with Time Windows) optimization:

**Constraints:**
- ✅ **Time Windows**: Delivery must occur within specified time ranges
- ✅ **Vehicle Capacity**: Total demand cannot exceed vehicle capacity
- ✅ **Working Hours**: Routes must fit within driver shift times
- ✅ **Service Time**: Time required at each stop
- ✅ **Fleet Minimization**: Uses minimum number of vehicles

**Optimization Goals:**
- Minimize total distance
- Minimize number of vehicles
- Maximize stops assigned
- Balance routes across vehicles

**Features:**
- Waiting time calculation
- Slack time analysis
- Dropped stop diagnostics
- Route statistics and KPIs
- Interactive map generation

[See Smart Path Finder Documentation](app/smart_path_finder/README.md)

## Development

### Run Tests
```bash
pytest
```

### Code Quality
```bash
# Format code
black app/

# Lint
flake8 app/

# Type checking
mypy app/
```

### Debug Mode
Set `DEBUG=True` in `.env` for detailed logging

## Production Deployment

### Using Docker
```bash
docker build -t route-optimization-api .
docker run -p 8000:8000 route-optimization-api
```

### Using Gunicorn
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Performance

### Smart Path Finder
- **Optimization Time**: <30 seconds for 50 stops
- **Concurrent Requests**: Supports multiple simultaneous optimizations
- **Memory Usage**: ~200MB per optimization
- **Scalability**: Handles up to 100 stops efficiently

### CodeForge
- **Validation Speed**: <1 second for single artifact
- **Bulk Validation**: <5 seconds for 100 artifacts
- **Code Review**: <10 seconds for typical OIC integration
- **Memory Usage**: ~50MB per analysis
- **Concurrent Reviews**: Supports multiple simultaneous analyses

## Documentation

- **Main README**: [../README.md](../README.md) - Project overview
- **Setup Guide**: [../SETUP_GUIDE.md](../SETUP_GUIDE.md) - Installation instructions
- **Frontend Docs**: [../frontend/README.md](../frontend/README.md) - Frontend architecture
- **Module Documentation**:
  - [CodeForge](app/codeforge/README.md)
  - [Smart Path Finder](app/smart_path_finder/README.md)

## Troubleshooting

### OR-Tools Installation Issues
```bash
# If OR-Tools fails to install, try:
pip install --upgrade pip
pip install ortools --no-cache-dir
```

### Import Errors
```bash
# Ensure you're in the backend directory and venv is activated
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

### CORS Issues
Add your frontend URL to `CORS_ORIGINS` in `.env`

## License

MIT License

## Support

### Getting Help
- **API Documentation**: http://localhost:8000/docs - Interactive API documentation
- **GitHub Issues**: Report bugs and request features
- **Module Documentation**: See links in [Documentation](#documentation) section

### Contributing
Contributions are welcome! Please follow the project's coding standards and submit pull requests for review.

---

**Built with ❤️ for the CodeForge AI Engineering Lab**