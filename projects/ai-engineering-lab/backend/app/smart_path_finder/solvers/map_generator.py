"""
Folium map generator for route visualization
"""
import folium
from folium import plugins
from typing import List
from app.models.schemas import OptimizedRoute

# Color palette for different vehicles
VEHICLE_COLORS = [
    '#3B82F6',  # blue
    '#10B981',  # green
    '#F59E0B',  # amber
    '#EF4444',  # red
    '#8B5CF6',  # purple
    '#EC4899',  # pink
    '#14B8A6',  # teal
    '#F97316',  # orange
]


def generate_route_map(routes: List[OptimizedRoute]) -> str:
    """
    Generate an interactive Folium map for optimized routes
    
    Args:
        routes: List of OptimizedRoute objects
    
    Returns:
        HTML string of the generated map
    """
    if not routes or len(routes) == 0:
        return "<div>No routes to display</div>"
    
    # Collect all coordinates to calculate center and bounds
    all_lats = []
    all_lons = []
    
    for route in routes:
        for stop in route.stops:
            all_lats.append(stop.latitude)
            all_lons.append(stop.longitude)
    
    # Calculate center point
    center_lat = sum(all_lats) / len(all_lats)
    center_lon = sum(all_lons) / len(all_lons)
    
    # Create map centered on the average location
    m = folium.Map(
        location=[center_lat, center_lon],
        zoom_start=12,
        tiles='OpenStreetMap'
    )
    
    # Add fullscreen button
    plugins.Fullscreen().add_to(m)
    
    # Add measure control
    plugins.MeasureControl(position='topleft').add_to(m)
    
    # Create feature groups for each vehicle
    feature_groups = {}
    
    for route_index, route in enumerate(routes):
        color = VEHICLE_COLORS[route_index % len(VEHICLE_COLORS)]
        vehicle_id = route.vehicle_id
        
        # Create feature group for this vehicle
        fg = folium.FeatureGroup(name=f'Vehicle {vehicle_id} ({route.num_stops} stops)')
        
        # Collect coordinates for this route
        route_coords = []
        
        # Add depot marker (first stop location)
        if route.stops:
            first_stop = route.stops[0]
            depot_coords = [first_stop.latitude, first_stop.longitude]
            route_coords.append(depot_coords)
            
            # Depot marker
            folium.Marker(
                location=depot_coords,
                popup=folium.Popup(
                    f"""
                    <div style="font-family: Arial, sans-serif; min-width: 200px;">
                        <h4 style="margin: 0 0 10px 0; color: {color};">🏢 Depot - Vehicle {vehicle_id}</h4>
                        <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="margin: 5px 0;"><strong>Route:</strong> Vehicle {vehicle_id}</p>
                        <p style="margin: 5px 0;"><strong>Total Stops:</strong> {route.num_stops}</p>
                        <p style="margin: 5px 0;"><strong>Total Distance:</strong> {route.total_distance:.1f} km</p>
                        <p style="margin: 5px 0;"><strong>Total Time:</strong> {route.total_time / 60:.1f} hrs</p>
                    </div>
                    """,
                    max_width=300
                ),
                tooltip=f"Depot - Vehicle {vehicle_id}",
                icon=folium.Icon(color='red' if route_index == 0 else 'blue', icon='home', prefix='fa')
            ).add_to(fg)
        
        # Add stop markers
        for stop in route.stops:
            stop_coords = [stop.latitude, stop.longitude]
            route_coords.append(stop_coords)
            
            # Create custom icon with stop number
            icon_html = f"""
            <div style="
                background-color: {color};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 14px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">{stop.sequence}</div>
            """
            
            # Popup content
            popup_html = f"""
            <div style="font-family: Arial, sans-serif; min-width: 250px;">
                <h4 style="margin: 0 0 10px 0; color: {color};">📍 {stop.stop_name}</h4>
                <p style="margin: 5px 0; color: {color}; font-weight: bold;">
                    Vehicle {vehicle_id} - Stop #{stop.sequence}
                </p>
                <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
                <table style="width: 100%; font-size: 12px;">
                    <tr><td><strong>Arrival:</strong></td><td>{stop.arrival_time}</td></tr>
                    <tr><td><strong>Service Start:</strong></td><td>{stop.service_start}</td></tr>
                    <tr><td><strong>Service Time:</strong></td><td>{stop.service_time} min</td></tr>
                    <tr><td><strong>Departure:</strong></td><td>{stop.departure_time}</td></tr>
                    <tr><td><strong>Demand:</strong></td><td>{stop.demand} units</td></tr>
                    {"<tr><td><strong>Waiting:</strong></td><td>" + str(stop.waiting_time) + " min</td></tr>" if stop.waiting_time > 0 else ""}
                    {"<tr><td><strong>Slack:</strong></td><td>" + str(stop.slack_time) + " min</td></tr>" if stop.slack_time > 0 else ""}
                    <tr><td><strong>Distance to Next:</strong></td><td>{stop.distance_to_next:.1f} km</td></tr>
                </table>
            </div>
            """
            
            folium.Marker(
                location=stop_coords,
                popup=folium.Popup(popup_html, max_width=300),
                tooltip=f"Stop {stop.sequence}: {stop.stop_name}",
                icon=folium.DivIcon(html=icon_html)
            ).add_to(fg)
        
        # Draw route line
        if len(route_coords) > 1:
            # Main route line with popup
            folium.PolyLine(
                locations=route_coords,
                color=color,
                weight=4,
                opacity=0.8,
                popup=folium.Popup(
                    f"""
                    <div style="font-family: Arial, sans-serif; min-width: 200px;">
                        <h4 style="margin: 0 0 10px 0; color: {color};">🚗 Vehicle {vehicle_id} Route</h4>
                        <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
                        <table style="width: 100%; font-size: 12px;">
                            <tr><td><strong>Distance:</strong></td><td>{route.total_distance:.1f} km</td></tr>
                            <tr><td><strong>Time:</strong></td><td>{route.total_time / 60:.1f} hrs</td></tr>
                            <tr><td><strong>Driving Time:</strong></td><td>{route.driving_time / 60:.1f} hrs</td></tr>
                            <tr><td><strong>Service Time:</strong></td><td>{route.service_time / 60:.1f} hrs</td></tr>
                            <tr><td><strong>Stops:</strong></td><td>{route.num_stops}</td></tr>
                            <tr><td><strong>Total Demand:</strong></td><td>{route.total_demand} units</td></tr>
                            <tr><td><strong>Efficiency:</strong></td><td>{route.service_efficiency * 100:.1f}%</td></tr>
                        </table>
                    </div>
                    """,
                    max_width=300
                ),
                tooltip=f"Vehicle {vehicle_id} Route"
            ).add_to(fg)
            
            # Add animated direction indicator using AntPath
            plugins.AntPath(
                locations=route_coords,
                color=color,
                weight=3,
                opacity=0.6,
                delay=800,
                dash_array=[10, 20],
                pulse_color='white'
            ).add_to(fg)
            
            # Add arrow markers at intervals to show direction
            num_arrows = min(len(route_coords) - 1, 10)  # Max 10 arrows
            if num_arrows > 0:
                step = max(1, (len(route_coords) - 1) // num_arrows)
                for i in range(0, len(route_coords) - 1, step):
                    start = route_coords[i]
                    end = route_coords[i + 1]
                    
                    # Calculate midpoint
                    mid_lat = (start[0] + end[0]) / 2
                    mid_lon = (start[1] + end[1]) / 2
                    
                    # Calculate angle for arrow rotation
                    import math
                    angle = math.degrees(math.atan2(end[1] - start[1], end[0] - start[0]))
                    
                    # Add arrow marker
                    arrow_icon = folium.DivIcon(html=f"""
                        <div style="
                            transform: rotate({angle}deg);
                            font-size: 20px;
                            color: {color};
                            text-shadow: 0 0 3px white, 0 0 3px white;
                        ">➤</div>
                    """)
                    
                    folium.Marker(
                        location=[mid_lat, mid_lon],
                        icon=arrow_icon,
                        tooltip=f"Direction: Stop {i+1} → Stop {i+2}"
                    ).add_to(fg)
        
        # Add feature group to map
        fg.add_to(m)
        feature_groups[vehicle_id] = fg
    
    # Add layer control
    folium.LayerControl(collapsed=False).add_to(m)
    
    # Fit bounds to show all markers
    if all_lats and all_lons:
        m.fit_bounds([
            [min(all_lats), min(all_lons)],
            [max(all_lats), max(all_lons)]
        ])
    
    # Generate HTML
    map_html = m._repr_html_()
    
    return map_html


