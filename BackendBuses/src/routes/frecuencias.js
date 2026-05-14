const express = require('express');
const router = express.Router();
const frecuenciaController = require('../controllers/frecuenciaController');
const paradaController = require('../controllers/paradaController');

// Rutas de Frecuencias
router.get('/', frecuenciaController.listarFrecuencias);
router.post('/', frecuenciaController.crearFrecuencia);
router.put('/:id', frecuenciaController.actualizarFrecuencia);
router.get('/buscar', frecuenciaController.buscarFrecuencias);

// Rutas de Paradas Intermedias
router.get('/:frecuenciaId/paradas', paradaController.listarParadas);
router.post('/:frecuenciaId/paradas', paradaController.agregarParada);
router.delete('/:frecuenciaId/paradas/:paradaId', paradaController.eliminarParada);