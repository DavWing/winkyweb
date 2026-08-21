import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { addTrip, getTrips, deleteTrip } from '../db'

export default function MileageLog() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startMiles: '',
    endMiles: '',
    type: 'business',
    purpose: '',
    notes: ''
  })

  useEffect(() => {
    loadTrips()
  }, [])

  async function loadTrips() {
    setLoading(true)
    try {
      const data = await getTrips()
      setTrips(data)
    } catch (error) {
      console.error('Error loading trips:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const miles = parseInt(formData.endMiles) - parseInt(formData.startMiles)
    if (miles <= 0) {
      alert('End miles must be greater than start miles')
      return
    }

    try {
      await addTrip({
        date: formData.date,
        startMiles: parseInt(formData.startMiles),
        endMiles: parseInt(formData.endMiles),
        miles: miles,
        type: formData.type,
        purpose: formData.purpose,
        notes: formData.notes
      })

      setFormData({
        date: new Date().toISOString().split('T')[0],
        startMiles: '',
        endMiles: '',
        type: 'business',
        purpose: '',
        notes: ''
      })

      await loadTrips()
    } catch (error) {
      console.error('Error adding trip:', error)
      alert('Error adding trip')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this trip?')) return
    try {
      await deleteTrip(id)
      await loadTrips()
    } catch (error) {
      console.error('Error deleting trip:', error)
      alert('Error deleting trip')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Add Trip Form */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Log a Trip</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="business">Business</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Odometer (miles)</label>
              <input
                type="number"
                value={formData.startMiles}
                onChange={(e) => setFormData({ ...formData, startMiles: e.target.value })}
                placeholder="e.g., 50000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Odometer (miles)</label>
              <input
                type="number"
                value={formData.endMiles}
                onChange={(e) => setFormData({ ...formData, endMiles: e.target.value })}
                placeholder="e.g., 50025"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="e.g., Client meeting, Delivery, Office supply run"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional details..."
                className="h-20"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add Trip
          </button>
        </form>
      </div>

      {/* Trips List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Trips</h2>
        {trips.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No trips logged yet. Add your first trip above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Miles</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Purpose</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{new Date(trip.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          trip.type === 'business'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {trip.type === 'business' ? 'Business' : 'Personal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{trip.miles}</td>
                    <td className="px-4 py-3 text-gray-600">{trip.purpose || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete trip"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
