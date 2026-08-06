import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getMenuCategories, getMenuItems } from '../api'

export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tableId = searchParams.get('table')
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  async function loadData() {
    try {
      const [cats, itemsData] = await Promise.all([getMenuCategories(), getMenuItems()])
      setCategories(cats)
      setItems(itemsData)
      if (cats.length > 0) setSelectedCategory(cats[0].id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = selectedCategory
    ? items.filter(i => i.categoryId === selectedCategory)
    : items

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  function goToCart() {
    if (tableId) {
      navigate(`/cart?table=${tableId}`)
    } else {
      navigate('/cart')
    }
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  return (
    <div>
      <header className="header">
        <h1>مرحبا بك</h1>
        <p>اختر ما تشاء من قائمتنا اللذيذة</p>
        {tableId && <p style={{ marginTop: 5, fontSize: '0.85rem', opacity: 0.8 }}>طاولة رقم {tableId.slice(-2)}</p>}
      </header>

      <div className="container">
        <div className="categories-nav">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="icon">{cat.icon}</span>
              <span className="label">{cat.nameAr}</span>
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-card">
              <div className="menu-card-image">
                {categories.find(c => c.id === item.categoryId)?.icon || '🍽️'}
              </div>
              <div className="menu-card-body">
                <h3 className="menu-card-title">{item.nameAr}</h3>
                <p className="menu-card-desc">{item.descriptionAr || item.description}</p>
                <div className="menu-card-footer">
                  <span className="menu-card-price">{item.price} د.م</span>
                  <button className="add-btn" onClick={() => addToCart(item)}>إضافة</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cartCount > 0 && (
        <div className="cart-fixed">
          <div className="cart-info">
            <span className="cart-count">{cartCount} عنصر</span>
            <span className="cart-total">المجموع: {cartTotal.toFixed(2)} د.م</span>
          </div>
          <button className="cart-btn" onClick={goToCart}>عرض السلة</button>
        </div>
      )}
    </div>
  )
}
