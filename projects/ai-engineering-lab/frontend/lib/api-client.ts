/**
 * API Client for Route Optimization Backend
 */
import axios from 'axios'
import type {
  DeliveryStop,
  OptimizationRequest,
  OptimizationResult,
  SimpleRouteResponse,
  ChatRequest,
  ChatResponse,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for optimization
})

/**
 * Optimize routes using VRPTW algorithm
 */
export async function optimizeRoutes(
  request: OptimizationRequest
): Promise<OptimizationResult> {
  const response = await apiClient.post<OptimizationResult>('/api/optimize', request)
  return response.data
}

/**
 * Upload CSV file with delivery stops
 */
export async function uploadCSV(file: File): Promise<DeliveryStop[]> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<DeliveryStop[]>('/api/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Get sample delivery data
 */
export async function getSampleData(): Promise<DeliveryStop[]> {
  const response = await apiClient.get<DeliveryStop[]>('/api/sample-data')
  return response.data
}

/**
 * Get simple point-to-point route
 */
export async function getSimpleRoute(
  originLat: number,
  originLon: number,
  destinationLat: number,
  destinationLon: number
): Promise<SimpleRouteResponse> {
  const response = await apiClient.post<SimpleRouteResponse>('/api/simple-route', {
    origin_lat: originLat,
    origin_lon: originLon,
    destination_lat: destinationLat,
    destination_lon: destinationLon,
  })
  return response.data
}

/**
 * Generate Folium map HTML from optimization result
 */
export async function generateMapHTML(result: OptimizationResult): Promise<string> {
  const response = await apiClient.post('/api/generate-map', result, {
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'text',
  })
  return response.data
}

/**
 * Send chat message to AI assistant
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await apiClient.post<ChatResponse>('/api/chat', request)
  return response.data
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ status: string; service: string }> {
  const response = await apiClient.get('/api/health')
  return response.data
}

/**
 * Error handler for API calls
 */
export function handleApiError(error: any): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      return error.response.data?.detail || error.response.statusText || 'Server error'
    } else if (error.request) {
      // Request made but no response
      return 'No response from server. Please check if the backend is running.'
    }
  }
  return error.message || 'An unexpected error occurred'
}

