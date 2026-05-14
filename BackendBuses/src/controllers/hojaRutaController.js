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

// Generación automática (round-robin con días de parada)
const generarAutomatico = async (req, res) => {
  const { cooperativa_id, fecha_inicio, fecha_fin } = req.body;
  try {
    // Obtener frecuencias activas
    const frecuencias = await pool.query(
      `SELECT id FROM frecuencia WHERE cooperativa_id = $1 AND activa = true`,
      [cooperativa_id]
    );
    // Obtener buses activos
    const buses = await pool.query(
      `SELECT id FROM bus WHERE cooperativa_id = $1 AND activo = true`,
      [cooperativa_id]
    );
    if (frecuencias.rows.length === 0 || buses.rows.length === 0) {
      return res.status(400).json({ error: 'No hay frecuencias o buses activos para esta cooperativa' });
    }

    const hojas = [];
    // Distribución round-robin
    for (let i = 0; i < frecuencias.rows.length; i++) {
      const bus = buses.rows[i % buses.rows.length];
      const result = await pool.query(
        `INSERT INTO hoja_ruta (cooperativa_id, frecuencia_id, bus_id, fecha_inicio, fecha_fin, generacion, activa)
         VALUES ($1, $2, $3, $4, $5, 'automatica', true) RETURNING *`,
        [cooperativa_id, frecuencias.rows[i].id, bus.id, fecha_inicio, fecha_fin]
      );
      await generarRutasDiarias(result.rows[0].id, fecha_inicio, fecha_fin);
      hojas.push(result.rows[0]);
    }
    // Días de parada: si hay más buses que frecuencias, los sobrantes se quedan sin asignación
    const sobrantes = buses.rows.length - frecuencias.rows.length;
    if (sobrantes > 0) {
      console.log(`⚠️ ${sobrantes} buses en días de parada (sin hoja de ruta)`);
    }
    res.json({ message: `Generadas ${hojas.length} hojas de ruta`, hojas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en generación automática' });
  }
};

module.exports = {
  listarHojas,
  crearHojaManual,
  generarAutomatico
};