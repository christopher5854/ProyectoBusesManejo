const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { roleGuard } = require('../middlewares/roleGuard');
const accesoController = require('../controllers/acceso.controller');

router.post('/validar', authMiddleware, roleGuard(['personal_bus', 'admin']), accesoController.validarAcceso);

module.exports = router;