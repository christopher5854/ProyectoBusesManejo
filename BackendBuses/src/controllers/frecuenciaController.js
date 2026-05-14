const { pool } = require('../config/db');

// Obtener todas las frecuencias (con filtros opcionales)
const listarFrecuencias = async (req, res) => {
  const { cooperativa_id, activa } = req.query;
  let query = `
    SELECT f.*, 
           c1.nombre as origen, 
           c2.nombre as destino,
           co.nombre as cooperativa
    FROM frecuencia f
    JOIN ciudad c1 ON f.ciudad_origen_id = c1.id
    JOIN ciudad c2 ON f.ciudad_destino_id = c2.id
    JOIN cooperativa co ON f.cooperativa_id = co.id
    WHERE 1=1
  `;
  const values = [];
  if (cooperativa_id) {
    values.push(cooperativa_id);
    query += ` AND f.cooperativa_id = $${values.length}`;
  }
  if (activa !== undefined) {
    values.push(activa === 'true');
    query += ` AND f.activa = $${values.length}`;
  }
  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar frecuencias' });
  }
};