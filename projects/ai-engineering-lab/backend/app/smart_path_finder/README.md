# Smart Path Finder Module

Advanced VRPTW (Vehicle Routing Problem with Time Windows) optimization module for logistics and delivery route planning using Google OR-Tools.

## Overview

The Smart Path Finder module provides production-ready route optimization capabilities for delivery operations, field service scheduling, and logistics planning. It uses Google's OR-Tools constraint programming solver to find optimal routes that satisfy multiple constraints.

## Features

### Core Capabilities
- ✅ **VRPTW Optimization**: Complete Vehicle Routing Problem with Time Windows solution
- ✅ **Time Window Management**: Ensure deliveries within specified time ranges
- ✅ **Vehicle Capacity**: Respect payload limits and demand constraints
- ✅ **Break Scheduling**: Automatic driver break planning
- ✅ **Fleet Minimization**: Use minimum number of vehicles
- ✅ **Route Balancing**: Distribute workload across vehicles

### Additional Features
- ✅ **CSV Upload**: Bulk upload delivery stops
- ✅ **Sample Data**: Pre-configured test datasets
- ✅ **Simple Route Finder**: Point-to-point route calculation
- ✅ **Map Generation**: Interactive route visualization
- ✅ **AI Chat Assistant**: Natural language route analysis
- ✅ **Comprehensive Analytics**: Distance, time, and efficiency metrics

## API Endpoints

### Route Optimization

#### POST `/api/optimize`
Optimize delivery routes using VRPTW algorithm.

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
      "stop_name": "Customer A",
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
  "routes": [
    {
      "vehicle_id": 0,
      "stops": [...],
      "total_distance_km": 15.5,
      "total_time_minutes": 180,
      "total_demand": 45,
      "num_stops": 8
    }
  ],
  "dropped_stops": [],
  "total_distance": 15.5,
  "total_time": 180,
  "num_vehicles_used": 1,
  "num_stops_assigned": 8,
  "num_stops_dropped": 0,
  "optimization_time": 2.45,
  "success": true,
  "message": "Successfully optimized 8 stops across 1 vehicle"
}
```

#### POST `/api/simple-route`
Calculate simple point-to-point route options.

**Request Body:**
```json
{
  "origin_lat": 37.7749,
  "origin_lon": -122.4194,
  "destination_lat": 37.7849,
  "destination_lon": -122.4094
}
```

**Response:**
```json
{
  "distance_km": 1.5,
  "estimated_time_minutes": 5,
  "route_options": [
    {
      "name": "Fastest Route",
      "distance_km": 1.5,
      "time_minutes": 5
    }
  ]
}
```

#### GET `/api/sample-data`
Get sample delivery data for testing.

**Response:**
```json
{
  "stops": [...],
  "constraints": {...}
}
```

#### POST `/api/upload-csv`
Upload CSV file with delivery stops.

**Form Data:**
- `file`: CSV file

**CSV Format:**
```csv
stop_id,stop_name,latitude,longitude,demand,window_start,window_end,service_time
0,Depot,37.7749,-122.4194,0,2026-03-07 08:00:00,2026-03-07 18:00:00,0
1,Stop 1,37.7849,-122.4094,10,2026-03-07 09:00:00,2026-03-07 11:00:00,15
```

#### POST `/api/generate-map`
Generate interactive map visualization.

**Request Body:**
```json
{
  "routes": [...],
  "stops": [...]
}
```

#### POST `/api/chat`
AI assistant for route analysis.

**Request Body:**
```json
{
  "query": "Why was Stop 5 dropped?",
  "context": {
    "routes": [...],
    "dropped_stops": [...]
  }
}
```

## VRPTW Algorithm

### Constraints

The solver enforces multiple constraints simultaneously:

1. **Time Windows**
   - Each stop must be visited within its specified time window
   - Early arrival results in waiting time
   - Late arrival is not allowed

2. **Vehicle Capacity**
   - Total demand on a route cannot exceed vehicle capacity
   - Demand is cumulative throughout the route

3. **Working Hours**
   - Routes must fit within driver shift times
   - Includes travel time, service time, waiting time, and breaks

4. **Service Time**
   - Time required at each stop for delivery/service
   - Added to total route time

5. **Break Scheduling**
   - Mandatory breaks after specified hours of work
   - Break duration configurable
   - Automatically scheduled in optimal positions

### Optimization Goals

The solver optimizes for multiple objectives:

1. **Primary**: Minimize number of vehicles used
2. **Secondary**: Minimize total distance traveled
3. **Tertiary**: Balance routes across vehicles
4. **Quaternary**: Maximize stops assigned

### Algorithm Features

- **Waiting Time Calculation**: Tracks time spent waiting before time windows open
- **Slack Time Analysis**: Calculates buffer time before windows close
- **Dropped Stop Diagnostics**: Provides specific reasons for unassigned stops
- **Route Statistics**: Comprehensive metrics per route
- **Efficiency KPIs**: Service, travel, and waiting efficiency percentages

## Module Structure

```
smart_path_finder/
├── __init__.py
├── service.py                 # Business logic
├── routes.py                  # API endpoints
├── models.py                  # Data models
└── solvers/
    ├── __init__.py
    ├── vrptw_solver.py        # OR-Tools VRPTW solver
    ├── simple_route.py        # Simple routing
    ├── map_generator.py       # Map generation
    └── distance.py            # Distance calculations
```

## Data Models

### Stop Model
```python
class Stop(BaseModel):
    stop_id: int
    stop_name: str
    latitude: float
    longitude: float
    demand: int
    window_start: datetime
    window_end: datetime
    service_time: int  # minutes
```

### Constraints Model
```python
class Constraints(BaseModel):
    num_vehicles: int
    vehicle_capacity: int
    max_working_hours: float
    max_deliveries: int
    shift_start: str  # HH:MM
    shift_end: str    # HH:MM
    break_duration: int  # minutes
    break_after_hours: float
    average_speed_kmh: float
```

### Route Model
```python
class Route(BaseModel):
    vehicle_id: int
    stops: List[RouteStop]
    total_distance_km: float
    total_time_minutes: int
    total_demand: int
    num_stops: int
    efficiency_metrics: EfficiencyMetrics
```

## Usage Examples

### Basic Optimization

```python
from app.smart_path_finder.service import optimize_routes

# Prepare data
stops = [...]  # List of Stop objects
constraints = Constraints(...)

# Optimize
result = optimize_routes(stops, constraints)

# Access results
for route in result.routes:
    print(f"Vehicle {route.vehicle_id}: {route.num_stops} stops")
    print(f"Distance: {route.total_distance_km} km")
    print(f"Time: {route.total_time_minutes} minutes")
```

### CSV Upload

```python
from app.smart_path_finder.service import parse_csv_file

# Parse CSV
stops, constraints = parse_csv_file(file_content)

# Optimize
result = optimize_routes(stops, constraints)
```

## Performance

### Benchmarks
- **Small (10-20 stops)**: <5 seconds
- **Medium (20-50 stops)**: <30 seconds
- **Large (50-100 stops)**: <2 minutes

### Scalability
- Handles up to 100 stops efficiently
- Supports multiple vehicles (tested up to 10)
- Memory usage: ~200MB per optimization
- Concurrent requests supported

### Optimization Tips
1. Use realistic time windows (not too tight)
2. Ensure vehicle capacity is adequate
3. Allow sufficient working hours
4. Use appropriate average speed
5. Consider break requirements

## Troubleshooting

### No Solution Found

**Possible Causes:**
- Time windows too tight
- Insufficient vehicle capacity
- Too many stops for available vehicles
- Working hours too short

**Solutions:**
- Relax time windows
- Increase vehicle capacity
- Add more vehicles
- Extend working hours
- Reduce number of stops

### Dropped Stops

**Common Reasons:**
- Time window conflicts
- Capacity constraints
- Distance/time limitations
- Infeasible combinations

**Check:**
- `dropped_stops` array in response
- Each dropped stop includes reason
- Adjust constraints accordingly

### Performance Issues

**If optimization is slow:**
- Reduce number of stops
- Simplify time windows
- Reduce number of vehicles
- Use faster hardware

## Integration

### Frontend Integration

```typescript
// TypeScript example
import axios from 'axios';

const optimizeRoutes = async (stops, constraints) => {
  const response = await axios.post('/api/optimize', {
    stops,
    constraints
  });
  return response.data;
};
```

### Backend Integration

```python
# Python example
from app.smart_path_finder.service import optimize_routes

result = optimize_routes(stops, constraints)
```

## Testing

### Unit Tests
```bash
cd backend
pytest unit_test/test_vrptw_solver.py
```

### Integration Tests
```bash
cd backend
./integration_test/integration_test.sh
```

## Configuration

### Environment Variables
```env
# In backend/.env
AVERAGE_SPEED_KMH=40.0
MAX_OPTIMIZATION_TIME=300  # seconds
DEFAULT_VEHICLE_CAPACITY=50
DEFAULT_NUM_VEHICLES=2
```

## Documentation

- **Main README**: [../../../README.md](../../../README.md)
- **Backend README**: [../../README.md](../../README.md)
- **Setup Guide**: [../../../SETUP_GUIDE.md](../../../SETUP_GUIDE.md)

## Support

For issues and questions:
- Check API documentation: http://localhost:8000/docs
- Review troubleshooting section above
- Open GitHub issue

---

**Part of the CodeForge AI Engineering Lab**