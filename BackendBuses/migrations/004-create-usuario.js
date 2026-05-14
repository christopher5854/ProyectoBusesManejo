/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'usuario',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      rol_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_usuario_rol',
          table: 'rol',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      cooperativa_id: {
        type: 'int',
        notNull: false,
        foreignKey: {
          name: 'fk_usuario_cooperativa',
          table: 'cooperativa',
          rules: {
            onDelete: 'SET NULL',
          },
          mapping: 'id',
        },
      },
      cedula: {
        type: 'char',
        length: 10,
        notNull: true,
        unique: true,
      },
      nombres: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      apellidos: {
        type: 'string',
        length: 100,
        notNull: true,
      },
      email: {
        type: 'string',
        length: 100,
        notNull: true,
        unique: true,
      },
      telefono: {
        type: 'string',
        length: 20,
        notNull: false,
      },
      password_hash: {
        type: 'string',
        length: 255,
        notNull: true,
      },
      fecha_nacimiento: {
        type: 'date',
        notNull: false,
      },
      discapacidad: {
        type: 'boolean',
        defaultValue: false,
        notNull: true,
      },
      porcentaje_discapacidad: {
        type: 'smallint',
        notNull: false,
      },
      activo: {
        type: 'boolean',
        defaultValue: true,
        notNull: true,
      },
      fecha_registro: {
        type: 'datetime',
        defaultValue: new String('CURRENT_TIMESTAMP'),
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('usuario', callback);
};
