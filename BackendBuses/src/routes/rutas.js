const router = require('express').Router();
const { pool } = require('../config/db');

// GET /api/rutas
router.get('/', async (req, res) => {
  try {
    // Consulta alternativa sin usar la vista que no existe
    const result = await pool.query(`
      SELECT 
        r.id,
        ci.nombre as origen,
        cd.nombre as destino,
        fr.hora_salida,
        r.fecha_ruta,
        r.estado
      FROM ruta r
      JOIN frecuencia fr ON r.frecuencia_id = fr.id
      JOIN ciudad ci ON fr.ciudad_origen_id = ci.id
      JOIN ciudad cd ON fr.ciudad_destino_id = cd.id
      WHERE r.estado = 'programada'
      LIMIT 10
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/rutas/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        r.id,
        ci.nombre as origen,
        cd.nombre as destino,
        fr.hora_salida,
        r.fecha_ruta,
        r.estado
      FROM ruta r
      JOIN frecuencia fr ON r.frecuencia_id = fr.id
      JOIN ciudad ci ON fr.ciudad_origen_id = ci.id
      JOIN ciudad cd ON fr.ciudad_destino_id = cd.id
      WHERE r.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener ruta:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;