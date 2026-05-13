const router = require('express').Router();
const { pool } = require('../config/db');

// GET todas las ciudades
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ciudad ORDER BY nombre'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ciudad por id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ciudad WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST nueva ciudad
router.post('/', async (req, res) => {
  const { nombre, provincia } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ciudad (nombre, provincia) VALUES ($1, $2) RETURNING *',
      [nombre, provincia]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;