/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  // Vista v_rutas_disponibles
  db.runSql(
    `
    CREATE OR REPLACE VIEW v_rutas_disponibles AS
    SELECT 
      r.id,
      r.ciudadOrigen,
      r.ciudadDestino,
      co.nombre as nombreOrigen,
      cd.nombre as nombreDestino,
      r.distancia,
      r.duracion,
      r.precio,
      r.activo,
      COUNT(CASE WHEN b.estado = 'disponible' THEN 1 END) as asientosDisponibles,
      COUNT(b.id) as asientosTotal
    FROM ruta r
    LEFT JOIN ciudad co ON r.ciudadOrigen = co.id
    LEFT JOIN ciudad cd ON r.ciudadDestino = cd.id
    LEFT JOIN boleto b ON r.id = b.ruta_id
    WHERE r.activo = true
    GROUP BY r.id, co.nombre, cd.nombre;
    `,
    callback
  );
};

exports.down = function (db, callback) {
  db.runSql('DROP VIEW IF EXISTS v_rutas_disponibles;', callback);
};
