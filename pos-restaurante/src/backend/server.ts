import express from 'express'
import cors from 'cors'
import { initDatabase } from './database/init.js'
import { apiRoutes } from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// Initialize Database
try {
  initDatabase()
  console.log('✓ Database initialized')
} catch (error) {
  console.error('✗ Database initialization failed:', error)
  process.exit(1)
}

// Routes
app.use('/api', apiRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 POS Backend running on http://localhost:${PORT}`)
  console.log(`📊 API available at http://localhost:${PORT}/api`)
})

export default app
