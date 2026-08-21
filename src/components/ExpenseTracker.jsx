import { useState, useEffect } from 'react'
import { Trash2, Plus, FileText } from 'lucide-react'
import { addExpense, getExpenses, deleteExpense, addReceipt } from '../db'

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'gas',
    amount: '',
    description: '',
    location: ''
  })
  const [receiptFile, setReceiptFile] = useState(null)

  useEffect(() => {
    loadExpenses()
  }, [])

  async function loadExpenses() {
    setLoading(true)
    try {
      const data = await getExpenses()
      setExpenses(data)
    } catch (error) {
      console.error('Error loading expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File must be less than 5MB')
        return
      }
      setReceiptFile(file)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    try {
      let receiptId = null

      if (receiptFile) {
        const reader = new FileReader()
        reader.onload = async (event) => {
          const receipt = {
            name: receiptFile.name,
            type: receiptFile.type,
            data: event.target.result,
            uploadedAt: new Date().toISOString()
          }
          receiptId = await addReceipt(receipt)

          const expense = {
            date: formData.date,
            category: formData.category,
            amount: parseFloat(formData.amount),
            description: formData.description,
            location: formData.location,
            receiptId: receiptId
          }

          await addExpense(expense)
          resetForm()
          await loadExpenses()
        }
        reader.readAsArrayBuffer(receiptFile)
      } else {
        const expense = {
          date: formData.date,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description,
          location: formData.location
        }

        await addExpense(expense)
        resetForm()
        await loadExpenses()
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      alert('Error adding expense')
    }
  }

  function resetForm() {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'gas',
      amount: '',
      description: '',
      location: ''
    })
    setReceiptFile(null)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this expense?')) return
    try {
      await deleteExpense(id)
      await loadExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Error deleting expense')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Add Expense Form */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Record an Expense</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="gas">Gas</option>
                <option value="maintenance">Maintenance & Repairs</option>
                <option value="other">Other (Insurance, Registration, etc.)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Shell Station, Joe's Repair"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Regular oil change, Tire repair"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Receipt (Optional)</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              <p className="text-xs text-gray-500 mt-2">Upload photos or PDFs of receipts (max 5MB)</p>
              {receiptFile && (
                <p className="text-sm text-green-600 mt-2">✓ {receiptFile.name} selected</p>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add Expense
          </button>
        </form>
      </div>

      {/* Expenses List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No expenses recorded yet. Add your first expense above!</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        expense.category === 'gas'
                          ? 'bg-blue-100 text-blue-800'
                          : expense.category === 'maintenance'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {expense.category === 'gas' ? 'Gas' : expense.category === 'maintenance' ? 'Maintenance' : 'Other'}
                    </span>
                    {expense.receiptId && (
                      <FileText size={16} className="text-gray-600" title="Receipt attached" />
                    )}
                  </div>
                  <p className="font-semibold text-gray-900">{expense.description || 'No description'}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(expense.date).toLocaleDateString()}
                    {expense.location && ` • ${expense.location}`}
                  </p>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                    title="Delete expense"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
