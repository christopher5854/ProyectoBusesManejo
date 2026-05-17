const router = require('express').Router();
const { verificarToken, roleGuard } = require('../middlewares/roleGuard');
const {
  getDescuentos,
  getDescuentoById,
  createDescuento,
  updateDescuento,
  deleteDescuento
} = require('../controllers/descuento.controller');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Solo admin y superadmin pueden modificar
router.get('/', roleGuard(['superadmin', 'admin', 'oficinista']), getDescuentos);
router.get('/:id', roleGuard(['superadmin', 'admin', 'oficinista']), getDescuentoById);
router.post('/', roleGuard(['superadmin', 'admin']), createDescuento);
router.put('/:id', roleGuard(['superadmin', 'admin']), updateDescuento);
router.delete('/:id', roleGuard(['superadmin', 'admin']), deleteDescuento);

module.exports = router;