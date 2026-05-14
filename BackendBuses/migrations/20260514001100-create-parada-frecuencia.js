/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'parada_frecuencia',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      frecuencia_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_parada_frecuencia',
          table: 'frecuencia',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      ciudad_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_parada_ciudad',
          table: 'ciudad',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      orden: {
        type: 'smallint',
        notNull: true,
      },
      tiempo_adicional: {
        type: 'string',
        length: 50,
        defaultValue: '00:00:00',
        notNull: true,
      },
      precio: {
        type: 'decimal',
        precision: 8,
        scale: 2,
        defaultValue: 0,
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('parada_frecuencia', callback);
};
