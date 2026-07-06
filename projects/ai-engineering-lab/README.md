# 🧪 AI Engineering Lab

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.44+-green.svg)](https://playwright.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-yellow.svg)]()

> **A unified enterprise platform for Integration Engineering, Oracle Fusion Cloud accelerators, and AI-powered productivity tools. Scalable, enterprise-ready, mission-critical.**

---

## 📑 Table of Contents

- [Platform Overview](#-platform-overview)
- [Capability Areas](#-capability-areas)
  - [Integration Engineering](#-integration-engineering)
  - [Oracle Fusion Utilities](#-oracle-fusion-utilities)
  - [AI Workspace](#-ai-workspace)
  - [Reports](#-reports)
  - [Administration](#-administration)
- [Platform Architecture](#-platform-architecture)
- [Technology Stack](#-technology-stack)
- [Navigation & UI Structure](#-navigation--ui-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🎯 Platform Overview

**AI Engineering Lab** is an enterprise-grade, multi-capability platform purpose-built for Oracle Integration Cloud (OIC) engineers and Oracle Fusion Cloud practitioners. It consolidates integration analysis, documentation, code quality, Fusion accelerators, role automation, AI assistance, and platform observability into one coherent product.

### Platform Stats (Live)

| Metric | Value |
|---|---|
| Integrations tracked | 247 |
| Applications | 19 |
| Environments | 5 (DEV / TEST / SIT / UAT / PROD) |
| Capability Areas | 5 |

### Design Principles

- 🔬 **Engineering-first**: Every tool is purpose-built for OIC/Fusion practitioners
- 🏢 **Enterprise-grade**: Multi-environment, role-based, audit-ready
- ⚡ **Live connectivity**: Real OIC API integration — not just static analysis
- 🤖 **Automation-driven**: Playwright browser automation, AI assistants, schedulers
- 🎨 **Consistent UI**: Single layout shell, collapsible 4-level sidebar, floating AI assistant
- 🔌 **API-first backend**: Every capability is a FastAPI module with OpenAPI docs

---

## 🗂️ Capability Areas

The platform is organized into five **Capability Areas**, each containing one or more **Applications**. The home page (`/`) displays all five areas as cards with health status, recent activity, and quick-launch buttons.

```
AI Engineering Lab
├── Dashboard                          /dashboard
├── Integration Engineering            /integration-engineering
│   ├── Integration Analyzer           /integration-analyzer
│   │   ├── Integrations               /integration-analyzer/integrations
│   │   ├── Connections                /integration-analyzer/connections
│   │   ├── Lookups                    /integration-analyzer/lookups
│   │   ├── Dependency Graph           /integration-analyzer/graph
│   │   ├── Impact Analysis            /integration-analyzer/impact
│   │   └── Administration             /integration-analyzer/administration
│   │       ├── Environments           /integration-analyzer/administration/environments
│   │       └── Sync                   /integration-analyzer/administration/sync
│   ├── Documentation Studio           /tdd-generator
│   └── CodeForge                      /code-forge
│       ├── Naming Conventions         /code-forge/naming-conventions
│       ├── Code Review                /code-forge/review
│       ├── Rules Register             /code-forge/rules-register
│       └── Rule Sets                  /code-forge/rule-sets
├── Oracle Fusion Utilities            /oracle-fusion
│   ├── Cost Item Profile              /fusion-tools/cost-profile-builder
│   ├── BIP Analyzer                   /fusion-tools/bip-analyser
│   ├── OTBI Analyzer                  /oracle-fusion/otbi-analyzer       [coming]
│   ├── FBDI Validator                 /oracle-fusion/fbdi-validator       [coming]
│   ├── FSM Explorer                   /oracle-fusion/fsm-explorer         [coming]
│   ├── Lookup Explorer                /oracle-fusion/lookup-explorer      [coming]
│   └── Role Provisioning Studio       /fusion-tools/role-provisioning
├── AI Workspace                       /ai-workspace
│   ├── Smart Path Finder              /smart-path-finder
│   ├── AI Assistant                   /ai-workspace/ai-assistant
│   ├── Prompt Studio                  /ai-workspace/prompt-studio         [coming]
│   └── Agent Builder                  /ai-workspace/agent-builder         [coming]
├── Reports                            /reports
│   ├── Execution Reports              /reports/execution
│   ├── Integration Health             /reports/health
│   ├── Audit Trail                    /reports/audit
│   └── Scheduled Exports              /reports/scheduled
└── Administration                     /administration
    ├── Users & Roles                  /administration/users
    ├── OIC Configuration              /administration/oic-configuration
    ├── Projects                       /administration/projects
    ├── Scheduler                      /administration/scheduler
    ├── Audit Logs                     /administration/audit-logs
    └── Settings                       /administration/settings
```

---

## 🔗 Integration Engineering

*Analyze, document, and generate Oracle Integration Cloud artefacts. Full dependency visibility across all environments.*

**Status:** ✅ Healthy — 247 integrations · 4 applications

---

### 🔍 Integration Analyzer

Live Oracle Integration Cloud connectivity with full dependency analysis, impact assessment, and an integration designer view.

#### Multi-Environment Management
- Full CRUD for OIC environments (DEV / TEST / SIT / UAT / PROD)
- Active environment switching — all API calls use the selected environment
- Auth modes: Bearer token and Basic (username/password)
- Credential masking — placeholder-aware update logic
- Connection test before save
- Sync history tracking
- **Frontend:** `/integration-analyzer/administration/environments`

#### Integrations Browser
- Live integration list from the configured OIC environment
- 5-minute TTL cache to minimize API load
- Filter by status (`ACTIVATED` / `DRAFT`) and free-text search
- Per-integration actions: View Graph, Open Designer
- **Frontend:** `/integration-analyzer/integrations`

#### Projects Browser
- Browse OIC projects with search
- Drill into project-scoped integrations
- Open project integrations in Designer View
- **Frontend:** `/integration-analyzer/projects`

#### Connections Browser
- Merges global OIC connections with project-scoped connections
- De-duplicate by connection ID
- Connection details: type, adapter, status
- **Frontend:** `/integration-analyzer/connections`

#### Lookups Browser
- Merges global and project-scoped lookup tables
- **Frontend:** `/integration-analyzer/lookups`

#### Dependency Graph
- Graph view of integration dependencies using Cytoscape.js
- `GraphDialog` full-screen renderer
- Dynamic routes: `/integration-analyzer/graph/[id]`
- **Frontend:** `/integration-analyzer/graph`

#### Impact Analysis
- Background indexer builds reverse-dependency index across all integrations
- Search for any connection, lookup, or integration and see what depends on it
- Scan status tracking with progress indicator
- **Frontend:** `/integration-analyzer/impact`

#### Integration Designer View
- Full OIC API chain: workspace retrieval → blueprint fetch → normalized designer payload
- Per-integration workspace caching for repeat opens
- Structured activity extraction via `blueprint.py` parser
- `DesignerDialog` frontend renderer for workflow activities
- Blueprint plan for recursive containers (GlobalTry, Router, Scope, ForEach) — see [`integration-observability-blueprint-plan.md`](integration-observability-blueprint-plan.md)

#### Dashboard Stats
- KPI cards: total, activated, draft, REST, scheduled, impact index size
- Live configured/connected status
- **Frontend:** `/integration-analyzer` (dashboard)

**Backend API Endpoints** (`/api/integration-analyzer/`):

```
# Environments
GET    /admin/environments                    List environments
POST   /admin/environments                    Create environment
PUT    /admin/environments/{id}               Update environment
DELETE /admin/environments/{id}               Delete environment
POST   /admin/environments/{id}/activate      Switch active environment
POST   /admin/config/test                     Test connection
GET    /admin/sync/history                    Sync history

# Integrations
GET    /integrations                          List (search, status filter, cache TTL)
GET    /integrations/{id}/graph               Dependency graph
GET    /integrations/{id}/designer            Designer payload (workspace + blueprint)

# Projects
GET    /projects                              List projects
GET    /projects/{id}/integrations            Project integration list
GET    /projects/{id}/integrations/{iid}/graph Project integration graph

# Connections & Lookups
GET    /connections                           Merged global + project connections
GET    /lookups                               Merged global + project lookups

# Impact Analysis
POST   /impact/scan                           Trigger background dependency scan
GET    /impact/status                         Indexer status
GET    /impact/search?q=...                   Search impact index

# Dashboard
GET    /dashboard/stats                       KPI data
```

**Backend module:** [`backend/app/integration_analyzer/`](backend/app/integration_analyzer/)
**Frontend components:** [`frontend/components/integration-analyzer/`](frontend/components/integration-analyzer/)

---

### 📖 Documentation Studio

Generate Technical Design Documents, functional designs, API docs, sequence diagrams and flow diagrams.

- **Output formats:** Markdown, Word, PDF
- **Document types:** TDD, API Docs, Sequence Diagrams, Flow Diagrams
- **Status:** Live — 89 docs generated
- **Frontend:** `/tdd-generator`
- **Backend module:** [`backend/app/`](backend/app/) (integrated with CodeForge review engine)

---

### 🔨 CodeForge — Code Quality & Standards

OIC naming conventions validation, code review automation, and standards enforcement.

#### Naming Conventions
- Validate OIC artifact names (Integrations, Connections, Lookups, Packages, Projects, Activities)
- Regex-based pattern enforcement per artifact type
- Bulk validation — multiple artifacts in one request
- Auto-generate compliant names
- Interactive pattern tester
- Full OIC naming standards reference guide
- **Frontend:** `/code-forge/naming-conventions` (bulk-validator, name-generator, pattern-guide, pattern-tester)

**API:**
```
POST /api/codeforge/naming/validate           Validate single name
POST /api/codeforge/naming/validate-bulk      Bulk validation
POST /api/codeforge/naming/generate           Generate compliant name
GET  /api/codeforge/naming/artifact-types     List artifact types
```

#### Code Review
- Multi-language reviewers: Python, OIC (`.iar` XML parsing)
- Severity levels: Critical, High, Medium, Low, Info
- Naming convention report from OIC integration file
- **Frontend:** `/code-forge/review`

**API:**
```
POST /api/codeforge/reviews                   Submit code for review
GET  /api/codeforge/reviews/{id}              Get review results
GET  /api/codeforge/reviews/{id}/naming-report Naming compliance report
```

#### Rules Register
- Full CRUD for custom quality rules
- Categories: Error Handling, Security, Performance, Best Practices
- Rule registry with rule manager and config layers
- **Frontend:** `/code-forge/rules-register`

**API:**
```
GET    /api/codeforge/rules                   List rules
POST   /api/codeforge/rules                   Create rule
GET    /api/codeforge/rules/{id}              Get rule
PUT    /api/codeforge/rules/{id}              Update rule
DELETE /api/codeforge/rules/{id}              Delete rule
```

#### Rule Sets
- Bundled sets: `oic_standard.json`, `oic_enterprise.json`, `oic_relaxed.json`
- Create and manage custom rule collections
- Card, List, and Compact view modes
- Import/export for team sharing
- **Frontend:** `/code-forge/rule-sets`

**API:**
```
GET    /api/codeforge/rulesets                List rulesets
POST   /api/codeforge/rulesets                Create ruleset
GET    /api/codeforge/rulesets/{id}           Get ruleset
PUT    /api/codeforge/rulesets/{id}           Update ruleset
DELETE /api/codeforge/rulesets/{id}           Delete ruleset
```

**Backend module:** [`backend/app/codeforge/`](backend/app/codeforge/)

---

## 🟠 Oracle Fusion Utilities

*Accelerators for Oracle Fusion Cloud — Cost profiles, BIP reports, OTBI, FBDI, FSM and Lookup management.*

**Status:** ✅ Healthy — 7 applications (3 live, 4 coming soon)

---

### 💰 Cost Item Profile *(Live)*

Build and manage Oracle Cost Item Profiles for Oracle Fusion Costing.

- Upload cost templates, map cost elements, validate structure
- Export profiles for Oracle Fusion import
- AI chat interface for cost data analysis
- Multi-category cost management
- **Status:** Live — 89 profiles built
- **Frontend:** `/fusion-tools/cost-profile-builder`
- **Backend:** `/api/cost-profile-builder/`

**API:**
```
POST /api/cost-profile-builder/create         Create cost profile
POST /api/cost-profile-builder/analyze        Analyze costs
GET  /api/cost-profile-builder/{id}           Get profile
GET  /api/cost-profile-builder/export         Export report
POST /api/cost-profile-builder/chat           AI chat
```

---

### 📊 BIP Analyzer *(Live)*

Analyze Oracle Business Intelligence Publisher reports.

- Extract data model structure, parameters, queries, and data sources
- Multi-format support: XML, PDF, Excel, RTF
- Visual analytics and cross-report correlation
- Export to Excel, CSV, JSON
- **Status:** Live — 34 reports analyzed
- **Frontend:** `/fusion-tools/bip-analyser`

---

### 🛡️ Role Provisioning Studio *(Live)*

Playwright-powered Oracle Fusion Security Console automation with live execution streaming.

- **Browser Automation:** Headless/headed Oracle Fusion UI via Playwright
- **SSE Streaming:** Real-time server-sent events for provisioning progress
- **Execution Modes:** `create`, `update`, `delete` for full role lifecycle
- **Dual Input Sources:** Manual entry or bulk JSON file (`role_definition.json`)
- **6-Section Studio Interface:**
  | Section | Purpose |
  |---|---|
  | 1 — Role Definition | Role name, code, category, execution mode |
  | 2 — Input Source | Manual / JSON file upload selector |
  | 3 — Live Execution | SSE-streaming progress panel |
  | 4 — Execution Grid | Per-role status rows in real time |
  | 5 — Execution Summary | Totals, timings, success/fail counts |
  | 6 — Export | JSON summary / log file / screenshots ZIP |
- **Configuration Tab:** Fusion URL, credentials, headless/debug settings
- **Run History Tab:** Past runs with per-run logs and screenshots
- **Audit Trail:** Automatic per-step screenshots, full file-based logs
- **Status:** Live — JSON-driven automation
- **Frontend:** `/fusion-tools/role-provisioning`
- **Backend:** `/api/role-provisioning/`

**API:**
```
POST /api/role-provisioning/run/stream                SSE streaming run
POST /api/role-provisioning/run                       Blocking run
GET  /api/role-provisioning/history                   List runs
GET  /api/role-provisioning/history/{id}/log          Stream log
GET  /api/role-provisioning/history/{id}/screenshots  List screenshots
GET  /api/role-provisioning/history/{id}/export/json  Export JSON summary
GET  /api/role-provisioning/history/{id}/export/log   Download log
GET  /api/role-provisioning/history/{id}/export/screenshots  ZIP download
GET  /api/role-provisioning/config                    Get config
PUT  /api/role-provisioning/config                    Update config
POST /api/role-provisioning/validate-json             Validate role JSON
POST /api/role-provisioning/test-connection           Ping Fusion URL
```

**Backend module:** [`backend/app/role_provisioning/`](backend/app/role_provisioning/)
**Frontend components:** [`frontend/components/role-provisioning/`](frontend/components/role-provisioning/)

---

### 📋 Coming Soon in Oracle Fusion Utilities

| Application | Description | Route |
|---|---|---|
| OTBI Analyzer | Inspect subject areas, dimensions, metrics | `/oracle-fusion/otbi-analyzer` |
| FBDI Validator | Validate File-Based Data Import templates | `/oracle-fusion/fbdi-validator` |
| FSM Explorer | Browse Functional Setup Manager tasks | `/oracle-fusion/fsm-explorer` |
| Lookup Explorer | Compare lookup types/values across environments | `/oracle-fusion/lookup-explorer` |

---

## 🤖 AI Workspace

*AI-powered productivity tools — Smart path finding, conversational assistant, prompt engineering and agent builder.*

**Status:** ✅ Healthy — 4 applications (2 live, 2 coming soon)

---

### 🚛 Smart Path Finder *(Live)*

Google OR-Tools powered Vehicle Routing Problem with Time Windows (VRPTW) optimizer for delivery operations.

- **VRPTW Solver**: OR-Tools route optimization
- **Time Windows**: Ensure deliveries within specified windows
- **Vehicle Capacity**: Respect payload constraints
- **Break Scheduling**: Auto driver break planning
- **Interactive Maps**: Folium/Leaflet route visualization
- **AI Chat**: Natural language route analysis
- **Data Input**: CSV upload, sample data, manual entry
- **Status:** Live — 89 routes solved
- **Frontend:** `/smart-path-finder`, `/simple-route`

**API:**
```
POST /api/optimize                             VRPTW route optimization
POST /api/simple-route                         Simple route calculation
GET  /api/sample-data                          Sample delivery data
POST /api/upload-csv                           Upload CSV stops
POST /api/generate-map                         Generate route map
POST /api/chat                                 AI chat interaction
```

**Backend module:** [`backend/app/smart_path_finder/`](backend/app/smart_path_finder/)

---

### 💬 AI Assistant *(Live Entry Point)*

Conversational AI assistant for engineering queries — ask about integrations, get recommendations, automate repetitive tasks.

- GPT-4 powered conversational interface
- Engineering-context aware responses
- **Frontend:** `/ai-workspace` → AI Assistant card

---

### 📋 Coming Soon in AI Workspace

| Application | Description | Route |
|---|---|---|
| Prompt Studio | Design, test, and version-control AI prompts | `/ai-workspace/prompt-studio` |
| Agent Builder | Build reusable AI agents for engineering workflows | `/ai-workspace/agent-builder` |

---

## 📊 Reports

*Platform-wide reporting. Execution history, audit trails, integration health summaries and scheduled exports.*

**Status:** ✅ Healthy — 4 report categories

| Report | Description | Route |
|---|---|---|
| Execution Reports | Integration execution history, success/failure rates, error breakdown | `/reports/execution` |
| Integration Health | Health summary across all environments | `/reports/health` |
| Audit Trail | Complete log of platform operations | `/reports/audit` |
| Scheduled Exports | Configure automated report delivery | `/reports/scheduled` |

**Frontend:** `/reports`

---

## ⚙️ Administration

*Platform administration — users, roles, OIC environment configuration, scheduler and system settings.*

**Status:** ⚠️ Warning — OIC token refresh due

| Section | Description | Detail | Route |
|---|---|---|---|
| Users & Roles | Platform users, role assignment (Admin/Engineer/Viewer) | 12 users · 3 roles | `/administration/users` |
| OIC Configuration | OIC environment credentials, OAuth, token management | 5 environments | `/administration/oic-configuration` |
| Projects | Group integrations, docs and configs across environments | 24 active projects | `/administration/projects` |
| Scheduler | Automate metadata sync, report generation, health checks | 8 active schedules | `/administration/scheduler` |
| Audit Logs | Full audit trail of logins, config changes, exports | — | `/administration/audit-logs` |
| Settings | System settings, feature flags, preferences | — | `/administration/settings` |

**Frontend:** `/administration`

---

## 📊 Platform Dashboard

Live KPI overview across all capability areas.

| KPI | Value | Trend |
|---|---|---|
| Total Integrations | 247 | +8 ↑ |
| Activated | 198 | +3 ↑ |
| Projects | 24 | +2 ↑ |
| Connections | 67 | +1 ↑ |
| Lookups | 412 | -4 ↓ |
| Packages | 18 | — |
| Dependency Health | 94% | +2% ↑ |
| Execution Success | 98.3% | +0.5% ↑ |

**Environments monitored:** DEV (⚠️), TEST, SIT, UAT, PROD (✅)

**Frontend:** `/dashboard`

---

## 🏗️ Platform Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          Browser — Next.js 14 App Router                      │
│                                                                                │
│  ┌─────────────┐  ┌──────────────────────────────────────────────────────┐  │
│  │  Top Nav    │  │                  Page Content                          │  │
│  │  Breadcrumb │  │                                                        │  │
│  │  User Menu  │  │   ┌───────────────┐   ┌───────────────┐              │  │
│  └─────────────┘  │   │  Integration  │   │    Oracle     │              │  │
│                   │   │  Engineering  │   │    Fusion     │              │  │
│  ┌─────────────┐  │   │  ───────────  │   │  Utilities   │              │  │
│  │ Collapsible │  │   │  Integration  │   │  ─────────── │              │  │
│  │  Sidebar    │  │   │  Analyzer     │   │  Cost Profile │              │  │
│  │  4-level    │  │   │  Doc Studio   │   │  BIP Analyser │              │  │
│  │  hierarchy  │  │   │  CodeForge    │   │  Role Prov.   │              │  │
│  └─────────────┘  │   └───────────────┘   └───────────────┘              │  │
│                   │                                                        │  │
│  ┌─────────────┐  │   ┌───────────────┐   ┌───────────────┐              │  │
│  │  Context    │  │   │  AI Workspace │   │  Dashboard    │              │  │
│  │  Panel      │  │   │  ─────────── │   │  Reports      │              │  │
│  └─────────────┘  │   │  Smart Path   │   │  Admin        │              │  │
│                   │   │  AI Assistant │   └───────────────┘              │  │
│  ┌─────────────┐  │   └───────────────┘                                  │  │
│  │  Floating   │  └──────────────────────────────────────────────────────┘  │
│  │  AI Chat    │                                                              │
│  └─────────────┘                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │ REST API / SSE
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Backend — FastAPI 0.109                                │
│                                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │   app/main.py  — router registration, CORS, startup/shutdown events    │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────────────┐ │
│  │  integration_   │  │  role_          │  │  codeforge/                  │ │
│  │  analyzer/      │  │  provisioning/  │  │  ├─ naming_conventions/      │ │
│  │  ├─ routes.py   │  │  ├─ routes.py   │  │  ├─ review/                  │ │
│  │  ├─ oic_client  │  │  ├─ service.py  │  │  │   └─ reviewers/ (oic,py)  │ │
│  │  ├─ blueprint   │  │  ├─ run_logger  │  │  ├─ rules_register/          │ │
│  │  ├─ analyzer    │  │  ├─ config.py   │  │  └─ rule_sets/               │ │
│  │  ├─ indexer     │  │  └─ pages/      │  │      rulesets/*.json          │ │
│  │  └─ config.py   │  │    login/fusion │  └──────────────────────────────┘ │
│  └─────────────────┘  │    role_manager │                                     │
│                        └─────────────────┘                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────────────┐ │
│  │  cost_profile_  │  │  smart_path_    │  │  api/                        │ │
│  │  builder/       │  │  finder/        │  │  ├─ routes.py                │ │
│  │  ├─ routes      │  │  ├─ routes      │  │  └─ chat.py                  │ │
│  │  ├─ oracle_svc  │  │  ├─ service     │  │                              │ │
│  │  └─ chat_svc    │  │  └─ solvers/    │  │  models/schemas.py           │ │
│  └─────────────────┘  └─────────────────┘  └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        External Systems & Storage                              │
│                                                                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────────┐ │
│  │  Oracle          │  │  Oracle Fusion   │  │  File Storage              │ │
│  │  Integration     │  │  Cloud (ERP/HCM) │  │  ├─ role_prov/logs/        │ │
│  │  Cloud (OIC)     │  │  Playwright UI   │  │  ├─ role_prov/screenshots/ │ │
│  │  REST APIs       │  │  Automation      │  │  ├─ rule_sets/*.json        │ │
│  └──────────────────┘  └──────────────────┘  └────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────┐  ┌──────────────────┐                                  │
│  │  OpenAI          │  │  Google OR-Tools │                                  │
│  │  GPT-4 API       │  │  VRPTW Solver    │                                  │
│  └──────────────────┘  └──────────────────┘                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Frontend Module Structure

```
frontend/
├── app/                                  # Next.js App Router pages
│   ├── page.tsx                          # Platform home — 5 capability area cards
│   ├── layout.tsx                        # Root layout (TopNav + Sidebar + ContextPanel + FloatingAI)
│   ├── globals.css                       # Tailwind base + custom utilities
│   ├── dashboard/
│   │   └── page.tsx                      # Platform Dashboard — KPIs, environments, AI insights
│   ├── integration-engineering/
│   │   └── page.tsx                      # IE landing — 4 application cards
│   ├── integration-analyzer/
│   │   ├── page.tsx                      # IA Dashboard — KPI cards, quick actions
│   │   ├── integrations/page.tsx         # Integration browser + Designer/Graph launch
│   │   ├── projects/page.tsx             # Project browser
│   │   ├── connections/page.tsx          # Connections browser
│   │   ├── lookups/page.tsx              # Lookups browser
│   │   ├── graph/
│   │   │   ├── page.tsx                  # Graph overview
│   │   │   └── [id]/page.tsx             # Per-integration dependency graph
│   │   ├── impact/page.tsx               # Impact analysis + indexer trigger
│   │   └── administration/
│   │       ├── page.tsx                  # Admin overview
│   │       ├── environments/page.tsx     # Multi-env CRUD + active switching
│   │       └── sync/page.tsx             # Sync management
│   ├── code-forge/
│   │   ├── page.tsx                      # CodeForge dashboard
│   │   ├── naming-conventions/           # bulk-validator, name-generator, pattern-guide, pattern-tester
│   │   ├── review/page.tsx               # Code review submit + results
│   │   ├── rules-register/page.tsx       # Rules CRUD
│   │   └── rule-sets/page.tsx            # Rule sets management
│   ├── oracle-fusion/
│   │   └── page.tsx                      # Oracle Fusion Utilities landing — 7 app cards
│   ├── fusion-tools/
│   │   ├── page.tsx                      # (legacy Fusion Tools root)
│   │   ├── cost-profile-builder/page.tsx # Cost Item Profile app
│   │   ├── bip-analyser/page.tsx         # BIP Analyzer app
│   │   └── role-provisioning/page.tsx    # Role Provisioning Studio (3 tabs)
│   ├── ai-workspace/
│   │   └── page.tsx                      # AI Workspace hub — 4 app cards
│   ├── smart-path-finder/page.tsx        # VRPTW optimizer
│   ├── simple-route/page.tsx             # Simple route calculator
│   ├── tdd-generator/page.tsx            # Documentation Studio
│   ├── reports/page.tsx                  # Reports hub — 4 categories
│   └── administration/
│       ├── page.tsx                      # Admin hub — 6 sections
│       └── oic-configuration/page.tsx    # OIC env config
│
├── components/
│   ├── layout/
│   │   ├── TopNavigation.tsx             # Fixed top bar — brand, breadcrumbs, user menu
│   │   ├── CollapsibleSidebar.tsx        # 4-level sidebar (area → app → page)
│   │   ├── ContextPanel.tsx              # Right-side context/help panel
│   │   └── FloatingAIAssistant.tsx       # Floating chat bubble (bottom-right)
│   ├── integration-analyzer/
│   │   ├── IntegrationAnalyzerLayout.tsx # IA-scoped sidebar layout
│   │   ├── DesignerDialog.tsx            # Integration Designer modal
│   │   └── GraphDialog.tsx              # Dependency graph modal
│   ├── role-provisioning/
│   │   ├── Section1RoleDefinition.tsx
│   │   ├── Section2InputSource.tsx
│   │   ├── Section3LiveExecution.tsx     # SSE streaming panel
│   │   ├── Section4ExecutionGrid.tsx     # Per-role status grid
│   │   ├── Section5ExecutionSummary.tsx
│   │   ├── Section6Export.tsx
│   │   ├── ConfigurationTab.tsx
│   │   ├── RunHistoryTab.tsx
│   │   ├── ToastContainer.tsx
│   │   └── types.ts                      # Shared TypeScript interfaces
│   ├── chat/                             # Chat UI components
│   ├── forms/                            # Shared form primitives
│   ├── naming/                           # Naming convention UI
│   ├── results/                          # Results/output display
│   └── ui/                               # Base UI atoms (buttons, badges, etc.)
│
└── lib/
    ├── integration-analyzer.ts           # IA API base URL + shared TypeScript types
    └── oic-config-store.ts               # OIC environment local storage helpers
```

### Backend Module Structure

```
backend/
├── app/
│   ├── main.py                           # FastAPI app — router registration, CORS
│   ├── api/
│   │   ├── routes.py                     # Core routes (health, etc.)
│   │   └── chat.py                       # Chat/AI endpoint
│   ├── integration_analyzer/
│   │   ├── routes.py                     # All 20+ IA endpoints
│   │   ├── oic_client.py                 # Async OIC REST client (httpx)
│   │   ├── analyzer.py                   # Dependency graph builder
│   │   ├── blueprint.py                  # OIC blueprint parser → designer payload
│   │   ├── indexer.py                    # Background impact analysis indexer
│   │   └── config.py                     # Multi-env config store
│   ├── role_provisioning/
│   │   ├── routes.py                     # SSE stream + blocking run + history + export
│   │   ├── service.py                    # Playwright orchestration (thread pool)
│   │   ├── run_logger.py                 # Per-run file logger
│   │   ├── config.py                     # Fusion connection config
│   │   ├── models.py                     # Pydantic models
│   │   └── pages/                        # Page Object Model
│   │       ├── base_page.py
│   │       ├── login.py
│   │       ├── fusion.py
│   │       └── role_manager.py
│   ├── codeforge/
│   │   ├── routes.py
│   │   ├── models.py
│   │   ├── naming_conventions/
│   │   │   ├── service.py
│   │   │   ├── generator.py
│   │   │   ├── models.py
│   │   │   ├── utils.py
│   │   │   └── validators/
│   │   │       └── oic_naming_validator.py
│   │   ├── review/
│   │   │   ├── service.py
│   │   │   ├── models.py
│   │   │   └── reviewers/
│   │   │       ├── oic_code_reviewer.py
│   │   │       └── python_code_reviewer.py
│   │   ├── rules_register/
│   │   │   ├── service.py
│   │   │   ├── models.py
│   │   │   ├── rule_registry.py
│   │   │   ├── rule_manager.py
│   │   │   └── rule_config.py
│   │   └── rule_sets/
│   │       ├── service.py
│   │       └── rulesets/
│   │           ├── oic_standard.json
│   │           ├── oic_enterprise.json
│   │           └── oic_relaxed.json
│   ├── cost_profile_builder/
│   │   ├── routes.py
│   │   ├── models.py
│   │   ├── oracle_service.py
│   │   └── chat_service.py
│   ├── smart_path_finder/
│   │   ├── routes.py
│   │   ├── models.py
│   │   ├── service.py
│   │   └── solvers/                      # VRPTW + simple route solvers
│   ├── shared/                           # Shared utilities
│   └── models/
│       └── schemas.py                    # Shared Pydantic schemas

platform/
├── observability/                        # Platform observability layer
│   ├── logger.py
│   ├── metrics.py
│   ├── tracing.py
│   ├── decorators.py
│   └── telemetry.py
└── security/                             # Security utilities (planned)
```

---

## 🛠️ Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.109.0 | Web framework, router, OpenAPI docs |
| **Python** | 3.9+ | Primary language |
| **Playwright** | ≥1.44.0 | Oracle Fusion browser automation |
| **Google OR-Tools** | 9.15.6755 | VRPTW route optimization |
| **Pydantic** | 2.5.3 | Data validation and serialization |
| **httpx** | 0.26.0 | Async HTTP client for OIC API calls |
| **OpenAI SDK** | 1.10.0 | GPT-4 AI/LLM integration |
| **Uvicorn** | 0.27.0 | ASGI server |
| **pandas** | ≥2.2.0 | Data processing and analysis |
| **folium** | 0.15.1 | Route map generation |
| **python-dotenv** | 1.0.0 | Environment configuration |
| **python-multipart** | 0.0.6 | File upload handling |
| **SQLAlchemy** | 2.0.25 | ORM (future persistence layer) |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.x | React framework (App Router) |
| **TypeScript** | 5.3.3 | Type-safe JavaScript |
| **React** | 18.x | UI library |
| **Tailwind CSS** | 3.4.x | Utility-first styling with custom tokens |
| **Cytoscape.js** | 3.34.0 | Dependency graph rendering |
| **Leaflet + react-leaflet** | 1.9.4 / 4.2.1 | Route map visualization |
| **Lucide React** | 0.316.0 | Icon library |
| **Framer Motion** | 11.x | UI animations |
| **PapaParse** | 5.4.1 | CSV parsing for bulk uploads |
| **axios** | 1.6.5 | HTTP client |
| **date-fns** | 3.3.1 | Date formatting |

### Design System (Tailwind Tokens)

| Token | Value | Usage |
|---|---|---|
| `primary-600` | `#2563eb` | Buttons, links, active states |
| `success-600` | `#16a34a` | Healthy status, success badges |
| `warning-600` | `#d97706` | Warning status, token expiry alerts |
| `danger-600` | `#dc2626` | Errors, critical alerts |
| `canvas` | `#f8fafc` | Page backgrounds |
| `surface` | `#ffffff` | Card/panel backgrounds |
| `gradient-hero` | `#1e3a8a → #2563eb` | Platform hero banner |

### Development Tools

| Tool | Purpose |
|---|---|
| **ESLint** + `eslint-config-next` | Frontend lint |
| **TypeScript** strict mode | Type checking |
| **pytest** | Backend unit/integration tests |
| **Playwright** | Browser automation + E2E testing |
| **Git** | Version control |
| **npm** / **pip** | Package management |
| **Markdown** / **OpenAPI** | Documentation |

---

## 🖥️ Navigation & UI Structure

### Global Layout

Every page is wrapped by the root layout ([`frontend/app/layout.tsx`](frontend/app/layout.tsx)):

```
┌──────────────────────────────────────────────────── Fixed Top Bar (h-14) ──┐
│  [🧪 AI Engineering Lab]  Home / Breadcrumb  …  🔔  ❓  🌙  ⚙️  [JD ▾]  │
└────────────────────────────────────────────────────────────────────────────┘
┌── Sidebar ──┐ ┌──────────── Main Content ──────────────────┐ ┌── Context ─┐
│ w-12→w-56   │ │                                             │ │  Panel     │
│ on hover    │ │   <page content>                            │ │  (toggle)  │
│ 4 levels:   │ │                                             │ └────────────┘
│ Dashboard   │ │                                             │
│ ─ Area      │ └─────────────────────────────────────────────┘
│   ─ App     │
│     ─ Page  │
└─────────────┘
                                              [💬 Floating AI Assistant]
```

### Sidebar Navigation Hierarchy

The [`CollapsibleSidebar`](frontend/components/layout/CollapsibleSidebar.tsx) has 4 levels:

1. **Dashboard** — direct link
2. **Capability Area** — Integration Engineering, Oracle Fusion Utilities, AI Workspace, Reports, Administration
3. **Application** — Integration Analyzer, Documentation Studio, CodeForge, Cost Item Profile, etc.
4. **Page** — sub-pages within an application (Integrations, Connections, Dependency Graph, etc.)

The sidebar collapses to icon-only (`w-12`) and expands to full (`w-56`) on hover.

### Top Navigation Features
- **Brand:** `FlaskConical` icon + "AI Engineering Lab" — links to `/`
- **Breadcrumbs:** Auto-generated from pathname with friendly label mapping
- **User Menu:** Profile, Administration, Sign Out (JD / Platform Admin)
- **Actions:** Search (⌘K), Notifications (with dot badge), Help, Theme toggle, Settings

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Python | 3.9+ | Required |
| Node.js | 18.0+ | Required |
| npm | 9.0+ | Required |
| Git | Latest | Required |
| Playwright Chromium | auto-installed | Required for Role Provisioning |

### Installation

#### 1. Clone

```bash
git clone <repository-url>
cd ai-engineering-lab_v5
```

#### 2. Backend

```bash
cd backend

# Virtual environment
python -m venv venv
source venv/bin/activate          # macOS/Linux
# venv\Scripts\activate           # Windows

# Dependencies
pip install -r requirements.txt

# Playwright browser (for Role Provisioning)
playwright install chromium

# Environment config
cp .env.example .env
# Edit .env — add OPENAI_API_KEY, Fusion credentials, etc.
```

#### 3. Frontend

```bash
cd frontend
npm install
```

### Running

#### Backend

```bash
cd backend

# With auto-reload (development)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use the run script
./run.sh
```

API live at: `http://localhost:8000`
Swagger UI: `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

#### Frontend

```bash
cd frontend
npm run dev          # Development with HMR
# npm run build && npm start   # Production
```

App live at: `http://localhost:3000`

### First-Time Setup Checklist

```
□ 1. Open http://localhost:3000
□ 2. Check Platform Dashboard at /dashboard
□ 3. Go to Administration → OIC Configuration — add your first OIC environment
□ 4. Go to Integration Engineering → Integration Analyzer — verify connection
□ 5. Browse live integrations at /integration-analyzer/integrations
□ 6. Run an impact scan at /integration-analyzer/impact
□ 7. Try Role Provisioning at /fusion-tools/role-provisioning → Configuration tab
□ 8. Explore CodeForge naming conventions at /code-forge/naming-conventions
□ 9. Run a Smart Path Finder route at /smart-path-finder
□ 10. Check API docs at http://localhost:8000/docs
```

---

## 📖 Usage Guide

### Integration Analyzer Workflow

1. **Add Environment** → `/integration-analyzer/administration/environments` → "Add Environment" → enter OIC URL, auth type, credentials → Test Connection → Save
2. **Browse Integrations** → `/integration-analyzer/integrations` → filter by status/search → click integration to open Designer or Graph
3. **Impact Analysis** → `/integration-analyzer/impact` → "Start Scan" (runs in background) → search for connection/lookup name → see dependent integrations
4. **Dependency Graph** → `/integration-analyzer/graph` → select integration → full graph with Cytoscape.js renderer

### Role Provisioning Workflow

1. **Configure** → `/fusion-tools/role-provisioning` → Configuration tab → set Fusion URL, credentials, headless mode → Test Connection
2. **Define Role** → Studio tab → Section 1: enter role name/code/category/mode → Section 2: choose manual or JSON file
3. **Run** → "Start Provisioning" → watch Section 3 SSE stream → Section 4 grid updates per role → Section 5 summary on completion
4. **Export** → Section 6 buttons or Run History tab → download JSON, log, or screenshots ZIP

### CodeForge Workflow

1. **Validate Names** → `/code-forge/naming-conventions` → enter artifact name + type → validate → use Bulk Validator for multiple
2. **Review Code** → `/code-forge/review` → upload `.iar` file or paste code → select ruleset → view results with severity breakdown
3. **Manage Rules** → `/code-forge/rules-register` → create/edit/delete custom rules → assign category and severity
4. **Apply Rule Sets** → `/code-forge/rule-sets` → choose OIC Standard / Enterprise / Relaxed or create custom → export as JSON

---

## 🔌 API Reference

Base URL: `http://localhost:8000`
Swagger: `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

### Router Registration (main.py)

| Prefix | Module | Tag |
|---|---|---|
| `/api` | `app.api.routes` | routes |
| `/api` | `app.api.chat` | chat |
| `/api/codeforge` | `app.codeforge.routes` | codeforge |
| `/api/cost-profile-builder` | `app.cost_profile_builder` | cost-profile-builder |
| `/api/integration-analyzer` | `app.integration_analyzer.routes` | integration-analyzer |
| `/api/role-provisioning` | `app.role_provisioning` | role-provisioning |

> See the [Capability Areas](#-capability-areas) section for per-module endpoint listings.

---

## ⚙️ Configuration

### Backend — `.env`

```env
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS — add frontend origin(s)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# OpenAI (AI Assistant, Chat)
OPENAI_API_KEY=sk-...

# Logging
LOG_LEVEL=INFO

# File uploads
MAX_UPLOAD_SIZE=10485760   # 10 MB
ALLOWED_EXTENSIONS=.py,.js,.xml,.iar,.csv,.json

# Oracle Fusion (Role Provisioning)
FUSION_BASE_URL=https://your-instance.oraclecloud.com
FUSION_USERNAME=your_admin_user
FUSION_PASSWORD=your_password
FUSION_HEADLESS=true
```

### Frontend — `.env.local`

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Feature flags
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 🚢 Deployment

### Docker (Recommended)

```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### Manual — Backend

```bash
pip install -r requirements.txt
playwright install chromium

# Production with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Manual — Frontend

```bash
npm run build
npm start
# or
vercel deploy --prod
```

---

## 🗺️ Roadmap

### ✅ Phase 1 — Foundation (Complete)
- Platform layout shell (TopNav, CollapsibleSidebar, ContextPanel, FloatingAI)
- Smart Path Finder VRPTW solver + maps
- CodeForge naming conventions + code review + rules management
- Backend modular architecture (FastAPI routers per capability)

### ✅ Phase 2 — OIC Intelligence (Complete)
- Integration Analyzer — live OIC connectivity
- Multi-environment management with CRUD and active switching
- Integrations, Projects, Connections, Lookups browsers
- Dependency graph (Cytoscape.js) + impact analysis indexer
- Integration Designer View (workspace → blueprint API chain)
- Platform home page with 5 capability area cards
- Platform Dashboard with live KPIs and environment health

### ✅ Phase 3 — Oracle Fusion Automation (Complete)
- Role Provisioning Studio — Playwright browser automation
- SSE live execution streaming
- Per-run logs, screenshots, export capabilities
- Oracle Fusion Utilities landing (7 app cards)
- AI Workspace hub with app launcher
- Documentation Studio shell (TDD Generator)

### 🚧 Phase 4 — Intelligence Enhancement (In Progress)
- Recursive OIC Blueprint parser (GlobalTry, Router, Scope, ForEach containers)
- DesignerDialog recursive renderer for complex blueprints
- Documentation Studio full backend (TDD generation, PDF export)
- Reports backend (execution history, scheduled exports)
- Administration backend (users, roles, scheduler)

### 📋 Phase 5 — Analytics & AI (Planned Q2 2026)
- AI Assistant full conversational interface
- Prompt Studio — design, test, version-control prompts
- Agent Builder — reusable engineering AI agents
- OTBI Analyzer
- FBDI Validator
- Cross-tool analytics dashboard

### 🔮 Phase 6 — Enterprise (Planned Q3 2026)
- FSM Explorer
- Lookup Explorer
- Multi-tenant support
- Advanced RBAC (Admin / Engineer / Viewer)
- CI/CD pipeline builder
- Enterprise SSO integration

---

## 🤝 Contributing

### Development Workflow

```bash
git checkout -b feature/your-feature
# make changes
git commit -m "feat: describe your change"
git push origin feature/your-feature
# open Pull Request
```

### Code Standards

**Backend (Python)**
- PEP 8 style, type hints throughout
- Docstrings on all public functions
- FastAPI dependency injection patterns
- Pydantic v2 models for all request/response types
- Unit tests in `backend/unit_test/`

**Frontend (TypeScript)**
- TypeScript strict mode
- ESLint + `eslint-config-next`
- Functional components + React hooks
- Tailwind utility classes — no inline styles
- Shared types in `lib/*.ts`

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 📞 Support & Documentation

| Resource | Link |
|---|---|
| Swagger API Docs | `http://localhost:8000/docs` |
| ReDoc API Docs | `http://localhost:8000/redoc` |
| Setup Guide | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| Backend README | [backend/README.md](backend/README.md) |
| Frontend README | [frontend/README.md](frontend/README.md) |
| Blueprint Plan | [integration-observability-blueprint-plan.md](integration-observability-blueprint-plan.md) |

---

## 📊 Project Statistics

| Metric | Value |
|---|---|
| Capability Areas | 5 |
| Applications (total) | 19 |
| Applications (live) | 10 |
| Applications (coming soon) | 9 |
| Backend modules | 6 |
| Frontend pages | 30+ |
| API endpoints | 65+ |
| Frontend components | 25+ |
| Backend LOC | ~12,000 |
| Frontend LOC | ~18,000 |
| Total LOC | ~30,000+ |

---

<div align="center">

**AI Engineering Lab** — Enterprise Platform for Oracle Integration & Fusion Cloud Engineering

---

[Setup Guide](SETUP_GUIDE.md) · [Backend](backend/README.md) · [Frontend](frontend/README.md) · [API Docs](http://localhost:8000/docs) · [Blueprint Plan](integration-observability-blueprint-plan.md)

</div>
