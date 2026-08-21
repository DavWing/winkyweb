import { useState, useEffect } from 'react'
import { Car, DollarSign, BarChart3, Receipt } from 'lucide-react'
import Dashboard from './components/Dashboard'
import MileageLog from './components/MileageLog'
import ExpenseTracker from './components/ExpenseTracker'
import Reports from './components/Reports'
import { initDB } from './db'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    initDB().then(() => setDbReady(true))
  }, [])

  if (!dbReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading app...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, component: Dashboard },
    { id: 'mileage', label: 'Mileage Log', icon: Car, component: MileageLog },
    { id: 'expenses', label: 'Expenses', icon: DollarSign, component: ExpenseTracker },
    { id: 'reports', label: 'Reports', icon: Receipt, component: Reports }
  ]

  const CurrentComponent = tabs.find(t => t.id === activeTab)?.component || Dashboard

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Mileage Expense Tracker</h1>
          <p className="text-gray-600 text-sm">Track business miles and expenses for tax deduction</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'tab-active'
                      : 'tab-inactive'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <CurrentComponent />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 text-gray-600 text-sm">
        <p>Mileage Expense Tracker v1.0 • All data stored locally on your device</p>
      </footer>
    </div>
  )
}
