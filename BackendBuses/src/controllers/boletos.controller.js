const { pool } = require('../config/db');

// GET /api/boletos
const getBoletos = async (req, res) => {
  try {
    res.json({ message: 'Lista de boletos - por implementar' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/boletos/:id
const getBoletoById = async (req, res) => {
  try {
    res.json({ message: `Boleto ${req.params.id} - por implementar` });
  } catch (error) {
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
      'SELECT id, disponible, numero_asiento FROM asiento WHERE id = $1 AND activo = true FOR UPDATE',
      [asiento_id]
    );

    if (asientoResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Asiento no encontrado o inactivo' });
    }

    const asiento = asientoResult.rows[0];
    if (!asiento.disponible) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: `El asiento ${asiento.numero_asiento} ya no está disponible` });
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
    res.json({ message: 'Validar pago - por implementar' });
  } catch (error) {
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
              a.numero_asiento
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
      asiento: boleto.numero_asiento,
      origen: boleto.ciudad_origen,
      destino: boleto.ciudad_destino,
      fecha: new Date().toISOString().split('T')[0]
    };

    // Generar QR como string JSON
    const qrString = JSON.stringify(qrData);
    const qrImage = await QRCode.toDataURL(qrString);

    // Guardar el QR en la base de datos (opcional)
    await pool.query(
      'UPDATE boleto SET qr_url = $1 WHERE id = $2',
      [qrImage, id]
    );

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
const generarPDF = async (req, res) => {
  try {
    res.json({ message: 'Generar PDF - por implementar' });
  } catch (error) {
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

module.exports = {
  getBoletos,
  getBoletoById,
  createBoleto,
  registrarPago,
  subirComprobante,
  validarPago,
  generarQR,
  generarPDF
};