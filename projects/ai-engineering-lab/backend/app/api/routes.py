"""
FastAPI routes for smart path finding
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import HTMLResponse
from typing import List
import logging

from app.models.schemas import (
    OptimizationRequest, OptimizationResult,
    SimpleRouteRequest, SimpleRouteResponse,
    DeliveryStop, VehicleConstraints
)
from app.smart_path_finder.solvers.vrptw_solver import VRPTWSolver
from app.smart_path_finder.solvers.simple_route import find_simple_routes
from app.smart_path_finder.solvers.map_generator import generate_route_map
from app.shared.utils.csv_parser import parse_csv_file, validate_stops, create_sample_csv

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/optimize", response_model=OptimizationResult)
async def optimize_routes(request: OptimizationRequest):
    """
    Optimize delivery routes using VRPTW algorithm
    
    Args:
        request: OptimizationRequest with stops and constraints
    
    Returns:
        OptimizationResult with optimized routes
    """
    try:
        # Validate stops
        is_valid, error_message = validate_stops(request.stops)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_message)
        
        # Create solver and solve
        solver = VRPTWSolver(request.stops, request.constraints)
        result = solver.solve()
        
        return result
    
    except Exception as e:
        logger.error(f"Optimization error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")


@router.post("/upload-csv", response_model=List[DeliveryStop])
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload CSV file with delivery stops
    
    Args:
        file: CSV file upload
    
    Returns:
        List of parsed DeliveryStop objects
    """
    try:
        # Read file content
        content = await file.read()
        file_content = content.decode('utf-8')
        
        # Parse CSV
        stops = parse_csv_file(file_content)
        
        # Validate stops
        is_valid, error_message = validate_stops(stops)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_message)
        
        return stops
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"CSV upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process CSV: {str(e)}")


@router.get("/sample-data", response_model=List[DeliveryStop])
async def get_sample_data():
    """
    Get sample delivery data for testing
    
    Returns:
        List of sample DeliveryStop objects
    """
    try:
        csv_content = create_sample_csv()
        stops = parse_csv_file(csv_content)
        return stops
    except Exception as e:
        logger.error(f"Sample data error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate sample data: {str(e)}")


@router.post("/simple-route", response_model=SimpleRouteResponse)
async def get_simple_route(request: SimpleRouteRequest):
    """
    Get simple point-to-point route options
    
    Args:
        request: SimpleRouteRequest with origin and destination
    
    Returns:
        SimpleRouteResponse with multiple route options
    """
    try:
        result = find_simple_routes(
            request.origin_lat,
            request.origin_lon,
            request.destination_lat,
            request.destination_lon
        )
        return result
    except Exception as e:
        logger.error(f"Simple route error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to find route: {str(e)}")


@router.post("/generate-map", response_class=HTMLResponse)
async def generate_map(result: OptimizationResult):
    """
    Generate Folium map HTML from optimization result
    
    Args:
        result: OptimizationResult with routes
    
    Returns:
        HTML string of the generated map
    """
    try:
        if not result.routes or len(result.routes) == 0:
            raise HTTPException(status_code=400, detail="No routes provided")
        
        map_html = generate_route_map(result.routes)
        return HTMLResponse(content=map_html)
    
    except Exception as e:
        logger.error(f"Map generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate map: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "smart-path-finder-api"}

