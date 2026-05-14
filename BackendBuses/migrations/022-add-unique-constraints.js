/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  // Agregar restricciones UNIQUE
  db.runSql(`
    -- UNIQUE constraints
    ALTER TABLE rol ADD CONSTRAINT rol_nombre_key UNIQUE (nombre);
    ALTER TABLE cooperativa ADD CONSTRAINT cooperativa_ruc_key UNIQUE (ruc);
    ALTER TABLE ciudad ADD CONSTRAINT ciudad_nombre_key UNIQUE (nombre);
    ALTER TABLE usuario ADD CONSTRAINT usuario_cedula_key UNIQUE (cedula);
    ALTER TABLE usuario ADD CONSTRAINT usuario_email_key UNIQUE (email);
    ALTER TABLE asiento ADD CONSTRAINT uq_asiento_bus_numero UNIQUE (bus_id, numero_asiento);
    ALTER TABLE parada_frecuencia ADD CONSTRAINT uq_parada_orden UNIQUE (frecuencia_id, orden);
    ALTER TABLE ruta ADD CONSTRAINT uq_ruta_hoja_fecha UNIQUE (hoja_ruta_id, fecha_ruta);
    ALTER TABLE tipo_asiento ADD CONSTRAINT tipo_asiento_nombre_key UNIQUE (nombre);
    ALTER TABLE tipo_descuento ADD CONSTRAINT tipo_descuento_nombre_key UNIQUE (nombre);
    ALTER TABLE metodo_pago ADD CONSTRAINT metodo_pago_nombre_key UNIQUE (nombre);
    ALTER TABLE boleto ADD CONSTRAINT boleto_codigo_boleto_key UNIQUE (codigo_boleto);
    ALTER TABLE bus ADD CONSTRAINT bus_placa_key UNIQUE (placa);
    ALTER TABLE configuracion_app ADD CONSTRAINT configuracion_app_clave_key UNIQUE (clave);
  `, callback);
};

exports.down = function (db, callback) {
  db.runSql(`
    ALTER TABLE rol DROP CONSTRAINT IF EXISTS rol_nombre_key;
    ALTER TABLE cooperativa DROP CONSTRAINT IF EXISTS cooperativa_ruc_key;
    ALTER TABLE ciudad DROP CONSTRAINT IF EXISTS ciudad_nombre_key;
    ALTER TABLE usuario DROP CONSTRAINT IF EXISTS usuario_cedula_key;
    ALTER TABLE usuario DROP CONSTRAINT IF EXISTS usuario_email_key;
    ALTER TABLE asiento DROP CONSTRAINT IF EXISTS uq_asiento_bus_numero;
    ALTER TABLE parada_frecuencia DROP CONSTRAINT IF EXISTS uq_parada_orden;
    ALTER TABLE ruta DROP CONSTRAINT IF EXISTS uq_ruta_hoja_fecha;
    ALTER TABLE tipo_asiento DROP CONSTRAINT IF EXISTS tipo_asiento_nombre_key;
    ALTER TABLE tipo_descuento DROP CONSTRAINT IF EXISTS tipo_descuento_nombre_key;
    ALTER TABLE metodo_pago DROP CONSTRAINT IF EXISTS metodo_pago_nombre_key;
    ALTER TABLE boleto DROP CONSTRAINT IF EXISTS boleto_codigo_boleto_key;
    ALTER TABLE bus DROP CONSTRAINT IF EXISTS bus_placa_key;
    ALTER TABLE configuracion_app DROP CONSTRAINT IF EXISTS configuracion_app_clave_key;
  `, callback);
};
