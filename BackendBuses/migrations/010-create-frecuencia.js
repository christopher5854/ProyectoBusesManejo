/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'frecuencia',
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
          name: 'fk_frecuencia_cooperativa',
          table: 'cooperativa',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      ciudad_origen_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_frecuencia_ciudad_origen',
          table: 'ciudad',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      ciudad_destino_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_frecuencia_ciudad_destino',
          table: 'ciudad',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      hora_salida: {
        type: 'time',
        notNull: true,
      },
      duracion_estimada: {
        type: 'string',
        length: 50,
        notNull: false,
      },
      numero_resolucion: {
        type: 'string',
        length: 60,
        notNull: false,
      },
      precio: {
        type: 'decimal',
        precision: 8,
        scale: 2,
        notNull: true,
      },
      activa: {
        type: 'boolean',
        defaultValue: true,
        notNull: true,
      },
      tipo_viaje: {
        type: 'string',
        length: 20,
        defaultValue: 'ordinario',
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('frecuencia', callback);
};
