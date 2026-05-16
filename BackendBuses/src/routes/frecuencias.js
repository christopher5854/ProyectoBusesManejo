const express = require('express');
const router = express.Router();
const frecuenciaController = require('../controllers/frecuenciaController');
const paradaController = require('../controllers/paradaController');
const hojaRutaController = require('../controllers/hojaRutaController');
const rutaController = require('../controllers/rutaController');
// const { verificarToken, roleGuard } = require('../middlewares/roleGuard'); // Comentado temporalmente

// Rutas de Frecuencias (públicas: GET, protegidas: POST, PUT)
router.get('/', frecuenciaController.listarFrecuencias);
router.post('/', /* verificarToken, roleGuard(['admin', 'cooperativa']), */ frecuenciaController.crearFrecuencia);
router.put('/:id', /* verificarToken, roleGuard(['admin', 'cooperativa']), */ frecuenciaController.actualizarFrecuencia);
router.get('/buscar', frecuenciaController.buscarFrecuencias);

// Rutas de Paradas Intermedias (públicas: GET, protegidas: POST, DELETE)
router.get('/:frecuenciaId/paradas', paradaController.listarParadas);
router.post('/:frecuenciaId/paradas', /* verificarToken, roleGuard(['admin', 'cooperativa']), */ paradaController.agregarParada);
router.delete('/:frecuenciaId/paradas/:paradaId', /* verificarToken, roleGuard(['admin', 'cooperativa']), */ paradaController.eliminarParada);

// Rutas de Hoja de Ruta (públicas: GET, protegidas: POST)
router.get('/hojas-ruta', hojaRutaController.listarHojas);
router.post('/hojas-ruta', /* verificarToken, roleGuard(['admin', 'cooperativa']), */ hojaRutaController.crearHojaManual);
router.post('/hojas-ruta/generar', /* verificarToken, roleGuard(['admin', 'cooperativa']), */ hojaRutaController.generarAutomatico);

// Rutas de Rutas Diarias (públicas: GET, protegida: PUT)
router.get('/rutas', rutaController.listarRutas);
router.get('/rutas/:id', rutaController.detalleRuta);
router.put('/rutas/:id', /* verificarToken, roleGuard(['admin', 'cooperativa']), */ rutaController.actualizarEstadoRuta);

module.exports = router;