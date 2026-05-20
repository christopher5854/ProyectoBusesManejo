const router = require('express').Router();
const { validarCedula } = require('../utils/validations');

router.post('/validar-cedula', (req, res) => {
  const { cedula } = req.body;
  
  if (!cedula) {
    return res.status(400).json({ error: 'La cédula es requerida' });
  }
  
  const esValida = validarCedula(cedula);
  
  res.json({
    cedula,
    valida: esValida,
    mensaje: esValida ? 'Cédula válida' : 'Cédula inválida'
  });
});

module.exports = router;