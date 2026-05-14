const nodemailer = require('nodemailer');

// Configuración para MailHog (entorno de desarrollo)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 1025,
  secure: false,
  tls: { rejectUnauthorized: false }
});

/**
 * Envía un correo electrónico
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Sistema de Buses" <no-reply@coopbuses.com>',
      to,
      subject,
      html
    });
    console.log(`Correo enviado a ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw error;
  }
};

// Plantillas predefinidas para notificaciones
const templates = {
  compraConfirmada: (nombre, codigoBoleto) => `
    <h1>Compra confirmada</h1>
    <p>Hola ${nombre}, tu compra ha sido exitosa.</p>
    <p>Código de boleto: <strong>${codigoBoleto}</strong></p>
    <p>Gracias por viajar con nosotros.</p>
  `,
  pagoValidado: (nombre, codigoBoleto) => `
    <h1>Pago validado</h1>
    <p>Hola ${nombre}, tu pago ha sido aprobado. Tu boleto ${codigoBoleto} ya está disponible.</p>
  `
};

module.exports = { sendEmail, templates };