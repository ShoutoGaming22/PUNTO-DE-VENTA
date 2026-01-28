## 🔧 INSTRUCCIONES TÉCNICAS - LA JICARADAS POS

### 📍 Ubicación del Proyecto
```
c:\Users\mauri\OneDrive\Desktop\LA JICARADAS\pos-restaurante
```

---

## 1️⃣ INSTALACIÓN INICIAL

### Windows (Recomendado)
```powershell
# Abrir PowerShell en el directorio del proyecto
cd 'c:\Users\mauri\OneDrive\Desktop\LA JICARADAS\pos-restaurante'

# Ejecutar instalador
.\install.bat

# O manualmente
npm install
mkdir data
```

### macOS / Linux
```bash
# Abrir terminal
cd ~/path/to/pos-restaurante

# Instalar
npm install
mkdir -p data
```

---

## 2️⃣ INICIAR EN DESARROLLO

### Opción 1: Desarrollo completo (backend + frontend)
```bash
npm run dev
```

Esto inicia:
- Backend Node.js en http://localhost:3001
- Frontend React en http://localhost:3000
- Abre el navegador automáticamente

### Opción 2: Solo backend
```bash
npm run dev:backend
```
Acceso: http://localhost:3001/api

### Opción 3: Solo frontend
```bash
npm run dev:react
```
Acceso: http://localhost:3000

---

## 3️⃣ BASE DE DATOS - PRIMERAS VECES

### Crear BD con datos de prueba (RECOMENDADO)
```bash
npm run init:db
```

Esto crea:
- Base de datos en `data/pos.db`
- 18 mesas (6 por sección)
- 9 productos de ejemplo
- 6 items de inventario
- Usuario admin (PIN: 1234)

### Crear BD manualmente
```bash
# BD se crea automáticamente al iniciar npm run dev
# Pero sin datos de prueba
```

### Inspeccionar BD
```bash
# Con sqlite3 CLI
sqlite3 data/pos.db

# Queries útiles:
# SELECT * FROM users;
# SELECT * FROM tables;
# SELECT * FROM products;
```

---

## 4️⃣ CREDENCIALES INICIALES

```
Usuario: admin
PIN: 1234
Rol: admin (acceso completo)
```

### Crear otros usuarios (En el futuro):
```bash
# POST http://localhost:3001/api/users
{
  "username": "john",
  "pin": "5678",
  "role": "waiter",
  "name": "John Doe",
  "email": "john@lajicaradas.local"
}
```

---

## 5️⃣ ESTRUCTURA DEL CÓDIGO

### Backend (src/backend/)
```
src/backend/
├── server.ts              # Express app
├── database/
│   └── init.ts           # Schema SQLite
├── routes/
│   ├── index.ts          # Router principal
│   ├── orders.ts         # CRUD de órdenes
│   ├── tables.ts         # CRUD de mesas
│   ├── products.ts       # CRUD de productos
│   ├── inventory.ts      # CRUD de inventario
│   ├── users.ts          # CRUD de usuarios
│   └── reports.ts        # Reportes
└── middleware/
    ├── requestLogger.ts
    └── errorHandler.ts
```

### Frontend (src/renderer/)
```
src/renderer/
├── pages/
│   ├── LoginPage.tsx    # Login con PIN
│   └── SalesPage.tsx    # Gestión de mesas
├── components/
│   ├── Sidebar.tsx      # Menú lateral
│   └── Header.tsx       # Encabezado
├── store/
│   └── posStore.ts      # Zustand store
├── hooks/
│   ├── api.ts           # Axios client
│   └── index.ts         # Custom hooks
├── styles/
│   └── app.css          # Tailwind CSS
├── App.tsx              # Componente principal
└── main.tsx             # React entry
```

---

## 6️⃣ API - EJEMPLOS DE USO

### Login
```bash
POST http://localhost:3001/api/users/verify-pin
Content-Type: application/json

{
  "username": "admin",
  "pin": "1234"
}

Response:
{
  "id": 1,
  "username": "admin",
  "name": "Administrador",
  "role": "admin"
}
```

### Listar mesas
```bash
GET http://localhost:3001/api/tables

Response:
[
  {
    "id": 1,
    "table_number": 1,
    "section": "General",
    "capacity": 4,
    "status": "free"
  }
]
```

### Crear orden
```bash
POST http://localhost:3001/api/orders
Content-Type: application/json

{
  "table_id": 1,
  "user_id": 1
}

Response:
{
  "id": 1,
  "order_number": "ORD-1706424245123"
}
```

### Agregar item a orden
```bash
POST http://localhost:3001/api/orders/1/items
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2,
  "unit_price": 8.50
}

Response:
{
  "id": 1
}
```

### Listar productos
```bash
GET http://localhost:3001/api/products?category=Platos%20Principales

Response:
[
  {
    "id": 1,
    "name": "Hamburguesa Clásica",
    "category": "Platos Principales",
    "price": 8.50,
    "cost": 3.00
  }
]
```

### Reportes
```bash
GET http://localhost:3001/api/reports/sales?start_date=2026-01-01&end_date=2026-01-31

GET http://localhost:3001/api/reports/top-products?limit=10

GET http://localhost:3001/api/reports/inventory-valuation
```

---

## 7️⃣ DESARROLLO - AGREGAR NUEVAS FUNCIONALIDADES

### Agregar nuevo endpoint

1. **Crear ruta** (src/backend/routes/nuevo.ts):
```typescript
import { Router } from 'express'
import { getDatabase } from '../database/init.js'

export const nuevoRouter = Router()

nuevoRouter.get('/', (req, res) => {
  try {
    const db = getDatabase()
    const data = db.prepare('SELECT * FROM tabla').all()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default nuevoRouter
```

2. **Agregar al router principal** (src/backend/routes/index.ts):
```typescript
import { nuevoRouter } from './nuevo.js'

apiRoutes.use('/nuevo', nuevoRouter)
```

3. **Consumir desde React**:
```typescript
const response = await axios.get('http://localhost:3001/api/nuevo')
```

### Agregar nuevo componente

1. **Crear componente** (src/renderer/components/MiComponente.tsx):
```typescript
import React from 'react'

export function MiComponente() {
  return (
    <div className="p-4 rounded-lg bg-white">
      {/* Tu contenido */}
    </div>
  )
}
```

2. **Usar en página**:
```typescript
import { MiComponente } from '../components/MiComponente'

export function MyPage() {
  return <MiComponente />
}
```

### Agregar nueva tabla a BD

1. **Editar** `src/backend/database/init.ts`
2. **Agregar CREATE TABLE** en la función `createTables()`
3. **Agregar índices** si es necesario
4. **Reiniciar** `npm run dev` (BD se recrea si es nueva)

---

## 8️⃣ DEBUGGING

### Activar DevTools en Electron
```
Ctrl + Shift + I
```

### Ver logs del backend
```bash
npm run dev:backend
# Verás todos los requests en consola
```

### Inspeccionar BD
```bash
# Windows
sqlite3 data\pos.db

# macOS/Linux
sqlite3 data/pos.db

# Luego:
> .schema                  # Ver estructura
> SELECT * FROM orders;   # Ver datos
> .exit                    # Salir
```

### Console del navegador
```
F12 → Console
```

### Network tab
```
F12 → Network
# Ver todos los requests a http://localhost:3001/api
```

---

## 9️⃣ BUILD PARA PRODUCCIÓN

### Build frontend
```bash
npm run build:react
# Genera carpeta: dist/renderer/
```

### Build Electron
```bash
npm run build
# Compila TypeScript de Electron
```

### Empaquetar como .exe
```bash
npm run pack
# Crea .exe instalable
```

### Distribución
```bash
npm run dist
# Prepara todo para distribución
```

---

## 🔟 TROUBLESHOOTING TÉCNICO

### Error: "Port 3001 already in use"
```powershell
# Encontrar proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess

# Matar proceso
Stop-Process -ID <PID> -Force

# O cambiar puerto en src/backend/server.ts línea 6
const PORT = process.env.PORT || 3002
```

### Error: "Cannot find module"
```bash
# Limpiar e reinstalar
rm -r node_modules
npm install

# Limpiar caché
npm cache clean --force
npm install
```

### Error: "Database is locked"
```bash
# Cerrar todas las instancias de Node.js
taskkill /F /IM node.exe

# Eliminar BD y recrear
rm data/pos.db
npm run dev
```

### TypeScript errors
```bash
# Verificar tipos
npm run lint

# Formatear código
npm run format
```

### BD corrupta
```bash
# Eliminar y recrear
rm data/pos.db
npm run init:db
```

---

## 1️⃣1️⃣ VARIABLES DE ENTORNO

Crear `.env` en la raíz:

```env
# Backend
PORT=3001
NODE_ENV=development

# Database
DB_PATH=./data/pos.db

# Electron
ELECTRON_ENV=development

# App
APP_NAME=LA JICARADAS
APP_VERSION=1.0.0
```

---

## 1️⃣2️⃣ COMMIT & VERSIONADO

Usar conventional commits:

```bash
git commit -m "feat: agregar carrito de compras"
git commit -m "fix: corregir cierre de caja"
git commit -m "docs: actualizar README"
git commit -m "style: formatear código"
git commit -m "refactor: mejorar performance"
```

---

## 1️⃣3️⃣ DEPLOYMENT

### En Windows:
```bash
npm run dist  # Crea .exe
# Distribuir: dist/LA JICARADAS Setup 1.0.0.exe
```

### En servidor:
```bash
# Requiere Node.js + SQLite
npm install --production
npm run dev:backend  # En background o con PM2
```

---

## 1️⃣4️⃣ DOCUMENTACIÓN

- `README.md` - Doc completa
- `DEVELOPMENT.md` - Dev guide
- `QUICKSTART.md` - Inicio rápido
- Cada archivo tiene comentarios

---

## 🆘 SOPORTE

Para problemas:
1. Ver DEVELOPMENT.md
2. Verificar logs (F12)
3. Revisar consola del backend
4. Inspeccionar BD con sqlite3

---

**¡Listo para desarrollar!** 🚀
