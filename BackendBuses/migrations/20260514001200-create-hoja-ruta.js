/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'hoja_ruta',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      cooperativa_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_hoja_ruta_cooperativa',
          table: 'cooperativa',
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
          name: 'fk_hoja_ruta_frecuencia',
          table: 'frecuencia',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      bus_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_hoja_ruta_bus',
          table: 'bus',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      fecha_inicio: {
        type: 'date',
        notNull: true,
      },
      fecha_fin: {
        type: 'date',
        notNull: false,
      },
      generacion: {
        type: 'string',
        length: 20,
        defaultValue: 'manual',
        notNull: true,
      },
      activa: {
        type: 'boolean',
        defaultValue: true,
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('hoja_ruta', callback);
};
