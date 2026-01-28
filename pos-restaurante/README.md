# LA JICARADAS - POS Profesional para Restaurantes

Sistema punto de venta (POS) moderno, offline-first y profesional diseñado específicamente para restaurantes.

## 🎯 Características Principales

### 🍽️ Gestión de Mesas y Comandas
- Visualización gráfica del área de mesas (general, barra)
- Estados de mesa: Libre, Ocupada, Reservada
- Envío inmediato de órdenes a cocina/bar
- Reducción de errores en pedidos

### 📦 Control de Inventario y Mermas
- Monitoreo en tiempo real de insumos (gramos, mililitros)
- Recetas/composición de productos finales
- Puntos de reorden automáticos
- Reducción de desperdicios
- Valuación de inventario

### ⚡ Rapidez y Funcionalidad Offline
- Operación ágil en horas pico
- Funciona sin internet (Offline First)
- Sincronización automática cuando hay conexión
- Respuesta instantánea en mesas

### 📊 Reportes e Inteligencia de Negocio
- Informes de productos más vendidos
- Ticket promedio por período
- Desempeño por mesero
- Reportes de nómina
- Horas pico
- Dashboard en tiempo real

### 💳 Facturación y Pagos
- Emisión de facturas electrónicas
- Cola de facturación (sincronización SAT/AFIP/DIAN)
- Múltiples formas de pago:
  - Efectivo
  - Tarjetas (integración con terminal bancaria)
  - Transferencias
  - QR

### 🔐 Seguridad y Soporte
- Roles de usuario: Admin, Cajero, Mesero, Cocina
- Autenticación por PIN
- Cierre de caja obligatorio
- Cumplimiento indirecto de PCI DSS
- Auditoría completa de transacciones

### 📱 Compatibilidad
- Windows (Electron)
- Tablets iOS/Android (Web App/PWA)
- Conexión por LAN local

## 🏗️ Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────┐
│                    ELECTRON APP (Windows)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │   React UI       │         │  Preload Bridge  │    │
│  │ (Tailwind CSS)   │────────▶│ (IPC Handler)    │    │
│  └──────────────────┘         └──────────────────┘    │
│           │                             │              │
│           ▼                             ▼              │
│  ┌──────────────────────────────────────────────────┐  │
│  │     Local REST API (Node.js) - Port 3001         │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Orders│Tables│Products│Inventory│Reports │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│           │                                            │
│           ▼                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │       SQLite Database (Local/Encrypted)          │  │
│  │  Users│Tables│Orders│Products│Inventory│Invoice │  │
│  │  Transactions│CashSessions│AuditLogs             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │  Impresora       │         │  Hardware        │    │
│  │  Térmica ESC/POS │         │  (Cajón, etc)    │    │
│  └──────────────────┘         └──────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
         │
         │ (Cuando hay internet)
         ▼
    Backend Central
    (Reportes, Facturación, Updates)
```

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **App Desktop** | Electron 27+ |
| **Frontend** | React 18 + Tailwind CSS |
| **Backend Local** | Node.js + Express |
| **Base de Datos** | SQLite 3 |
| **Estado** | Zustand |
| **HTTP** | Axios |
| **Comunicación** | Socket.io (para tiempo real) |
| **Actualizaciones** | electron-updater |
| **Impresoras** | ESC/POS |

## 🚀 Instalación y Desarrollo

### Requisitos
- Node.js 18+
- npm o yarn

### Setup Inicial

```bash
# Entrar a la carpeta del proyecto
cd pos-restaurante

# Instalar dependencias
npm install

# Crear carpeta de datos
mkdir -p data
```

### Desarrollo

```bash
# Iniciar en modo desarrollo (Electron + React + Backend)
npm run dev

# Por separado:
npm run dev:electron    # Electron app
npm run dev:backend     # Node backend (port 3001)
npm run dev:react       # React dev server (port 3000)
```

### Build

```bash
# Build para producción
npm run build

# Empaquetar como .exe para Windows
npm run pack

# Crear ejecutable distribuible
npm run dist
```

## 📁 Estructura del Proyecto

```
pos-restaurante/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── index.ts         # Entry point
│   │   └── preload.ts       # IPC bridge
│   ├── backend/              # Node.js backend
│   │   ├── server.ts        # Express app
│   │   ├── database/        # SQLite
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Express middleware
│   │   └── models/          # Data models
│   └── renderer/             # React frontend
│       ├── pages/           # Pages
│       ├── components/      # React components
│       ├── store/           # Zustand store
│       ├── hooks/           # Custom hooks
│       └── styles/          # CSS
├── public/                   # Static assets
├── index.html               # HTML template
├── vite.config.ts          # Vite config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## 📚 API Endpoints

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `POST /api/orders/:id/items` - Añadir item a orden
- `POST /api/orders/:id/close` - Cerrar orden
- `POST /api/orders/:id/send-kitchen` - Enviar a cocina

### Mesas
- `GET /api/tables` - Listar mesas
- `POST /api/tables` - Crear mesa
- `PUT /api/tables/:id/status` - Actualizar estado

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `POST /api/products/:id/recipe` - Añadir receta

### Inventario
- `GET /api/inventory` - Listar inventario
- `POST /api/inventory` - Añadir item
- `POST /api/inventory/:id/movement` - Registrar movimiento

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users/verify-pin` - Login con PIN

### Reportes
- `GET /api/reports/sales` - Ventas por período
- `GET /api/reports/top-products` - Productos más vendidos
- `GET /api/reports/sales-by-user` - Ventas por mesero
- `GET /api/reports/inventory-valuation` - Valuación de inventario

## 🔐 Seguridad

- ✅ Autenticación por PIN
- ✅ Roles y permisos
- ✅ Auditoría de transacciones
- ✅ Encriptación de contraseñas (bcrypt)
- ✅ No procesa tarjetas directamente (terminal externa)
- ✅ Cumplimiento PCI DSS indirecto

## 🔄 Flujo Offline/Online

1. **Offline Mode**: Toda operación se guarda en SQLite local
2. **Cuando conecta**: Sincronización automática de datos
3. **Cola de Facturación**: Facturas se envían cuando hay internet
4. **Backups**: Sincronización con servidor central opcional

## 📱 Planes Futuros

- [ ] Versión web/PWA para tablets
- [ ] Integración SAT (México)
- [ ] Integración AFIP (Argentina)
- [ ] Integración DIAN (Colombia)
- [ ] Módulo de inventario avanzado
- [ ] Análisis predictivo de ventas
- [ ] App móvil para meseros

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo.

## 📄 Licencia

Proprietario - LA JICARADAS 2026
