/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  // Vista v_boletos_detalle
  db.runSql(
    `
    CREATE OR REPLACE VIEW v_boletos_detalle AS
    SELECT 
      b.id,
      b.numeroAsiento,
      b.precioFinal,
      b.estado,
      b.fechaViaje,
      b.horaViaje,
      r.id as ruta_id,
      co.nombre as ciudadOrigen,
      cd.nombre as ciudadDestino,
      r.distancia,
      r.duracion,
      r.precio as precioBase,
      u.id as usuario_id,
      u.nombres as usuarioNombres,
      u.apellidos as usuarioApellidos,
      u.email as usuarioEmail,
      b.createdAt
    FROM boleto b
    LEFT JOIN ruta r ON b.ruta_id = r.id
    LEFT JOIN ciudad co ON r.ciudadOrigen = co.id
    LEFT JOIN ciudad cd ON r.ciudadDestino = cd.id
    LEFT JOIN usuario u ON b.usuario_id = u.id
    ORDER BY b.fechaViaje DESC;
    `,
    callback
  );
};

exports.down = function (db, callback) {
  db.runSql('DROP VIEW IF EXISTS v_boletos_detalle;', callback);
};
