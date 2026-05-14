const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginQuery } = require('../queries/auth.queries');

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validar que lleguen los datos
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET no configurado en el servidor' });
  }

  try {
    // 1. Buscar usuario en BD
    const result = await loginQuery(email);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const usuario = result.rows[0];

    // 2. Verificar si está activo
    if (!usuario.activo) {
      return res.status(403).json({ message: 'Usuario inactivo, contacta al administrador' });
    }

    // 3. Comparar contraseña con hash
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValido) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // 4. Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol_nombre,
        cooperativa_id: usuario.cooperativa_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 5. Responder con token y datos del usuario
    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol_nombre,
        cooperativa_id: usuario.cooperativa_id,
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login };