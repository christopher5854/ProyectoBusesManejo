// src/utils/validations.js

const validarCedula = (cedula) => {
  // Validar que la cédula tenga 10 dígitos
  if (!cedula || cedula.length !== 10) return false;
  
  // Validar que sean solo números
  if (!/^\d+$/.test(cedula)) return false;
  
  // Validar que los primeros dos dígitos sean entre 01 y 24
  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;
  
  // Algoritmo del módulo 10
  const digitos = cedula.split('').map(Number);
  const codigoProvincia = digitos[0] * 10 + digitos[1];
  
  // El tercer dígito no puede ser mayor a 6 (para personas naturales)
  if (digitos[2] > 6) return false;
  
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = digitos[i];
    if (i % 2 === 0) {
      valor *= 2;
      if (valor > 9) valor -= 9;
    }
    suma += valor;
  }
  
  const decena = Math.ceil(suma / 10) * 10;
  const digitoVerificador = decena - suma;
  const digitoReal = digitos[9];
  
  return digitoVerificador === digitoReal;
};

module.exports = { validarCedula };