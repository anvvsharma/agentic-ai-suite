/**
 * CodeForge TypeScript Types
 */

export enum Severity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export enum Category {
  NAMING_CONVENTION = 'naming_convention',
  CODE_STRUCTURE = 'code_structure',
  DESIGN_PATTERN = 'design_pattern',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  ERROR_HANDLING = 'error_handling',
  LOGGING = 'logging',
  DOCUMENTATION = 'documentation'
}

export enum Technology {
  PYTHON = 'python',
  JAVASCRIPT = 'javascript',
  NODEJS = 'nodejs',
  NEXTJS = 'nextjs',
  JAVA = 'java',
  PLSQL = 'plsql',
  OIC = 'oic'
}

export enum ReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface Issue {
  id: string
  file_path: string
  line_number?: number
  column_number?: number
  severity: Severity
  category: Category
  rule_id: string
  rule_name: string
  violation: string
  current_value?: string
  suggested_value?: string
  description: string
  code_snippet?: string
  created_at: string
}

export interface ReviewSummary {
  total_files: number
  total_lines: number
  total_issues: number
  critical_severity: number
  high_severity: number
  medium_severity: number
  low_severity: number
  info_severity: number
  issues_by_category: Record<string, number>
}

export interface CodeReview {
  id: string
  project_id: string
  technology: Technology
  status: ReviewStatus
  summary: ReviewSummary
  issues: Issue[]
  started_at?: string
  completed_at?: string
  duration_seconds?: number
  created_at: string
}

export interface Project {
  id: string
  name: string
  technology: Technology
  repository_url?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface AnalyzeCodeRequest {
  project_id?: string
  technology: Technology
  code: string
  file_name?: string
  standards_id?: string
}

export interface AnalyzeCodeResponse {
  review_id: string
  status: ReviewStatus
  summary: ReviewSummary
  issues: Issue[]
  analysis_time: number
}

export interface Stats {
  total_projects: number
  total_reviews: number
  completed_reviews: number
  total_issues_found: number
  avg_issues_per_review: number
}

// UI-specific types
export interface SeverityConfig {
  color: string
  bgColor: string
  icon: string
  label: string
}

export const SEVERITY_CONFIG: Record<Severity, SeverityConfig> = {
  [Severity.CRITICAL]: {
    color: 'text-red-900',
    bgColor: 'bg-red-100',
    icon: '🔥',
    label: 'Critical'
  },
  [Severity.HIGH]: {
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    icon: '🔴',
    label: 'High'
  },
  [Severity.MEDIUM]: {
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    icon: '🟡',
    label: 'Medium'
  },
  [Severity.LOW]: {
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    icon: '🔵',
    label: 'Low'
  },
  [Severity.INFO]: {
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    icon: 'ℹ️',
    label: 'Info'
  }
}

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.NAMING_CONVENTION]: 'Naming Convention',
  [Category.CODE_STRUCTURE]: 'Code Structure',
  [Category.DESIGN_PATTERN]: 'Design Pattern',
  [Category.PERFORMANCE]: 'Performance',
  [Category.SECURITY]: 'Security',
  [Category.ERROR_HANDLING]: 'Error Handling',
  [Category.LOGGING]: 'Logging',
  [Category.DOCUMENTATION]: 'Documentation'
}

export const TECHNOLOGY_LABELS: Record<Technology, string> = {
  [Technology.PYTHON]: 'Python',
  [Technology.JAVASCRIPT]: 'JavaScript',
  [Technology.NODEJS]: 'Node.js',
  [Technology.NEXTJS]: 'Next.js',
  [Technology.JAVA]: 'Java',
  [Technology.PLSQL]: 'PL/SQL',
  [Technology.OIC]: 'Oracle Integration Cloud'
}

