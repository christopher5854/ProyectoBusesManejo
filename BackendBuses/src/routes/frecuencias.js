const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { buscarFrecuencias } = require('../controllers/frecuenciaController');

// GET /api/frecuencias - Listar todas las frecuencias
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.id, f.hora_salida, f.precio, f.tipo_viaje,
              c1.nombre as origen, c2.nombre as destino
       FROM frecuencia f
       JOIN ciudad c1 ON f.ciudad_origen_id = c1.id
       JOIN ciudad c2 ON f.ciudad_destino_id = c2.id
       WHERE f.activa = true
       ORDER BY f.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener frecuencias' });
  }
});

// POST /api/frecuencias - Crear nueva frecuencia
router.post('/', async (req, res) => {
  const { origen, destino, hora_salida, precio, tipo_viaje } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, precio, tipo_viaje, activa)
       VALUES (1, (SELECT id FROM ciudad WHERE nombre = $1), (SELECT id FROM ciudad WHERE nombre = $2), $3, $4, $5, true)
       RETURNING *`,
      [origen, destino, hora_salida, precio, tipo_viaje || 'ordinario']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear frecuencia' });
  }
});

// GET /api/frecuencias/buscar - Buscar frecuencias por origen, destino y fecha
router.get('/buscar', buscarFrecuencias);

module.exports = router;