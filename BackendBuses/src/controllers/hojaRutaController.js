const { pool } = require('../config/db');

// Listar hojas de ruta
const listarHojas = async (req, res) => {
  const { cooperativa_id } = req.query;
  let query = `
    SELECT hr.*, f.hora_salida, b.placa, co.nombre as cooperativa
    FROM hoja_ruta hr
    JOIN frecuencia f ON hr.frecuencia_id = f.id
    JOIN bus b ON hr.bus_id = b.id
    JOIN cooperativa co ON hr.cooperativa_id = co.id
  `;
  const values = [];
  if (cooperativa_id) {
    values.push(cooperativa_id);
    query += ` WHERE hr.cooperativa_id = $1`;
  }
  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar hojas de ruta' });
  }
};