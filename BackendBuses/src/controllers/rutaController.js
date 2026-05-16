const { pool } = require('../config/db');

// Listar rutas (con filtros)
const listarRutas = async (req, res) => {
  const { fecha, cooperativa_id } = req.query;
  let query = `
    SELECT r.id, r.fecha_ruta, r.estado, r.observacion,
           b.placa, b.capacidad_total,
           f.origen, f.destino,
           hr.cooperativa_id,
           COUNT(bo.id) as asientos_ocupados
    FROM ruta r
    JOIN hoja_ruta hr ON r.hoja_ruta_id = hr.id
    JOIN bus b ON hr.bus_id = b.id
    JOIN (
      SELECT f.id, c1.nombre as origen, c2.nombre as destino
      FROM frecuencia f
      JOIN ciudad c1 ON f.ciudad_origen_id = c1.id
      JOIN ciudad c2 ON f.ciudad_destino_id = c2.id
    ) f ON r.frecuencia_id = f.id
    LEFT JOIN boleto bo ON bo.ruta_id = r.id AND bo.estado_boleto != 'cancelado'
    WHERE 1=1
  `;
  const values = [];
  if (fecha) {
    values.push(fecha);
    query += ` AND r.fecha_ruta = $${values.length}`;
  }
  if (cooperativa_id) {
    values.push(cooperativa_id);
    query += ` AND hr.cooperativa_id = $${values.length}`;
  }
  query += ` GROUP BY r.id, b.placa, b.capacidad_total, f.origen, f.destino, hr.cooperativa_id`;
  try {
    const result = await pool.query(query, values);
    const rutas = result.rows.map(r => ({
      ...r,
      asientos_disponibles: r.capacidad_total - parseInt(r.asientos_ocupados)
    }));
    res.json(rutas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar rutas' });
  }
};

// Detalle de una ruta (incluye disponibilidad)
const detalleRuta = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT r.*, b.capacidad_total, hr.bus_id
      FROM ruta r
      JOIN hoja_ruta hr ON r.hoja_ruta_id = hr.id
      JOIN bus b ON hr.bus_id = b.id
      WHERE r.id = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ruta no encontrada' });
    const ruta = result.rows[0];
    const ocupados = await pool.query(`SELECT COUNT(*) FROM boleto WHERE ruta_id = $1 AND estado_boleto != 'cancelado'`, [id]);
    ruta.asientos_ocupados = parseInt(ocupados.rows[0].count);
    ruta.asientos_disponibles = ruta.capacidad_total - ruta.asientos_ocupados;
    res.json(ruta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener detalle de ruta' });
  }
};

// Actualizar estado de una ruta (programada, en_curso, completada, cancelada)
const actualizarEstadoRuta = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!['programada', 'en_curso', 'completada', 'cancelada'].includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido. Use: programada, en_curso, completada, cancelada' });
  }
  try {
    const result = await pool.query(
      `UPDATE ruta SET estado = $1 WHERE id = $2 RETURNING *`,
      [estado, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ruta no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

module.exports = {
  listarRutas,
  detalleRuta,
  actualizarEstadoRuta
};