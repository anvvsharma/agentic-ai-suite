import { Construction, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SimpleRoutePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <Construction className="w-12 h-12 text-yellow-600" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Simple Route Finder
          </h1>
          
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
            <p className="text-lg text-yellow-800 font-semibold mb-2">
              🚧 Under Construction
            </p>
            <p className="text-gray-600">
              This feature is currently being developed and will be available soon.
            </p>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Planned Features:</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Point-to-point route optimization</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Multiple route options (Fastest, Shortest, Balanced)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Real-time traffic consideration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Interactive map visualization</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Distance and time estimates</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              href="/smart-path-finder"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Try Smart Path Finder
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              In the meantime, check out our advanced{' '}
              <Link href="/smart-path-finder" className="text-primary-600 font-semibold hover:underline">
                Smart Path Finder
              </Link>
              {' '}for multi-stop delivery planning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

