import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const db = new Database(path.join(__dirname, '../data/pos.db'))

console.log('📦 Inicializando BD con datos de prueba...\n')

try {
  // Crear usuario admin
  db.prepare(`
    INSERT OR IGNORE INTO users (username, pin, password_hash, role, name, email, phone, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('admin', '1234', 'admin_hash', 'admin', 'Administrador', 'admin@lajicaradas.local', '555-0000', 1)
  console.log('✓ Usuario admin creado (PIN: 1234)')

  // Crear mesas
  const sections = ['General', 'Barra', 'Terraza']
  sections.forEach((section) => {
    for (let i = 1; i <= 6; i++) {
      db.prepare(`
        INSERT OR IGNORE INTO tables (table_number, section, capacity, status)
        VALUES (?, ?, ?, ?)
      `).run(`${section[0]}${i}`, section, 4, 'free')
    }
  })
  console.log('✓ 18 mesas creadas (6 por sección)')

  // Crear productos
  const products = [
    { name: 'Hamburguesa Clásica', category: 'Platos Principales', price: 8.50, cost: 3.00 },
    { name: 'Tacos Al Pastor (3)', category: 'Platos Principales', price: 6.00, cost: 2.50 },
    { name: 'Enchiladas Verdes', category: 'Platos Principales', price: 7.50, cost: 3.50 },
    { name: 'Quesadilla', category: 'Platos Principales', price: 5.00, cost: 2.00 },
    { name: 'Ceviche', category: 'Platos Principales', price: 9.00, cost: 4.00 },
    { name: 'Agua Fresca', category: 'Bebidas', price: 1.50, cost: 0.50 },
    { name: 'Cerveza Corona', category: 'Bebidas', price: 3.50, cost: 1.50 },
    { name: 'Refresco', category: 'Bebidas', price: 2.00, cost: 0.75 },
    { name: 'Café', category: 'Bebidas', price: 2.50, cost: 0.75 },
  ]

  products.forEach(p => {
    db.prepare(`
      INSERT OR IGNORE INTO products (name, category, price, cost, active)
      VALUES (?, ?, ?, ?, ?)
    `).run(p.name, p.category, p.price, p.cost, 1)
  })
  console.log('✓ 9 productos creados')

  // Crear inventario básico
  const inventory = [
    { name: 'Carne de res', unit: 'kg', quantity: 10, min: 2, max: 15, cost: 5.00 },
    { name: 'Pan para hamburguesa', unit: 'pieza', quantity: 50, min: 20, max: 100, cost: 0.30 },
    { name: 'Queso', unit: 'kg', quantity: 3, min: 1, max: 5, cost: 4.00 },
    { name: 'Lechuga', unit: 'kg', quantity: 5, min: 2, max: 10, cost: 1.50 },
    { name: 'Tomate', unit: 'kg', quantity: 4, min: 1, max: 8, cost: 1.00 },
    { name: 'Tortillas', unit: 'docena', quantity: 20, min: 5, max: 30, cost: 0.50 },
  ]

  inventory.forEach(item => {
    db.prepare(`
      INSERT OR IGNORE INTO inventory (name, unit, current_quantity, minimum_quantity, maximum_quantity, unit_cost)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(item.name, item.unit, item.quantity, item.min, item.max, item.cost)
  })
  console.log('✓ 6 items de inventario creados')

  console.log('\n✅ Base de datos inicializada correctamente')
  console.log('\n📝 Credenciales de acceso:')
  console.log('   Usuario: admin')
  console.log('   PIN: 1234')

} catch (error) {
  console.error('❌ Error:', (error as Error).message)
  process.exit(1)
}

db.close()
