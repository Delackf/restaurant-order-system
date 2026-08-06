const API_BASE = '/api'

async function fetchApi(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const getMenuCategories = () => fetchApi('/menu/categories')
export const getMenuItems = (categoryId) => fetchApi(`/menu/items${categoryId ? `?categoryId=${categoryId}` : ''}`)
export const createMenuItem = (data) => fetchApi('/menu/items', { method: 'POST', body: JSON.stringify(data) })
export const updateMenuItem = (id, data) => fetchApi(`/menu/items/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteMenuItem = (id) => fetchApi(`/menu/items/${id}`, { method: 'DELETE' })
export const createCategory = (data) => fetchApi('/menu/categories', { method: 'POST', body: JSON.stringify(data) })
export const deleteCategory = (id) => fetchApi(`/menu/categories/${id}`, { method: 'DELETE' })

export const createOrder = (data) => fetchApi('/orders', { method: 'POST', body: JSON.stringify(data) })
export const getOrders = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return fetchApi(`/orders${qs ? `?${qs}` : ''}`)
}
export const getOrder = (id) => fetchApi(`/orders/${id}`)
export const updateOrderStatus = (id, status) => fetchApi(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
export const deleteOrder = (id) => fetchApi(`/orders/${id}`, { method: 'DELETE' })

export const getAdminStats = () => fetchApi('/admin/stats')
export const getDailyStats = () => fetchApi('/admin/orders/daily')

export const getTables = () => fetchApi('/tables')
export const createTable = (data) => fetchApi('/tables', { method: 'POST', body: JSON.stringify(data) })
export const updateTable = (id, data) => fetchApi(`/tables/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteTable = (id) => fetchApi(`/tables/${id}`, { method: 'DELETE' })
