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

// Crear una nueva ciudad
const crearCiudad = async (req, res) => {
  const { nombre, provincia } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
  try {
    const result = await pool.query(
      'INSERT INTO ciudad (nombre, provincia) VALUES ($1, $2) RETURNING *',
      [nombre, provincia || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'La ciudad ya existe' });
    console.error(err);
    res.status(500).json({ error: 'Error al crear ciudad' });
  }
};

// Actualizar una ciudad
const actualizarCiudad = async (req, res) => {
  const { id } = req.params;
  const { nombre, provincia } = req.body;
  try {
    const result = await pool.query(
      'UPDATE ciudad SET nombre = COALESCE($1, nombre), provincia = COALESCE($2, provincia) WHERE id = $3 RETURNING *',
      [nombre, provincia, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'El nombre ya existe' });
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar ciudad' });
  }
};