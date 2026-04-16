# 🚀 Setup Guide - CodeForge AI Engineering Lab

Complete step-by-step guide to set up and run the CodeForge platform with all its modules.

## 📋 Prerequisites

### Required Software
- **Python 3.9 or higher** - [Download](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **npm 9 or higher** (comes with Node.js)
- **Git** (optional) - [Download](https://git-scm.com/)

### Verify Installation

```bash
python --version  # Should be 3.9+
node --version    # Should be 18+
npm --version     # Should be 9+
```

### What You'll Set Up

This guide will help you set up:
- **Backend API**: FastAPI server with CodeForge and Smart Path Finder modules
- **Frontend UI**: Next.js application with all tool interfaces
- **CodeForge Features**: Naming conventions, code review, rules management
- **Smart Path Finder**: Route optimization and logistics planning
---

## 🔧 Backend Setup (Python + FastAPI)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

### Step 3: Install Dependencies
```bash
# Upgrade pip first
pip install --upgrade pip

# Install all required packages
pip install -r requirements.txt

# This will install:
# - fastapi (web framework)
# - uvicorn (ASGI server)
# - ortools (optimization engine)
# - pandas (data processing)
# - pydantic (data validation)
# - and more...
```

**Note**: OR-Tools installation may take 2-3 minutes as it's a large package.

### Step 4: Configure Environment Variables
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file (optional for MVP)
# You can use default values for now
```

Default `.env` values:
```env
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
DATABASE_URL=sqlite:///./routes.db
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Step 5: Run Backend Server
```bash
# Option 1: Using uvicorn directly
uvicorn app.main:app --reload --port 8000

# Option 2: Using the run script (macOS/Linux)
chmod +x run.sh
./run.sh

# Option 3: Using Python directly
python -m app.main
```

### Step 6: Verify Backend is Running
Open your browser and visit:
- **API Root**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

You should see:
```json
{
  "status": "healthy",
  "service": "route-optimization-api"
}
```

---

## 🎨 Frontend Setup (Next.js + TypeScript)

### Step 1: Open New Terminal
Keep the backend running and open a new terminal window.

### Step 2: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 3: Install Dependencies
```bash
# Install all npm packages
npm install

# This will install:
# - next (React framework)
# - react & react-dom
# - typescript
# - tailwindcss (styling)
# - leaflet (maps)
# - axios (HTTP client)
# - and more...
```

**Note**: This may take 2-3 minutes depending on your internet speed.

### Step 4: Create Environment File (Optional)
```bash
# Create .env.local file
touch .env.local

# Add backend URL (optional, defaults to localhost:8000)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### Step 5: Run Frontend Development Server
```bash
npm run dev
```

### Step 6: Verify Frontend is Running
Open your browser and visit:
- **Home Page**: http://localhost:3000

You should see the landing page with:
- Hero section
- Feature cards
- Navigation menu

---

## ✅ Verification Checklist

### Backend Verification
- [ ] Backend server running on port 8000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Health check returns `{"status": "healthy"}`
- [ ] No errors in terminal

### Frontend Verification
- [ ] Frontend running on port 3000
- [ ] Home page loads correctly
- [ ] Navigation menu visible
- [ ] No console errors (press F12 to check)

### Integration Verification
- [ ] Frontend can reach backend (check browser console)
- [ ] CORS is configured correctly
- [ ] Both servers running simultaneously

---

## 🧪 Testing the Application

### 1. Test Backend Health
```bash
# In a new terminal
curl http://localhost:8000/api/health
```

### 2. Test CodeForge APIs
```bash
# Test naming validation
curl -X POST http://localhost:8000/api/codeforge/naming/validate \
  -H "Content-Type: application/json" \
  -d '{"artifact_type": "integration", "name": "BCRX_SF_ERP_ORDER_INT"}'

# List artifact types
curl http://localhost:8000/api/codeforge/naming/artifact-types

# List rules
curl http://localhost:8000/api/codeforge/rules

# List rulesets
curl http://localhost:8000/api/codeforge/rulesets
```

### 3. Test Smart Path Finder APIs
```bash
# Get sample data
curl http://localhost:8000/api/sample-data
```

### 4. Test Frontend Pages

**CodeForge Pages:**
- http://localhost:3000/code-forge - Main CodeForge dashboard
- http://localhost:3000/code-forge/naming-conventions - Naming conventions tools
- http://localhost:3000/code-forge/naming-conventions/bulk-validator - Bulk validation
- http://localhost:3000/code-forge/naming-conventions/name-generator - Name generation
- http://localhost:3000/code-forge/naming-conventions/pattern-guide - Standards guide
- http://localhost:3000/code-forge/naming-conventions/pattern-tester - Pattern testing
- http://localhost:3000/code-forge/review - Code review interface
- http://localhost:3000/code-forge/rules-register - Rules management
- http://localhost:3000/code-forge/rule-sets - Rule sets management

**Smart Path Finder Pages:**
- http://localhost:3000/smart-path-finder - Route optimization
- http://localhost:3000/simple-route - Simple route calculator

**Other Pages:**
- http://localhost:3000 - Home/Dashboard
- http://localhost:3000/dashboard - Main dashboard
- http://localhost:3000/integration-analyzer - Integration analyzer
- http://localhost:3000/tdd-generator - TDD generator (coming soon)

---

## 🐛 Troubleshooting

### Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'fastapi'"
**Solution**: Virtual environment not activated or dependencies not installed
```bash
source venv/bin/activate  # Activate venv
pip install -r requirements.txt
```

#### Issue: "Address already in use" (Port 8000)
**Solution**: Another process is using port 8000
```bash
# Find and kill the process
# macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

#### Issue: OR-Tools installation fails
**Solution**: Try installing without cache
```bash
pip install --no-cache-dir ortools
```

### Frontend Issues

#### Issue: "Cannot find module 'next'"
**Solution**: Dependencies not installed
```bash
npm install
```

#### Issue: Port 3000 already in use
**Solution**: Use a different port
```bash
npm run dev -- -p 3001
```

#### Issue: TypeScript errors
**Solution**: These are expected before `npm install`. After installation, restart VS Code.

### CORS Issues

#### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution**: Check backend `.env` file has correct CORS_ORIGINS
```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## 📦 Development Workflow

### Starting Development
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Stopping Servers
- Press `Ctrl+C` in each terminal to stop the servers

### Restarting After Changes
- **Backend**: Auto-reloads with `--reload` flag
- **Frontend**: Auto-reloads with Next.js hot reload

---

## 🚀 Next Steps

After successful setup:

1. **Explore API Documentation**
   - Visit http://localhost:8000/docs
   - Try the interactive API endpoints
   - Test CodeForge naming validation
   - Test Smart Path Finder optimization

2. **Try CodeForge Features**
   - Upload an OIC integration file (.iar) for analysis
   - Validate artifact names using naming conventions
   - Create custom rules in Rules Register
   - Explore predefined rule sets

3. **Test Smart Path Finder**
   - Use sample data for route optimization
   - Upload CSV with delivery stops
   - View optimized routes on interactive map

4. **Explore Frontend**
   - Navigate through all CodeForge pages
   - Test naming conventions tools
   - Try code review functionality
   - Manage rules and rule sets

5. **Optional Enhancements**
   - Add OpenAI API key for AI chat features
   - Configure custom naming patterns
   - Create organization-specific rule sets

---

## 📚 Additional Resources

### Documentation
- **FastAPI**: https://fastapi.tiangolo.com/
- **Next.js**: https://nextjs.org/docs
- **OR-Tools**: https://developers.google.com/optimization
- **Leaflet**: https://leafletjs.com/

### Project Documentation
- [README.md](README.md) - Project overview
- [backend/README.md](backend/README.md) - Backend architecture
- [frontend/README.md](frontend/README.md) - Frontend architecture
- **CodeForge Documentation:**
  - [CodeForge Overview](backend/app/codeforge/README.md)
  - [Naming Conventions](backend/app/codeforge/naming_conventions/README.md)
  - [Code Review](backend/app/codeforge/review/README.md)
  - [Rules Register](backend/app/codeforge/rules_register/README.md)
  - [Rule Sets](backend/app/codeforge/rule_sets/README.md)
- **Smart Path Finder Documentation:**
  - [Smart Path Finder](backend/app/smart_path_finder/README.md)

---

## ✅ Setup Complete!

You now have:
- ✅ Backend API running on port 8000 with CodeForge and Smart Path Finder modules
- ✅ Frontend app running on port 3000 with all tool interfaces
- ✅ All dependencies installed
- ✅ Development environment ready
- ✅ CodeForge features: Naming conventions, code review, rules management
- ✅ Smart Path Finder: Route optimization and logistics planning

**Ready to use CodeForge AI Engineering Lab!** 🎉

### Quick Access Links
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **CodeForge**: http://localhost:3000/code-forge
- **Smart Path Finder**: http://localhost:3000/smart-path-finder