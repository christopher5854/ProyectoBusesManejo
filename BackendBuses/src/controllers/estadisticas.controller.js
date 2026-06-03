const { pool } = require('../config/db');

const getEstadisticas = async (req, res) => {
  try {
    // Total de boletos vendidos
    const totalVentas = await pool.query('SELECT COUNT(*) FROM boleto');
    
    // Ingresos del mes actual
    const ingresosMes = await pool.query(
      `SELECT COALESCE(SUM(precio_final), 0) FROM boleto 
       WHERE EXTRACT(MONTH FROM fecha_compra) = EXTRACT(MONTH FROM CURRENT_DATE)
       AND EXTRACT(YEAR FROM fecha_compra) = EXTRACT(YEAR FROM CURRENT_DATE)`
    );
    
    // Total de buses
    const totalBuses = await pool.query('SELECT COUNT(*) FROM bus');
    
    // Total de usuarios (solo clientes)
    const totalUsuarios = await pool.query('SELECT COUNT(*) FROM usuario WHERE rol_id = 5');
    
    res.json({
      totalVentas: parseInt(totalVentas.rows[0].count),
      ingresosMes: parseFloat(ingresosMes.rows[0].coalesce),
      totalBuses: parseInt(totalBuses.rows[0].count),
      totalUsuarios: parseInt(totalUsuarios.rows[0].count)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEstadisticas };