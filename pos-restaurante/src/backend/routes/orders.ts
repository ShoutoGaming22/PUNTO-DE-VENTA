import { Router } from 'express'
import { getDatabase } from '../database/init.js'

export const ordersRouter = Router()

// Get all orders
ordersRouter.get('/', (req, res) => {
  try {
    const db = getDatabase()
    const orders = db.prepare(`
      SELECT * FROM orders
      ORDER BY created_at DESC
      LIMIT 50
    `).all()
    
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Get order by ID
ordersRouter.get('/:id', (req, res) => {
  try {
    const db = getDatabase()
    const { id } = req.params
    
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id)
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id)
    
    res.json({ ...order, items })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Create new order
ordersRouter.post('/', (req, res) => {
  try {
    const db = getDatabase()
    const { table_id, user_id } = req.body
    
    const order_number = `ORD-${Date.now()}`
    
    const result = db.prepare(`
      INSERT INTO orders (order_number, table_id, user_id, status)
      VALUES (?, ?, ?, 'open')
    `).run(order_number, table_id, user_id)
    
    res.status(201).json({ id: result.lastInsertRowid, order_number })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Add item to order
ordersRouter.post('/:id/items', (req, res) => {
  try {
    const db = getDatabase()
    const { id } = req.params
    const { product_id, quantity, unit_price } = req.body
    
    const subtotal = quantity * unit_price
    
    const result = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, product_id, quantity, unit_price, subtotal)
    
    // Update order totals
    const totals = db.prepare(`
      SELECT SUM(subtotal) as subtotal FROM order_items WHERE order_id = ?
    `).get(id) as any
    
    const tax = totals.subtotal * 0.16
    const total = totals.subtotal + tax
    
    db.prepare(`
      UPDATE orders SET subtotal = ?, tax = ?, total = ? WHERE id = ?
    `).run(totals.subtotal, tax, total, id)
    
    res.status(201).json({ id: result.lastInsertRowid })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Close order
ordersRouter.post('/:id/close', (req, res) => {
  try {
    const db = getDatabase()
    const { id } = req.params
    
    db.prepare(`
      UPDATE orders SET status = 'closed', closed_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(id)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Send order to kitchen
ordersRouter.post('/:id/send-kitchen', (req, res) => {
  try {
    const db = getDatabase()
    const { id } = req.params
    
    db.prepare(`
      UPDATE order_items SET sent_to_kitchen = 1, sent_at = CURRENT_TIMESTAMP
      WHERE order_id = ? AND status = 'pending'
    `).run(id)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})
