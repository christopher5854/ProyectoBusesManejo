/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'asiento',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      bus_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_asiento_bus',
          table: 'bus',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      tipo_asiento_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_asiento_tipo_asiento',
          table: 'tipo_asiento',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      numero_asiento: {
        type: 'string',
        length: 10,
        notNull: true,
      },
      piso: {
        type: 'smallint',
        defaultValue: 1,
        notNull: true,
      },
      disponible: {
        type: 'boolean',
        defaultValue: true,
        notNull: true,
      },
      activo: {
        type: 'boolean',
        defaultValue: true,
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('asiento', callback);
};
