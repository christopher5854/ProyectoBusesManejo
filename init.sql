-- ============================================================
-- SCRIPT DE INICIALIZACIÓN - SISTEMA DE BUSES
-- Ejecutar una sola vez al iniciar el proyecto
-- ============================================================

-- ─── ROL ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rol (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(200)
);

-- ─── COOPERATIVA ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cooperativa (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  ruc CHAR(13) UNIQUE,
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion VARCHAR(200),
  logo_url VARCHAR(300),
  activa BOOLEAN NOT NULL DEFAULT true,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── CIUDAD ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ciudad (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  provincia VARCHAR(100)
);

-- ─── USUARIO ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  rol_id INT NOT NULL REFERENCES rol(id) ON DELETE RESTRICT,
  cooperativa_id INT REFERENCES cooperativa(id) ON DELETE SET NULL,
  cedula CHAR(10) UNIQUE NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE,
  discapacidad BOOLEAN NOT NULL DEFAULT false,
  porcentaje_discapacidad SMALLINT,
  activo BOOLEAN NOT NULL DEFAULT true,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── TIPO ASIENTO ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tipo_asiento (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- ─── BUS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bus (
  id SERIAL PRIMARY KEY,
  cooperativa_id INT NOT NULL REFERENCES cooperativa(id),
  numero_interno VARCHAR(20),
  placa VARCHAR(10) NOT NULL UNIQUE,
  marca_chasis VARCHAR(80),
  marca_carroceria VARCHAR(80),
  anio_fabricacion SMALLINT,
  capacidad_total SMALLINT NOT NULL,
  foto_url VARCHAR(300),
  activo BOOLEAN NOT NULL DEFAULT true
);

-- ─── ASIENTO ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asiento (
  id SERIAL PRIMARY KEY,
  bus_id INT NOT NULL REFERENCES bus(id),
  tipo_asiento_id INT REFERENCES tipo_asiento(id),
  numero VARCHAR(5) NOT NULL,
  piso SMALLINT DEFAULT 1,
  disponible BOOLEAN DEFAULT true
);

-- ─── TIPO DESCUENTO ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tipo_descuento (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  porcentaje SMALLINT NOT NULL
);

-- ─── METODO PAGO ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS metodo_pago (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE
);

-- ─── FRECUENCIA ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS frecuencia (
  id SERIAL PRIMARY KEY,
  cooperativa_id INT NOT NULL REFERENCES cooperativa(id),
  ciudad_origen_id INT NOT NULL REFERENCES ciudad(id),
  ciudad_destino_id INT NOT NULL REFERENCES ciudad(id),
  hora_salida TIME NOT NULL,
  duracion_estimada VARCHAR(50),
  numero_resolucion VARCHAR(60),
  precio NUMERIC(8,2) NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT true,
  tipo_viaje VARCHAR(20) NOT NULL DEFAULT 'ordinario'
);

-- ─── PARADA FRECUENCIA ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS parada_frecuencia (
  id SERIAL PRIMARY KEY,
  frecuencia_id INT NOT NULL REFERENCES frecuencia(id),
  ciudad_id INT NOT NULL REFERENCES ciudad(id),
  orden SMALLINT NOT NULL,
  tiempo_parada INT
);

-- ─── HOJA RUTA ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hoja_ruta (
  id SERIAL PRIMARY KEY,
  cooperativa_id INT NOT NULL REFERENCES cooperativa(id),
  frecuencia_id INT NOT NULL REFERENCES frecuencia(id),
  bus_id INT NOT NULL REFERENCES bus(id),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  tipo VARCHAR(20) DEFAULT 'manual',
  activa BOOLEAN NOT NULL DEFAULT true
);

-- ─── RUTA ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ruta (
  id SERIAL PRIMARY KEY,
  frecuencia_id INT NOT NULL REFERENCES frecuencia(id),
  bus_id INT NOT NULL REFERENCES bus(id),
  fecha_ruta DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'programada'
);

-- ─── BOLETO ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS boleto (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuario(id),
  asiento_id INT REFERENCES asiento(id),
  frecuencia_id INT REFERENCES frecuencia(id),
  fecha_viaje DATE,
  codigo VARCHAR(20) UNIQUE,
  estado VARCHAR(20) DEFAULT 'pendiente',
  precio_final NUMERIC(8,2),
  tipo_descuento_id INT REFERENCES tipo_descuento(id),
  metodo_pago_id INT REFERENCES metodo_pago(id),
  referencia_pago VARCHAR(100),
  comprobante_url VARCHAR(300),
  qr_url VARCHAR(300),
  fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── NOTIFICACION ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notificacion (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuario(id),
  titulo VARCHAR(100),
  mensaje TEXT,
  leida BOOLEAN DEFAULT false,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── ACCESO PASAJERO ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS acceso_pasajero (
  id SERIAL PRIMARY KEY,
  boleto_id INT REFERENCES boleto(id),
  usuario_id INT REFERENCES usuario(id),
  fecha_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tipo VARCHAR(20) DEFAULT 'entrada'
);

-- ─── CONFIGURACION APP ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS configuracion_app (
  id SERIAL PRIMARY KEY,
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT
);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Roles
INSERT INTO rol (nombre, descripcion) VALUES
  ('admin', 'Administrador del sistema'),
  ('cooperativa', 'Administrador de cooperativa'),
  ('oficinista', 'Oficinista de cooperativa'),
  ('personal_bus', 'Personal encargado del bus'),
  ('cliente', 'Cliente del sistema')
ON CONFLICT DO NOTHING;

-- Ciudades
INSERT INTO ciudad (nombre, provincia) VALUES
  ('Quito', 'Pichincha'),
  ('Guayaquil', 'Guayas'),
  ('Cuenca', 'Azuay'),
  ('Ambato', 'Tungurahua'),
  ('Riobamba', 'Chimborazo'),
  ('Latacunga', 'Cotopaxi'),
  ('Loja', 'Loja'),
  ('Ibarra', 'Imbabura'),
  ('Santo Domingo', 'Santo Domingo de los Tsáchilas'),
  ('Esmeraldas', 'Esmeraldas'),
  ('Manta', 'Manabí'),
  ('Portoviejo', 'Manabí'),
  ('Machala', 'El Oro'),
  ('Babahoyo', 'Los Ríos'),
  ('Tulcán', 'Carchi')
ON CONFLICT DO NOTHING;

-- Tipos de asiento
INSERT INTO tipo_asiento (nombre) VALUES ('Normal'), ('VIP'), ('Ejecutivo') ON CONFLICT DO NOTHING;

-- Tipos de descuento
INSERT INTO tipo_descuento (nombre, porcentaje) VALUES
  ('Discapacidad', 50),
  ('Tercera Edad', 50),
  ('Menor', 25)
ON CONFLICT DO NOTHING;

-- Métodos de pago
INSERT INTO metodo_pago (nombre) VALUES ('Transferencia'), ('Depósito'), ('Efectivo') ON CONFLICT DO NOTHING;

-- Cooperativa de prueba
INSERT INTO cooperativa (nombre, ruc, telefono, email) VALUES
  ('Flota Pelileo', '1891234560001', '032123456', 'info@flotapelileo.com')
ON CONFLICT DO NOTHING;

-- Usuario admin (password: password)
INSERT INTO usuario (rol_id, cedula, nombres, apellidos, email, password_hash) VALUES
  (1, '1234567890', 'Admin', 'Sistema', 'admin@buses.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT DO NOTHING;

-- Bus de prueba
INSERT INTO bus (cooperativa_id, placa, capacidad_total, numero_interno, marca_chasis) VALUES
  (1, 'ABC-1234', 40, 'B001', 'Mercedes')
ON CONFLICT DO NOTHING;

-- Asientos del bus
INSERT INTO asiento (bus_id, tipo_asiento_id, numero, piso)
SELECT 1, 1, LPAD(n::text, 2, '0'), 1
FROM generate_series(1, 40) n
ON CONFLICT DO NOTHING;

-- Frecuencia Ambato → Quito
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion)
VALUES (1,
  (SELECT id FROM ciudad WHERE nombre = 'Ambato'),
  (SELECT id FROM ciudad WHERE nombre = 'Quito'),
  '08:00', 3.50, 'ordinario', 'RES-001')
ON CONFLICT DO NOTHING;

-- Frecuencia Quito → Ambato
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion)
VALUES (1,
  (SELECT id FROM ciudad WHERE nombre = 'Quito'),
  (SELECT id FROM ciudad WHERE nombre = 'Ambato'),
  '10:00', 3.50, 'ordinario', 'RES-002')
ON CONFLICT DO NOTHING;

-- Hoja de ruta activa
INSERT INTO hoja_ruta (cooperativa_id, frecuencia_id, bus_id, activa, fecha_inicio)
VALUES (1, 1, 1, true, '2026-01-01'),
       (1, 2, 1, true, '2026-01-01')
ON CONFLICT DO NOTHING;

-- Configuracion app
INSERT INTO configuracion_app (clave, valor) VALUES
  ('nombre_app', 'Flota Pelileo'),
  ('logo_url', ''),
  ('color_primario', '#E53935')
ON CONFLICT DO NOTHING;
