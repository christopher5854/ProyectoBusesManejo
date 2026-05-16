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

router.get('/', verificarToken, roleGuard(['admin', 'oficinista', 'cliente']), getBoletos);
router.get('/:id', verificarToken, getBoletoById);
router.post('/', verificarToken, roleGuard(['cliente', 'oficinista']), createBoleto);
router.put('/:id/pago', verificarToken, roleGuard(['cliente']), registrarPago);
router.post('/:id/comprobante', verificarToken, roleGuard(['cliente']), subirComprobante);
router.put('/:id/validar', verificarToken, roleGuard(['oficinista', 'admin']), validarPago);
router.post('/:id/qr', verificarToken, generarQR);
router.get('/:id/pdf', verificarToken, generarPDF);

module.exports = router;