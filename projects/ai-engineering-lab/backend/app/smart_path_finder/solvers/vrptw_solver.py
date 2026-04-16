"""
VRPTW (Vehicle Routing Problem with Time Windows) Solver using Google OR-Tools
"""
import time
from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Optional
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

from app.models.schemas import (
    DeliveryStop, VehicleConstraints, OptimizedRoute, 
    RouteStop, RouteBreak, DroppedStop, OptimizationResult
)
from app.smart_path_finder.solvers.distance import haversine_distance, calculate_travel_time


class VRPTWSolver:
    """VRPTW Solver using Google OR-Tools"""
    
    def __init__(self, stops: List[DeliveryStop], constraints: VehicleConstraints):
        self.stops = stops
        self.constraints = constraints
        self.num_locations = len(stops)
        self.num_vehicles = constraints.num_vehicles
        
        # Find depot (stop_id = 0)
        self.depot_idx = next((i for i, s in enumerate(stops) if s.stop_id == 0), 0)
        
        # Create distance and time matrices
        self.distance_matrix = self._create_distance_matrix()
        self.time_matrix = self._create_time_matrix()
        
        # Time windows in minutes from midnight
        self.time_windows = self._create_time_windows()
        
        # Service times in minutes
        self.service_times = [stop.service_time for stop in stops]
        
        # Demands
        self.demands = [stop.demand for stop in stops]
        
    def _create_distance_matrix(self) -> List[List[int]]:
        """Create distance matrix in meters (OR-Tools uses integers)"""
        n = self.num_locations
        matrix = [[0] * n for _ in range(n)]
        
        for i in range(n):
            for j in range(n):
                if i != j:
                    lat1, lon1 = self.stops[i].latitude, self.stops[i].longitude
                    lat2, lon2 = self.stops[j].latitude, self.stops[j].longitude
                    distance_km = haversine_distance(lat1, lon1, lat2, lon2)
                    # Convert to meters and round to integer
                    matrix[i][j] = int(distance_km * 1000)
        
        return matrix
    
    def _create_time_matrix(self) -> List[List[int]]:
        """Create travel time matrix in minutes"""
        n = self.num_locations
        matrix = [[0] * n for _ in range(n)]
        
        for i in range(n):
            for j in range(n):
                if i != j:
                    distance_km = self.distance_matrix[i][j] / 1000.0
                    matrix[i][j] = calculate_travel_time(
                        distance_km, 
                        self.constraints.average_speed_kmh
                    )
        
        return matrix
    
    def _create_time_windows(self) -> List[Tuple[int, int]]:
        """Convert datetime time windows to minutes from shift start (relative time)"""
        windows = []
        
        # Get depot (shift) start time as reference
        depot_stop = self.stops[self.depot_idx]
        if hasattr(depot_stop.window_start, 'time'):
            shift_start_time = depot_stop.window_start.time()
        else:
            shift_start_time = depot_stop.window_start
        
        shift_start_minutes = shift_start_time.hour * 60 + shift_start_time.minute
        
        for stop in self.stops:
            # Handle both datetime and time objects
            if hasattr(stop.window_start, 'time'):
                # It's a datetime object, extract time
                start_time = stop.window_start.time()
                end_time = stop.window_end.time()
            else:
                # It's already a time object
                start_time = stop.window_start
                end_time = stop.window_end
            
            # Convert to minutes from midnight
            start_minutes = start_time.hour * 60 + start_time.minute
            end_minutes = end_time.hour * 60 + end_time.minute
            
            # Make relative to shift start (so depot starts at 0)
            relative_start = start_minutes - shift_start_minutes
            relative_end = end_minutes - shift_start_minutes
            
            windows.append((relative_start, relative_end))
        
        return windows
    
    def solve(self) -> OptimizationResult:
        """Solve the VRPTW problem"""
        start_time = time.time()
        
        try:
            # Create routing index manager
            manager = pywrapcp.RoutingIndexManager(
                self.num_locations,
                self.num_vehicles,
                self.depot_idx
            )
            
            # Create routing model
            routing = pywrapcp.RoutingModel(manager)
        except Exception as e:
            import logging
            logging.error(f"Error creating routing model: {str(e)}")
            raise Exception(f"Failed to create routing model: {str(e)}")
        
        try:
            # Create distance callback
            def distance_callback(from_index, to_index):
                from_node = manager.IndexToNode(from_index)
                to_node = manager.IndexToNode(to_index)
                return self.distance_matrix[from_node][to_node]
            
            transit_callback_index = routing.RegisterTransitCallback(distance_callback)
            routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
            
            # Add distance dimension
            routing.AddDimension(
                transit_callback_index,
                0,  # no slack
                int(self.constraints.max_working_hours * 60 * self.constraints.average_speed_kmh * 1000),  # max distance
                True,  # start cumul to zero
                'Distance'
            )
            
            # Create time callback
            def time_callback(from_index, to_index):
                from_node = manager.IndexToNode(from_index)
                to_node = manager.IndexToNode(to_index)
                travel_time = self.time_matrix[from_node][to_node]
                service_time = self.service_times[from_node]
                return travel_time + service_time
            
            time_callback_index = routing.RegisterTransitCallback(time_callback)
            
            # Add time dimension with time windows
            # Calculate max time based on the depot's time window (shift duration)
            depot_window = self.time_windows[self.depot_idx]
            shift_duration = depot_window[1] - depot_window[0]  # Total shift time in minutes
            max_time = shift_duration  # Use full shift duration
            
            routing.AddDimension(
                time_callback_index,
                shift_duration,  # allow waiting time up to shift duration
                shift_duration,  # maximum time per vehicle (full shift)
                False,  # don't force start cumul to zero
                'Time'
            )
            
            time_dimension = routing.GetDimensionOrDie('Time')
            
            # Add time window constraints
            for location_idx in range(self.num_locations):
                index = manager.NodeToIndex(location_idx)
                time_window = self.time_windows[location_idx]
                time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])
            
            # Force vehicles to start at depot opening time
            depot_time_window = self.time_windows[self.depot_idx]
            for vehicle_id in range(self.num_vehicles):
                start_index = routing.Start(vehicle_id)
                time_dimension.CumulVar(start_index).SetRange(depot_time_window[0], depot_time_window[0])
            
            # Add capacity constraints
            def demand_callback(from_index):
                from_node = manager.IndexToNode(from_index)
                return self.demands[from_node]
            
            demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
            routing.AddDimensionWithVehicleCapacity(
                demand_callback_index,
                0,  # null capacity slack
                [self.constraints.vehicle_capacity] * self.num_vehicles,  # vehicle capacities
                True,  # start cumul to zero
                'Capacity'
            )
            
            # Add fixed cost per vehicle to minimize fleet size
            for vehicle_id in range(self.num_vehicles):
                routing.SetFixedCostOfVehicle(100000, vehicle_id)
            
            # Allow dropping nodes with penalty
            penalty = 1000000
            for node in range(1, self.num_locations):  # Skip depot
                routing.AddDisjunction([manager.NodeToIndex(node)], penalty)
            
            # Set search parameters
            search_parameters = pywrapcp.DefaultRoutingSearchParameters()
            search_parameters.first_solution_strategy = (
                routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
            )
            search_parameters.local_search_metaheuristic = (
                routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
            )
            search_parameters.time_limit.seconds = 30
            
            # Solve
            solution = routing.SolveWithParameters(search_parameters)
        
        except Exception as e:
            import logging
            import traceback
            logging.error(f"Error during solver setup or solving: {str(e)}")
            logging.error(f"Traceback: {traceback.format_exc()}")
            raise Exception(f"Solver setup failed: {str(e)}")
        
        optimization_time = time.time() - start_time
        
        if solution:
            return self._extract_solution(manager, routing, solution, optimization_time)
        else:
            return OptimizationResult(
                routes=[],
                dropped_stops=[],
                total_distance=0.0,
                total_time=0,
                num_vehicles_used=0,
                num_stops_assigned=0,
                num_stops_dropped=len(self.stops) - 1,
                optimization_time=optimization_time,
                success=False,
                message="No solution found. Try relaxing constraints."
            )
    
    def _extract_solution(
        self, 
        manager, 
        routing, 
        solution, 
        optimization_time: float
    ) -> OptimizationResult:
        """Extract solution from OR-Tools solver"""
        routes = []
        dropped_stops = []
        total_distance = 0.0
        total_time = 0
        assigned_stops = set()
        
        time_dimension = routing.GetDimensionOrDie('Time')
        distance_dimension = routing.GetDimensionOrDie('Distance')
        
        for vehicle_id in range(self.num_vehicles):
            index = routing.Start(vehicle_id)
            route_stops = []
            route_distance = 0.0
            route_time = 0
            route_demand = 0
            sequence = 0
            
            while not routing.IsEnd(index):
                node_index = manager.IndexToNode(index)
                next_index = solution.Value(routing.NextVar(index))
                next_node_index = manager.IndexToNode(next_index)
                
                if node_index != self.depot_idx:  # Skip depot in route display
                    stop = self.stops[node_index]
                    assigned_stops.add(node_index)
                    
                    # Get time variables
                    time_var = time_dimension.CumulVar(index)
                    arrival_minutes = solution.Min(time_var)
                    
                    # Calculate waiting time
                    window_start = self.time_windows[node_index][0]
                    waiting_time = max(0, window_start - arrival_minutes)
                    service_start = max(arrival_minutes, window_start)
                    departure_minutes = service_start + stop.service_time
                    
                    # Calculate slack time
                    window_end = self.time_windows[node_index][1]
                    slack_time = window_end - arrival_minutes
                    
                    # Distance and travel time to next stop
                    distance_to_next = self.distance_matrix[node_index][next_node_index] / 1000.0
                    travel_time_to_next = self.time_matrix[node_index][next_node_index]
                    
                    route_stop = RouteStop(
                        sequence=sequence,
                        stop_id=stop.stop_id,
                        stop_name=stop.stop_name,
                        latitude=stop.latitude,
                        longitude=stop.longitude,
                        demand=stop.demand,
                        arrival_time=self._format_time(arrival_minutes),
                        waiting_time=waiting_time,
                        service_start=self._format_time(service_start),
                        service_time=stop.service_time,
                        departure_time=self._format_time(departure_minutes),
                        slack_time=slack_time,
                        distance_to_next=round(distance_to_next, 3),
                        travel_time_to_next=travel_time_to_next
                    )
                    
                    route_stops.append(route_stop)
                    route_distance += distance_to_next
                    route_demand += stop.demand
                    sequence += 1
                
                index = next_index
            
            # Only add route if it has stops
            if route_stops:
                # Calculate route statistics
                driving_time = sum(s.travel_time_to_next for s in route_stops)
                service_time = sum(s.service_time for s in route_stops)
                waiting_time = sum(s.waiting_time for s in route_stops)
                route_time = driving_time + service_time + waiting_time
                
                # Calculate slack statistics
                slack_times = [s.slack_time for s in route_stops]
                avg_slack = sum(slack_times) / len(slack_times) if slack_times else 0
                min_slack = min(slack_times) if slack_times else 0
                max_slack = max(slack_times) if slack_times else 0
                
                # Calculate efficiency metrics
                service_efficiency = (service_time / route_time * 100) if route_time > 0 else 0
                travel_efficiency = (driving_time / route_time * 100) if route_time > 0 else 0
                waiting_ratio = (waiting_time / route_time * 100) if route_time > 0 else 0
                
                optimized_route = OptimizedRoute(
                    vehicle_id=vehicle_id + 1,
                    stops=route_stops,
                    breaks=[],  # Breaks can be added in future enhancement
                    total_distance=round(route_distance, 3),
                    total_time=route_time,
                    driving_time=driving_time,
                    service_time=service_time,
                    waiting_time=waiting_time,
                    break_time=0,
                    total_demand=route_demand,
                    num_stops=len(route_stops),
                    avg_slack=round(avg_slack, 1),
                    min_slack=min_slack,
                    max_slack=max_slack,
                    service_efficiency=round(service_efficiency, 1),
                    travel_efficiency=round(travel_efficiency, 1),
                    waiting_ratio=round(waiting_ratio, 1)
                )
                
                routes.append(optimized_route)
                total_distance += route_distance
                total_time += route_time
        
        # Find dropped stops
        for i, stop in enumerate(self.stops):
            if i != self.depot_idx and i not in assigned_stops:
                # Determine reason for dropping
                reason, details = self._diagnose_dropped_stop(i, manager, routing, solution)
                
                dropped_stop = DroppedStop(
                    stop_id=stop.stop_id,
                    stop_name=stop.stop_name,
                    reason=reason,
                    details=details
                )
                dropped_stops.append(dropped_stop)
        
        num_stops_assigned = len(assigned_stops)
        num_stops_dropped = len(dropped_stops)
        
        return OptimizationResult(
            routes=routes,
            dropped_stops=dropped_stops,
            total_distance=round(total_distance, 3),
            total_time=total_time,
            num_vehicles_used=len(routes),
            num_stops_assigned=num_stops_assigned,
            num_stops_dropped=num_stops_dropped,
            optimization_time=round(optimization_time, 2),
            success=True,
            message=f"Successfully optimized {num_stops_assigned} stops across {len(routes)} vehicles"
        )
    
    def _diagnose_dropped_stop(self, node_index: int, manager, routing, solution) -> Tuple[str, str]:
        """Diagnose why a stop was dropped"""
        stop = self.stops[node_index]
        
        # Check capacity constraint
        if stop.demand > self.constraints.vehicle_capacity:
            return "Capacity Exceeded", f"Demand ({stop.demand}) exceeds vehicle capacity ({self.constraints.vehicle_capacity})"
        
        # Check time window feasibility
        window_start, window_end = self.time_windows[node_index]
        depot_start = self.time_windows[self.depot_idx][0]
        
        # Minimum time to reach from depot
        min_travel_time = self.time_matrix[self.depot_idx][node_index]
        earliest_arrival = depot_start + min_travel_time
        
        if earliest_arrival > window_end:
            return "Time Window Infeasible", f"Cannot reach before window closes (earliest arrival: {self._format_time(earliest_arrival)}, window closes: {self._format_time(window_end)})"
        
        # Default reason
        return "Optimization Constraint", "Stop could not be assigned due to route optimization constraints"
    
    def _format_time(self, minutes: int) -> str:
        """Format minutes from shift start to HH:MM (absolute time)"""
        # Get shift start time
        depot_stop = self.stops[self.depot_idx]
        if hasattr(depot_stop.window_start, 'time'):
            shift_start_time = depot_stop.window_start.time()
        else:
            shift_start_time = depot_stop.window_start
        
        shift_start_minutes = shift_start_time.hour * 60 + shift_start_time.minute
        
        # Convert relative minutes to absolute minutes from midnight
        absolute_minutes = shift_start_minutes + minutes
        
        hours = absolute_minutes // 60
        mins = absolute_minutes % 60
        return f"{hours:02d}:{mins:02d}"

