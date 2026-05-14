@echo off
REM Script para ejecutar migraciones de forma segura en Windows

echo 🔍 Verificando conexión a PostgreSQL...

REM Verificar conexión a PostgreSQL
psql -h %DB_HOST% -U %DB_USER% -d %DB_NAME% -c "\q" >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: No se puede conectar a PostgreSQL
    echo Verifica que:
    echo   1. PostgreSQL está corriendo
    echo   2. Las variables de entorno están configuradas correctamente en .env
    pause
    exit /b 1
)

echo ✅ Conexión a PostgreSQL OK
echo.
echo 📦 Instalando dependencias si es necesario...
call npm install >nul 2>&1

echo.
echo 🚀 Ejecutando migraciones...
call npm run migrate:up

echo.
echo ✅ ¡Migraciones completadas exitosamente!
echo.
echo 📊 Tablas creadas:
psql -h %DB_HOST% -U %DB_USER% -d %DB_NAME% -c "\dt"
pause
