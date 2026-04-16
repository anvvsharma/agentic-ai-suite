"""
Distance and travel time calculations using Haversine formula
"""
import math
from typing import Tuple


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on Earth
    
    Args:
        lat1, lon1: Latitude and longitude of point 1 (in decimal degrees)
        lat2, lon2: Latitude and longitude of point 2 (in decimal degrees)
    
    Returns:
        Distance in kilometers (rounded to 3 decimal places)
    """
    # Convert decimal degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of Earth in kilometers
    r = 6371.0
    
    # Calculate distance
    distance = r * c
    
    # Round to 3 decimal places
    return round(distance, 3)


def calculate_travel_time(distance_km: float, speed_kmh: float = 40.0) -> int:
    """
    Calculate travel time based on distance and average speed
    
    Args:
        distance_km: Distance in kilometers
        speed_kmh: Average speed in km/h (default: 40 km/h for urban delivery)
    
    Returns:
        Travel time in minutes (rounded up)
    """
    if distance_km <= 0:
        return 0
    
    # Calculate time in hours, convert to minutes
    time_hours = distance_km / speed_kmh
    time_minutes = time_hours * 60
    
    # Round up to nearest minute
    return math.ceil(time_minutes)


def create_distance_matrix(locations: list[Tuple[float, float]]) -> list[list[float]]:
    """
    Create a distance matrix for all locations
    
    Args:
        locations: List of (latitude, longitude) tuples
    
    Returns:
        2D matrix of distances in kilometers
    """
    n = len(locations)
    matrix = [[0.0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            if i != j:
                lat1, lon1 = locations[i]
                lat2, lon2 = locations[j]
                matrix[i][j] = haversine_distance(lat1, lon1, lat2, lon2)
    
    return matrix


def create_time_matrix(locations: list[Tuple[float, float]], speed_kmh: float = 40.0) -> list[list[int]]:
    """
    Create a travel time matrix for all locations
    
    Args:
        locations: List of (latitude, longitude) tuples
        speed_kmh: Average speed in km/h
    
    Returns:
        2D matrix of travel times in minutes
    """
    distance_matrix = create_distance_matrix(locations)
    n = len(locations)
    time_matrix = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            if i != j:
                time_matrix[i][j] = calculate_travel_time(distance_matrix[i][j], speed_kmh)
    
    return time_matrix


def format_distance(distance_km: float) -> str:
    """
    Format distance for display
    
    Args:
        distance_km: Distance in kilometers
    
    Returns:
        Formatted string (e.g., "1.417 km")
    """
    return f"{distance_km:.3f} km"


def format_time(minutes: int) -> str:
    """
    Format time for display
    
    Args:
        minutes: Time in minutes
    
    Returns:
        Formatted string (e.g., "2h 15m" or "45m")
    """
    if minutes < 60:
        return f"{minutes}m"
    
    hours = minutes // 60
    mins = minutes % 60
    
    if mins == 0:
        return f"{hours}h"
    
    return f"{hours}h {mins}m"

