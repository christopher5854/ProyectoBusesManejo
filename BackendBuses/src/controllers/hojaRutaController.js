const { pool } = require('../config/db');

const getHojaRuta = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, 
              ci.nombre as origen, 
              cd.nombre as destino,
              r.fecha_ruta as fecha,
              b.placa as bus,
              r.estado
       FROM ruta r
       JOIN frecuencia f ON r.frecuencia_id = f.id
       JOIN ciudad ci ON f.ciudad_origen_id = ci.id
       JOIN ciudad cd ON f.ciudad_destino_id = cd.id
       JOIN bus b ON r.bus_id = b.id
       ORDER BY r.fecha_ruta DESC
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHojaRuta };