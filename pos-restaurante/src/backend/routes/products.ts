import { Router } from 'express'
import { getDatabase } from '../database/init.js'

export const productsRouter = Router()

// Get all products
productsRouter.get('/', (req, res) => {
  try {
    const db = getDatabase()
    const { category } = req.query
    
    let query = 'SELECT * FROM products WHERE active = 1'
    const params: any[] = []
    
    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }
    
    query += ' ORDER BY category, name'
    
    const products = db.prepare(query).all(...params)
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Get product by ID
productsRouter.get('/:id', (req, res) => {
  try {
    const db = getDatabase()
    const { id } = req.params
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
    const recipe = db.prepare('SELECT * FROM recipe_items WHERE product_id = ?').all(id)
    
    res.json({ ...product, recipe })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Create product
productsRouter.post('/', (req, res) => {
  try {
    const db = getDatabase()
    const { name, description, category, price, cost, sku, barcode } = req.body
    
    const result = db.prepare(`
      INSERT INTO products (name, description, category, price, cost, sku, barcode)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, description, category, price, cost, sku, barcode)
    
    res.status(201).json({ id: result.lastInsertRowid })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Add recipe items to product
productsRouter.post('/:id/recipe', (req, res) => {
  try {
    const db = getDatabase()
    const { id } = req.params
    const { ingredient_id, quantity, unit } = req.body
    
    db.prepare(`
      INSERT INTO recipe_items (product_id, ingredient_id, quantity, unit)
      VALUES (?, ?, ?, ?)
    `).run(id, ingredient_id, quantity, unit)
    
    res.status(201).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})
