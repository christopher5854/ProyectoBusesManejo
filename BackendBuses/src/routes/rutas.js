const router = require('express').Router();
const { pool } = require('../config/db');

// GET /api/rutas
router.get('/', async (req, res) => {
  try {
    // Permite listar rutas generales
    const result = await pool.query(`
      SELECT 
        r.id,
        ci.nombre as origen,
        cd.nombre as destino,
        fr.hora_salida,
        r.fecha_ruta,
        r.estado
      FROM ruta r
      JOIN frecuencia fr ON r.frecuencia_id = fr.id
      JOIN ciudad ci ON fr.ciudad_origen_id = ci.id
      JOIN ciudad cd ON fr.ciudad_destino_id = cd.id
      WHERE r.estado = 'programada'
      LIMIT 10
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/rutas/buscar
router.get('/buscar', async (req, res) => {
  const { origen, destino, fecha } = req.query;
  if (!origen || !destino || !fecha) {
    return res.status(400).json({ message: 'Faltan parámetros de búsqueda: origen, destino, fecha' });
  }

  const queryHojaRuta = `
      SELECT
        r.id,
        ci.nombre as origen,
        cd.nombre as destino,
        fr.ciudad_origen_id,
        fr.ciudad_destino_id,
        fr.hora_salida,
        fr.precio,
        r.fecha_ruta,
        r.estado,
        b.placa,
        b.capacidad_total,
        co.nombre as cooperativa,
        COUNT(bo.id) as asientos_ocupados
      FROM ruta r
      JOIN hoja_ruta hr ON r.hoja_ruta_id = hr.id
      JOIN bus b ON hr.bus_id = b.id
      JOIN frecuencia fr ON r.frecuencia_id = fr.id
      JOIN ciudad ci ON fr.ciudad_origen_id = ci.id
      JOIN ciudad cd ON fr.ciudad_destino_id = cd.id
      JOIN cooperativa co ON hr.cooperativa_id = co.id
      LEFT JOIN boleto bo ON bo.ruta_id = r.id AND bo.estado_boleto != 'cancelado'
      WHERE ci.nombre = $1
        AND cd.nombre = $2
        AND r.fecha_ruta = $3
        AND r.estado = 'programada'
      GROUP BY r.id, ci.nombre, cd.nombre, fr.ciudad_origen_id, fr.ciudad_destino_id, fr.hora_salida, fr.precio, r.fecha_ruta, r.estado, b.placa, b.capacidad_total, co.nombre
      ORDER BY fr.hora_salida
    `;

  const queryBusDirecto = `
      SELECT
        r.id,
        ci.nombre as origen,
        cd.nombre as destino,
        fr.ciudad_origen_id,
        fr.ciudad_destino_id,
        fr.hora_salida,
        fr.precio,
        r.fecha_ruta,
        r.estado,
        b.placa,
        b.capacidad_total,
        co.nombre as cooperativa,
        COUNT(bo.id) as asientos_ocupados
      FROM ruta r
      JOIN bus b ON r.bus_id = b.id
      JOIN cooperativa co ON b.cooperativa_id = co.id
      JOIN frecuencia fr ON r.frecuencia_id = fr.id
      JOIN ciudad ci ON fr.ciudad_origen_id = ci.id
      JOIN ciudad cd ON fr.ciudad_destino_id = cd.id
      LEFT JOIN boleto bo ON bo.ruta_id = r.id AND bo.estado_boleto != 'cancelado'
      WHERE ci.nombre = $1
        AND cd.nombre = $2
        AND r.fecha_ruta = $3
        AND r.estado = 'programada'
      GROUP BY r.id, ci.nombre, cd.nombre, fr.ciudad_origen_id, fr.ciudad_destino_id, fr.hora_salida, fr.precio, r.fecha_ruta, r.estado, b.placa, b.capacidad_total, co.nombre
      ORDER BY fr.hora_salida
    `;

  try {
    const result = await pool.query(queryHojaRuta, [origen, destino, fecha]);
    const rutas = result.rows.map((r) => ({
      ...r,
      asientos_disponibles: r.capacidad_total - parseInt(r.asientos_ocupados || 0, 10),
    }));
    return res.json(rutas);
  } catch (error) {
    const fallback = /hoja_ruta_id|relation \"hoja_ruta\" does not exist|column \"hoja_ruta_id\" does not exist/i.test(error.message);
    if (!fallback) {
      console.error('Error al buscar rutas:', error);
      return res.status(500).json({ message: error.message });
    }

    try {
      const result = await pool.query(queryBusDirecto, [origen, destino, fecha]);
      const rutas = result.rows.map((r) => ({
        ...r,
        asientos_disponibles: r.capacidad_total - parseInt(r.asientos_ocupados || 0, 10),
      }));
      return res.json(rutas);
    } catch (fallbackError) {
      console.error('Error al buscar rutas con esquema alternativo:', fallbackError);
      return res.status(500).json({ message: fallbackError.message });
    }
  }
});

// GET /api/rutas/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        r.id,
        ci.nombre as origen,
        cd.nombre as destino,
        fr.hora_salida,
        r.fecha_ruta,
        r.estado
      FROM ruta r
      JOIN frecuencia fr ON r.frecuencia_id = fr.id
      JOIN ciudad ci ON fr.ciudad_origen_id = ci.id
      JOIN ciudad cd ON fr.ciudad_destino_id = cd.id
      WHERE r.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener ruta:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;