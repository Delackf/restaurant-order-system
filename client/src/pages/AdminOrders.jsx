import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus } from '../api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  async function loadOrders() {
    try {
      const data = await getOrders(filter !== 'all' ? { status: filter } : {})
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (err) {
      console.error(err)
    }
  }

  const statusFilters = [
    { value: 'all', label: 'الكل' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'preparing', label: 'قيد التحضير' },
    { value: 'ready', label: 'جاهز' },
    { value: 'delivered', label: 'تم التسليم' },
    { value: 'cancelled', label: 'ملغي' },
  ]

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">إدارة الطلبات</h2>
      </div>

      <div className="categories-nav" style={{ marginBottom: 20 }}>
        {statusFilters.map(f => (
          <button
            key={f.value}
            className={`category-btn ${filter === f.value ? 'active' : ''}`}
            onClick={() => { setFilter(f.value); loadOrders() }}
          >
            <span className="label">{f.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>لا توجد طلبات</p>
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>الرقم</th>
              <th>الطاولة</th>
              <th>العناصر</th>
              <th>المجموع</th>
              <th>الحالة</th>
              <th>ملاحظات</th>
              <th>الوقت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 8)}</td>
                <td>طاولة {order.tableNumber}</td>
                <td>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {order.items.map((item, idx) => (
                      <li key={idx}>{item.nameAr} × {item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td>{order.total.toFixed(2)} د.م</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="preparing">قيد التحضير</option>
                    <option value="ready">جاهز</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </td>
                <td style={{ maxWidth: 150, fontSize: '0.85rem' }}>{order.notes || '-'}</td>
                <td>{new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
