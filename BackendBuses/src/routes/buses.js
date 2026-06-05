const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

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
  const { placa, numero_interno, capacidad_total, marca_chasis, cooperativa_id } = req.body;
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

// GET /api/buses/:id/asientos - Obtener asientos de un bus
router.get('/:id/asientos', async (req, res) => {
  const { id } = req.params;
  try {
    const busResult = await pool.query(
      `SELECT hr.bus_id, f.precio FROM ruta r
       JOIN hoja_ruta hr ON r.hoja_ruta_id = hr.id
       JOIN frecuencia f ON r.frecuencia_id = f.id
       WHERE r.id = $1 LIMIT 1`,
      [id]
    );
    if (busResult.rows.length === 0) return res.json([]);
    
    const { bus_id, precio } = busResult.rows[0];
    const result = await pool.query(
      `SELECT a.*, ta.nombre as tipo, $2::numeric as precio FROM asiento a
       LEFT JOIN tipo_asiento ta ON a.tipo_asiento_id = ta.id
       WHERE a.bus_id = $1 ORDER BY a.piso, a.numero`,
      [bus_id, precio]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener asientos' });
  }
});

module.exports = router;