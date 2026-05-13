# 📋 Instrucciones de Instalación - ProyectoBusesManejo

## ✅ Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalados:

- **Node.js** (versión 16 o superior) - [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **PostgreSQL** (versión 12 o superior) - [Descargar](https://www.postgresql.org/)

Verifica las instalaciones con:
```bash
node --version
npm --version
psql --version
```

---

## 🚀 Instalación del Proyecto

### 1. Clonar o Actualizar el Repositorio
```bash
git clone <URL-del-repositorio>
cd ProyectoBusesManejo
# O si ya lo tienes:
git pull origin main
```

### 2. Instalar Dependencias del Backend

```bash
cd BackendBuses
npm install
```

**Dependencias principales:**
- Express (servidor web)
- PostgreSQL (pg - cliente de base de datos)
- JWT (autenticación)
- bcrypt/bcryptjs (encriptación de contraseñas)
- CORS (configuración de conexiones)
- dotenv (variables de entorno)

### 3. Configurar Variables de Entorno (Backend)

Crear archivo `.env` en la carpeta `BackendBuses/`:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña
DB_NAME=buses_db

# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=tu_clave_secreta_super_segura
```

### 4. Instalar Dependencias del Frontend

```bash
cd ../frontendBuses
npm install
```

**Dependencias principales:**
- React 19 (interfaz de usuario)
- Vite (herramienta de construcción)
- React Router (navegación)
- Axios (peticiones HTTP)
- Material-UI (componentes de diseño)
- Styled Components (estilos CSS-in-JS)

### 5. Configurar Variables de Entorno (Frontend)

Crear archivo `.env` en la carpeta `frontendBuses/` (si es necesario):

```env
VITE_API_URL=http://localhost:5000
```

---

## 🗄️ Configuración de Base de Datos

1. **Crear la base de datos PostgreSQL:**
```bash
psql -U postgres
CREATE DATABASE buses_db;
```

2. **Ejecutar scripts de inicialización** (si existen en el proyecto)

---

## ▶️ Ejecución del Proyecto

### Backend (en terminal, desde `BackendBuses/`)
```bash
# Desarrollo con recarga automática
npm run dev

# O producción
npm start
```

El backend estará disponible en: `http://localhost:5000`

### Frontend (en otra terminal, desde `frontendBuses/`)
```bash
# Desarrollo con Vite
npm run dev

# O compilar para producción
npm run build
```

El frontend estará disponible en: `http://localhost:5173` (o el puerto que indique Vite)

---

## 📝 Resumen Rápido de Instalación

```bash
# 1. Entrar al proyecto
cd ProyectoBusesManejo

# 2. Backend
cd BackendBuses
npm install
# Crear .env con las variables de la BD
cd ..

# 3. Frontend
cd frontendBuses
npm install
cd ..

# 4. Ejecutar en dos terminales
# Terminal 1: cd BackendBuses && npm run dev
# Terminal 2: cd frontendBuses && npm run dev
```

---

## 🔧 Problemas Comunes

| Problema | Solución |
|----------|----------|
| Error de conexión a BD | Verifica que PostgreSQL esté ejecutándose y las credenciales en `.env` |
| Puerto 5000 ocupado | Cambia `PORT` en `.env` del backend |
| Módulos no encontrados | Ejecuta `npm install` en la carpeta correspondiente |
| CORS errors | Verifica la configuración de CORS en `BackendBuses/src/index.js` |

---

## ✨ Notas Adicionales

- Los archivos `.env` **no se deben subir a Git** (están en `.gitignore`)
- Para desarrollo, usa `npm run dev` para ambos proyectos
- La comunicación entre frontend y backend se realiza a través de Axios

---

**¡Listo! El proyecto debería estar funcionando correctamente.** 🎉
