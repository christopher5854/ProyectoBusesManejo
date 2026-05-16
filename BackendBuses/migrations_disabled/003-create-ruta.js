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
      ciudadOrigen: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_ruta_ciudad_origen',
          table: 'ciudad',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      ciudadDestino: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_ruta_ciudad_destino',
          table: 'ciudad',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      distancia: {
        type: 'decimal',
        precision: 8,
        scale: 2,
        notNull: false,
      },
      duracion: {
        type: 'string',
        length: 50,
        notNull: false,
      },
      precio: {
        type: 'decimal',
        precision: 10,
        scale: 2,
        notNull: true,
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
  db.dropTable('ruta', callback);
};
