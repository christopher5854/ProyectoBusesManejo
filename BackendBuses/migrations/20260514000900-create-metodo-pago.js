/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'metodo_pago',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: 'string',
        length: 80,
        notNull: true,
        unique: true,
      },
      activo: {
        type: 'boolean',
        defaultValue: true,
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('metodo_pago', callback);
};
