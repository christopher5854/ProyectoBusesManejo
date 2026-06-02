const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const boletosController = require('../controllers/boletos.controller');

const verificarToken = authMiddleware;
const { roleGuard } = require('../middlewares/roleGuard');

// Primero rutas específicas
router.get('/pendientes', verificarToken, roleGuard(['oficinista', 'admin']), boletosController.getBoletosPendientes);

// Luego rutas con parámetros
router.get('/:id/pdf', verificarToken, roleGuard(['superadmin', 'admin', 'cliente', 'oficinista']), boletosController.generarPDF);
router.get('/:id', verificarToken, boletosController.getBoletoById);
router.get('/', verificarToken, roleGuard(['superadmin', 'admin', 'oficinista', 'cliente']), boletosController.getBoletos);
router.post('/', verificarToken, roleGuard(['superadmin', 'admin', 'cliente', 'oficinista']), boletosController.createBoleto);
router.put('/:id/pago', verificarToken, roleGuard(['superadmin', 'admin', 'cliente']), boletosController.registrarPago);
router.post('/:id/comprobante', verificarToken, roleGuard(['superadmin', 'admin', 'cliente']), boletosController.subirComprobante);
router.put('/:id/validar', verificarToken, roleGuard(['superadmin', 'admin', 'oficinista']), boletosController.validarPago);
router.post('/:id/qr', verificarToken, roleGuard(['superadmin', 'admin', 'cliente', 'oficinista']), boletosController.generarQR);

module.exports = router;