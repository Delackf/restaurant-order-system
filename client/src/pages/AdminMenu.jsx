import { useState, useEffect } from 'react'
import { getMenuCategories, getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, createCategory, deleteCategory } from '../api'

export default function AdminMenu() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    categoryId: '', name: '', nameAr: '', description: '', descriptionAr: '', price: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [cats, itemsData] = await Promise.all([getMenuCategories(), getMenuItems()])
      setCategories(cats)
      setItems(itemsData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function openAddForm() {
    setEditingItem(null)
    setFormData({ categoryId: categories[0]?.id || '', name: '', nameAr: '', description: '', descriptionAr: '', price: '' })
    setShowForm(true)
  }

  function openEditForm(item) {
    setEditingItem(item)
    setFormData({
      categoryId: item.categoryId,
      name: item.name,
      nameAr: item.nameAr,
      description: item.description || '',
      descriptionAr: item.descriptionAr || '',
      price: item.price.toString()
    })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const itemData = { ...formData, price: parseFloat(formData.price) }
      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData)
      } else {
        await createMenuItem(itemData)
      }
      setShowForm(false)
      loadData()
    } catch (err) {
      alert('حدث خطأ')
    }
  }

  async function handleDelete(id) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    try {
      await deleteMenuItem(id)
      loadData()
    } catch (err) {
      alert('حدث خطأ')
    }
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">إدارة القائمة</h2>
        <button className="save-btn" onClick={openAddForm}>+ إضافة عنصر</button>
      </div>

      {showForm && (
        <div className="menu-form">
          <h3 style={{ marginBottom: 15 }}>{editingItem ? 'تعديل عنصر' : 'إضافة عنصر جديد'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>الصنف</label>
                <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.nameAr}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>السعر (د.م)</label>
                <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>الاسم (عربي)</label>
                <input type="text" value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>الاسم (إنجليزي)</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>الوصف (عربي)</label>
              <input type="text" value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="save-btn">{editingItem ? 'تحديث' : 'إضافة'}</button>
              <button type="button" className="back-btn" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {categories.map(cat => {
        const catItems = items.filter(i => i.categoryId === cat.id)
        return (
          <div key={cat.id} style={{ marginBottom: 25 }}>
            <h3 style={{ marginBottom: 10 }}>{cat.icon} {cat.nameAr}</h3>
            {catItems.length === 0 ? (
              <p style={{ color: 'var(--text-light)', padding: 10 }}>لا توجد عناصر</p>
            ) : (
              catItems.map(item => (
                <div key={item.id} className="menu-item-row">
                  <div>
                    <strong>{item.nameAr}</strong>
                    <span style={{ color: 'var(--text-light)', marginRight: 10 }}>{item.price} د.م</span>
                    {!item.available && <span style={{ color: 'var(--danger)', marginRight: 10 }}>(غير متوفر)</span>}
                  </div>
                  <div className="actions">
                    <button className="icon-btn edit" onClick={() => openEditForm(item)}>✏️</button>
                    <button className="icon-btn delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      })}
    </div>
  )
}
