'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, Play, Loader2 } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { DeliveryStop, VehicleConstraints, OptimizationResult } from '@/lib/types'
import { optimizeRoutes, uploadCSV, getSampleData, handleApiError } from '@/lib/api-client'

// Dynamic imports to avoid SSR issues with Leaflet
const RouteMap = dynamic(() => import('@/components/results/RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  ),
})

const AIChatAssistant = dynamic(() => import('@/components/chat/AIChatAssistant'), {
  ssr: false,
})

export default function SmartPathFinder() {
  const [stops, setStops] = useState<DeliveryStop[]>([])
  const [constraints, setConstraints] = useState<VehicleConstraints>({
    num_vehicles: 3,
    vehicle_capacity: 100,
    max_working_hours: 8,
    max_deliveries: 20,
    shift_start: '08:00',
    shift_end: '18:00',
    break_duration: 30,
    break_after_hours: 4,
    average_speed_kmh: 40,
  })
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'routes' | 'map' | 'chat'>('summary')

  const handleLoadSample = async () => {
    try {
      setLoading(true)
      setError(null)
      const sampleStops = await getSampleData()
      setStops(sampleStops)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      setError(null)
      const uploadedStops = await uploadCSV(file)
      setStops(uploadedStops)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleOptimize = async () => {
    if (stops.length === 0) {
      setError('Please add delivery stops first')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const optimizationResult = await optimizeRoutes({ stops, constraints })
      setResult(optimizationResult)
      setActiveTab('summary')
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Path Finder</h1>
                <p className="text-sm text-gray-600">Intelligent Route Planning with VRPTW</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Delivery Locations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Locations</h2>
            
            {/* Upload Options */}
            <div className="space-y-4 mb-6">
              <button
                onClick={handleLoadSample}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Load Sample Data
                  </>
                )}
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-8 text-center cursor-pointer hover:border-blue-500 transition-colors block"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload CSV or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    CSV format: stop_id, stop_name, latitude, longitude, demand, window_start, window_end, service_time
                  </p>
                </label>
              </div>
            </div>

            {/* Stops List */}
            {stops.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Loaded Stops ({stops.length})</h3>
                <div className="max-h-96 overflow-auto border rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-2 py-2 text-left whitespace-nowrap">ID</th>
                        <th className="px-2 py-2 text-left whitespace-nowrap">Name</th>
                        <th className="px-2 py-2 text-left whitespace-nowrap">Lat</th>
                        <th className="px-2 py-2 text-left whitespace-nowrap">Lon</th>
                        <th className="px-2 py-2 text-left whitespace-nowrap">Demand</th>
                        <th className="px-2 py-2 text-left whitespace-nowrap">Window Start</th>
                        <th className="px-2 py-2 text-left whitespace-nowrap">Window End</th>
                        <th className="px-2 py-2 text-left whitespace-nowrap">Service (min)</th>
                        <th className="px-2 py-2 text-left whitespace-nowrap">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stops.map((stop) => (
                        <tr key={stop.stop_id} className="border-t hover:bg-gray-50">
                          <td className="px-2 py-2 whitespace-nowrap">{stop.stop_id}</td>
                          <td className="px-2 py-2 whitespace-nowrap font-medium">{stop.stop_name}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-gray-600">{stop.latitude.toFixed(4)}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-gray-600">{stop.longitude.toFixed(4)}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{stop.demand}</span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">{stop.window_start}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{stop.window_end}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">{stop.service_time}</td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            {stop.priority && (
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                stop.priority === 'high' ? 'bg-red-100 text-red-800' :
                                stop.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {stop.priority}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Scroll horizontally to view all columns
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Vehicle Constraints */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Vehicle Constraints</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Vehicles
                </label>
                <input
                  type="number"
                  value={constraints.num_vehicles}
                  onChange={(e) => setConstraints({ ...constraints, num_vehicles: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Capacity
                </label>
                <input
                  type="number"
                  value={constraints.vehicle_capacity}
                  onChange={(e) => setConstraints({ ...constraints, vehicle_capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Working Hours
                  </label>
                  <input
                    type="number"
                    value={constraints.max_working_hours}
                    onChange={(e) => setConstraints({ ...constraints, max_working_hours: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Deliveries
                  </label>
                  <input
                    type="number"
                    value={constraints.max_deliveries}
                    onChange={(e) => setConstraints({ ...constraints, max_deliveries: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shift Start
                  </label>
                  <input
                    type="time"
                    value={constraints.shift_start}
                    onChange={(e) => setConstraints({ ...constraints, shift_start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shift End
                  </label>
                  <input
                    type="time"
                    value={constraints.shift_end}
                    onChange={(e) => setConstraints({ ...constraints, shift_end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Break Duration (min)
                  </label>
                  <input
                    type="number"
                    value={constraints.break_duration}
                    onChange={(e) => setConstraints({ ...constraints, break_duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Break After (hours)
                  </label>
                  <input
                    type="number"
                    value={constraints.break_after_hours}
                    onChange={(e) => setConstraints({ ...constraints, break_after_hours: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Speed (km/h)
                </label>
                <input
                  type="number"
                  value={constraints.average_speed_kmh}
                  onChange={(e) => setConstraints({ ...constraints, average_speed_kmh: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Optimize Button */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-center mb-8">
          <h3 className="text-white text-xl font-bold mb-2">Ready to Find the Best Path?</h3>
          <p className="text-blue-100 mb-4">
            {stops.length} stops loaded • {constraints.num_vehicles} vehicles available
          </p>
          <button
            onClick={handleOptimize}
            disabled={loading || stops.length === 0}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Finding Optimal Paths...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Find Smart Paths
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Smart Path Results</h2>

            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'summary'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab('routes')}
                  className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'routes'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Routes
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'map'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'chat'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  AI Analysis
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'summary' && (
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Deliveries</p>
                  <p className="text-3xl font-bold text-blue-600">{result.num_stops_assigned}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Vehicles Used</p>
                  <p className="text-3xl font-bold text-green-600">{result.num_vehicles_used}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Distance</p>
                  <p className="text-3xl font-bold text-purple-600">{result.total_distance.toFixed(1)} km</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Time</p>
                  <p className="text-3xl font-bold text-orange-600">{(result.total_time / 60).toFixed(1)} hrs</p>
                </div>
              </div>
            )}

            {activeTab === 'routes' && (
              <div className="space-y-4">
                {result.routes.map((route) => (
                  <div key={route.vehicle_id} className="border rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-2">Vehicle {route.vehicle_id}</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Distance:</span>{' '}
                        <span className="font-semibold">{route.total_distance.toFixed(1)} km</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Time:</span>{' '}
                        <span className="font-semibold">{(route.total_time / 60).toFixed(1)} hrs</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Stops:</span>{' '}
                        <span className="font-semibold">{route.num_stops}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {route.stops.map((stop) => (
                        <div key={stop.sequence} className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                            {stop.sequence}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{stop.stop_name}</p>
                            <p className="text-gray-600 text-xs">
                              Arrival: {stop.arrival_time} • Service: {stop.service_time} min
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'map' && (
              <RouteMap result={result} />
            )}

            {activeTab === 'chat' && (
              <AIChatAssistant result={result} mode="tab" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

