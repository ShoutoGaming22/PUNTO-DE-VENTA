import { Router } from 'express'
import { getDatabase } from '../database/init.js'

export const tablesRouter = Router()

// Get all tables
tablesRouter.get('/', (req, res) => {
  try {
    const db = getDatabase()
    const tables = db.prepare(`
      SELECT t.*, o.id as order_id, o.order_number
      FROM tables t
      LEFT JOIN orders o ON t.current_order_id = o.id
      ORDER BY t.section, t.table_number
    `).all()
    
    res.json(tables)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Get table by ID
tablesRouter.get('/:id', (req, res) => {
  try {
    const db = getDatabase()
    const { id } = req.params
    const table = db.prepare('SELECT * FROM tables WHERE id = ?').get(id)
    
    res.json(table)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Create table
tablesRouter.post('/', (req, res) => {
  try {
    const db = getDatabase()
    const { table_number, section, capacity } = req.body
    
    const result = db.prepare(`
      INSERT INTO tables (table_number, section, capacity, status)
      VALUES (?, ?, ?, 'free')
    `).run(table_number, section, capacity)
    
    res.status(201).json({ id: result.lastInsertRowid })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Update table status
tablesRouter.put('/:id/status', (req, res) => {
  try {
    const db = getDatabase()
    const { id } = req.params
    const { status, current_order_id } = req.body
    
    db.prepare(`
      UPDATE tables SET status = ?, current_order_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, current_order_id, id)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})
