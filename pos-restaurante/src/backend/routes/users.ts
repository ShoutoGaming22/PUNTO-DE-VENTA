import { Router } from 'express'
import { getDatabase } from '../database/init.js'

export const usersRouter = Router()

// Get all users
usersRouter.get('/', (req, res) => {
  try {
    const db = getDatabase()
    const users = db.prepare(`
      SELECT id, username, role, name, email, phone, active FROM users
      ORDER BY name
    `).all()
    
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Create user
usersRouter.post('/', (req, res) => {
  try {
    const db = getDatabase()
    const { username, pin, password_hash, role, name, email, phone } = req.body
    
    const result = db.prepare(`
      INSERT INTO users (username, pin, password_hash, role, name, email, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(username, pin, password_hash, role, name, email, phone)
    
    res.status(201).json({ id: result.lastInsertRowid })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// Verify PIN (for login)
usersRouter.post('/verify-pin', (req, res) => {
  try {
    const db = getDatabase()
    const { username, pin } = req.body
    
    const user = db.prepare(`
      SELECT id, username, role, name FROM users
      WHERE username = ? AND pin = ? AND active = 1
    `).get(username, pin)
    
    if (user) {
      res.json(user)
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})
