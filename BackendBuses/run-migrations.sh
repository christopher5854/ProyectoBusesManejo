#!/bin/bash
# Script para ejecutar migraciones de forma segura

set -e

echo "🔍 Verificando conexión a PostgreSQL..."
if ! psql -h ${DB_HOST:-localhost} -U ${DB_USER:-postgres} -d ${DB_NAME:-busesdb} -c "\q" 2>/dev/null; then
    echo "❌ Error: No se puede conectar a PostgreSQL"
    echo "Verifica que:"
    echo "  1. PostgreSQL está corriendo"
    echo "  2. Las variables de entorno están configuradas correctamente en .env"
    exit 1
fi

echo "✅ Conexión a PostgreSQL OK"
echo ""
echo "📦 Instalando dependencias si es necesario..."
npm install > /dev/null 2>&1

echo ""
echo "🚀 Ejecutando migraciones..."
npm run migrate:up

echo ""
echo "✅ ¡Migraciones completadas exitosamente!"
echo ""
echo "📊 Tablas creadas:"
psql -h ${DB_HOST:-localhost} -U ${DB_USER:-postgres} -d ${DB_NAME:-busesdb} -c "\dt"
