/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.runSql(`
    INSERT INTO rol (nombre, descripcion) VALUES
      ('cooperativa', 'Administrador de cooperativa'),
      ('personal_bus', 'Personal encargado del bus')
    ON CONFLICT (nombre) DO NOTHING;
  `, callback);
};

exports.down = function (db, callback) {
  db.runSql(`
    DELETE FROM rol WHERE nombre IN ('cooperativa', 'personal_bus');
  `, callback);
};
