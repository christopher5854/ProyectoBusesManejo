/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'rol',
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
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('rol', callback);
};
