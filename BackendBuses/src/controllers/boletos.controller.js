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

// POST /api/boletos/:id/comprobante
const subirComprobante = async (req, res) => {
  try {
    res.json({ message: 'Subir comprobante - por implementar' });
  } catch (error) {
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
const generarQR = async (req, res) => {
  try {
    res.json({ message: 'Generar QR - por implementar' });
  } catch (error) {
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