const router = require('express').Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombres, apellidos, email, activo FROM usuario'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;