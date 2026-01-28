import { Router } from 'express'
import { getDatabase } from '../database/init.js'

export const inventoryRouter = Router()

// Get all inventory items
inventoryRouter.get('/', (req, res) => {
  try {
    const db = getDatabase()
    const items = db.prepare(`
      SELECT * FROM inventory
      ORDER BY name
    `).all()
    
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Get low stock items
inventoryRouter.get('/low-stock', (req, res) => {
  try {
    const db = getDatabase()
    const items = db.prepare(`
      SELECT * FROM inventory
      WHERE current_quantity < minimum_quantity
      ORDER BY current_quantity ASC
    `).all()
    
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Add inventory item
inventoryRouter.post('/', (req, res) => {
  try {
    const db = getDatabase()
    const { name, unit, current_quantity, minimum_quantity, maximum_quantity, unit_cost } = req.body
    
    const result = db.prepare(`
      INSERT INTO inventory (name, unit, current_quantity, minimum_quantity, maximum_quantity, unit_cost)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, unit, current_quantity, minimum_quantity, maximum_quantity, unit_cost)
    
    res.status(201).json({ id: result.lastInsertRowid })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Update inventory quantity
inventoryRouter.post('/:id/movement', (req, res) => {
  try {
    const db = getDatabase()
    const { id } = req.params
    const { type, quantity, reference_type, reference_id, notes, user_id } = req.body
    
    // Record movement
    db.prepare(`
      INSERT INTO inventory_movements (inventory_id, type, quantity, reference_type, reference_id, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, type, quantity, reference_type, reference_id, notes, user_id)
    
    // Update quantity
    const multiplier = type === 'input' ? 1 : -1
    db.prepare(`
      UPDATE inventory
      SET current_quantity = current_quantity + ?, last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(quantity * multiplier, id)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})
