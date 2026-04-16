"""
Simple point-to-point route finder
Generates multiple route options using heuristics
"""
from typing import List
from app.models.schemas import SimpleRoute, SimpleRouteResponse
from app.smart_path_finder.solvers.distance import haversine_distance, calculate_travel_time


def find_simple_routes(
    origin_lat: float,
    origin_lon: float,
    destination_lat: float,
    destination_lon: float,
    average_speed_kmh: float = 40.0
) -> SimpleRouteResponse:
    """
    Find multiple route options between two points
    
    Args:
        origin_lat: Origin latitude
        origin_lon: Origin longitude
        destination_lat: Destination latitude
        destination_lon: Destination longitude
        average_speed_kmh: Average speed for time calculation
    
    Returns:
        SimpleRouteResponse with multiple route options
    """
    # Calculate straight-line distance
    straight_distance = haversine_distance(origin_lat, origin_lon, destination_lat, destination_lon)
    
    # Generate route options using heuristics
    routes = []
    
    # Route A: Fastest (highway route - 15% longer, higher speed)
    fastest_distance = straight_distance * 1.15
    fastest_time = calculate_travel_time(fastest_distance, average_speed_kmh * 1.5)  # 50% faster on highway
    routes.append(SimpleRoute(
        route_id="A",
        name="Fastest",
        distance=round(fastest_distance, 3),
        time=fastest_time,
        description="Via main highway - fastest route with moderate traffic",
        recommended=True
    ))
    
    # Route B: Shortest (direct route - 5% longer, slower)
    shortest_distance = straight_distance * 1.05
    shortest_time = calculate_travel_time(shortest_distance, average_speed_kmh * 0.8)  # 20% slower on local roads
    routes.append(SimpleRoute(
        route_id="B",
        name="Shortest",
        distance=round(shortest_distance, 3),
        time=shortest_time,
        description="Via local roads - shortest distance with light traffic",
        recommended=False
    ))
    
    # Route C: Balanced (mixed route - 10% longer, normal speed)
    balanced_distance = straight_distance * 1.10
    balanced_time = calculate_travel_time(balanced_distance, average_speed_kmh)
    routes.append(SimpleRoute(
        route_id="C",
        name="Balanced",
        distance=round(balanced_distance, 3),
        time=balanced_time,
        description="Via mixed roads - optimal balance of time and distance",
        recommended=False
    ))
    
    return SimpleRouteResponse(
        origin={"latitude": origin_lat, "longitude": origin_lon},
        destination={"latitude": destination_lat, "longitude": destination_lon},
        straight_line_distance=round(straight_distance, 3),
        routes=routes
    )

