const { pool } = require('../config/db');

// GET /api/tipo-descuento - Listar todos los descuentos
const getDescuentos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipo_descuento ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tipo-descuento/:id - Obtener un descuento por ID
const getDescuentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tipo_descuento WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tipo de descuento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tipo-descuento - Crear un nuevo descuento
const createDescuento = async (req, res) => {
  try {
    const { nombre, descripcion, porcentaje, activo } = req.body;
    
    if (!nombre || porcentaje === undefined) {
      return res.status(400).json({ message: 'Nombre y porcentaje son requeridos' });
    }
    
    const result = await pool.query(
      'INSERT INTO tipo_descuento (nombre, descripcion, porcentaje, activo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion || null, porcentaje, activo !== undefined ? activo : true]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/tipo-descuento/:id - Actualizar un descuento
const updateDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, porcentaje, activo } = req.body;
    
    const result = await pool.query(
      'UPDATE tipo_descuento SET nombre = COALESCE($1, nombre), descripcion = COALESCE($2, descripcion), porcentaje = COALESCE($3, porcentaje), activo = COALESCE($4, activo) WHERE id = $5 RETURNING *',
      [nombre, descripcion, porcentaje, activo, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tipo de descuento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tipo-descuento/:id - Eliminar un descuento
const deleteDescuento = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tipo_descuento WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tipo de descuento no encontrado' });
    }
    res.json({ message: 'Tipo de descuento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDescuentos,
  getDescuentoById,
  createDescuento,
  updateDescuento,
  deleteDescuento
};