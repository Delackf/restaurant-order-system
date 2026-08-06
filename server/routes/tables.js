const express = require('express')
const router = express.Router()
const { getDb, saveDb } = require('../database')
const { v4: uuidv4 } = require('uuid')

router.get('/', (req, res) => {
  const db = getDb()
  const tables = [...db.tables].sort((a, b) => a.number - b.number)
  res.json(tables)
})

router.post('/', (req, res) => {
  const db = getDb()
  const { number, name } = req.body
  const existing = db.tables.find(t => t.number === number)
  if (existing) return res.status(400).json({ error: 'Table number already exists' })

  const newTable = {
    id: uuidv4(),
    number: parseInt(number),
    name: name || `Table ${number}`,
    qrCode: `table_${number}`,
    active: 1
  }
  db.tables.push(newTable)
  saveDb()
  res.status(201).json(newTable)
})

router.put('/:id', (req, res) => {
  const db = getDb()
  const table = db.tables.find(t => t.id === req.params.id)
  if (!table) return res.status(404).json({ error: 'Table not found' })

  const { number, name, active } = req.body
  if (number) table.number = parseInt(number)
  if (name) table.name = name
  if (active !== undefined) table.active = active
  saveDb()
  res.json({ success: true })
})

router.delete('/:id', (req, res) => {
  const db = getDb()
  db.tables = db.tables.filter(t => t.id !== req.params.id)
  saveDb()
  res.json({ success: true })
})

router.get('/:id/qr', (req, res) => {
  const db = getDb()
  const table = db.tables.find(t => t.id === req.params.id)
  if (!table) return res.status(404).json({ error: 'Table not found' })
  res.json({ table, qrUrl: `/menu?table=${table.id}` })
})

module.exports = router
