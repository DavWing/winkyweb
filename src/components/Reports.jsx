import { useState, useEffect } from 'react'
import { Download, Calendar } from 'lucide-react'
import { getTrips, getExpenses } from '../db'

export default function Reports() {
  const [trips, setTrips] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterYear, setFilterYear] = useState(new Date().getFullYear())

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

  function getFilteredTrips() {
    return trips.filter(t => new Date(t.date).getFullYear() === filterYear)
  }

  function getFilteredExpenses() {
    return expenses.filter(e => new Date(e.date).getFullYear() === filterYear)
  }

  function exportCSV() {
    const filteredTrips = getFilteredTrips()
    const filteredExpenses = getFilteredExpenses()

    let csv = 'MILEAGE EXPENSE TRACKER REPORT\n'
    csv += `Year: ${filterYear}\n`
    csv += `Generated: ${new Date().toLocaleDateString()}\n\n`

    csv += '=== MILEAGE LOG ===\n'
    csv += 'Date,Type,Start Miles,End Miles,Total Miles,Purpose,Notes\n'
    filteredTrips.forEach(t => {
      csv += `${t.date},${t.type},${t.startMiles},${t.endMiles},${t.miles},"${t.purpose || ''}","${t.notes || ''}"\n`
    })

    csv += '\n=== EXPENSES ===\n'
    csv += 'Date,Category,Amount,Description,Location\n'
    filteredExpenses.forEach(e => {
      csv += `${e.date},${e.category},${e.amount},"${e.description || ''}","${e.location || ''}"\n`
    })

    const totalBusinessMiles = filteredTrips
      .filter(t => t.type === 'business')
      .reduce((sum, t) => sum + t.miles, 0)
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    const deductibleExpenses = filteredTrips.length > 0
      ? totalExpenses * (totalBusinessMiles / filteredTrips.reduce((sum, t) => sum + t.miles, 0))
      : 0

    csv += '\n=== SUMMARY ===\n'
    csv += `Total Miles,${filteredTrips.reduce((sum, t) => sum + t.miles, 0)}\n`
    csv += `Business Miles,${totalBusinessMiles}\n`
    csv += `Business %,${filteredTrips.length > 0 ? ((totalBusinessMiles / filteredTrips.reduce((sum, t) => sum + t.miles, 0)) * 100).toFixed(2) : 0}%\n`
    csv += `Total Expenses,$${totalExpenses.toFixed(2)}\n`
    csv += `Deductible Expenses,$${deductibleExpenses.toFixed(2)}\n`

    downloadFile(csv, `mileage-report-${filterYear}.csv`)
  }

  function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const filteredTrips = getFilteredTrips()
  const filteredExpenses = getFilteredExpenses()

  const totalMiles = filteredTrips.reduce((sum, t) => sum + t.miles, 0)
  const totalBusinessMiles = filteredTrips
    .filter(t => t.type === 'business')
    .reduce((sum, t) => sum + t.miles, 0)
  const totalPersonalMiles = filteredTrips
    .filter(t => t.type === 'personal')
    .reduce((sum, t) => sum + t.miles, 0)
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
  const deductibleExpenses = totalMiles > 0 ? totalExpenses * (totalBusinessMiles / totalMiles) : 0

  return (
    <div className="space-y-6">
      {/* Filter and Export */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Year</label>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-600" />
              <input
                type="number"
                min="2020"
                max={new Date().getFullYear()}
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          <button onClick={exportCSV} className="btn-primary flex items-center gap-2">
            <Download size={20} />
            Export to CSV
          </button>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Deduction Summary - {filterYear}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-gray-700 text-sm font-medium">Total Miles</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{totalMiles.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-gray-700 text-sm font-medium">Business Miles</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{totalBusinessMiles.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <p className="text-gray-700 text-sm font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">${totalExpenses.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <p className="text-gray-700 text-sm font-medium">Deductible Amount</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">${deductibleExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mileage Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Business Miles</span>
                <span className="text-lg font-bold text-green-600">{totalBusinessMiles}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: totalMiles > 0 ? `${(totalBusinessMiles / totalMiles) * 100}%` : '0%' }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {totalMiles > 0 ? ((totalBusinessMiles / totalMiles) * 100).toFixed(1) : 0}% deductible
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Personal Miles</span>
                <span className="text-lg font-bold text-gray-600">{totalPersonalMiles}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gray-600 h-3 rounded-full"
                  style={{ width: totalMiles > 0 ? `${(totalPersonalMiles / totalMiles) * 100}%` : '0%' }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {totalMiles > 0 ? ((totalPersonalMiles / totalMiles) * 100).toFixed(1) : 0}% non-deductible
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h2>
          <div className="space-y-3">
            {['gas', 'maintenance', 'other'].map(category => {
              const amount = filteredExpenses
                .filter(e => e.category === category)
                .reduce((sum, e) => sum + e.amount, 0)
              const categoryName =
                category === 'gas' ? 'Gas' : category === 'maintenance' ? 'Maintenance' : 'Other'
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0

              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">{categoryName}</span>
                    <span className="text-lg font-bold text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        category === 'gas'
                          ? 'bg-blue-600'
                          : category === 'maintenance'
                          ? 'bg-purple-600'
                          : 'bg-amber-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{percentage.toFixed(1)}%</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tax Recommendation Note */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600">
        <h3 className="font-semibold text-gray-900 mb-2">Tax Deduction Note</h3>
        <p className="text-gray-700 text-sm">
          Based on your records for {filterYear}, you can deduct approximately <strong>${deductibleExpenses.toFixed(2)}</strong> for your business vehicle expenses. Keep all receipts and this report for your tax preparation. Consult with your tax professional for specific deduction eligibility.
        </p>
      </div>
    </div>
  )
}
