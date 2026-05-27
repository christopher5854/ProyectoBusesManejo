const express = require('express');
const router = express.Router();
const ciudadController = require('../controllers/ciudadController');
const { verificarToken, roleGuard } = require('../middlewares/roleGuard');

// Rutas públicas
router.get('/', ciudadController.listarCiudades);
router.get('/:id', ciudadController.obtenerCiudad);

// Rutas protegidas (solo admin o cooperativa)
router.post('/', verificarToken, roleGuard(['admin', 'cooperativa']), ciudadController.crearCiudad);
router.put('/:id', verificarToken, roleGuard(['admin', 'cooperativa']), ciudadController.actualizarCiudad);
router.delete('/:id', verificarToken, roleGuard(['admin', 'cooperativa']), ciudadController.eliminarCiudad);

module.exports = router;