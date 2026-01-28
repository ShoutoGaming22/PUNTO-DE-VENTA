#!/bin/bash

# Script de instalación para LA JICARADAS POS

echo "🚀 Instalando LA JICARADAS POS..."

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "✓ Node.js $(node -v) detectado"

# 2. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# 3. Crear carpeta de datos
mkdir -p data

# 4. Inicializar BD
echo "🗄️ Inicializando base de datos..."
npm run init:db

echo ""
echo "✅ ¡Instalación completada!"
echo ""
echo "Para iniciar en desarrollo, ejecutar:"
echo "  npm run dev"
echo ""
echo "Credenciales por defecto:"
echo "  Usuario: admin"
echo "  PIN: 1234"
echo ""
