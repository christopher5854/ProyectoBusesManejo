/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'cooperativa',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: 'string',
        length: 120,
        notNull: true,
      },
      ruc: {
        type: 'char',
        length: 13,
        notNull: true,
        unique: true,
      },
      telefono: {
        type: 'string',
        length: 20,
        notNull: false,
      },
      email: {
        type: 'string',
        length: 100,
        notNull: false,
      },
      direccion: {
        type: 'string',
        length: 200,
        notNull: false,
      },
      logo_url: {
        type: 'string',
        length: 300,
        notNull: false,
      },
      activa: {
        type: 'boolean',
        defaultValue: true,
        notNull: true,
      },
      fecha_registro: {
        type: 'datetime',
        defaultValue: new String('CURRENT_TIMESTAMP'),
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('cooperativa', callback);
};
