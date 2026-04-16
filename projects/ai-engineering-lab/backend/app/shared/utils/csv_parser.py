"""
CSV file parser for delivery stops
"""
import pandas as pd
from datetime import datetime
from typing import List
from io import StringIO

from app.models.schemas import DeliveryStop


def parse_csv_file(file_content: str) -> List[DeliveryStop]:
    """
    Parse CSV file content into DeliveryStop objects
    
    Expected CSV format:
    stop_id,stop_name,latitude,longitude,demand,window_start,window_end,service_time
    
    Args:
        file_content: CSV file content as string
    
    Returns:
        List of DeliveryStop objects
    
    Raises:
        ValueError: If CSV format is invalid
    """
    try:
        # Read CSV
        df = pd.read_csv(StringIO(file_content))
        
        # Validate required columns
        required_columns = [
            'stop_id', 'stop_name', 'latitude', 'longitude', 
            'demand', 'window_start', 'window_end', 'service_time'
        ]
        
        missing_columns = set(required_columns) - set(df.columns)
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Parse stops
        stops = []
        for _, row in df.iterrows():
            # Parse datetime strings
            window_start = pd.to_datetime(row['window_start'])
            window_end = pd.to_datetime(row['window_end'])
            
            # Get priority if exists, default to 'medium'
            priority = row.get('priority', 'medium')
            
            stop = DeliveryStop(
                stop_id=int(row['stop_id']),
                stop_name=str(row['stop_name']),
                latitude=float(row['latitude']),
                longitude=float(row['longitude']),
                demand=int(row['demand']),
                window_start=window_start,
                window_end=window_end,
                service_time=int(row['service_time']),
                priority=priority
            )
            
            stops.append(stop)
        
        # Validate depot exists (stop_id = 0)
        if not any(stop.stop_id == 0 for stop in stops):
            raise ValueError("CSV must contain a depot (stop_id = 0)")
        
        return stops
    
    except pd.errors.EmptyDataError:
        raise ValueError("CSV file is empty")
    except pd.errors.ParserError as e:
        raise ValueError(f"CSV parsing error: {str(e)}")
    except KeyError as e:
        raise ValueError(f"Missing required column: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error parsing CSV: {str(e)}")


def validate_stops(stops: List[DeliveryStop]) -> tuple[bool, str]:
    """
    Validate delivery stops
    
    Args:
        stops: List of DeliveryStop objects
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not stops:
        return False, "No stops provided"
    
    # Check for depot
    depot_count = sum(1 for stop in stops if stop.stop_id == 0)
    if depot_count == 0:
        return False, "No depot found (stop_id = 0)"
    if depot_count > 1:
        return False, "Multiple depots found (only one stop_id = 0 allowed)"
    
    # Check for duplicate stop IDs
    stop_ids = [stop.stop_id for stop in stops]
    if len(stop_ids) != len(set(stop_ids)):
        return False, "Duplicate stop IDs found"
    
    # Validate coordinates
    for stop in stops:
        if not (-90 <= stop.latitude <= 90):
            return False, f"Invalid latitude for {stop.stop_name}: {stop.latitude}"
        if not (-180 <= stop.longitude <= 180):
            return False, f"Invalid longitude for {stop.stop_name}: {stop.longitude}"
    
    # Validate time windows
    for stop in stops:
        if stop.window_end <= stop.window_start:
            return False, f"Invalid time window for {stop.stop_name}: end time must be after start time"
    
    # Validate demands
    for stop in stops:
        if stop.demand < 0:
            return False, f"Invalid demand for {stop.stop_name}: {stop.demand}"
    
    # Validate service times
    for stop in stops:
        if stop.service_time < 0:
            return False, f"Invalid service time for {stop.stop_name}: {stop.service_time}"
    
    return True, "Valid"


def create_sample_csv() -> str:
    """
    Create sample CSV content for testing
    
    Returns:
        CSV content as string
    """
    csv_content = """stop_id,stop_name,latitude,longitude,demand,window_start,window_end,service_time
0,Depot,37.7749,-122.4194,0,2026-03-07 08:00:00,2026-03-07 18:00:00,0
1,Stop 1,37.7849,-122.4094,10,2026-03-07 09:00:00,2026-03-07 11:00:00,15
2,Stop 2,37.7949,-122.3994,15,2026-03-07 10:00:00,2026-03-07 12:00:00,15
3,Stop 3,37.7649,-122.4294,20,2026-03-07 09:00:00,2026-03-07 13:00:00,20
4,Stop 4,37.7549,-122.4394,5,2026-03-07 11:00:00,2026-03-07 14:00:00,10
5,Stop 5,37.7449,-122.4494,12,2026-03-07 12:00:00,2026-03-07 15:00:00,15
6,Stop 6,37.7849,-122.4594,8,2026-03-07 09:00:00,2026-03-07 16:00:00,10
7,Stop 7,37.7949,-122.4694,14,2026-03-07 10:00:00,2026-03-07 17:00:00,15
8,Stop 8,37.7649,-122.4794,11,2026-03-07 11:00:00,2026-03-07 18:00:00,20
9,Stop 9,37.7549,-122.4894,18,2026-03-07 12:00:00,2026-03-07 18:00:00,15
10,Stop 10,37.7449,-122.4994,9,2026-03-07 13:00:00,2026-03-07 18:00:00,10"""
    
    return csv_content

