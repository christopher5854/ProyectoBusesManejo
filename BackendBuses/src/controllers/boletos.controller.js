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
      pasajero_cedula,
      pasajero_nombres,
      pasajero_apellidos,
      pasajero_telefono,
      tipo_descuento_id,
      precio_final
    } = req.body;

    const usuario_id = req.user.id; // del token

    // Validar campos requeridos
    if (!ruta_id || !asiento_id || !pasajero_cedula || !pasajero_nombres) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    // Iniciar transacción
    await client.query('BEGIN');

    // 1. Bloquear el asiento para evitar doble venta (SELECT FOR UPDATE)
    const asientoResult = await client.query(
      'SELECT id, estado, numero_asiento FROM asiento WHERE id = $1 FOR UPDATE',
      [asiento_id]
    );

    if (asientoResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Asiento no encontrado' });
    }

    const asiento = asientoResult.rows[0];
    if (asiento.estado !== 'disponible') {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: `El asiento ${asiento.numero_asiento} ya no está disponible` });
    }

    // 2. Generar código único del boleto (timestamp + random)
    const codigo_boleto = `BOL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Insertar el boleto
    const boletoResult = await client.query(
      `INSERT INTO boleto 
       (codigo_boleto, ruta_id, asiento_id, usuario_id, pasajero_cedula, 
        pasajero_nombres, pasajero_apellidos, pasajero_telefono, 
        tipo_descuento_id, precio_final, estado_pago, estado_uso)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pendiente', 'pendiente')
       RETURNING *`,
      [codigo_boleto, ruta_id, asiento_id, usuario_id, pasajero_cedula,
       pasajero_nombres, pasajero_apellidos || null, pasajero_telefono || null,
       tipo_descuento_id || null, precio_final || 0]
    );

    // 4. Marcar el asiento como reservado
    await client.query(
      'UPDATE asiento SET estado = $1 WHERE id = $2',
      ['reservado', asiento_id]
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
    res.json({ message: 'Registrar pago - por implementar' });
  } catch (error) {
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