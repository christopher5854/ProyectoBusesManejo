const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = require('./config/db');

const accesoRoutes = require('./routes/acceso.routes');
app.use('/api/acceso', accesoRoutes);

const estadisticasController = require('./controllers/estadisticas.controller');
app.get('/api/estadisticas', estadisticasController.getEstadisticas);

const hojaRutaController = require('./controllers/hojaRutaController');
app.get('/api/hoja-ruta', hojaRutaController.getHojaRuta);

// Rutas
app.use('/api/rutas',      require('./routes/rutas'));
app.use('/api/boletos',    require('./routes/boletos'));
app.use('/api/usuarios',   require('./routes/usuarios'));
app.use('/api/ciudades',   require('./routes/ciudades'));
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api', require('./routes/validaciones.routes'));
app.use('/api/tipo-descuento', require('./routes/descuento.routes'));
app.use('/api/buses',      require('./routes/buses'));

const frecuenciasRoutes = require('./routes/frecuencias');
app.use('/api/frecuencias', frecuenciasRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API TransiSys funcionando' });
});

const PORT = process.env.PORT || 3000;

db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log('Conectado a la base de datos y servidor iniciado');
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar el servidor por fallo en la BD:', err.message);
    process.exit(1);
  });