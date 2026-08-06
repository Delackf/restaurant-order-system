import { NavLink, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>لوحة التحكم</h2>
        <ul className="sidebar-nav">
          <li><NavLink to="/admin" end>📊 الرئيسية</NavLink></li>
          <li><NavLink to="/admin/orders">📋 الطلبات</NavLink></li>
          <li><NavLink to="/admin/menu">🍽️ القائمة</NavLink></li>
          <li><NavLink to="/admin/tables">🪑 الطاولات</NavLink></li>
          <li><NavLink to="/admin/qr">📱 رموز QR</NavLink></li>
          <li style={{ marginTop: 20 }}><NavLink to="/" style={{ border: '1px solid rgba(255,255,255,0.3)' }}>🏠 صفحة الزبون</NavLink></li>
        </ul>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
