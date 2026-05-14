/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.createTable(
    'acceso_pasajero',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      boleto_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_acceso_boleto',
          table: 'boleto',
          rules: {
            onDelete: 'CASCADE',
          },
          mapping: 'id',
        },
      },
      personal_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_acceso_personal',
          table: 'usuario',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      fecha_escaneo: {
        type: 'datetime',
        defaultValue: new String('CURRENT_TIMESTAMP'),
        notNull: true,
      },
      resultado: {
        type: 'string',
        length: 20,
        defaultValue: 'valido',
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
  db.dropTable('acceso_pasajero', callback);
};
