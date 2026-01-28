## 🚀 INICIO RÁPIDO - 3 PASOS

### Ubicación:
```
c:\Users\mauri\OneDrive\Desktop\LA JICARADAS\pos-restaurante
```

---

## 📥 PASO 1: Instalar (5 minutos)

**Opción A - Automática (Windows):**
1. Doble-click en `install.bat`
2. Esperar a que termine
3. ¡Listo!

**Opción B - Manual:**
```powershell
# Abrir PowerShell en la carpeta del proyecto
cd 'c:\Users\mauri\OneDrive\Desktop\LA JICARADAS\pos-restaurante'

# Instalar
npm install
```

---

## 🏃 PASO 2: Iniciar (10 segundos)

```powershell
npm run dev
```

La app se abrirá automáticamente en:
- http://localhost:3000 (Frontend)
- http://localhost:3001/api (Backend)

---

## 🔓 PASO 3: Login (2 segundos)

```
Usuario: admin
PIN: 1234
```

---

## ✅ ¡Listo!

Ya puedes:
- ✅ Ver todas las mesas
- ✅ Acceder a API
- ✅ Ver reportes
- ✅ Controlar inventario

---

## 📚 Documentación Completa

Dentro del proyecto:
- `README.md` - Documentación completa
- `QUICKSTART.md` - Guía detallada
- `FEATURES_CHECKLIST.md` - Lo que funciona
- `DEVELOPMENT.md` - Para desarrolladores

---

## 🆘 Problemas?

### Puerto ocupado (3001)
```powershell
# Encontrar proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess

# Matar proceso y reintentar
```

### Módulos faltando
```powershell
rm -r node_modules
npm install
```

### Base de datos corrupta
```powershell
rm data/pos.db
npm run dev  # Se recreará automáticamente
```

---

**¡Disfruta tu POS!** 🎉
