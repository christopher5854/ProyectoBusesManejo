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
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      asiento_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_boleto_asiento',
          table: 'asiento',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      cliente_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_boleto_cliente',
          table: 'usuario',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      tipo_descuento_id: {
        type: 'int',
        notNull: false,
        foreignKey: {
          name: 'fk_boleto_tipo_descuento',
          table: 'tipo_descuento',
          rules: {
            onDelete: 'SET NULL',
          },
          mapping: 'id',
        },
      },
      oficinista_id: {
        type: 'int',
        notNull: false,
        foreignKey: {
          name: 'fk_boleto_oficinista',
          table: 'usuario',
          rules: {
            onDelete: 'SET NULL',
          },
          mapping: 'id',
        },
      },
      ciudad_abordaje_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_boleto_ciudad_abordaje',
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
          name: 'fk_boleto_ciudad_destino',
          table: 'ciudad',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      metodo_pago_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'fk_boleto_metodo_pago',
          table: 'metodo_pago',
          rules: {
            onDelete: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      precio_base: {
        type: 'decimal',
        precision: 8,
        scale: 2,
        notNull: true,
      },
      descuento_aplicado: {
        type: 'decimal',
        precision: 8,
        scale: 2,
        defaultValue: 0,
        notNull: true,
      },
      precio_final: {
        type: 'decimal',
        precision: 8,
        scale: 2,
        notNull: true,
      },
      estado_pago: {
        type: 'string',
        length: 20,
        defaultValue: 'pendiente',
        notNull: true,
      },
      referencia_bancaria: {
        type: 'string',
        length: 100,
        notNull: false,
      },
      comprobante_url: {
        type: 'string',
        length: 300,
        notNull: false,
      },
      fecha_pago: {
        type: 'datetime',
        notNull: false,
      },
      validado_por: {
        type: 'int',
        notNull: false,
        foreignKey: {
          name: 'fk_boleto_validador',
          table: 'usuario',
          rules: {
            onDelete: 'SET NULL',
          },
          mapping: 'id',
        },
      },
      fecha_validacion: {
        type: 'datetime',
        notNull: false,
      },
      codigo_boleto: {
        type: 'string',
        length: 60,
        notNull: true,
        unique: true,
      },
      qr_url: {
        type: 'string',
        length: 300,
        notNull: false,
      },
      estado_boleto: {
        type: 'string',
        length: 20,
        defaultValue: 'emitido',
        notNull: true,
      },
      fecha_emision: {
        type: 'datetime',
        defaultValue: new String('CURRENT_TIMESTAMP'),
        notNull: true,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('boleto', callback);
};
