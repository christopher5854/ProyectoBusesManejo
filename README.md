# 🚌 Proyecto Buses Manejo

Sistema integral para la gestión y administración de cooperativas de transporte o flotas de buses. El proyecto se divide en un **Backend** construido con Node.js, Express y PostgreSQL, y un **Frontend** desarrollado con React, Vite y Material UI.

## 🚀 Características Principales

- **Gestión de Usuarios y Roles:** Autenticación con JWT, contraseñas encriptadas con bcrypt y permisos basados en roles.
- **Administración de Flotas:** Control de vehículos, choferes y rutas.
- **Generación de Reportes:** Exportación a PDF (mediante `pdfkit`) y generación de códigos QR (mediante `qrcode` y `html5-qrcode`).
- **Notificaciones por Correo:** Envío de emails mediante `nodemailer` (integrado con MailHog para desarrollo).
- **Base de Datos Relacional:** Uso de PostgreSQL con migraciones gestionadas a través de `db-migrate`.
- **Arquitectura Contenerizada:** Soporte completo de Docker y Docker Compose para facilitar el despliegue y desarrollo local.

---

## 🛠️ Tecnologías Utilizadas

### Backend (`/BackendBuses`)
- **Entorno:** Node.js, Express.js
- **Base de Datos:** PostgreSQL, `pg`, `db-migrate`
- **Seguridad:** `bcrypt`, `jsonwebtoken` (JWT), `cors`
- **Utilidades:** `multer` (subida de archivos), `nodemailer` (emails), `pdfkit` (PDFs), `qrcode` (códigos QR)

### Frontend (`/frontendBuses`)
- **Core:** React 19, Vite, React Router DOM
- **Estado y Fetching:** Zustand, TanStack React Query (`@tanstack/react-query`)
- **Estilos y UI:** Material UI (MUI), Styled Components, Emotion, React Icons
- **Gráficos y Extras:** Recharts, React Hot Toast, React QR Code

### Infraestructura
- **Docker & Docker Compose**
- **Servicios Adicionales:** MailHog (pruebas de email), pgAdmin (gestión de DB)

---

## 📋 Estructura del Proyecto

```plaintext
ProyectoBusesManejo/
├── BackendBuses/         # Código fuente de la API (Node.js/Express)
├── frontendBuses/        # Código fuente del cliente (React/Vite)
├── docker-compose.yml    # Configuración de los servicios de Docker
├── init.sql              # Script de inicialización de la base de datos
├── backup_db.sql         # Respaldo de la base de datos
├── INSTALACION.md        # Guía paso a paso de instalación
└── README.md             # Documentación general del proyecto (este archivo)
```

---

## 🔧 Instalación y Ejecución Local

Puedes revisar la guía rápida en el archivo [INSTALACION.md](./INSTALACION.md) para un proceso detallado sin Docker.

### Opción 1: Ejecución con Docker (Recomendado)

Asegúrate de tener instalado [Docker](https://www.docker.com/) y Docker Compose.

1. Clona el repositorio y entra al directorio:
   ```bash
   git clone <URL-del-repositorio>
   cd ProyectoBusesManejo
   ```
2. Ejecuta los contenedores en segundo plano:
   ```bash
   docker-compose up -d
   ```
3. **Servicios Disponibles:**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:3000](http://localhost:3000)
   - **Base de Datos (PostgreSQL):** Puerto `5433` localmente (o `5432` dentro de la red de Docker).
   - **pgAdmin:** [http://localhost:5050](http://localhost:5050) (admin@admin.com / admin123)
   - **MailHog (Bandeja de correos):** [http://localhost:8025](http://localhost:8025)

### Opción 2: Instalación Manual

Requisitos: **Node.js (v16+)** y **PostgreSQL (v12+)**.

1. **Configuración de Base de Datos y Backend:**
   ```bash
   cd BackendBuses
   npm install
   ```
   Crea un archivo `.env` en `BackendBuses` basado en `.env.example`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cooperativa_db
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña
   PORT=3000
   JWT_SECRET=tu_secreto_jwt
   ```
   Crea la base de datos y ejecuta las migraciones:
   ```bash
   psql -U postgres -c "CREATE DATABASE cooperativa_db;"
   npm run migrate:up
   ```
   Levanta el servidor Backend:
   ```bash
   npm run dev
   ```

2. **Configuración del Frontend:**
   En otra terminal:
   ```bash
   cd frontendBuses
   npm install
   npm run dev
   ```

---

## 📄 Licencia

Este proyecto está bajo la licencia [ISC](./LICENSE) (u otra aplicable). Revisa el archivo `LICENSE` para más detalles.
