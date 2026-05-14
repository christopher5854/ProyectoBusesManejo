/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'tipo_asiento',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: 'string',
        length: 50,
        notNull: true,
        unique: true,
      },
      descripcion: {
        type: 'text',
        notNull: false,
      },
      precio_base: {
        type: 'decimal',
        precision: 8,
        scale: 2,
        defaultValue: 0,
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('tipo_asiento', callback);
};
