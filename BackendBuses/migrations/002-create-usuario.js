/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'usuario',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      nombres: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      apellidos: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      email: {
        type: 'string',
        length: 150,
        notNull: true,
        unique: true,
      },
      password: {
        type: 'string',
        length: 255,
        notNull: false,
      },
      activo: {
        type: 'boolean',
        defaultValue: true,
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
  db.dropTable('usuario', callback);
};
