/**
 * TypeScript types for Route Optimization Platform
 */

export interface DeliveryStop {
  stop_id: number
  stop_name: string
  latitude: number
  longitude: number
  demand: number
  window_start: string
  window_end: string
  service_time: number
  priority?: 'low' | 'medium' | 'high'
}

export interface VehicleConstraints {
  num_vehicles: number
  vehicle_capacity: number
  max_working_hours: number
  max_deliveries: number
  shift_start: string
  shift_end: string
  break_duration: number
  break_after_hours: number
  average_speed_kmh: number
}

export interface RouteStop {
  sequence: number
  stop_id: number
  stop_name: string
  latitude: number
  longitude: number
  demand: number
  arrival_time: string
  waiting_time: number
  service_start: string
  service_time: number
  departure_time: string
  slack_time: number
  distance_to_next: number
  travel_time_to_next: number
}

export interface RouteBreak {
  start_time: string
  duration: number
  after_stop: number
}

export interface OptimizedRoute {
  vehicle_id: number
  stops: RouteStop[]
  breaks: RouteBreak[]
  total_distance: number
  total_time: number
  driving_time: number
  service_time: number
  waiting_time: number
  break_time: number
  total_demand: number
  num_stops: number
  avg_slack: number
  min_slack: number
  max_slack: number
  service_efficiency: number
  travel_efficiency: number
  waiting_ratio: number
}

export interface DroppedStop {
  stop_id: number
  stop_name: string
  reason: string
  details: string
}

export interface OptimizationResult {
  routes: OptimizedRoute[]
  dropped_stops: DroppedStop[]
  total_distance: number
  total_time: number
  num_vehicles_used: number
  num_stops_assigned: number
  num_stops_dropped: number
  optimization_time: number
  success: boolean
  message: string
}

export interface OptimizationRequest {
  stops: DeliveryStop[]
  constraints: VehicleConstraints
}

export interface SimpleRoute {
  route_id: string
  name: string
  distance: number
  time: number
  description: string
  recommended: boolean
}

export interface SimpleRouteResponse {
  origin: { latitude: number; longitude: number }
  destination: { latitude: number; longitude: number }
  straight_line_distance: number
  routes: SimpleRoute[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatRequest {
  query: string
  context?: any
}

export interface ChatResponse {
  response: string
  timestamp: string
}

