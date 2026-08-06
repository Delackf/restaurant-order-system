import { useState, useEffect } from 'react'
import { getTables, createTable, deleteTable } from '../api'

export default function AdminTables() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    loadTables()
  }, [])

  async function loadTables() {
    try {
      const data = await getTables()
      setTables(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!newNumber) return
    try {
      await createTable({ number: parseInt(newNumber), name: `Table ${newNumber}` })
      setNewNumber('')
      loadTables()
    } catch (err) {
      alert(err.message || 'حدث خطأ')
    }
  }

  async function handleDelete(id) {
    if (!confirm('هل أنت متأكد؟')) return
    try {
      await deleteTable(id)
      loadTables()
    } catch (err) {
      alert('حدث خطأ')
    }
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">إدارة الطاولات</h2>
      </div>

      <div className="menu-form" style={{ marginBottom: 25 }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>رقم الطاولة الجديدة</label>
            <input
              type="number"
              value={newNumber}
              onChange={e => setNewNumber(e.target.value)}
              placeholder="أدخل الرقم"
              min="1"
            />
          </div>
          <button type="submit" className="save-btn">إضافة طاولة</button>
        </form>
      </div>

      <div className="stats-grid">
        {tables.map(table => (
          <div key={table.id} className="stat-card">
            <h3>طاولة {table.number}</h3>
            <div className="value">{table.number}</div>
            <div style={{ marginTop: 10 }}>
              <button className="icon-btn delete" onClick={() => handleDelete(table.id)}>🗑️ حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
