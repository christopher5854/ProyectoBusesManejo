/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'ciudad',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: 'string',
        length: 100,
        notNull: true,
        unique: true,
      },
      provincia: {
        type: 'string',
        length: 100,
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('ciudad', callback);
};
