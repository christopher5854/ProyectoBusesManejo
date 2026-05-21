const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/:id/asientos', async (req, res) => {
  const { id } = req.params;
  try {
    const busResult = await pool.query(
      `SELECT hr.bus_id, f.precio FROM hoja_ruta hr 
       JOIN frecuencia f ON hr.frecuencia_id = f.id
       WHERE hr.frecuencia_id = $1 AND hr.activa = true LIMIT 1`,
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