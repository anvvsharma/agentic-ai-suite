'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { OptimizationResult } from '@/lib/types'
import { generateMapHTML, handleApiError } from '@/lib/api-client'

interface RouteMapProps {
  result: OptimizationResult
}

export default function RouteMap({ result }: RouteMapProps) {
  const [mapHTML, setMapHTML] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMap = async () => {
      try {
        setLoading(true)
        setError(null)
        const html = await generateMapHTML(result)
        setMapHTML(html)
      } catch (err) {
        setError(handleApiError(err))
      } finally {
        setLoading(false)
      }
    }

    if (result && result.routes && result.routes.length > 0) {
      fetchMap()
    } else {
      setLoading(false)
      setError('No routes to display')
    }
  }, [result])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Generating interactive map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-red-50 rounded-lg border border-red-200">
        <div className="text-center p-6">
          <p className="text-red-600 font-semibold mb-2">Failed to load map</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!mapHTML) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">No map data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Map Instructions */}
      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
        <strong>💡 Tip:</strong> Click on markers or route lines to see detailed information. 
        Use the layer control (top right) to toggle vehicle routes. Zoom and pan to explore the map.
      </div>

      {/* Map Container */}
      <div className="w-full rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <iframe
          srcDoc={mapHTML}
          className="w-full h-[600px] border-0"
          title="Route Map"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      {/* Map Legend */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 text-sm">Route Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {result.routes.map((route, index) => {
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']
            const color = colors[index % colors.length]
            return (
              <div key={route.vehicle_id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <span className="font-medium">Vehicle {route.vehicle_id}</span>
                  <div className="text-gray-500">
                    {route.num_stops} stops • {route.total_distance.toFixed(1)} km
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

