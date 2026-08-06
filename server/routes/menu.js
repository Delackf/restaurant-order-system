const express = require('express')
const router = express.Router()
const { getDb, saveDb } = require('../database')

router.get('/categories', (req, res) => {
  const db = getDb()
  const categories = db.categories.sort((a, b) => a.sortOrder - b.sortOrder)
  res.json(categories)
})

router.get('/items', (req, res) => {
  const db = getDb()
  const { categoryId } = req.query
  let items = db.menuItems.filter(i => i.available === 1)
  if (categoryId) {
    items = items.filter(i => i.categoryId === categoryId)
  }
  items.sort((a, b) => a.sortOrder - b.sortOrder)
  res.json(items)
})

router.get('/items/:id', (req, res) => {
  const db = getDb()
  const item = db.menuItems.find(i => i.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  res.json(item)
})

router.post('/items', (req, res) => {
  const db = getDb()
  const { v4: uuidv4 } = require('uuid')
  const { categoryId, name, nameAr, description, descriptionAr, price, image, sortOrder } = req.body
  const newItem = {
    id: uuidv4(),
    categoryId,
    name,
    nameAr,
    description: description || '',
    descriptionAr: descriptionAr || '',
    price: parseFloat(price),
    image: image || '',
    available: 1,
    sortOrder: sortOrder || 0
  }
  db.menuItems.push(newItem)
  saveDb()
  res.status(201).json(newItem)
})

router.put('/items/:id', (req, res) => {
  const db = getDb()
  const idx = db.menuItems.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Item not found' })

  const { name, nameAr, description, descriptionAr, price, image, available, sortOrder } = req.body
  const item = db.menuItems[idx]

  db.menuItems[idx] = {
    ...item,
    name: name || item.name,
    nameAr: nameAr || item.nameAr,
    description: description ?? item.description,
    descriptionAr: descriptionAr ?? item.descriptionAr,
    price: price ? parseFloat(price) : item.price,
    image: image ?? item.image,
    available: available ?? item.available,
    sortOrder: sortOrder ?? item.sortOrder
  }
  saveDb()
  res.json(db.menuItems[idx])
})

router.delete('/items/:id', (req, res) => {
  const db = getDb()
  db.menuItems = db.menuItems.filter(i => i.id !== req.params.id)
  saveDb()
  res.json({ success: true })
})

router.post('/categories', (req, res) => {
  const db = getDb()
  const { v4: uuidv4 } = require('uuid')
  const { name, nameAr, icon, sortOrder } = req.body
  const newCat = {
    id: uuidv4(),
    name,
    nameAr,
    icon: icon || '',
    sortOrder: sortOrder || 0
  }
  db.categories.push(newCat)
  saveDb()
  res.status(201).json(newCat)
})

router.delete('/categories/:id', (req, res) => {
  const db = getDb()
  db.menuItems = db.menuItems.filter(i => i.categoryId !== req.params.id)
  db.categories = db.categories.filter(c => c.id !== req.params.id)
  saveDb()
  res.json({ success: true })
})

module.exports = router
