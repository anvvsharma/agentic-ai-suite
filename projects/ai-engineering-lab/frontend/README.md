# CodeForge Frontend

Modern Next.js frontend for the CodeForge AI Engineering Intelligence Lab, featuring code quality analysis, OIC naming conventions validation, and logistics route optimization.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Getting Started](#getting-started)
- [Development](#development)
- [Build & Deployment](#build--deployment)

## Overview

The CodeForge frontend is built with Next.js 14 and TypeScript, providing a modern, responsive interface for all platform features. It follows a modular architecture with feature-based organization.

## Technology Stack

### Core Technologies
- **Framework**: Next.js 14.1.0
- **Language**: TypeScript 5.3.3
- **UI Library**: React 18.2.0
- **Styling**: Tailwind CSS 3.4.1

### Key Libraries
- **Maps**: Leaflet 1.9.4 + React Leaflet 4.2.1
- **HTTP Client**: Axios 1.6.5
- **Icons**: Lucide React 0.316.0
- **Animations**: Framer Motion 11.18.2
- **Date Handling**: date-fns 3.3.1
- **CSV Parsing**: PapaParse 5.4.1

### Development Tools
- **Linting**: ESLint 8.56.0
- **Type Checking**: TypeScript strict mode
- **Code Formatting**: Prettier (via ESLint)

## Project Structure

```
frontend/
├── app/                              # Next.js App Router
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   │
│   ├── dashboard/                    # Main dashboard
│   │   └── page.tsx
│   │
│   ├── code-forge/                   # CodeForge module
│   │   ├── page.tsx                  # CodeForge main page
│   │   ├── naming-conventions/       # Naming conventions tools
│   │   │   ├── page.tsx              # Main naming conventions page
│   │   │   ├── bulk-validator/       # Bulk validation tool
│   │   │   │   └── page.tsx
│   │   │   ├── name-generator/       # Name generation tool
│   │   │   │   └── page.tsx
│   │   │   ├── pattern-guide/        # Standards guide
│   │   │   │   └── page.tsx
│   │   │   └── pattern-tester/       # Pattern testing tool
│   │   │       └── page.tsx
│   │   ├── review/                   # Code review
│   │   │   └── page.tsx
│   │   ├── rules-register/           # Rules management
│   │   │   └── page.tsx
│   │   └── rule-sets/                # Rule sets management
│   │       └── page.tsx
│   │
│   ├── smart-path-finder/            # Route optimization
│   │   └── page.tsx
│   │
│   ├── simple-route/                 # Simple route calculator
│   │   └── page.tsx
│   │
│   ├── integration-analyzer/         # Integration analyzer
│   │   └── page.tsx
│   │
│   └── tdd-generator/                # TDD generator
│       └── page.tsx
│
├── components/                       # Reusable components
│   ├── layout/                       # Layout components
│   │   ├── CollapsibleSidebar.tsx    # Main navigation sidebar
│   │   ├── TopNavigation.tsx         # Top navigation bar
│   │   ├── ContextPanel.tsx          # Context-aware panel
│   │   └── FloatingAIAssistant.tsx   # AI assistant widget
│   │
│   ├── chat/                         # Chat components
│   │   ├── AIChatAssistant.tsx       # AI chat interface
│   │   └── FloatingChatWidget.tsx    # Floating chat widget
│   │
│   ├── naming/                       # Naming conventions components
│   │   ├── CanvasPanel.tsx           # Main canvas panel
│   │   ├── CommandPalette.tsx        # Command palette
│   │   ├── ExplorerPanel.tsx         # Explorer sidebar
│   │   ├── InspectorPanel.tsx        # Inspector sidebar
│   │   ├── NamingReportTable.tsx     # Naming report display
│   │   └── PatternTester.tsx         # Pattern testing component
│   │
│   ├── results/                      # Results components
│   │   └── RouteMap.tsx              # Route visualization map
│   │
│   ├── forms/                        # Form components
│   │   └── (form components)
│   │
│   └── ui/                           # UI primitives
│       └── (UI components)
│
├── lib/                              # Utilities and helpers
│   ├── api.ts                        # API client
│   ├── codeforge-api.ts              # CodeForge API client
│   ├── design-system.ts              # Design tokens
│   └── naming-types.ts               # TypeScript types
│
├── public/                           # Static assets
│   └── (images, fonts, etc.)
│
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
└── README.md                         # This file
```

## Pages & Routes

### Main Pages

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home/Landing page | ✅ Active |
| `/dashboard` | Main dashboard | ✅ Active |

### CodeForge Pages

| Route | Description | Status |
|-------|-------------|--------|
| `/code-forge` | CodeForge main dashboard | ✅ Active |
| `/code-forge/naming-conventions` | Naming conventions tools | ✅ Active |
| `/code-forge/naming-conventions/bulk-validator` | Bulk validation tool | ✅ Active |
| `/code-forge/naming-conventions/name-generator` | Name generation tool | ✅ Active |
| `/code-forge/naming-conventions/pattern-guide` | OIC standards guide | ✅ Active |
| `/code-forge/naming-conventions/pattern-tester` | Pattern testing tool | ✅ Active |
| `/code-forge/review` | Code review interface | ✅ Active |
| `/code-forge/rules-register` | Rules management | ✅ Active |
| `/code-forge/rule-sets` | Rule sets management | ✅ Active |

### Smart Path Finder Pages

| Route | Description | Status |
|-------|-------------|--------|
| `/smart-path-finder` | Route optimization | ✅ Active |
| `/simple-route` | Simple route calculator | ✅ Active |

### Other Pages

| Route | Description | Status |
|-------|-------------|--------|
| `/integration-analyzer` | Integration analyzer | 🚧 In Progress |
| `/tdd-generator` | TDD generator | 📋 Planned |

## Components

### Layout Components

**CollapsibleSidebar**
- Main navigation sidebar
- Collapsible/expandable
- Tool categorization
- Active route highlighting

**TopNavigation**
- Top navigation bar
- User profile
- Quick actions
- Breadcrumbs

**FloatingAIAssistant**
- AI chat assistant
- Context-aware help
- Floating widget
- Minimizable

### Feature Components

**NamingReportTable**
- Displays naming validation results
- Artifact categorization
- Status indicators (✅ valid, ❌ invalid)
- Expandable categories
- Issue details and suggestions

**RouteMap**
- Interactive Leaflet map
- Route visualization
- Stop markers
- Route polylines
- Zoom and pan controls

**PatternTester**
- Live pattern testing
- Regex validation
- Example inputs
- Real-time feedback

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Map Configuration
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit files in `app/` or `components/`
   - Changes auto-reload via Hot Module Replacement

3. **Type Checking**
   ```bash
   npm run type-check
   ```

4. **Linting**
   ```bash
   npm run lint
   ```

### Code Style

- **TypeScript**: Use strict mode, define types for all props
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **File Naming**: kebab-case for files, PascalCase for components
- **Imports**: Absolute imports using `@/` prefix

### Adding New Pages

1. Create page file in `app/` directory
2. Export default React component
3. Add route to sidebar navigation
4. Update this README

### Adding New Components

1. Create component in appropriate `components/` subdirectory
2. Export component
3. Add TypeScript types/interfaces
4. Document props and usage

## Build & Deployment

### Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker container

### Environment Variables for Production

Set these in your deployment platform:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_ENABLE_AI_CHAT` - Enable AI chat features
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable analytics

## API Integration

### API Client

The frontend uses Axios for API calls. API clients are located in `lib/`:

- `lib/api.ts` - General API client
- `lib/codeforge-api.ts` - CodeForge-specific API client

### Example API Call

```typescript
import { codeforgeApi } from '@/lib/codeforge-api';

// Validate artifact name
const result = await codeforgeApi.validateName({
  artifact_type: 'integration',
  name: 'BCRX_SF_ERP_ORDER_INT'
});
```

## Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: API response caching
- **Bundle Analysis**: Use `npm run analyze` to analyze bundle size

## Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
# Use different port
npm run dev -- -p 3001
```

**TypeScript errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Module not found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Documentation

- **Main README**: [../README.md](../README.md) - Project overview
- **Backend Docs**: [../backend/README.md](../backend/README.md) - Backend API
- **Setup Guide**: [../SETUP_GUIDE.md](../SETUP_GUIDE.md) - Installation guide

## Contributing

1. Follow the code style guidelines
2. Write TypeScript types for all components
3. Add comments for complex logic
4. Test on multiple browsers
5. Update documentation

---

**Built with ❤️ for the CodeForge AI Engineering Lab**