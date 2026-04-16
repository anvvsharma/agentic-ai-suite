"""
Pydantic schemas for request/response validation
"""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, validator


class DeliveryStop(BaseModel):
    """Delivery stop model"""
    stop_id: int
    stop_name: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    demand: int = Field(..., ge=0)
    window_start: datetime
    window_end: datetime
    service_time: int = Field(..., ge=0, description="Service time in minutes")
    priority: Optional[str] = Field(default="medium", description="Priority: low, medium, high")

    @validator('window_end')
    def validate_time_window(cls, v, values):
        if 'window_start' in values and v <= values['window_start']:
            raise ValueError('window_end must be after window_start')
        return v


class VehicleConstraints(BaseModel):
    """Vehicle and driver constraints"""
    num_vehicles: int = Field(default=2, ge=1, le=10)
    vehicle_capacity: int = Field(default=50, ge=1)
    max_working_hours: float = Field(default=8.0, ge=1, le=12)
    max_deliveries: int = Field(default=20, ge=1)
    shift_start: str = Field(default="08:00", description="Shift start time HH:MM")
    shift_end: str = Field(default="18:00", description="Shift end time HH:MM")
    break_duration: int = Field(default=30, ge=0, description="Break duration in minutes")
    break_after_hours: float = Field(default=4.0, ge=0, description="Break after X hours")
    average_speed_kmh: float = Field(default=40.0, ge=1, description="Average speed in km/h")


class OptimizationRequest(BaseModel):
    """Request for route optimization"""
    stops: List[DeliveryStop]
    constraints: VehicleConstraints


class RouteStop(BaseModel):
    """Stop in an optimized route"""
    sequence: int
    stop_id: int
    stop_name: str
    latitude: float
    longitude: float
    demand: int
    arrival_time: str
    waiting_time: int = Field(description="Waiting time in minutes")
    service_start: str
    service_time: int
    departure_time: str
    slack_time: int = Field(description="Slack time in minutes")
    distance_to_next: float = Field(description="Distance to next stop in km")
    travel_time_to_next: int = Field(description="Travel time to next stop in minutes")


class RouteBreak(BaseModel):
    """Break in a route"""
    start_time: str
    duration: int
    after_stop: int


class OptimizedRoute(BaseModel):
    """Optimized route for a single vehicle"""
    vehicle_id: int
    stops: List[RouteStop]
    breaks: List[RouteBreak]
    total_distance: float = Field(description="Total distance in km")
    total_time: int = Field(description="Total time in minutes")
    driving_time: int = Field(description="Driving time in minutes")
    service_time: int = Field(description="Service time in minutes")
    waiting_time: int = Field(description="Waiting time in minutes")
    break_time: int = Field(description="Break time in minutes")
    total_demand: int
    num_stops: int
    avg_slack: float = Field(description="Average slack time in minutes")
    min_slack: int = Field(description="Minimum slack time in minutes")
    max_slack: int = Field(description="Maximum slack time in minutes")
    service_efficiency: float = Field(description="Service efficiency percentage")
    travel_efficiency: float = Field(description="Travel efficiency percentage")
    waiting_ratio: float = Field(description="Waiting ratio percentage")


class DroppedStop(BaseModel):
    """Stop that could not be assigned"""
    stop_id: int
    stop_name: str
    reason: str
    details: str


class OptimizationResult(BaseModel):
    """Complete optimization result"""
    routes: List[OptimizedRoute]
    dropped_stops: List[DroppedStop]
    total_distance: float
    total_time: int
    num_vehicles_used: int
    num_stops_assigned: int
    num_stops_dropped: int
    optimization_time: float = Field(description="Optimization time in seconds")
    success: bool
    message: str


class SimpleRouteRequest(BaseModel):
    """Request for simple point-to-point route"""
    origin_lat: float = Field(..., ge=-90, le=90)
    origin_lon: float = Field(..., ge=-180, le=180)
    destination_lat: float = Field(..., ge=-90, le=90)
    destination_lon: float = Field(..., ge=-180, le=180)
    preferences: Optional[List[str]] = Field(default=["fastest"])


class SimpleRoute(BaseModel):
    """Simple route option"""
    route_id: str
    name: str
    distance: float = Field(description="Distance in km")
    time: int = Field(description="Estimated time in minutes")
    description: str
    recommended: bool = False


class SimpleRouteResponse(BaseModel):
    """Response for simple route"""
    origin: dict
    destination: dict
    straight_line_distance: float
    routes: List[SimpleRoute]


class ChatRequest(BaseModel):
    """AI chat request"""
    query: str
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    """AI chat response"""
    response: str
    timestamp: datetime

