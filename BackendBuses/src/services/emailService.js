const nodemailer = require('nodemailer');

// NOTA: Este servicio será integrado por Alexis en el módulo de boletos (BUS-06)


// Configuración dinámica: Gmail en producción, MailHog en desarrollo
const createTransporter = () => {
  // Si hay credenciales SMTP configuradas, usar Gmail (u otro proveedor)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: MailHog para desarrollo local
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mailhog',
    port: process.env.SMTP_PORT || 1025,
    secure: false,
    tls: { rejectUnauthorized: false }
  });
};

const transporter = createTransporter();

/**
 * Envía un correo electrónico
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const fromName = process.env.SMTP_FROM_NAME || 'Sistema de Buses';
    const fromEmail = process.env.SMTP_USER || 'no-reply@coopbuses.com';

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
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
  `,
  codigoVerificacion: (codigo) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#C62828,#8E0000);padding:32px 40px;text-align:center;">
                  <div style="width:50px;height:50px;background:rgba(255,255,255,0.2);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                    <span style="font-size:22px;font-weight:800;color:#ffffff;">BUS</span>
                  </div>
                  <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:600;">Flota Pelileo</h1>
                  <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:4px 0 0;">Cooperativa de transporte</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="color:#111827;font-size:20px;margin:0 0 8px;font-weight:700;">Verifica tu correo electrónico</h2>
                  <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 28px;">
                    Has solicitado registrarte en nuestro sistema. Usa el siguiente código para completar tu registro:
                  </p>
                  <!-- Código -->
                  <div style="background:#fef2f2;border:2px dashed #C62828;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
                    <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#C62828;">${codigo}</span>
                  </div>
                  <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:0;">
                    ⏱ Este código expira en <strong>10 minutos</strong>.<br>
                    Si no solicitaste este registro, puedes ignorar este correo.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                  <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Flota Pelileo — Sistema de Buses</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
};

module.exports = { sendEmail, templates };