const { pool } = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// GET /api/boletos
const getBoletos = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    const tokenUserId = req.user.id;
    
    // Si no hay usuario_id, usar el del token
    const clienteId = usuario_id || tokenUserId;
    
    const result = await pool.query(
      `SELECT b.id, b.codigo_boleto as codigo, b.precio_final, b.estado_pago as estado,
              ci.nombre as origen, cd.nombre as destino,
              r.fecha_ruta as fecha, fr.hora_salida,
              a.numero as asiento,
              u.nombres as nombre
       FROM boleto b
       JOIN ruta r ON b.ruta_id = r.id
       JOIN frecuencia fr ON r.frecuencia_id = fr.id
       JOIN ciudad ci ON fr.ciudad_origen_id = ci.id
       JOIN ciudad cd ON fr.ciudad_destino_id = cd.id
       JOIN asiento a ON b.asiento_id = a.id
       JOIN usuario u ON b.cliente_id = u.id
       WHERE b.cliente_id = $1
       ORDER BY b.id DESC`,
      [clienteId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener boletos:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/boletos/:id
// GET /api/boletos/:id
const getBoletoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT b.id, b.codigo_boleto, b.precio_base, b.descuento_aplicado, b.precio_final, 
              b.estado_pago, b.estado, b.referencia_bancaria, b.comprobante_url, 
              b.fecha_pago, b.fecha_emision,
              u.nombres as cliente_nombre, u.apellidos as cliente_apellidos, u.cedula as cliente_cedula,
              ci.nombre as ciudad_origen, cd.nombre as ciudad_destino,
              a.numero, a.piso,
              tp.nombre as tipo_asiento,
              r.fecha_ruta,
              fr.hora_salida
       FROM boleto b
       JOIN usuario u ON b.cliente_id = u.id
       JOIN ciudad ci ON b.ciudad_abordaje_id = ci.id
       JOIN ciudad cd ON b.ciudad_destino_id = cd.id
       JOIN asiento a ON b.asiento_id = a.id
       JOIN tipo_asiento tp ON a.tipo_asiento_id = tp.id
       JOIN ruta r ON b.ruta_id = r.id
       JOIN frecuencia fr ON r.frecuencia_id = fr.id
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener boleto:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/boletos
const createBoleto = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      ruta_id,
      asiento_id,
      cliente_id,
      tipo_descuento_id,
      ciudad_abordaje_id,
      ciudad_destino_id,
      metodo_pago_id,
      precio_base,
      descuento_aplicado,
      precio_final
    } = req.body;

    // Validar campos requeridos
    if (!ruta_id || !asiento_id || !cliente_id || !ciudad_abordaje_id || !ciudad_destino_id || !metodo_pago_id || !precio_base) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    // Generar código único del boleto
    const codigo_boleto = `BOL-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Iniciar transacción
    await client.query('BEGIN');

    // 1. Bloquear el asiento para evitar doble venta (SELECT FOR UPDATE)
    const asientoResult = await client.query(
      'SELECT id, disponible, numero FROM asiento WHERE id = $1 AND disponible = true FOR UPDATE',
      [asiento_id]
    );

    if (asientoResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Asiento no encontrado o inactivo' });
    }

    const asiento = asientoResult.rows[0];
    if (!asiento.disponible) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: `El asiento ${asiento.numero} ya no está disponible` });
    }

    // 2. Insertar el boleto con codigo_boleto
    const boletoResult = await client.query(
      `INSERT INTO boleto 
       (codigo_boleto, ruta_id, asiento_id, cliente_id, tipo_descuento_id, ciudad_abordaje_id, 
        ciudad_destino_id, metodo_pago_id, precio_base, descuento_aplicado, precio_final, estado_pago)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pendiente')
       RETURNING *`,
      [codigo_boleto, ruta_id, asiento_id, cliente_id, tipo_descuento_id || null, ciudad_abordaje_id,
       ciudad_destino_id, metodo_pago_id, precio_base, descuento_aplicado || 0, precio_final || precio_base]
    );

    // 3. Marcar el asiento como NO disponible
    await client.query(
      'UPDATE asiento SET disponible = false WHERE id = $1',
      [asiento_id]
    );

    // Confirmar transacción
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Boleto creado exitosamente',
      boleto: boletoResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear boleto:', error);
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

// PUT /api/boletos/:id/pago
const registrarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { referencia_bancaria } = req.body;

    if (!referencia_bancaria) {
      return res.status(400).json({ message: 'La referencia bancaria es requerida' });
    }

    // Verificar que el boleto existe y está pendiente
    const boletoResult = await pool.query(
      'SELECT id, estado_pago FROM boleto WHERE id = $1',
      [id]
    );

    if (boletoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    const boleto = boletoResult.rows[0];
    if (boleto.estado_pago !== 'pendiente') {
      return res.status(409).json({ message: `El pago ya está ${boleto.estado_pago}` });
    }

    // Actualizar el boleto con la referencia bancaria y cambiar estado a 'pagado'
    const result = await pool.query(
      `UPDATE boleto 
       SET referencia_bancaria = $1, 
           fecha_pago = NOW(),
           estado_pago = 'pagado'
       WHERE id = $2 
       RETURNING *`,
      [referencia_bancaria, id]
    );

    res.json({
      message: 'Pago registrado exitosamente',
      boleto: result.rows[0]
    });

  } catch (error) {
    console.error('Error al registrar pago:', error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/boletos/:id/validar
const validarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const oficinista_id = req.user.id;

    const boletoResult = await pool.query(
      'SELECT id, estado_pago, estado FROM boleto WHERE id = $1',
      [id]
    );

    if (boletoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    const boleto = boletoResult.rows[0];

    if (boleto.estado_pago !== 'pagado') {
      return res.status(409).json({ 
        message: `No se puede validar. El pago está ${boleto.estado_pago}` 
      });
    }

    const result = await pool.query(
      `UPDATE boleto 
       SET oficinista_id = $1,
           fecha_validacion = NOW()
       WHERE id = $2 
       RETURNING *`,
      [oficinista_id, id]
    );

    res.json({
      message: 'Pago validado exitosamente por el oficinista',
      boleto: result.rows[0]
    });

  } catch (error) {
    console.error('Error al validar pago:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/boletos/:id/qr
const QRCode = require('qrcode');

// POST /api/boletos/:id/qr
const generarQR = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener datos del boleto
    const boletoResult = await pool.query(
      `SELECT b.id, b.codigo_boleto, b.asiento_id, b.precio_final, 
              b.ciudad_abordaje_id, b.ciudad_destino_id, b.estado_pago,
              u.nombres as cliente_nombre, u.cedula as cliente_cedula,
              ci.nombre as ciudad_origen, cd.nombre as ciudad_destino,
              a.numero
       FROM boleto b
       JOIN usuario u ON b.cliente_id = u.id
       JOIN ciudad ci ON b.ciudad_abordaje_id = ci.id
       JOIN ciudad cd ON b.ciudad_destino_id = cd.id
       JOIN asiento a ON b.asiento_id = a.id
       WHERE b.id = $1`,
      [id]
    );

    if (boletoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    const boleto = boletoResult.rows[0];

    // Crear objeto con la información para el QR
    const qrData = {
      codigo: boleto.codigo_boleto,
      boleto_id: boleto.id,
      pasajero: boleto.cliente_nombre,
      cedula: boleto.cliente_cedula,
      asiento: boleto.numero,
      origen: boleto.ciudad_origen,
      destino: boleto.ciudad_destino,
      fecha: new Date().toISOString().split('T')[0]
    };

    // Generar QR como string JSON
    const qrString = JSON.stringify(qrData);
    const qrImage = await QRCode.toDataURL(qrString);

    // No guardamos en la BD para evitar error de longitud
    res.json({
      message: 'QR generado exitosamente',
      qr: qrImage,
      boleto_id: boleto.id,
      codigo_boleto: boleto.codigo_boleto
    });

  } catch (error) {
    console.error('Error al generar QR:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/boletos/:id/pdf
// GET /api/boletos/:id/pdf
const generarPDF = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener datos del boleto con toda la información necesaria
    const boletoResult = await pool.query(
      `SELECT b.id, b.codigo_boleto, b.precio_base, b.descuento_aplicado, b.precio_final, 
              b.estado_pago, b.referencia_bancaria, b.fecha_pago, b.fecha_emision,
              u.nombres as cliente_nombre, u.apellidos as cliente_apellidos, u.cedula as cliente_cedula,
              ci.nombre as ciudad_origen, cd.nombre as ciudad_destino,
              a.numero, a.piso,
              tp.nombre as tipo_asiento,
              r.fecha_ruta,
              fr.hora_salida
       FROM boleto b
       JOIN usuario u ON b.cliente_id = u.id
       JOIN ciudad ci ON b.ciudad_abordaje_id = ci.id
       JOIN ciudad cd ON b.ciudad_destino_id = cd.id
       JOIN asiento a ON b.asiento_id = a.id
       JOIN tipo_asiento tp ON a.tipo_asiento_id = tp.id
       JOIN ruta r ON b.ruta_id = r.id
       JOIN frecuencia fr ON r.frecuencia_id = fr.id
       WHERE b.id = $1`,
      [id]
    );

    if (boletoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }

    const boleto = boletoResult.rows[0];

    // Configurar respuesta como PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=boleto_${boleto.codigo_boleto}.pdf`);

    // Crear documento PDF
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Título
    doc.fontSize(20).text('TRANSISYS - BOLETO DE PASAJE', { align: 'center' });
    doc.moveDown();

    // Línea separadora
    doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Información del boleto
    doc.fontSize(14).text(`Código: ${boleto.codigo_boleto}`, { align: 'center' });
    doc.moveDown();

    // Datos del pasajero
    doc.fontSize(12).text('DATOS DEL PASAJERO', { underline: true });
    doc.fontSize(10).text(`Nombre: ${boleto.cliente_nombre} ${boleto.cliente_apellidos || ''}`);
    doc.text(`Cédula: ${boleto.cliente_cedula}`);
    doc.moveDown();

    // Datos del viaje
    doc.fontSize(12).text('DATOS DEL VIAJE', { underline: true });
    doc.fontSize(10).text(`Origen: ${boleto.ciudad_origen}`);
    doc.text(`Destino: ${boleto.ciudad_destino}`);
    doc.text(`Fecha: ${new Date(boleto.fecha_ruta).toLocaleDateString()}`);
    doc.text(`Hora: ${boleto.hora_salida.substring(0, 5)}`);
    doc.text(`Asiento: ${boleto.numero} (Piso ${boleto.piso})`);
    doc.text(`Tipo: ${boleto.tipo_asiento}`);
    doc.moveDown();

    // Información del pago
    doc.fontSize(12).text('INFORMACIÓN DEL PAGO', { underline: true });
    doc.fontSize(10).text(`Precio Base: $${parseFloat(boleto.precio_base).toFixed(2)}`);
    doc.text(`Descuento: $${parseFloat(boleto.descuento_aplicado).toFixed(2)}`);
    doc.text(`Total Pagado: $${parseFloat(boleto.precio_final).toFixed(2)}`);
    doc.text(`Estado: ${boleto.estado_pago.toUpperCase()}`);
    if (boleto.referencia_bancaria) {
      doc.text(`Referencia: ${boleto.referencia_bancaria}`);
    }
    if (boleto.fecha_pago) {
      doc.text(`Fecha Pago: ${new Date(boleto.fecha_pago).toLocaleString()}`);
    }
    doc.moveDown();

    // Generar QR y agregarlo al PDF
    const qrData = {
      codigo: boleto.codigo_boleto,
      boleto_id: boleto.id,
      pasajero: boleto.cliente_nombre,
      cedula: boleto.cliente_cedula,
      asiento: boleto.numero,
      origen: boleto.ciudad_origen,
      destino: boleto.ciudad_destino
    };

    const QRCode = require('qrcode');
    const qrImage = await QRCode.toBuffer(JSON.stringify(qrData));

    doc.image(qrImage, {
      fit: [100, 100],
      align: 'center',
      valign: 'center'
    });

    doc.moveDown();
    doc.fontSize(8).text('Presentar este documento al abordar el bus.', { align: 'center' });
    doc.text(`Emitido: ${new Date(boleto.fecha_emision).toLocaleString()}`, { align: 'center' });

    // Finalizar PDF
    doc.end();

  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ message: error.message });
  }
};


const multer = require('multer');
const path = require('path');

// Configurar Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `comprobante-${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// POST /api/boletos/:id/comprobante
const subirComprobante = async (req, res) => {
  const uploadMiddleware = upload.single('comprobante');
  
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    try {
      const { id } = req.params;
      const comprobante_url = `/uploads/${req.file.filename}`;

      const result = await pool.query(
        `UPDATE boleto 
         SET comprobante_url = $1
         WHERE id = $2 
         RETURNING *`,
        [comprobante_url, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Boleto no encontrado' });
      }

      res.json({
        message: 'Comprobante subido exitosamente',
        comprobante_url,
        boleto: result.rows[0]
      });

    } catch (error) {
      console.error('Error al subir comprobante:', error);
      res.status(500).json({ message: error.message });
    }
  });
};

const getBoletosPendientes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.codigo_boleto, b.referencia_bancaria, b.comprobante_url,
              u.nombres, u.apellidos, u.cedula,
              ci.nombre as origen, cd.nombre as destino,
              r.fecha_ruta, fr.hora_salida, a.numero as asiento
       FROM boleto b
       JOIN usuario u ON b.cliente_id = u.id
       JOIN ruta r ON b.ruta_id = r.id
       JOIN frecuencia fr ON r.frecuencia_id = fr.id
       JOIN ciudad ci ON fr.ciudad_origen_id = ci.id
       JOIN ciudad cd ON fr.ciudad_destino_id = cd.id
       JOIN asiento a ON b.asiento_id = a.id
       WHERE b.estado_pago = 'pagado'
       ORDER BY b.id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBoletosPendientes,
  getBoletos,
  getBoletoById,
  createBoleto,
  registrarPago,
  subirComprobante,
  validarPago,
  generarQR,
  generarPDF
};