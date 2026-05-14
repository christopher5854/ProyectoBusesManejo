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
