const jwt = require('jsonwebtoken');

// ----- Middleware: verificar token JWT -------------------------
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // IMPORTANTE: Guardamos en 'user'. 
    // decoded ya contiene el 'rol' que Toa guardó como rol_nombre.
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

// ─── Middleware: verificar roles permitidos ──────────────────────────────────
// Uso: roleGuard(['cooperativa', 'oficinista', 'cliente', 'personal_bus', 'admin'])
const roleGuard = (rolesPermitidos) => {
  return (req, res, next) => {
   
    const rolUsuario = req.user?.rol;

    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere: ${rolesPermitidos.join(', ')}`,
        tuRol: rolUsuario || 'ninguno'
      });
    }
    next();
  };
};

module.exports = { verificarToken, roleGuard };
