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

// Crear una nueva frecuencia
const crearFrecuencia = async (req, res) => {
  const { cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, duracion_estimada, numero_resolucion, precio, tipo_viaje } = req.body;
  if (!cooperativa_id || !ciudad_origen_id || !ciudad_destino_id || !hora_salida || !numero_resolucion || !precio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, duracion_estimada, numero_resolucion, precio, tipo_viaje, activa)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true) RETURNING *`,
      [cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, duracion_estimada, numero_resolucion, precio, tipo_viaje || 'Directo']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear frecuencia' });
  }
};

// Actualizar una frecuencia (activa/desactiva u otros campos)
const actualizarFrecuencia = async (req, res) => {
  const { id } = req.params;
  const { activa, hora_salida, precio } = req.body;
  try {
    const result = await pool.query(
      `UPDATE frecuencia SET activa = COALESCE($1, activa), hora_salida = COALESCE($2, hora_salida), precio = COALESCE($3, precio)
       WHERE id = $4 RETURNING *`,
      [activa, hora_salida, precio, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Frecuencia no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar frecuencia' });
  }
};
