# 📋 Instalación Rápida - ProyectoBusesManejo

## ✅ Requisitos

- **Node.js** v16+ - [Descargar](https://nodejs.org/)
- **PostgreSQL** v12+ - [Descargar](https://www.postgresql.org/)

Verifica:
```bash
node --version
npm --version
psql --version
```

---

## 🚀 Instalación (5 minutos)

### 1. Clonar y Entrar al Proyecto
```bash
git clone <URL-del-repositorio>
cd ProyectoBusesManejo
```

### 2. Backend - Instalar y Configurar
```bash
cd BackendBuses
npm install
```

Crear archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cooperativa_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
PORT=3000
```

### 3. Crear BD y Ejecutar Migraciones
```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE cooperativa_db;"

# Ejecutar migraciones (crea 17 tablas + triggers)
npm run migrate:up
```

### 4. Verificar
```bash
psql -U postgres -d cooperativa_db
\dt  -- Ver 17 tablas
\dy  -- Ver triggers
```

### 5. Frontend - Instalar
```bash
cd ../frontendBuses
npm install
```

---

## ▶️ Ejecutar

**Terminal 1 (Backend):**
```bash
cd BackendBuses
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontendBuses
npm run dev
```

---

## 📞 Soporte

| Problema | Solución |
|----------|----------|
| No conecta a BD | PostgreSQL corriendo + credenciales en `.env` |
| Migraciones fallan | Verifica que la BD existe: `psql -U postgres -l` |

Para detalles completos: [MIGRACIONES.md](./BackendBuses/MIGRACIONES.md)
