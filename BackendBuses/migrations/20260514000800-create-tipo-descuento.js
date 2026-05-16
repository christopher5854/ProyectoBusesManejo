/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'tipo_descuento',
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
      porcentaje: {
        type: 'decimal',
        precision: 5,
        scale: 2,
        notNull: true,
      },
      requiere_validacion: {
        type: 'boolean',
        defaultValue: false,
        notNull: true,
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
  db.dropTable('tipo_descuento', callback);
};
