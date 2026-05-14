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
      },
      provincia: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      createdAt: {
        type: 'datetime',
        defaultValue: new String('CURRENT_TIMESTAMP'),
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('ciudad', callback);
};
