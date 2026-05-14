const express = require('express');
const router = express.Router();
const frecuenciaController = require('../controllers/frecuenciaController');

// Rutas de Frecuencias
router.get('/', frecuenciaController.listarFrecuencias);
router.post('/', frecuenciaController.crearFrecuencia);
router.put('/:id', frecuenciaController.actualizarFrecuencia);
router.get('/buscar', frecuenciaController.buscarFrecuencias);