const { pool } = require('../config/db');

const loginQuery = (email) => {
  return pool.query(
    `SELECT 
       u.id,
       u.nombres,
       u.apellidos,
       u.email,
       u.password_hash,
       u.activo,
       u.cooperativa_id,
       r.nombre AS rol_nombre
     FROM usuario u
     INNER JOIN rol r ON u.rol_id = r.id
     WHERE u.email = $1`,
    [email]
  );
};

module.exports = { loginQuery };