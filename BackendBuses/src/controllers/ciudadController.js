const { pool } = require('../config/db');

// Obtener todas las ciudades
const listarCiudades = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ciudad ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar ciudades' });
  }
};

// Obtener una ciudad por ID
const obtenerCiudad = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM ciudad WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ciudad' });
  }
};