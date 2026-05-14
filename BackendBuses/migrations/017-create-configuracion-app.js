/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'configuracion_app',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      clave: {
        type: 'string',
        length: 100,
        notNull: true,
        unique: true,
      },
      valor: {
        type: 'text',
        notNull: true,
      },
      descripcion: {
        type: 'text',
        notNull: false,
      },
      tipo_dato: {
        type: 'string',
        length: 50,
        defaultValue: 'string',
      },
      actualizado_en: {
        type: 'datetime',
        defaultValue: new String('CURRENT_TIMESTAMP'),
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('configuracion_app', callback);
};
