/**
 * CodeForge API Client
 */
import axios from 'axios'
import {
  Project,
  CodeReview,
  AnalyzeCodeRequest,
  AnalyzeCodeResponse,
  Stats,
  Technology
} from './codeforge-types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const CODEFORGE_API = `${API_BASE_URL}/api/codeforge`

const api = axios.create({
  baseURL: CODEFORGE_API,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const codeforgeApi = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  },

  // Projects
  async createProject(data: {
    name: string
    technology: Technology
    repository_url?: string
    description?: string
  }): Promise<Project> {
    const response = await api.post('/projects', data)
    return response.data
  },

  async listProjects(): Promise<Project[]> {
    const response = await api.get('/projects')
    return response.data
  },

  async getProject(projectId: string): Promise<Project> {
    const response = await api.get(`/projects/${projectId}`)
    return response.data
  },

  // Code Analysis
  async analyzeCode(request: AnalyzeCodeRequest): Promise<AnalyzeCodeResponse> {
    const response = await api.post('/analyze', request)
    return response.data
  },

  async uploadFile(file: File, technology: Technology, projectId?: string) {
    const formData = new FormData()
    formData.append('file', file)
    if (projectId) {
      formData.append('project_id', projectId)
    }
    formData.append('technology', technology)

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Reviews
  async getReview(reviewId: string): Promise<CodeReview> {
    const response = await api.get(`/reviews/${reviewId}`)
    return response.data
  },

  async listReviews(projectId?: string, limit: number = 50): Promise<CodeReview[]> {
    const params: any = { limit }
    if (projectId) {
      params.project_id = projectId
    }
    const response = await api.get('/reviews', { params })
    return response.data
  },

  // Naming Report
  async getNamingReport(reviewId: string): Promise<any> {
    const response = await api.get(`/reviews/${reviewId}/naming-report`)
    return response.data
  },

  // Sample Code
  async getSampleCode(): Promise<{ python: string; javascript: string }> {
    const response = await api.get('/sample-code')
    return response.data
  },

  // Statistics
  async getStats(): Promise<Stats> {
    const response = await api.get('/stats')
    return response.data
  },

  // Rulesets
  async listRulesets(technology?: Technology): Promise<any> {
    const params = technology ? { technology } : {}
    const response = await api.get('/rulesets', { params })
    return response.data
  },

  async getRuleset(rulesetId: string): Promise<any> {
    const response = await api.get(`/rulesets/${rulesetId}`)
    return response.data
  }
}

export default codeforgeApi

