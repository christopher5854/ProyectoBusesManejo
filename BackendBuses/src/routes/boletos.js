const router = require('express').Router();
const { verificarToken, roleGuard } = require('../middlewares/roleGuard');

const {
  getBoletos,
  getBoletoById,
  createBoleto,
  registrarPago,
  subirComprobante,
  validarPago,
  generarQR,
  generarPDF
} = require('../controllers/boletos.controller');

router.get('/', verificarToken, roleGuard(['superadmin', 'admin', 'oficinista', 'cliente']), getBoletos);
router.get('/:id', verificarToken, getBoletoById);
router.post('/', verificarToken, roleGuard(['superadmin', 'admin', 'cliente', 'oficinista']), createBoleto);
router.put('/:id/pago', verificarToken, roleGuard(['superadmin', 'admin', 'cliente']), registrarPago);
router.post('/:id/comprobante', verificarToken, roleGuard(['superadmin', 'admin', 'cliente']), subirComprobante);
router.put('/:id/validar', verificarToken, roleGuard(['oficinista', 'admin']), validarPago);
router.post('/:id/qr', verificarToken, roleGuard(['superadmin', 'admin', 'cliente', 'oficinista']), generarQR);
router.get('/:id/pdf', verificarToken, roleGuard(['superadmin', 'admin', 'cliente', 'oficinista']), generarPDF);

module.exports = router;