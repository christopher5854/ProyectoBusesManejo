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

// Función auxiliar para generar rutas diarias (instancias)
async function generarRutasDiarias(hojaId, fechaInicio, fechaFin) {
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const fecha = d.toISOString().slice(0, 10);
    await pool.query(
      `INSERT INTO ruta (hoja_ruta_id, frecuencia_id, fecha_ruta, estado)
       SELECT $1, frecuencia_id, $2, 'activo'
       FROM hoja_ruta WHERE id = $1`,
      [hojaId, fecha]
    );
  }
}

// Crear hoja de ruta manual
const crearHojaManual = async (req, res) => {
  const { cooperativa_id, frecuencia_id, bus_id, fecha_inicio, fecha_fin } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO hoja_ruta (cooperativa_id, frecuencia_id, bus_id, fecha_inicio, fecha_fin, generacion, activa)
       VALUES ($1, $2, $3, $4, $5, 'manual', true) RETURNING *`,
      [cooperativa_id, frecuencia_id, bus_id, fecha_inicio, fecha_fin]
    );
    // Generar las rutas diarias para el rango de fechas
    await generarRutasDiarias(result.rows[0].id, fecha_inicio, fecha_fin);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear hoja de ruta manual' });
  }
};