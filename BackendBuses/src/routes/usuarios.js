const router = require('express').Router();
const {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} = require('../controllers/users.controller');

// IMPORTANTE: Debes traer AMBOS middlewares
const { verificarToken, roleGuard } = require('../middlewares/roleGuard');

// --- RUTAS ---
// Primero verificamos el TOKEN, luego el ROL
router.get('/',      verificarToken, roleGuard(['admin', 'operador']), getUsuarios);
router.get('/:id',   verificarToken, roleGuard(['admin', 'operador']), getUsuarioById);
router.post('/',     verificarToken, roleGuard(['admin']),             createUsuario);
router.put('/:id',   verificarToken, roleGuard(['admin']),             updateUsuario);
router.delete('/:id', verificarToken, roleGuard(['admin']),             deleteUsuario);

module.exports = router;