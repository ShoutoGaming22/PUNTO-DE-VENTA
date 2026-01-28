import { Router } from 'express'
import { getDatabase } from '../database/init.js'

export const reportsRouter = Router()

// Sales report by date range
reportsRouter.get('/sales', (req, res) => {
  try {
    const db = getDatabase()
    const { start_date, end_date } = req.query
    
    const report = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_orders,
        SUM(total) as total_sales,
        AVG(total) as average_ticket,
        COUNT(DISTINCT table_id) as tables_served
      FROM orders
      WHERE status = 'closed'
      AND created_at >= ? AND created_at <= ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `).all(start_date, end_date)
    
    res.json(report)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Best selling products
reportsRouter.get('/top-products', (req, res) => {
  try {
    const db = getDatabase()
    const { limit = 10 } = req.query
    
    const products = db.prepare(`
      SELECT 
        p.id,
        p.name,
        p.category,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'closed'
      GROUP BY p.id
      ORDER BY total_quantity DESC
      LIMIT ?
    `).all(limit)
    
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Sales by user
reportsRouter.get('/sales-by-user', (req, res) => {
  try {
    const db = getDatabase()
    const { start_date, end_date } = req.query
    
    const report = db.prepare(`
      SELECT 
        u.id,
        u.name,
        COUNT(o.id) as total_orders,
        SUM(o.total) as total_sales,
        AVG(o.total) as average_ticket
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.status = 'closed'
      AND o.created_at >= ? AND o.created_at <= ?
      GROUP BY u.id
      ORDER BY total_sales DESC
    `).all(start_date, end_date)
    
    res.json(report)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Inventory valuation
reportsRouter.get('/inventory-valuation', (req, res) => {
  try {
    const db = getDatabase()
    
    const valuation = db.prepare(`
      SELECT 
        SUM(current_quantity * unit_cost) as total_value,
        COUNT(*) as total_items,
        SUM(CASE WHEN current_quantity < minimum_quantity THEN 1 ELSE 0 END) as low_stock_items
      FROM inventory
    `).get()
    
    const items = db.prepare(`
      SELECT 
        name,
        current_quantity,
        unit,
        unit_cost,
        (current_quantity * unit_cost) as item_value,
        CASE 
          WHEN current_quantity < minimum_quantity THEN 'LOW'
          WHEN current_quantity > maximum_quantity THEN 'EXCESS'
          ELSE 'OK'
        END as status
      FROM inventory
      ORDER BY item_value DESC
    `).all()
    
    res.json({ summary: valuation, items })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})
