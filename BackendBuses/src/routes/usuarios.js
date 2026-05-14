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
router.get('/',       verificarToken, roleGuard(['admin', 'cooperativa', 'oficinista']), getUsuarios);
router.get('/:id',    verificarToken, roleGuard(['admin', 'cooperativa', 'oficinista']), getUsuarioById);
router.post('/',      verificarToken, roleGuard(['admin', 'cooperativa']),               createUsuario);
router.put('/:id',    verificarToken, roleGuard(['admin', 'cooperativa']),               updateUsuario);
router.delete('/:id', verificarToken, roleGuard(['admin', 'cooperativa']),               deleteUsuario);

module.exports = router;
