/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'ruta',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      hoja_ruta_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_ruta_hoja_ruta',
          table: 'hoja_ruta',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      frecuencia_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_ruta_frecuencia',
          table: 'frecuencia',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      fecha_ruta: {
        type: 'date',
        notNull: true,
      },
      estado: {
        type: 'string',
        length: 20,
        defaultValue: 'programada',
        notNull: true,
      },
      observacion: {
        type: 'text',
        notNull: false,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('ruta', callback);
};
