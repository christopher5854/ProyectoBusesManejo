/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'boleto',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      ruta_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_boleto_ruta',
          table: 'ruta',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      usuario_id: {
        type: 'int',
        notNull: false,
        foreignKey: {
          name: 'fk_boleto_usuario',
          table: 'usuario',
          rules: {
            onDelete: 'SET NULL',
          },
          mapping: 'id',
        },
      },
      numeroAsiento: {
        type: 'string',
        length: 10,
        notNull: true,
      },
      precioFinal: {
        type: 'decimal',
        precision: 10,
        scale: 2,
        notNull: true,
      },
      estado: {
        type: 'string',
        length: 50,
        defaultValue: 'disponible',
        comment: 'disponible, vendido, reservado, cancelado',
      },
      fechaViaje: {
        type: 'datetime',
        notNull: true,
      },
      horaViaje: {
        type: 'string',
        length: 8,
        notNull: false,
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
  db.dropTable('boleto', callback);
};
