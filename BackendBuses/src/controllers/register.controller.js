const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const { sendEmail, templates } = require('../services/emailService');

// Almacenamiento en memoria para códigos de verificación
// Formato: { email: { code, expiresAt, datos } }
const verificationCodes = new Map();

// Limpiar códigos expirados cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (now > data.expiresAt) {
      verificationCodes.delete(email);
    }
  }
}, 5 * 60 * 1000);

/**
 * Genera un código numérico de 6 dígitos
 */
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Valida el formato de email
 */
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida cédula ecuatoriana (10 dígitos)
 */
const isValidCedula = (cedula) => {
  return /^\d{10}$/.test(cedula);
};

/**
 * POST /api/register/send-code
 * Envía un código de verificación al email proporcionado
 */
const sendVerificationCode = async (req, res) => {
  try {
    const { email, cedula, nombres, apellidos, password } = req.body;

    // Validar campos requeridos
    if (!email || !cedula || !nombres || !apellidos || !password) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos: email, cedula, nombres, apellidos, password'
      });
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'El formato del correo electrónico no es válido' });
    }

    // Validar cédula
    if (!isValidCedula(cedula)) {
      return res.status(400).json({ message: 'La cédula debe tener 10 dígitos numéricos' });
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar que el email no esté ya registrado
    const emailExiste = await pool.query('SELECT id FROM usuario WHERE email = $1', [email]);
    if (emailExiste.rows.length > 0) {
      return res.status(409).json({ message: 'Este correo electrónico ya está registrado' });
    }

    // Verificar que la cédula no esté ya registrada
    const cedulaExiste = await pool.query('SELECT id FROM usuario WHERE cedula = $1', [cedula]);
    if (cedulaExiste.rows.length > 0) {
      return res.status(409).json({ message: 'Esta cédula ya está registrada' });
    }

    // Generar código de verificación
    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

    // Almacenar código y datos del usuario
    verificationCodes.set(email, {
      code,
      expiresAt,
      datos: { cedula, nombres, apellidos, email, password }
    });

    console.log('\n======================================================');
    console.log(`CÓDIGO DE VERIFICACIÓN PARA ${email}: ${code}`);
    console.log('======================================================\n');

    // Enviar correo con el código
    await sendEmail({
      to: email,
      subject: 'Código de verificación — Flota Pelileo',
      html: templates.codigoVerificacion(code)
    });

    return res.status(200).json({
      message: 'Código de verificación enviado correctamente. Revisa tu correo electrónico.'
    });

  } catch (error) {
    console.error('Error al enviar código de verificación:', error);

    // Si el error es de SMTP, dar mensaje más claro
    if (error.code === 'EAUTH' || error.code === 'ESOCKET' || error.code === 'ECONNREFUSED') {
      return res.status(500).json({
        message: 'No se pudo enviar el correo. Verifica la configuración SMTP del servidor.'
      });
    }

    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * POST /api/register/verify
 * Verifica el código y completa el registro del usuario
 */
const verifyCodeAndRegister = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email y código de verificación son requeridos' });
    }

    // Buscar el código almacenado
    const stored = verificationCodes.get(email);

    if (!stored) {
      return res.status(400).json({
        message: 'No se encontró un código de verificación para este correo. Solicita uno nuevo.'
      });
    }

    // Verificar expiración
    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({
        message: 'El código de verificación ha expirado. Solicita uno nuevo.'
      });
    }

    // Verificar código
    if (stored.code !== code.toString().trim()) {
      return res.status(400).json({ message: 'El código de verificación es incorrecto' });
    }

    const { cedula, nombres, apellidos, password } = stored.datos;

    // Verificar nuevamente que el email y cédula no existan (por seguridad)
    const emailExiste = await pool.query('SELECT id FROM usuario WHERE email = $1', [email]);
    if (emailExiste.rows.length > 0) {
      verificationCodes.delete(email);
      return res.status(409).json({ message: 'Este correo electrónico ya está registrado' });
    }

    const cedulaExiste = await pool.query('SELECT id FROM usuario WHERE cedula = $1', [cedula]);
    if (cedulaExiste.rows.length > 0) {
      verificationCodes.delete(email);
      return res.status(409).json({ message: 'Esta cédula ya está registrada' });
    }

    // Obtener el rol_id de 'cliente'
    const rolResult = await pool.query("SELECT id FROM rol WHERE nombre = 'cliente'");
    if (rolResult.rows.length === 0) {
      return res.status(500).json({ message: 'Error de configuración: rol cliente no encontrado' });
    }
    const rolClienteId = rolResult.rows[0].id;

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Crear usuario
    const result = await pool.query(
      `INSERT INTO usuario (cedula, nombres, apellidos, email, password_hash, rol_id, activo)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, cedula, nombres, apellidos, email, activo`,
      [cedula, nombres, apellidos, email, password_hash, rolClienteId]
    );

    // Limpiar el código usado
    verificationCodes.delete(email);

    return res.status(201).json({
      message: 'Registro completado exitosamente. Ya puedes iniciar sesión.',
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Error al verificar código y registrar:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * POST /api/register/resend-code
 * Reenvía el código de verificación
 */
const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El email es requerido' });
    }

    const stored = verificationCodes.get(email);
    if (!stored) {
      return res.status(400).json({
        message: 'No hay un registro pendiente para este correo. Inicia el proceso nuevamente.'
      });
    }

    // Generar nuevo código
    const newCode = generateCode();
    stored.code = newCode;
    stored.expiresAt = Date.now() + 10 * 60 * 1000;
    verificationCodes.set(email, stored);

    // Reenviar correo
    await sendEmail({
      to: email,
      subject: 'Nuevo código de verificación — Flota Pelileo',
      html: templates.codigoVerificacion(newCode)
    });

    return res.status(200).json({
      message: 'Nuevo código de verificación enviado correctamente.'
    });

  } catch (error) {
    console.error('Error al reenviar código:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { sendVerificationCode, verifyCodeAndRegister, resendCode };
