const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Asegurarnos de inicializar la conexión a la DB antes de levantar el servidor
const db = require('./config/db');

// Rutas
app.use('/api/rutas',      require('./routes/rutas'));
app.use('/api/boletos',    require('./routes/boletos'));
app.use('/api/usuarios',   require('./routes/usuarios'));
app.use('/api/ciudades',   require('./routes/ciudades'));
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api', require('./routes/validaciones.routes'));
app.use('/api/tipo-descuento', require('./routes/descuento.routes'));

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