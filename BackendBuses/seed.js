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
