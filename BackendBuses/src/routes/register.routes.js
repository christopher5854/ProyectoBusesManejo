const express = require('express');
const router = express.Router();
const {
  sendVerificationCode,
  verifyCodeAndRegister,
  resendCode
} = require('../controllers/register.controller');

// Rutas públicas (sin autenticación)
router.post('/send-code', sendVerificationCode);
router.post('/verify', verifyCodeAndRegister);
router.post('/resend-code', resendCode);

module.exports = router;
