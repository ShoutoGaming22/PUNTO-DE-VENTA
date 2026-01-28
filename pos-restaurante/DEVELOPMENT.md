# Configuración de Desarrollo

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Backend
PORT=3001
NODE_ENV=development

# Database
DB_PATH=./data/pos.db

# Electron
ELECTRON_ENV=development
```

## Primeras Pasos

### 1. Crear Usuario Admin

Para crear el primer usuario admin en la BD, ejecutar este script:

```javascript
const Database = require('better-sqlite3')
const db = new Database('./data/pos.db')

db.prepare(`
  INSERT INTO users (username, pin, password_hash, role, name, email)
  VALUES (?, ?, ?, ?, ?, ?)
`).run('admin', '1234', 'admin_hash', 'admin', 'Administrador', 'admin@lajicaradas.local')

console.log('✓ Usuario admin creado: admin / PIN: 1234')
```

### 2. Crear Mesas Iniciales

```javascript
const sections = ['General', 'Barra', 'Terraza']
sections.forEach((section, idx) => {
  for (let i = 1; i <= 5; i++) {
    db.prepare(`
      INSERT INTO tables (table_number, section, capacity)
      VALUES (?, ?, ?)
    `).run(idx * 100 + i, section, 4)
  }
})
```

### 3. Crear Categorías de Productos

Agregar productos de ejemplo:

```javascript
const products = [
  { name: 'Hamburguesa Clásica', category: 'Platos', price: 8.50, cost: 3.00 },
  { name: 'Tacos Al Pastor', category: 'Platos', price: 6.00, cost: 2.50 },
  { name: 'Agua Fresca', category: 'Bebidas', price: 1.50, cost: 0.50 },
  { name: 'Cerveza', category: 'Bebidas', price: 3.00, cost: 1.50 },
]

products.forEach(p => {
  db.prepare(`
    INSERT INTO products (name, category, price, cost)
    VALUES (?, ?, ?, ?)
  `).run(p.name, p.category, p.price, p.cost)
})
```

## Debugging

### Electron DevTools
- `Ctrl+Shift+I` abre las herramientas de desarrollador

### Backend Logs
El servidor Node.js registra todos los requests:
```
[2026-01-28T10:30:45.123Z] GET /api/orders - 200 (45ms)
```

### SQLite Inspector
Usar herramienta como `sqlite3-viewer` o `DB Browser for SQLite`

## Estructura de Carpetas de Datos

```
pos-restaurante/
└── data/
    └── pos.db (Base de datos SQLite)
```

La DB se crea automáticamente en `data/pos.db` la primera vez que se ejecuta.

## Commits y Versionado

Seguir conventional commits:
- `feat: Nueva característica`
- `fix: Corrección de bug`
- `docs: Documentación`
- `style: Formato de código`
- `refactor: Refactorización`

Ejemplo:
```
feat: Agregar sistema de facturación electrónica
fix: Corregir cierre de caja
```

## Testing

Ejecutar tests:
```bash
npm test
```

Crear tests en `src/__tests__/` con extensión `.test.ts`
