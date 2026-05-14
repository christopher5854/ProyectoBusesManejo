# 🗄️ Migraciones de Base de Datos - Sistema de Cooperativa de Buses

Este documento explica cómo usar las migraciones para sincronizar la base de datos en todos los equipos.

## 📋 Requisitos

- Node.js instalado
- PostgreSQL instalado y ejecutándose
- Archivo `.env` configurado en `BackendBuses/` con:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=cooperativa_db
  DB_USER=postgres
  DB_PASSWORD=tu_contraseña
  PORT=3000
  ```

## 🚀 Primeros Pasos

### 1. Instalar dependencias
```bash
cd BackendBuses
npm install
```

### 2. Ejecutar todas las migraciones
```bash
npm run migrate:up
```

### 3. Verificar que se crearon las tablas
Conectarse a PostgreSQL:
```bash
psql -U postgres -d cooperativa_db -h localhost
```

Listar tablas:
```sql
\dt
```

## 📊 Estructura de Tablas (22 Migraciones)

### Tablas Maestras (Sin dependencias)
- **rol** - Roles del sistema (Admin, Operador, Oficinista, Cliente, etc.)
- **cooperativa** - Cooperativas de transporte
- **ciudad** - Ciudades del sistema
- **tipo_asiento** - Tipos de asientos (Normal, VIP, etc.)
- **tipo_descuento** - Tipos de descuentos (Estudiante, Adulto Mayor, etc.)
- **metodo_pago** - Métodos de pago disponibles

### Tablas con Relaciones
- **usuario** (FK: rol, cooperativa) - Usuarios del sistema con roles
- **bus** (FK: cooperativa) - Buses de las cooperativas
- **asiento** (FK: bus, tipo_asiento) - Asientos en cada bus
- **frecuencia** (FK: cooperativa, ciudad) - Frecuencias de viaje
- **parada_frecuencia** (FK: frecuencia, ciudad) - Paradas intermedias
- **hoja_ruta** (FK: cooperativa, frecuencia, bus) - Asignación de buses a frecuencias
- **ruta** (FK: hoja_ruta, frecuencia) - Rutas específicas por fecha
- **boleto** (FK: múltiples) - Boletos vendidos/disponibles
- **acceso_pasajero** (FK: boleto, usuario) - Registro de escaneo de boletos
- **notificacion** (FK: usuario) - Notificaciones para usuarios
- **configuracion_app** - Configuración general de la aplicación

## 🔍 Relaciones Principales

```
cooperativa
├── usuario (1:N)
├── bus (1:N)
│   └── asiento (1:N)
│       └── boleto (1:N)
│           └── acceso_pasajero (1:N)
└── frecuencia (1:N)
    ├── parada_frecuencia (1:N)
    └── hoja_ruta (1:N)
        └── ruta (1:N)
            └── boleto (1:N)

ciudad (1:N) ← frecuencia, parada_frecuencia, boleto

rol (1:N) ← usuario

tipo_asiento (1:N) ← asiento
tipo_descuento (1:N) ← boleto
metodo_pago (1:N) ← boleto
```

## 🔄 Comandos Útiles

### Avanzar una migración
```bash
npm run migrate:up
```

### Retroceder una migración
```bash
npm run migrate:down
```

### Ver estado de migraciones
```bash
npx db-migrate db:migration:unlock --env dev
```

## 📝 Agregar Datos de Prueba

Después de ejecutar las migraciones, conectarse a PostgreSQL e insertar datos:

```sql
-- Insertar roles
INSERT INTO rol (nombre, descripcion) VALUES 
('admin', 'Administrador del sistema'),
('operador', 'Operador de cooperativa'),
('oficinista', 'Personal de oficina'),
('conductor', 'Conductor de bus'),
('cliente', 'Cliente del sistema'),
('validador', 'Personal de validación');

-- Insertar cooperativa
INSERT INTO cooperativa (nombre, ruc, telefono, email, direccion) VALUES
(' FlashTour', '1891234560001', '032-123456', 'info@tungurahua.com', 'Av. Los Shyris, Ambato');

-- Insertar ciudades
INSERT INTO ciudad (nombre, provincia) VALUES 
('Quito', 'Pichincha'),
('Guayaquil', 'Guayas'),
('Cuenca', 'Azuay'),
('Ibarra', 'Imbabura');

-- Insertar tipos de asiento
INSERT INTO tipo_asiento (nombre, descripcion, precio_base) VALUES
('Normal', 'Asiento estándar', 0),
('VIP', 'Asiento VIP con más espacio', 5.00),
('PremiumVIP', 'Asiento de primera clase', 10.00);

-- Insertar tipos de descuento
INSERT INTO tipo_descuento (nombre, porcentaje, requiere_validacion, descripcion) VALUES
('Estudiante', 10, true, 'Descuento para estudiantes'),
('Adulto Mayor', 25, false, 'Descuento para personas de tercera edad'),
('Discapacitado', 50, true, 'Descuento para personas con discapacidad');

-- Insertar métodos de pago
INSERT INTO metodo_pago (nombre, activo) VALUES
('Efectivo', true),
('Tarjeta Débito', true),
('Tarjeta Crédito', true),
('Transferencia Bancaria', true),
('PayPal', false);

-- Insertar usuario admin
INSERT INTO usuario (rol_id, cooperativa_id, cedula, nombres, apellidos, email, password_hash, activo) VALUES
(1, 1, '1234567890', 'Juan', 'Admin', 'admin@coopbuses.com', 'hash_del_password', true);

-- Insertar bus
INSERT INTO bus (cooperativa_id, numero_interno, placa, marca_chasis, marca_carroceria, anio_fabricacion, capacidad_total, activo) VALUES
(1, 'BUS-001', 'ABC1234', 'Volvo', 'Zhong Tong', 2020, 50, true);

-- Insertar frecuencia
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, duracion_estimada, precio, activa, tipo_viaje) VALUES
(1, 1, 2, '08:00:00', '8 hours', 25.00, true, 'ordinario'),
(1, 2, 3, '10:00:00', '5 hours', 18.00, true, 'ejecutivo');
```

## ⚠️ Troubleshooting

| Problema | Solución |
|----------|----------|
| Error de conexión a BD | Verifica que PostgreSQL esté corriendo y las credenciales en `.env` |
| "migration already applied" | Las migraciones ya se ejecutaron previamente |
| Error al crear constraint | Asegurar que los datos existentes cumplan con la restricción |
| Error de trigger | Verificar que las funciones se crearon correctamente |

## 📌 Notas Importantes

- Las migraciones están numeradas secuencialmente (001-022)
- No editar migraciones ya aplicadas
- El orden de migraciones es crítico por las dependencias
- Las migraciones son reversibles con `npm run migrate:down`
- Cada migración debe ser atómica (una sola responsabilidad)

## 🔐 Para el Equipo de Desarrollo

Cuando alguien añada una nueva columna o tabla:

1. Crea una nueva migración numerada (ej: 023-add-campo-nuevo.js)
2. Pushea los cambios a Git
3. Los demás ejecutan `npm run migrate:up`

Esto asegura que todos trabajen con la misma estructura de BD.

## 📋 Lista de Migraciones

| # | Nombre | Descripción |
|---|--------|---|
| 001 | create-rol | Tabla de roles |
| 002 | create-cooperativa | Tabla de cooperativas |
| 003 | create-ciudad | Tabla de ciudades |
| 004 | create-usuario | Tabla de usuarios con FK a rol y cooperativa |
| 005 | create-bus | Tabla de buses con FK a cooperativa |
| 006 | create-tipo-asiento | Tabla de tipos de asiento |
| 007 | create-asiento | Tabla de asientos con FK a bus y tipo_asiento |
| 008 | create-tipo-descuento | Tabla de tipos de descuento |
| 009 | create-metodo-pago | Tabla de métodos de pago |
| 010 | create-frecuencia | Tabla de frecuencias con FK a cooperativa y ciudades |
| 011 | create-parada-frecuencia | Tabla de paradas intermedias |
| 012 | create-hoja-ruta | Tabla de asignaciones de buses |
| 013 | create-ruta | Tabla de rutas específicas |
| 014 | create-boleto | Tabla de boletos (tabla más compleja) |
| 015 | create-notificacion | Tabla de notificaciones |
| 016 | create-acceso-pasajero | Tabla de escaneo de boletos |
| 017 | create-configuracion-app | Tabla de configuración |
| 018 | add-indexes | Índices para optimización |
| 019 | add-check-constraints | Restricciones CHECK |
| 020 | create-functions | Funciones para triggers |
| 021 | create-triggers | Triggers automáticos |
| 022 | add-unique-constraints | Restricciones UNIQUE |


## 🔄 Comandos Útiles

### Avanzar una migración
```bash
npm run migrate:up
```

### Retroceder una migración
```bash
npm run migrate:down
```

### Ver estado de migraciones
```bash
npx db-migrate db:migration:unlock --env dev
```

## 📝 Agregar Datos de Prueba

Después de ejecutar las migraciones, conectarse a PostgreSQL e insertar datos:

```sql
-- Insertar ciudades
INSERT INTO ciudad (nombre, provincia) VALUES 
('Quito', 'Pichincha'),
('Guayaquil', 'Guayas'),
('Cuenca', 'Azuay'),
('Ibarra', 'Imbabura');

-- Insertar rutas
INSERT INTO ruta (ciudadOrigen, ciudadDestino, distancia, duracion, precio, activo) VALUES
(1, 2, 420, '8 horas', 25.00, true),
(2, 1, 420, '8 horas', 25.00, true),
(1, 3, 150, '3 horas', 15.00, true),
(3, 1, 150, '3 horas', 15.00, true);

-- Insertar usuario de prueba
INSERT INTO usuario (nombres, apellidos, email, password, activo) VALUES
('Juan', 'Pérez', 'juan@example.com', 'hashed_password', true),
('María', 'García', 'maria@example.com', 'hashed_password', true);
```

## ⚠️ Troubleshooting

### Error: "ECONNREFUSED"
- Verificar que PostgreSQL está corriendo
- Verificar credenciales en `.env`

### Error: "migration already applied"
- Las migraciones ya se ejecutaron previamente

### Error al crear vista
- Asegurar que las tablas existen primero
- El orden de migraciones es importante

## 📌 Notas Importantes

- Las migraciones están numeradas secuencialmente (001, 002, 003...)
- No editar migraciones ya aplicadas
- Crear nuevas migraciones para cambios futuros
- Las migraciones son reversibles (down)

## 🔐 Para el Equipo de Desarrollo

Cuando alguien añada una nueva columna o tabla:

1. Crea una nueva migración numerada
2. Pushea los cambios a Git
3. Los demás ejecutan `npm run migrate:up`

Esto asegura que todos trabajen con la misma estructura de BD.
