import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Zap, Navigation } from 'lucide-react'
import { getTrips, getExpenses } from '../db'

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [tripsData, expensesData] = await Promise.all([getTrips(), getExpenses()])
      setTrips(tripsData)
      setExpenses(expensesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalBusinessMiles = trips
    .filter(t => t.type === 'business')
    .reduce((sum, t) => sum + (t.miles || 0), 0)

  const totalPersonalMiles = trips
    .filter(t => t.type === 'personal')
    .reduce((sum, t) => sum + (t.miles || 0), 0)

  const totalMiles = trips.reduce((sum, t) => sum + (t.miles || 0), 0)

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)

  const gasExpenses = expenses
    .filter(e => e.category === 'gas')
    .reduce((sum, e) => sum + (e.amount || 0), 0)

  const maintenanceExpenses = expenses
    .filter(e => e.category === 'maintenance')
    .reduce((sum, e) => sum + (e.amount || 0), 0)

  const otherExpenses = expenses
    .filter(e => e.category === 'other')
    .reduce((sum, e) => sum + (e.amount || 0), 0)

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Miles</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalMiles.toLocaleString()}</p>
            </div>
            <Navigation className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Business Miles</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{totalBusinessMiles.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">${totalExpenses.toFixed(2)}</p>
            </div>
            <DollarSign className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Deductible %</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {totalMiles > 0 ? ((totalBusinessMiles / totalMiles) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <Zap className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-gray-700 text-sm font-medium">Gas</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">${gasExpenses.toFixed(2)}</p>
            <p className="text-gray-600 text-xs mt-2">
              {expenses.filter(e => e.category === 'gas').length} entries
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <p className="text-gray-700 text-sm font-medium">Maintenance</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">${maintenanceExpenses.toFixed(2)}</p>
            <p className="text-gray-600 text-xs mt-2">
              {expenses.filter(e => e.category === 'maintenance').length} entries
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
            <p className="text-gray-700 text-sm font-medium">Other</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">${otherExpenses.toFixed(2)}</p>
            <p className="text-gray-600 text-xs mt-2">
              {expenses.filter(e => e.category === 'other').length} entries
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Total Trips</span>
              <span className="font-semibold text-gray-900">{trips.length}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Avg Miles per Trip</span>
              <span className="font-semibold text-gray-900">
                {trips.length > 0 ? (totalMiles / trips.length).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Business Trip %</span>
              <span className="font-semibold text-green-600">
                {trips.length > 0
                  ? ((trips.filter(t => t.type === 'business').length / trips.length) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Cost per Mile</span>
              <span className="font-semibold text-gray-900">
                ${totalMiles > 0 ? (totalExpenses / totalMiles).toFixed(3) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Deductible Amount</span>
              <span className="font-semibold text-green-600">
                ${totalMiles > 0 ? (totalExpenses * (totalBusinessMiles / totalMiles)).toFixed(2) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold text-orange-600">${totalExpenses.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
