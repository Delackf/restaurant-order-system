import { useSearchParams, Link } from 'react-router-dom'

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  const tableNumber = searchParams.get('table')

  return (
    <div className="container">
      <div className="confirmation-container">
        <div className="success-icon">✅</div>
        <h1 className="confirmation-title">تم استلام طلبك بنجاح!</h1>
        <p className="confirmation-order">
          رقم الطلب: <strong>#{orderId?.slice(0, 8)}</strong>
          {tableNumber && <span> | طاولة رقم {tableNumber}</span>}
        </p>

        <div className="order-status-badge status-pending">قيد التحضير</div>

        <div style={{ marginTop: 30, maxWidth: 400, margin: '30px auto' }}>
          <div className="cart-summary">
            <div className="summary-row">
              <span>حالة الطلب</span>
              <span>في الانتظار</span>
            </div>
            <div className="summary-row">
              <span>وقت التحضير المتوقع</span>
              <span>15-25 دقيقة</span>
            </div>
          </div>
        </div>

        <Link to="/" className="home-btn">العودة للصفحة الرئيسية</Link>
      </div>
    </div>
  )
}
