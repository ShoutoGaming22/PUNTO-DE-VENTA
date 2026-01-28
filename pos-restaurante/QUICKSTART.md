# Guía de Inicio Rápido

## 🎯 Pasos para Empezar

### 1️⃣ Preparar el Entorno

```bash
cd "c:\Users\mauri\OneDrive\Desktop\LA JICARADAS\pos-restaurante"
npm install
```

### 2️⃣ Ejecutar en Desarrollo

```bash
npm run dev
```

Esto inicia:
- **Backend (Node.js)** en `http://localhost:3001`
- **React Dev Server** en `http://localhost:3000`
- Abre la app en navegador para desarrollo

### 3️⃣ Primeros Datos

El backend crea la BD automáticamente en `data/pos.db` con estas tablas:

| Tabla | Descripción |
|-------|------------|
| `users` | Usuarios (admin, cashier, waiter, kitchen) |
| `tables` | Mesas del restaurante |
| `orders` | Órdenes/comandas |
| `order_items` | Items de cada orden |
| `products` | Catálogo de productos |
| `inventory` | Insumos/ingredientes |
| `recipe_items` | Composición de productos |
| `cash_sessions` | Sesiones de caja |
| `invoices` | Facturas electrónicas |
| `transactions` | Pagos y transacciones |

### 4️⃣ Crear Usuario Admin (Primera Vez)

Ejecutar en Node.js REPL o crear script `init-admin.js`:

```javascript
import Database from 'better-sqlite3'
import path from 'path'

const db = new Database('data/pos.db')

// Crear usuario admin
db.prepare(`
  INSERT INTO users (username, pin, password_hash, role, name, email, phone)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run('admin', '1234', 'hash', 'admin', 'Administrador', 'admin@lajicaradas.local', '555-0000')

// Crear mesas de ejemplo
const sections = ['General', 'Barra', 'Terraza']
sections.forEach((section, idx) => {
  for (let i = 1; i <= 6; i++) {
    db.prepare(`
      INSERT INTO tables (table_number, section, capacity, status)
      VALUES (?, ?, ?, ?)
    `).run(section[0] + i, section, 4, 'free')
  }
})

// Crear productos de ejemplo
const products = [
  { name: 'Hamburguesa Clásica', category: 'Platos Principales', price: 8.50, cost: 3.00 },
  { name: 'Tacos Al Pastor', category: 'Platos Principales', price: 6.00, cost: 2.50 },
  { name: 'Enchiladas', category: 'Platos Principales', price: 7.50, cost: 3.50 },
  { name: 'Agua Fresca', category: 'Bebidas', price: 1.50, cost: 0.50 },
  { name: 'Cerveza Corona', category: 'Bebidas', price: 3.50, cost: 1.50 },
  { name: 'Refresco', category: 'Bebidas', price: 2.00, cost: 0.75 },
]

products.forEach(p => {
  db.prepare(`
    INSERT INTO products (name, category, price, cost, active)
    VALUES (?, ?, ?, ?, ?)
  `).run(p.name, p.category, p.price, p.cost, 1)
})

console.log('✓ BD inicializada con datos de prueba')
db.close()
```

Ejecutar:
```bash
node init-admin.js
```

### 5️⃣ Login

Usar credenciales en la pantalla de login:
- **Usuario**: `admin`
- **PIN**: `1234`

## 🎨 Interfaz

La app tiene dos vistas principales:

### 📱 Ventas (Mesas)
- Visualización de mesas por sección
- Click para seleccionar mesa
- Botones para: Nueva Orden, Ver Orden, Cerrar Mesa

### 📊 Otras Secciones (próximamente)
- Inventario
- Reportes
- Usuarios
- Configuración

## 🔌 API Endpoints Disponibles

Todos en `http://localhost:3001/api`:

**Órdenes:**
- `GET /orders` - Listar
- `POST /orders` - Crear
- `POST /orders/:id/items` - Agregar item
- `POST /orders/:id/close` - Cerrar
- `POST /orders/:id/send-kitchen` - Enviar a cocina

**Mesas:**
- `GET /tables` - Listar
- `POST /tables` - Crear
- `PUT /tables/:id/status` - Actualizar estado

**Productos:**
- `GET /products?category=...` - Listar
- `POST /products` - Crear

**Inventario:**
- `GET /inventory` - Listar
- `GET /inventory/low-stock` - Stock bajo
- `POST /inventory/:id/movement` - Registrar movimiento

**Reportes:**
- `GET /reports/sales?start_date=...&end_date=...`
- `GET /reports/top-products`
- `GET /reports/sales-by-user`
- `GET /reports/inventory-valuation`

## 🛠️ Troubleshooting

### Puerto 3001 en uso
```bash
netstat -ano | findstr :3001  # Windows
lsof -i :3001                  # Mac/Linux
```

### BD corrupta
```bash
rm data/pos.db
npm run dev  # Se recreará
```

### Módulos no encontrados
```bash
rm -rf node_modules
npm install
```

## 📚 Próximos Pasos

1. Implementar módulo de órdenes completo
2. Agregar carrito de compras
3. Sistema de pagos
4. Facturación electrónica
5. Reportes avanzados
6. Versión web para tablets
7. Integración con impresora térmica

## 🚨 Notas Importantes

- **BD Local**: Toda operación se guarda en SQLite
- **Offline First**: App funciona sin internet
- **Seguridad**: Usar roles y permisos apropiados
- **Respaldos**: Considerar backup de `data/pos.db`

¡Listo para desarrollar! 🚀
