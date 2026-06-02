const { pool } = require('../config/db');

const validarAcceso = async (req, res) => {
  try {
    const { qr, boleto_id } = req.body;
    const busUserId = req.user.id;
    
    // Buscar el boleto por ID o código
    const boletoResult = await pool.query(
      `SELECT b.id, b.estado, b.codigo_boleto, b.asiento_id, b.ruta_id,
              u.nombres as pasajero, a.numero as asiento
       FROM boleto b
       JOIN usuario u ON b.cliente_id = u.id
       JOIN asiento a ON b.asiento_id = a.id
       WHERE b.id = $1 OR b.codigo_boleto = $2`,
      [boleto_id || qr, qr]
    );
    
    if (boletoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Boleto no encontrado' });
    }
    
    const boleto = boletoResult.rows[0];
    
    if (boleto.estado === 'usado') {
      return res.status(400).json({ message: 'Este boleto ya fue usado' });
    }
    
    // Registrar acceso
    await pool.query(
      `INSERT INTO acceso_pasajero (boleto_id, usuario_id, tipo, fecha_acceso)
       VALUES ($1, $2, 'entrada', NOW())`,
      [boleto.id, busUserId]
    );
    
    // Actualizar estado del boleto
    await pool.query(
      `UPDATE boleto SET estado = 'usado' WHERE id = $1`,
      [boleto.id]
    );
    
    res.json({ 
      message: 'Acceso permitido', 
      boleto: {
        codigo: boleto.codigo_boleto,
        pasajero: boleto.pasajero,
        asiento: boleto.asiento
      }
    });
  } catch (error) {
    console.error('Error al validar acceso:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { validarAcceso };