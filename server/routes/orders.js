const express = require('express')
const router = express.Router()
const { getDb, saveDb } = require('../database')
const { v4: uuidv4 } = require('uuid')

router.post('/', (req, res) => {
  const db = getDb()
  const { tableId, items, notes } = req.body

  if (!tableId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Table ID and items are required' })
  }

  const table = db.tables.find(t => t.id === tableId)
  if (!table) return res.status(404).json({ error: 'Table not found' })

  let total = 0
  const orderItems = items.map(item => {
    const menuItem = db.menuItems.find(m => m.id === item.id)
    if (!menuItem) throw new Error(`Menu item ${item.id} not found`)
    const itemTotal = menuItem.price * item.quantity
    total += itemTotal
    return {
      id: menuItem.id,
      name: menuItem.name,
      nameAr: menuItem.nameAr,
      price: menuItem.price,
      quantity: item.quantity,
      total: itemTotal
    }
  })

  const order = {
    id: uuidv4(),
    tableId,
    tableNumber: table.number,
    items: orderItems,
    total,
    status: 'pending',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  db.orders.push(order)
  saveDb()

  res.status(201).json(order)
})

router.get('/', (req, res) => {
  const db = getDb()
  const { status, tableId, limit = 50 } = req.query
  let orders = [...db.orders]

  if (status) {
    orders = orders.filter(o => o.status === status)
  }
  if (tableId) {
    orders = orders.filter(o => o.tableId === tableId)
  }

  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  orders = orders.slice(0, parseInt(limit))

  res.json(orders)
})

router.get('/:id', (req, res) => {
  const db = getDb()
  const order = db.orders.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

router.put('/:id/status', (req, res) => {
  const db = getDb()
  const { status } = req.body
  const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const order = db.orders.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })

  order.status = status
  order.updatedAt = new Date().toISOString()
  saveDb()

  res.json({ success: true, status })
})

router.delete('/:id', (req, res) => {
  const db = getDb()
  db.orders = db.orders.filter(o => o.id !== req.params.id)
  saveDb()
  res.json({ success: true })
})

module.exports = router
