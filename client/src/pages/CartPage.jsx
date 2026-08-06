import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { createOrder } from '../api'

export default function CartPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tableId = searchParams.get('table')
  const [cart, setCart] = useState([])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  function updateQuantity(id, delta) {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) }
        }
        return item
      }).filter(item => item.quantity > 0)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  function removeItem(id) {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  async function handleSubmit() {
    if (!tableId) {
      alert('رقم الطاولة غير متوفر. يرجى مسح QR Code من الطاولة.')
      return
    }
    if (cart.length === 0) return

    setSubmitting(true)
    try {
      const order = await createOrder({
        tableId,
        items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        notes
      })
      localStorage.removeItem('cart')
      navigate(`/confirmation?order=${order.id}&table=${order.tableNumber}`)
    } catch (err) {
      alert('حدث خطأ في إرسال الطلب. حاول مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">سلة المشتريات</h2>
          <button className="back-btn" onClick={() => navigate(-1)}>رجوع</button>
        </div>
        <div className="empty-state">
          <div className="icon">🛒</div>
          <h3>السلة فارغة</h3>
          <p>أضف بعض العناصر من القائمة</p>
          <button className="home-btn" style={{ marginTop: 20 }} onClick={() => navigate('/')}>
            العودة للقائمة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">سلة المشتريات</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>رجوع</button>
      </div>

      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <span className="cart-item-icon">🍽️</span>
          <div className="cart-item-details">
            <div className="cart-item-name">{item.nameAr}</div>
            <div className="cart-item-price">{item.price} د.م × {item.quantity}</div>
          </div>
          <div className="cart-item-qty">
            <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
            <span className="qty-value">{item.quantity}</span>
            <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
            <button className="icon-btn delete" onClick={() => removeItem(item.id)}>✕</button>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <div className="summary-row total">
          <span>المجموع الكلي</span>
          <span>{total.toFixed(2)} د.م</span>
        </div>
        <textarea
          className="notes-input"
          placeholder="ملاحظات إضافية (اختياري)..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <button
        className="submit-order-btn"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'جاري الإرسال...' : `تأكيد الطلب - ${total.toFixed(2)} د.م`}
      </button>
    </div>
  )
}
