/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'bus',
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
          name: 'fk_bus_cooperativa',
          table: 'cooperativa',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      numero_interno: {
        type: 'string',
        length: 20,
        notNull: false,
      },
      placa: {
        type: 'string',
        length: 10,
        notNull: true,
        unique: true,
      },
      marca_chasis: {
        type: 'string',
        length: 80,
        notNull: false,
      },
      marca_carroceria: {
        type: 'string',
        length: 80,
        notNull: false,
      },
      anio_fabricacion: {
        type: 'smallint',
        notNull: false,
      },
      capacidad_total: {
        type: 'smallint',
        notNull: true,
      },
      foto_url: {
        type: 'string',
        length: 300,
        notNull: false,
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
  db.dropTable('bus', callback);
};
