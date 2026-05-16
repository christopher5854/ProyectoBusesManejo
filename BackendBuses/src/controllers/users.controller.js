const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

// GET /api/usuarios — listar todos (con filtro opcional por rol)
const getUsuarios = async (req, res) => {
  try {
    const { rol } = req.query; // ?rol=admin

    let query = `
      SELECT 
        u.id,
        u.cedula,
        u.nombres,
        u.apellidos,
        u.email,
        u.activo,
        u.cooperativa_id,
        r.nombre AS rol
      FROM usuario u
      INNER JOIN rol r ON u.rol_id = r.id
    `;

    const params = [];

    if (rol) {
      query += ` WHERE r.nombre = $1`;
      params.push(rol);
    }

    query += ` ORDER BY u.id ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET /api/usuarios/:id — obtener uno por ID
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.cedula, u.nombres, u.apellidos, u.email,
              u.activo, u.cooperativa_id, r.nombre AS rol
       FROM usuario u
       INNER JOIN rol r ON u.rol_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/usuarios — crear usuario
const createUsuario = async (req, res) => {
  try {
    const { cedula, nombres, apellidos, email, password, rol_id, cooperativa_id } = req.body;

    if (!cedula || !nombres || !apellidos || !email || !password || !rol_id) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar email único
    const existe = await pool.query('SELECT id FROM usuario WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    // Verificar cédula única
    const cedulaExiste = await pool.query('SELECT id FROM usuario WHERE cedula = $1', [cedula]);
    if (cedulaExiste.rows.length > 0) {
      return res.status(409).json({ message: 'La cédula ya está registrada' });
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuario (cedula, nombres, apellidos, email, password_hash, rol_id, cooperativa_id, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING id, cedula, nombres, apellidos, email, activo, rol_id, cooperativa_id`,
      [cedula, nombres, apellidos, email, password_hash, rol_id, cooperativa_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/usuarios/:id — actualizar usuario
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres, apellidos, email, rol_id, cooperativa_id, activo } = req.body;

    const result = await pool.query(
      `UPDATE usuario
       SET nombres = COALESCE($1, nombres),
           apellidos = COALESCE($2, apellidos),
           email = COALESCE($3, email),
           rol_id = COALESCE($4, rol_id),
           cooperativa_id = COALESCE($5, cooperativa_id),
           activo = COALESCE($6, activo)
       WHERE id = $7
       RETURNING id, nombres, apellidos, email, activo, rol_id, cooperativa_id`,
      [nombres, apellidos, email, rol_id, cooperativa_id, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/usuarios/:id — desactivar usuario (soft delete)
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE usuario SET activo = false WHERE id = $1
       RETURNING id, nombres, apellidos, activo`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario desactivado correctamente', usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };