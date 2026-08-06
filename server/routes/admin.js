const express = require('express')
const router = express.Router()
const { getDb } = require('../database')

router.get('/stats', (req, res) => {
  const db = getDb()

  const totalOrders = db.orders.length
  const pendingOrders = db.orders.filter(o => o.status === 'pending').length

  const today = new Date().toISOString().split('T')[0]
  const todayOrders = db.orders.filter(o => o.createdAt.startsWith(today)).length

  const validOrders = db.orders.filter(o => o.status !== 'cancelled')
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0)

  const todayRevenue = validOrders
    .filter(o => o.createdAt.startsWith(today))
    .reduce((sum, o) => sum + o.total, 0)

  const recentOrders = [...db.orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)

  const itemCounts = {}
  validOrders.forEach(order => {
    order.items.forEach(item => {
      if (!itemCounts[item.id]) {
        itemCounts[item.id] = { id: item.id, name: item.name, nameAr: item.nameAr, quantity: 0, revenue: 0 }
      }
      itemCounts[item.id].quantity += item.quantity
      itemCounts[item.id].revenue += item.total
    })
  })

  const topItems = Object.values(itemCounts).sort((a, b) => b.quantity - a.quantity).slice(0, 5)

  res.json({
    totalOrders,
    pendingOrders,
    todayOrders,
    totalRevenue,
    todayRevenue,
    recentOrders,
    topItems
  })
})

router.get('/orders/daily', (req, res) => {
  const db = getDb()
  const dailyMap = {}

  db.orders.filter(o => o.status !== 'cancelled').forEach(order => {
    const date = order.createdAt.split('T')[0]
    if (!dailyMap[date]) {
      dailyMap[date] = { date, orders: 0, revenue: 0 }
    }
    dailyMap[date].orders++
    dailyMap[date].revenue += order.total
  })

  const stats = Object.values(dailyMap).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)
  res.json(stats)
})

module.exports = router
