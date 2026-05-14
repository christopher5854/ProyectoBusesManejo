const { pool } = require('../config/db');

const listarParadas = async (req, res) => {
  const { frecuenciaId } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, c.nombre as ciudad
       FROM parada_frecuencia p
       JOIN ciudad c ON p.ciudad_id = c.id
       WHERE p.frecuencia_id = $1
       ORDER BY p.orden`,
      [frecuenciaId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar paradas' });
  }
};

const agregarParada = async (req, res) => {
  const { frecuenciaId } = req.params;
  const { ciudad_id, orden, tiempo_adicional, precio } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO parada_frecuencia (frecuencia_id, ciudad_id, orden, tiempo_adicional, precio)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [frecuenciaId, ciudad_id, orden, tiempo_adicional, precio || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar parada' });
  }
};
