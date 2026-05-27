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

    // ─── Buses ───────────────────────────────────────────────────
    // Obtener el id de la cooperativa recién insertada (o existente)
    const coopRes = await client.query(`SELECT id FROM cooperativa WHERE ruc = '1891234560001'`);
    const cooperativaId = coopRes.rows[0].id;
    await client.query(
      `INSERT INTO bus (cooperativa_id, numero_interno, placa, marca_chasis, marca_carroceria, anio_fabricacion, capacidad_total, activo)
       VALUES ($1, 'BUS-001', 'ABC1234', 'Volvo', 'Zhong Tong', 2020, 50, true)
       ON CONFLICT (placa) DO NOTHING`,
      [cooperativaId]
    );
    console.log('✅ Buses insertados');

    // ─── Frecuencia Quito → Ambato ───────────────────────────────
    // Obtener IDs de ciudades (suponiendo que ya fueron insertadas)
    const quitoRes = await client.query(`SELECT id FROM ciudad WHERE nombre = 'Quito'`);
    const ambatoRes = await client.query(`SELECT id FROM ciudad WHERE nombre = 'Ambato'`);
    const quitoId = quitoRes.rows[0].id;
    const ambatoId = ambatoRes.rows[0].id;

    await client.query(
      `INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, duracion_estimada, numero_resolucion, precio, activa, tipo_viaje)
       VALUES ($1, $2, $3, '08:00:00', '02:30:00', 'RES-QUITO-AMBATO', 12.50, true, 'directo')
       ON CONFLICT (id) DO NOTHING`,
      [cooperativaId, quitoId, ambatoId]
    );
    console.log('✅ Frecuencia Quito → Ambato insertada');

    // ─── Hoja de ruta para esa frecuencia ────────────────────────
    const freqRes = await client.query(`SELECT id FROM frecuencia WHERE ciudad_origen_id = $1 AND ciudad_destino_id = $2`, [quitoId, ambatoId]);
    const frecuenciaId = freqRes.rows[0].id;
    const busRes = await client.query(`SELECT id FROM bus WHERE placa = 'ABC1234'`);
    const busId = busRes.rows[0].id;

    await client.query(
      `INSERT INTO hoja_ruta (cooperativa_id, frecuencia_id, bus_id, fecha_inicio, fecha_fin, tipo, activa)
       VALUES ($1, $2, $3, '2026-05-01', '2026-12-31', 'manual', true)
       ON CONFLICT DO NOTHING`,
      [cooperativaId, frecuenciaId, busId]
    );
    console.log('✅ Hoja de ruta insertada');

    // ─── Rutas diarias para varios días (ejemplo) ───────────────
    const hojaRes = await client.query(`SELECT id FROM hoja_ruta WHERE frecuencia_id = $1`, [frecuenciaId]);
    const hojaRutaId = hojaRes.rows[0].id;
    // Insertar rutas para los próximos 10 días desde 2026-05-20
    for (let i = 0; i < 10; i++) {
      const fecha = new Date('2026-05-20');
      fecha.setDate(fecha.getDate() + i);
      const fechaStr = fecha.toISOString().slice(0, 10);
      await client.query(
        `INSERT INTO ruta (frecuencia_id, bus_id, fecha_ruta, estado)
         VALUES ($1, $2, $3, 'programada')
         ON CONFLICT DO NOTHING`,
        [frecuenciaId, busId, fechaStr]
      );
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
