// seed.js — Datos iniciales del sistema de buses
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ─── Ciudades ───────────────────────────────────────────────
    const ciudades = [
      { nombre: 'Quito', provincia: 'Pichincha' },
      { nombre: 'Guayaquil', provincia: 'Guayas' },
      { nombre: 'Cuenca', provincia: 'Azuay' },
      { nombre: 'Ambato', provincia: 'Tungurahua' },
      { nombre: 'Riobamba', provincia: 'Chimborazo' },
      { nombre: 'Latacunga', provincia: 'Cotopaxi' },
      { nombre: 'Loja', provincia: 'Loja' },
      { nombre: 'Ibarra', provincia: 'Imbabura' },
      { nombre: 'Santo Domingo', provincia: 'Santo Domingo de los Tsáchilas' },
      { nombre: 'Esmeraldas', provincia: 'Esmeraldas' },
      { nombre: 'Manta', provincia: 'Manabí' },
      { nombre: 'Portoviejo', provincia: 'Manabí' },
      { nombre: 'Machala', provincia: 'El Oro' },
      { nombre: 'Babahoyo', provincia: 'Los Ríos' },
      { nombre: 'Tulcán', provincia: 'Carchi' },
      { nombre: 'Guaranda', provincia: 'Bolívar' },
      { nombre: 'Azogues', provincia: 'Cañar' },
      { nombre: 'Puyo', provincia: 'Pastaza' },
      { nombre: 'Tena', provincia: 'Napo' },
      { nombre: 'Lago Agrio', provincia: 'Sucumbíos' },
    ];

    for (const c of ciudades) {
      await client.query(
        `INSERT INTO ciudad (nombre, provincia) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [c.nombre, c.provincia]
      );
    }
    console.log('✅ Ciudades insertadas');

    // ─── Roles ──────────────────────────────────────────────────
    const roles = ['admin', 'cooperativa', 'oficinista', 'personal_bus', 'cliente'];
    for (const r of roles) {
      await client.query(
        `INSERT INTO rol (nombre) VALUES ($1) ON CONFLICT DO NOTHING`,
        [r]
      );
    }
    console.log('✅ Roles insertados');
    
    // ─── Tipos de asiento ───────────────────────────────────────
    const tiposAsiento = ['Normal', 'VIP', 'Ejecutivo'];
    for (const t of tiposAsiento) {
      await client.query(
        `INSERT INTO tipo_asiento (nombre) VALUES ($1) ON CONFLICT DO NOTHING`,
        [t]
      );
    }
    console.log('✅ Tipos de asiento insertados');

    // ─── Tipos de descuento ─────────────────────────────────────
    const descuentos = [
      { nombre: 'Discapacidad', porcentaje: 50 },
      { nombre: 'Tercera Edad', porcentaje: 50 },
      { nombre: 'Menor', porcentaje: 25 },
    ];
    for (const d of descuentos) {
      await client.query(
        `INSERT INTO tipo_descuento (nombre, porcentaje) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [d.nombre, d.porcentaje]
      );
    }
    console.log('✅ Tipos de descuento insertados');

    // ─── Cooperativas ────────────────────────────────────────────
    const cooperativas = [
      { nombre: 'FlashTour', ruc: '1891234560001', telefono: '032-123456', email: 'info@tungurahua.com', direccion: 'Av. Los Shyris, Ambato' }
    ];
    for (const c of cooperativas) {
      await client.query(
        `INSERT INTO cooperativa (nombre, ruc, telefono, email, direccion, activa)
         VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT (ruc) DO NOTHING`,
        [c.nombre, c.ruc, c.telefono, c.email, c.direccion]
      );
    }
    console.log('✅ Cooperativas insertadas');

    // ─── Usuarios de ejemplo ─────────────────────────────────────
    const usuarios = [
      { rol_id: 1, cedula: '1234567890', nombres: 'Admin', apellidos: 'Sistema', email: 'admin@buses.com', password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' },
      { rol_id: 5, cedula: '0999999999', nombres: 'Cliente', apellidos: 'Prueba', email: 'cliente@test.com', password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' },
      { rol_id: 3, cedula: '1800000001', nombres: 'Oficinista', apellidos: 'Prueba', email: 'oficinista@test.com', password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' },
      { rol_id: 4, cedula: '1812345678', nombres: 'Chofer', apellidos: 'Bus', email: 'personal@bus.com', password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' },
    ];
    for (const u of usuarios) {
      await client.query(
        `INSERT INTO usuario (rol_id, cedula, nombres, apellidos, email, password_hash, activo)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         ON CONFLICT (email) DO NOTHING`,
        [u.rol_id, u.cedula, u.nombres, u.apellidos, u.email, u.password_hash]
      );
    }
    console.log('✅ Usuarios de ejemplo insertados');

// ─── Buses ───────────────────────────────────────────────────
const coopRes = await client.query(`SELECT id FROM cooperativa WHERE ruc = '1891234560001'`);
const cooperativaId = coopRes.rows[0].id;

const buses = [
  { numero_interno: 'BUS-001', placa: 'ABC1234', marca_chasis: 'Volvo', marca_carroceria: 'Zhong Tong', anio: 2020, capacidad: 50 },
  { numero_interno: 'BUS-002', placa: 'XYZ5678', marca_chasis: 'Mercedes', marca_carroceria: 'Busscar', anio: 2021, capacidad: 45 },
  { numero_interno: 'BUS-003', placa: 'DEF9012', marca_chasis: 'Scania', marca_carroceria: 'Marcopolo', anio: 2022, capacidad: 52 },
  { numero_interno: 'BUS-004', placa: 'GHI3456', marca_chasis: 'Volvo', marca_carroceria: 'Irizar', anio: 2023, capacidad: 48 },
  { numero_interno: 'BUS-005', placa: 'JKL7890', marca_chasis: 'Mercedes', marca_carroceria: 'Zhong Tong', anio: 2020, capacidad: 50 },
];

for (const bus of buses) {
  await client.query(
    `INSERT INTO bus (cooperativa_id, numero_interno, placa, marca_chasis, marca_carroceria, anio_fabricacion, capacidad_total, activo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true)
     ON CONFLICT (placa) DO NOTHING`,
    [cooperativaId, bus.numero_interno, bus.placa, bus.marca_chasis, bus.marca_carroceria, bus.anio, bus.capacidad]
  );
}
console.log('✅ Buses insertados');

// ─── Asientos para cada bus ──────────────────────────────────
const tiposAsientoDB = await client.query(`SELECT id FROM tipo_asiento`);
const tipoNormalId = tiposAsientoDB.rows[0]?.id;

const busesDB = await client.query(`SELECT id, capacidad_total FROM bus`);

for (const bus of busesDB.rows) {
  // Verificar si ya tiene asientos
  const asientosExistentes = await client.query(`SELECT COUNT(*) FROM asiento WHERE bus_id = $1`, [bus.id]);
  if (parseInt(asientosExistentes.rows[0].count) === 0) {
    for (let i = 1; i <= bus.capacidad_total; i++) {
      const piso = i <= 25 ? 1 : 2;
      await client.query(
        `INSERT INTO asiento (bus_id, numero, piso, disponible, tipo_asiento_id)
         VALUES ($1, $2, $3, true, $4)`,
        [bus.id, i, piso, tipoNormalId]
      );
    }
    console.log(`✅ Asientos creados para bus ${bus.id} (${bus.capacidad_total} asientos)`);
  }
}

    // ─── Obtener IDs de ciudades (UNA SOLA VEZ) ─────────────────
    const quitoRes = await client.query(`SELECT id FROM ciudad WHERE nombre = 'Quito'`);
    const ambatoRes = await client.query(`SELECT id FROM ciudad WHERE nombre = 'Ambato'`);
    const guayaquilRes = await client.query(`SELECT id FROM ciudad WHERE nombre = 'Guayaquil'`);
    const cuencaRes = await client.query(`SELECT id FROM ciudad WHERE nombre = 'Cuenca'`);

    const quitoId = quitoRes.rows[0].id;
    const ambatoId = ambatoRes.rows[0].id;
    const guayaquilId = guayaquilRes.rows[0].id;
    const cuencaId = cuencaRes.rows[0].id;

    // ─── Frecuencias (todas las rutas) ──────────────────────────
    const frecuencias = [
      // Quito ↔ Ambato
      { origen: quitoId, destino: ambatoId, hora: '08:00:00', duracion: '02:30:00', resolucion: 'RES-QUITO-AMBATO-1', precio: 12.50 },
      { origen: ambatoId, destino: quitoId, hora: '11:00:00', duracion: '02:20:00', resolucion: 'RES-AMBATO-QUITO-1', precio: 12.50 },
      
      // Quito ↔ Guayaquil
      { origen: quitoId, destino: guayaquilId, hora: '07:00:00', duracion: '08:00:00', resolucion: 'RES-QUITO-GUAYAQUIL-1', precio: 18.00 },
      { origen: quitoId, destino: guayaquilId, hora: '13:00:00', duracion: '08:00:00', resolucion: 'RES-QUITO-GUAYAQUIL-2', precio: 18.00 },
      { origen: quitoId, destino: guayaquilId, hora: '22:00:00', duracion: '08:00:00', resolucion: 'RES-QUITO-GUAYAQUIL-3', precio: 18.00 },
      { origen: guayaquilId, destino: quitoId, hora: '07:00:00', duracion: '08:00:00', resolucion: 'RES-GUAYAQUIL-QUITO-1', precio: 18.00 },
      { origen: guayaquilId, destino: quitoId, hora: '13:00:00', duracion: '08:00:00', resolucion: 'RES-GUAYAQUIL-QUITO-2', precio: 18.00 },
      { origen: guayaquilId, destino: quitoId, hora: '22:00:00', duracion: '08:00:00', resolucion: 'RES-GUAYAQUIL-QUITO-3', precio: 18.00 },
      
      // Quito ↔ Cuenca
      { origen: quitoId, destino: cuencaId, hora: '08:00:00', duracion: '10:00:00', resolucion: 'RES-QUITO-CUENCA-1', precio: 20.00 },
      { origen: quitoId, destino: cuencaId, hora: '15:00:00', duracion: '10:00:00', resolucion: 'RES-QUITO-CUENCA-2', precio: 20.00 },
      { origen: cuencaId, destino: quitoId, hora: '08:00:00', duracion: '10:00:00', resolucion: 'RES-CUENCA-QUITO-1', precio: 20.00 },
      { origen: cuencaId, destino: quitoId, hora: '15:00:00', duracion: '10:00:00', resolucion: 'RES-CUENCA-QUITO-2', precio: 20.00 },
      
      // Guayaquil ↔ Cuenca
      { origen: guayaquilId, destino: cuencaId, hora: '06:30:00', duracion: '04:00:00', resolucion: 'RES-GUAYAQUIL-CUENCA-1', precio: 12.00 },
      { origen: guayaquilId, destino: cuencaId, hora: '14:30:00', duracion: '04:00:00', resolucion: 'RES-GUAYAQUIL-CUENCA-2', precio: 12.00 },
      { origen: cuencaId, destino: guayaquilId, hora: '06:30:00', duracion: '04:00:00', resolucion: 'RES-CUENCA-GUAYAQUIL-1', precio: 12.00 },
      { origen: cuencaId, destino: guayaquilId, hora: '14:30:00', duracion: '04:00:00', resolucion: 'RES-CUENCA-GUAYAQUIL-2', precio: 12.00 },
    ];

for (const f of frecuencias) {
  const exists = await client.query(
    `SELECT id FROM frecuencia WHERE numero_resolucion = $1`,
    [f.resolucion]
  );
  if (exists.rows.length === 0) {
    await client.query(
      `INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, duracion_estimada, numero_resolucion, precio, activa, tipo_viaje)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, 'directo')`,
      [cooperativaId, f.origen, f.destino, f.hora, f.duracion, f.resolucion, f.precio]
    );
  }
}
    console.log('✅ Frecuencias insertadas');

// ─── Obtener IDs de frecuencias y TODOS los buses ─────────────────
const frecuenciasDB = await client.query(`SELECT id FROM frecuencia`);
const busesDBasignar = await client.query(`SELECT id FROM bus`);

// ─── Hojas de ruta para cada frecuencia usando diferentes buses ───
let busIndex = 0;
for (const freq of frecuenciasDB.rows) {
  // Rotar entre los buses disponibles
  const busId = busesDBasignar.rows[busIndex % busesDBasignar.rows.length].id;
  await client.query(
    `INSERT INTO hoja_ruta (cooperativa_id, frecuencia_id, bus_id, fecha_inicio, fecha_fin, generacion, activa)
     VALUES ($1, $2, $3, '2026-05-01', '2026-12-31', 'manual', true)
     ON CONFLICT DO NOTHING`,
    [cooperativaId, freq.id, busId]
  );
  busIndex++;
}
console.log('✅ Hojas de ruta insertadas con diferentes buses');

    // ─── Rutas diarias para los próximos 10 días ─────────────────
    const hojasRuta = await client.query(`SELECT id, frecuencia_id FROM hoja_ruta`);
    
    for (const hoja of hojasRuta.rows) {
      for (let i = 0; i < 10; i++) {
        const fecha = new Date('2026-05-20');
        fecha.setDate(fecha.getDate() + i);
        const fechaStr = fecha.toISOString().slice(0, 10);
        await client.query(
          `INSERT INTO ruta (frecuencia_id, hoja_ruta_id, fecha_ruta, estado)
           SELECT $1, $2, $3, 'programada'
           WHERE NOT EXISTS (
             SELECT 1 FROM ruta WHERE frecuencia_id = $1 AND hoja_ruta_id = $2 AND fecha_ruta = $3
           )`,
          [hoja.frecuencia_id, hoja.id, fechaStr]
        );
      }
    }
    console.log('✅ Rutas diarias insertadas');

    await client.query('COMMIT');
    console.log('\n🚌 Seed completado exitosamente');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error en seed:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

seed();