import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    const interval = setInterval(loadStats, 10000)
    return () => clearInterval(interval)
  }, [])

  async function loadStats() {
    try {
      const data = await getAdminStats()
      setStats(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">لوحة التحكم</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>إجمالي الطلبات</h3>
          <div className="value">{stats?.totalOrders || 0}</div>
        </div>
        <div className="stat-card">
          <h3>طلبات اليوم</h3>
          <div className="value">{stats?.todayOrders || 0}</div>
        </div>
        <div className="stat-card">
          <h3>طلبات قيد الانتظار</h3>
          <div className="value" style={{ color: 'var(--warning)' }}>{stats?.pendingOrders || 0}</div>
        </div>
        <div className="stat-card">
          <h3>إيرادات اليوم</h3>
          <div className="value" style={{ color: 'var(--success)' }}>{(stats?.todayRevenue || 0).toFixed(2)}</div>
          <div className="subtitle">د.م</div>
        </div>
        <div className="stat-card">
          <h3>إجمالي الإيرادات</h3>
          <div className="value">{(stats?.totalRevenue || 0).toFixed(2)}</div>
          <div className="subtitle">د.م</div>
        </div>
      </div>

      <h3 style={{ marginBottom: 15 }}>آخر الطلبات</h3>
      {stats?.recentOrders?.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>الرقم</th>
              <th>الطاولة</th>
              <th>العناصر</th>
              <th>المجموع</th>
              <th>الحالة</th>
              <th>الوقت</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 6)}</td>
                <td>{order.tableNumber}</td>
                <td>{order.items.length} عنصر</td>
                <td>{order.total.toFixed(2)} د.م</td>
                <td>
                  <span className={`order-status-badge status-${order.status}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>لا توجد طلبات بعد</p>
        </div>
      )}
    </div>
  )
}

function getStatusLabel(status) {
  const labels = {
    pending: 'قيد الانتظار',
    preparing: 'قيد التحضير',
    ready: 'جاهز',
    delivered: 'تم التسليم',
    cancelled: 'ملغي'
  }
  return labels[status] || status
}
