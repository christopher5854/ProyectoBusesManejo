const express = require('express');
const router = express.Router();
const ciudadController = require('../controllers/ciudadController');

router.get('/', ciudadController.listarCiudades);
router.get('/:id', ciudadController.obtenerCiudad);
router.post('/', ciudadController.crearCiudad);
router.put('/:id', ciudadController.actualizarCiudad);
router.delete('/:id', ciudadController.eliminarCiudad);

module.exports = router;