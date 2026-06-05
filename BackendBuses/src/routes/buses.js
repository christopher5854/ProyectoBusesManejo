const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

const MAX_ASIENTOS = 100;

// GET /api/buses - Listar todos los buses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, c.nombre as cooperativa_nombre 
       FROM bus b
       LEFT JOIN cooperativa c ON b.cooperativa_id = c.id
       ORDER BY b.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener buses' });
  }
});

// POST /api/buses - Crear un nuevo bus
router.post('/', async (req, res) => {
  let { placa, numero_interno, capacidad_total, marca_chasis, cooperativa_id } = req.body;

  // Limitar capacidad máxima a 100
  if (capacidad_total && parseInt(capacidad_total) > MAX_ASIENTOS) {
    capacidad_total = MAX_ASIENTOS;
  }

  try {
    const result = await pool.query(
      `INSERT INTO bus (placa, numero_interno, capacidad_total, marca_chasis, cooperativa_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [placa, numero_interno, capacidad_total, marca_chasis, cooperativa_id || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear bus' });
  }
});

// GET /api/buses/:id/asientos - Obtener asientos de un bus para una ruta específica
// El :id es el ruta_id (no bus_id)
router.get('/:id/asientos', async (req, res) => {
  const { id } = req.params; // id = ruta_id
  try {
    // 1. Obtener bus_id y precio de la ruta
    const busResult = await pool.query(
      `SELECT hr.bus_id, f.precio FROM ruta r
       JOIN hoja_ruta hr ON r.hoja_ruta_id = hr.id
       JOIN frecuencia f ON r.frecuencia_id = f.id
       WHERE r.id = $1 LIMIT 1`,
      [id]
    );
    if (busResult.rows.length === 0) return res.json([]);

    const { bus_id, precio } = busResult.rows[0];

    // 2. Obtener IDs de asientos vendidos/reservados para ESTA ruta específica
    const vendidosResult = await pool.query(
      `SELECT asiento_id FROM boleto 
       WHERE ruta_id = $1 
       AND estado_pago IN ('pendiente', 'pagado', 'validado')`,
      [id]
    );
    const asientosVendidosIds = new Set(vendidosResult.rows.map(r => r.asiento_id));

    // 3. Obtener asientos del bus, limitados a 100
    const result = await pool.query(
      `SELECT a.id, a.numero, a.piso, a.disponible, ta.nombre as tipo, $2::numeric as precio
       FROM asiento a
       LEFT JOIN tipo_asiento ta ON a.tipo_asiento_id = ta.id
       WHERE a.bus_id = $1 
       ORDER BY a.piso, a.numero
       LIMIT $3`,
      [bus_id, precio, MAX_ASIENTOS]
    );

    // 4. Marcar el estado real combinando: disponible en DB + vendido en esta ruta
    const asientosConEstado = result.rows.map(a => ({
      ...a,
      estado: asientosVendidosIds.has(a.id) ? 'ocupado' : (a.disponible ? 'disponible' : 'ocupado')
    }));

    res.json(asientosConEstado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener asientos' });
  }
});

module.exports = router;  