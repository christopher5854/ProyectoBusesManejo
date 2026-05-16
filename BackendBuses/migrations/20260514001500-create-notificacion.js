/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'notificacion',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      usuario_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_notificacion_usuario',
          table: 'usuario',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      titulo: {
        type: 'string',
        length: 150,
        notNull: true,
      },
      mensaje: {
        type: 'text',
        notNull: true,
      },
      tipo: {
        type: 'string',
        length: 50,
        notNull: false,
      },
      leida: {
        type: 'boolean',
        defaultValue: false,
        notNull: true,
      },
      fecha_creacion: {
        type: 'datetime',
        defaultValue: new String('CURRENT_TIMESTAMP'),
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('notificacion', callback);
};
