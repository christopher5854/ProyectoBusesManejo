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
  generacion VARCHAR(20) DEFAULT 'manual',
  activa BOOLEAN NOT NULL DEFAULT true
);

-- ─── RUTA ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ruta (
  id SERIAL PRIMARY KEY,
  frecuencia_id INT NOT NULL REFERENCES frecuencia(id),
  hoja_ruta_id INT NOT NULL REFERENCES hoja_ruta(id),
  fecha_ruta DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'programada',
  observacion TEXT
);

-- ─── BOLETO ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS boleto (
  id SERIAL PRIMARY KEY,
  codigo_boleto VARCHAR(50),
  ruta_id INT REFERENCES ruta(id),
  asiento_id INT REFERENCES asiento(id),
  cliente_id INT REFERENCES usuario(id),
  tipo_descuento_id INT REFERENCES tipo_descuento(id),
  ciudad_abordaje_id INT REFERENCES ciudad(id),
  ciudad_destino_id INT REFERENCES ciudad(id),
  metodo_pago_id INT REFERENCES metodo_pago(id),
  precio_base NUMERIC(8,2),
  descuento_aplicado NUMERIC(8,2) DEFAULT 0,
  precio_final NUMERIC(8,2),
  estado VARCHAR(20) DEFAULT 'activo',
  estado_pago VARCHAR(20) DEFAULT 'pendiente',
  referencia_bancaria VARCHAR(100),
  comprobante_url VARCHAR(300),
  oficinista_id INT REFERENCES usuario(id),
  fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_pago TIMESTAMP,
  fecha_validacion TIMESTAMP
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

-- ─── COOPERATIVAS ────────────────────────────────────────────
INSERT INTO cooperativa (nombre, ruc, telefono, email) VALUES
  ('Flota Pelileo',       '1891234560001', '032123456', 'info@flotapelileo.com'),
  ('Trans Esmeraldas',    '0891234560001', '062710111', 'info@transesmeraldas.com'),
  ('Transportes Baños',   '1891234570001', '032740222', 'info@transbanos.com')
ON CONFLICT DO NOTHING;

-- Usuarios de ejemplo (password: password)
INSERT INTO usuario (rol_id, cedula, nombres, apellidos, email, password_hash) VALUES
  (1, '1234567890', 'Admin',      'Sistema', 'admin@buses.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
  (5, '0999999999', 'Cliente',    'Prueba',  'cliente@test.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
  (3, '1800000001', 'Oficinista', 'Prueba',  'oficinista@test.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
  (4, '1812345678', 'Chofer',     'Bus',     'personal@bus.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

-- ─── BUSES ───────────────────────────────────────────────────
-- Cooperativa 1: Flota Pelileo
INSERT INTO bus (cooperativa_id, placa, capacidad_total, numero_interno, marca_chasis) VALUES
  (1, 'ABC-1234', 40, 'B001', 'Mercedes'),
  (1, 'ABC-5678', 42, 'B002', 'Scania')
ON CONFLICT DO NOTHING;

-- Cooperativa 2: Trans Esmeraldas
INSERT INTO bus (cooperativa_id, placa, capacidad_total, numero_interno, marca_chasis) VALUES
  (2, 'DEF-1234', 44, 'TE01', 'Volvo'),
  (2, 'DEF-5678', 40, 'TE02', 'Mercedes')
ON CONFLICT DO NOTHING;

-- Cooperativa 3: Transportes Baños
INSERT INTO bus (cooperativa_id, placa, capacidad_total, numero_interno, marca_chasis) VALUES
  (3, 'GHI-1234', 40, 'TB01', 'Hino')
ON CONFLICT DO NOTHING;

-- ─── ASIENTOS ────────────────────────────────────────────────
-- Bus 1 (40 asientos)
INSERT INTO asiento (bus_id, tipo_asiento_id, numero, piso)
SELECT 1, 1, LPAD(n::text, 2, '0'), 1
FROM generate_series(1, 40) n
ON CONFLICT DO NOTHING;

-- Bus 2 (42 asientos)
INSERT INTO asiento (bus_id, tipo_asiento_id, numero, piso)
SELECT 2, 1, LPAD(n::text, 2, '0'), CASE WHEN n <= 21 THEN 1 ELSE 2 END
FROM generate_series(1, 42) n
ON CONFLICT DO NOTHING;

-- Bus 3 (44 asientos)
INSERT INTO asiento (bus_id, tipo_asiento_id, numero, piso)
SELECT 3, 1, LPAD(n::text, 2, '0'), CASE WHEN n <= 22 THEN 1 ELSE 2 END
FROM generate_series(1, 44) n
ON CONFLICT DO NOTHING;

-- Bus 4 (40 asientos)
INSERT INTO asiento (bus_id, tipo_asiento_id, numero, piso)
SELECT 4, 1, LPAD(n::text, 2, '0'), 1
FROM generate_series(1, 40) n
ON CONFLICT DO NOTHING;

-- Bus 5 (40 asientos)
INSERT INTO asiento (bus_id, tipo_asiento_id, numero, piso)
SELECT 5, 1, LPAD(n::text, 2, '0'), 1
FROM generate_series(1, 40) n
ON CONFLICT DO NOTHING;

-- ============================================================
-- FRECUENCIAS (rutas recurrentes con horarios)
-- ============================================================

-- ── Flota Pelileo (cooperativa 1) ──
-- Ambato → Quito (3 horarios)
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (1, (SELECT id FROM ciudad WHERE nombre='Ambato'), (SELECT id FROM ciudad WHERE nombre='Quito'),  '06:00', 3.50, 'ordinario', 'RES-001', '3h 00min'),
  (1, (SELECT id FROM ciudad WHERE nombre='Ambato'), (SELECT id FROM ciudad WHERE nombre='Quito'),  '08:00', 3.50, 'ordinario', 'RES-002', '3h 00min'),
  (1, (SELECT id FROM ciudad WHERE nombre='Ambato'), (SELECT id FROM ciudad WHERE nombre='Quito'),  '14:00', 3.50, 'ordinario', 'RES-003', '3h 00min');

-- Quito → Ambato (3 horarios)
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (1, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Ambato'), '07:00', 3.50, 'ordinario', 'RES-004', '3h 00min'),
  (1, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Ambato'), '10:00', 3.50, 'ordinario', 'RES-005', '3h 00min'),
  (1, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Ambato'), '16:00', 3.50, 'ordinario', 'RES-006', '3h 00min');

-- Ambato → Guayaquil
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (1, (SELECT id FROM ciudad WHERE nombre='Ambato'), (SELECT id FROM ciudad WHERE nombre='Guayaquil'), '09:00', 5.00, 'ordinario', 'RES-007', '5h 00min'),
  (1, (SELECT id FROM ciudad WHERE nombre='Ambato'), (SELECT id FROM ciudad WHERE nombre='Guayaquil'), '21:00', 5.00, 'ordinario', 'RES-008', '5h 00min');

-- Guayaquil → Ambato
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (1, (SELECT id FROM ciudad WHERE nombre='Guayaquil'), (SELECT id FROM ciudad WHERE nombre='Ambato'), '08:00', 5.00, 'ordinario', 'RES-009', '5h 00min'),
  (1, (SELECT id FROM ciudad WHERE nombre='Guayaquil'), (SELECT id FROM ciudad WHERE nombre='Ambato'), '20:00', 5.00, 'ordinario', 'RES-010', '5h 00min');

-- Ambato → Riobamba
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (1, (SELECT id FROM ciudad WHERE nombre='Ambato'), (SELECT id FROM ciudad WHERE nombre='Riobamba'), '07:30', 1.50, 'ordinario', 'RES-011', '1h 00min'),
  (1, (SELECT id FROM ciudad WHERE nombre='Ambato'), (SELECT id FROM ciudad WHERE nombre='Riobamba'), '12:00', 1.50, 'ordinario', 'RES-012', '1h 00min');

-- Riobamba → Ambato
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (1, (SELECT id FROM ciudad WHERE nombre='Riobamba'), (SELECT id FROM ciudad WHERE nombre='Ambato'), '08:00', 1.50, 'ordinario', 'RES-013', '1h 00min'),
  (1, (SELECT id FROM ciudad WHERE nombre='Riobamba'), (SELECT id FROM ciudad WHERE nombre='Ambato'), '15:00', 1.50, 'ordinario', 'RES-014', '1h 00min');

-- ── Trans Esmeraldas (cooperativa 2) ──
-- Quito → Guayaquil
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (2, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Guayaquil'), '06:30', 8.00, 'ordinario', 'RES-015', '8h 00min'),
  (2, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Guayaquil'), '22:00', 10.00, 'ejecutivo', 'RES-016', '8h 00min');

-- Guayaquil → Quito
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (2, (SELECT id FROM ciudad WHERE nombre='Guayaquil'), (SELECT id FROM ciudad WHERE nombre='Quito'), '07:00', 8.00, 'ordinario', 'RES-017', '8h 00min'),
  (2, (SELECT id FROM ciudad WHERE nombre='Guayaquil'), (SELECT id FROM ciudad WHERE nombre='Quito'), '23:00', 10.00, 'ejecutivo', 'RES-018', '8h 00min');

-- Quito → Esmeraldas
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (2, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Esmeraldas'), '08:00', 7.50, 'ordinario', 'RES-019', '6h 00min'),
  (2, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Esmeraldas'), '21:30', 7.50, 'ordinario', 'RES-020', '6h 00min');

-- Esmeraldas → Quito
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (2, (SELECT id FROM ciudad WHERE nombre='Esmeraldas'), (SELECT id FROM ciudad WHERE nombre='Quito'), '06:00', 7.50, 'ordinario', 'RES-021', '6h 00min'),
  (2, (SELECT id FROM ciudad WHERE nombre='Esmeraldas'), (SELECT id FROM ciudad WHERE nombre='Quito'), '18:00', 7.50, 'ordinario', 'RES-022', '6h 00min');

-- Guayaquil → Cuenca
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (2, (SELECT id FROM ciudad WHERE nombre='Guayaquil'), (SELECT id FROM ciudad WHERE nombre='Cuenca'), '09:00', 8.50, 'ordinario', 'RES-023', '4h 00min'),
  (2, (SELECT id FROM ciudad WHERE nombre='Guayaquil'), (SELECT id FROM ciudad WHERE nombre='Cuenca'), '15:00', 8.50, 'ordinario', 'RES-024', '4h 00min');

-- Cuenca → Guayaquil
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (2, (SELECT id FROM ciudad WHERE nombre='Cuenca'), (SELECT id FROM ciudad WHERE nombre='Guayaquil'), '07:00', 8.50, 'ordinario', 'RES-025', '4h 00min'),
  (2, (SELECT id FROM ciudad WHERE nombre='Cuenca'), (SELECT id FROM ciudad WHERE nombre='Guayaquil'), '14:00', 8.50, 'ordinario', 'RES-026', '4h 00min');

-- ── Transportes Baños (cooperativa 3) ──
-- Ambato → Cuenca
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (3, (SELECT id FROM ciudad WHERE nombre='Ambato'), (SELECT id FROM ciudad WHERE nombre='Cuenca'), '07:00', 6.00, 'ordinario', 'RES-027', '6h 00min'),
  (3, (SELECT id FROM ciudad WHERE nombre='Ambato'), (SELECT id FROM ciudad WHERE nombre='Cuenca'), '20:00', 6.00, 'ordinario', 'RES-028', '6h 00min');

-- Cuenca → Ambato
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (3, (SELECT id FROM ciudad WHERE nombre='Cuenca'), (SELECT id FROM ciudad WHERE nombre='Ambato'), '06:00', 6.00, 'ordinario', 'RES-029', '6h 00min'),
  (3, (SELECT id FROM ciudad WHERE nombre='Cuenca'), (SELECT id FROM ciudad WHERE nombre='Ambato'), '18:00', 6.00, 'ordinario', 'RES-030', '6h 00min');

-- Quito → Cuenca
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (3, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Cuenca'), '22:00', 12.00, 'ejecutivo', 'RES-031', '10h 00min');

-- Cuenca → Quito
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (3, (SELECT id FROM ciudad WHERE nombre='Cuenca'), (SELECT id FROM ciudad WHERE nombre='Quito'), '21:00', 12.00, 'ejecutivo', 'RES-032', '10h 00min');

-- Quito → Loja
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (3, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Loja'), '20:00', 15.00, 'ordinario', 'RES-033', '14h 00min');

-- Loja → Quito
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (3, (SELECT id FROM ciudad WHERE nombre='Loja'), (SELECT id FROM ciudad WHERE nombre='Quito'), '19:00', 15.00, 'ordinario', 'RES-034', '14h 00min');

-- Quito → Ibarra
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (3, (SELECT id FROM ciudad WHERE nombre='Quito'), (SELECT id FROM ciudad WHERE nombre='Ibarra'), '09:00', 3.00, 'ordinario', 'RES-035', '2h 30min');

-- Ibarra → Quito
INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, numero_resolucion, duracion_estimada)
VALUES
  (3, (SELECT id FROM ciudad WHERE nombre='Ibarra'), (SELECT id FROM ciudad WHERE nombre='Quito'), '10:00', 3.00, 'ordinario', 'RES-036', '2h 30min');

-- ============================================================
-- HOJAS DE RUTA (asignar un bus a cada frecuencia)
-- ============================================================
-- Usamos DO block para insertar hojas de ruta dinámicamente
DO $$
DECLARE
  frec RECORD;
  v_bus_id INT;
BEGIN
  FOR frec IN SELECT f.id AS frecuencia_id, f.cooperativa_id FROM frecuencia f WHERE f.activa = true
  LOOP
    -- Seleccionar el primer bus activo de la cooperativa
    SELECT b.id INTO v_bus_id
    FROM bus b
    WHERE b.cooperativa_id = frec.cooperativa_id AND b.activo = true
    LIMIT 1;

    IF v_bus_id IS NOT NULL THEN
      INSERT INTO hoja_ruta (cooperativa_id, frecuencia_id, bus_id, activa, fecha_inicio)
      VALUES (frec.cooperativa_id, frec.frecuencia_id, v_bus_id, true, '2026-01-01')
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- ============================================================
-- RUTAS (instancias diarias para los próximos 30 días)
-- Esto es lo que permite que la búsqueda de boletos funcione
-- ============================================================
INSERT INTO ruta (frecuencia_id, hoja_ruta_id, fecha_ruta, estado)
SELECT
  hr.frecuencia_id,
  hr.id AS hoja_ruta_id,
  d::date AS fecha_ruta,
  'programada'
FROM hoja_ruta hr
CROSS JOIN generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day') d
WHERE hr.activa = true
ON CONFLICT DO NOTHING;

-- ─── CONFIGURACION APP ──────────────────────────────────────
INSERT INTO configuracion_app (clave, valor) VALUES
  ('nombre_app', 'Flota Pelileo'),
  ('logo_url', ''),
  ('color_primario', '#E53935')
ON CONFLICT DO NOTHING;
