/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.runSql(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rol_nombre_key') THEN
        ALTER TABLE rol ADD CONSTRAINT rol_nombre_key UNIQUE (nombre);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cooperativa_ruc_key') THEN
        ALTER TABLE cooperativa ADD CONSTRAINT cooperativa_ruc_key UNIQUE (ruc);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ciudad_nombre_key') THEN
        ALTER TABLE ciudad ADD CONSTRAINT ciudad_nombre_key UNIQUE (nombre);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuario_cedula_key') THEN
        ALTER TABLE usuario ADD CONSTRAINT usuario_cedula_key UNIQUE (cedula);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuario_email_key') THEN
        ALTER TABLE usuario ADD CONSTRAINT usuario_email_key UNIQUE (email);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_asiento_bus_numero') THEN
        ALTER TABLE asiento ADD CONSTRAINT uq_asiento_bus_numero UNIQUE (bus_id, numero_asiento);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_parada_orden') THEN
        ALTER TABLE parada_frecuencia ADD CONSTRAINT uq_parada_orden UNIQUE (frecuencia_id, orden);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_ruta_hoja_fecha') THEN
        ALTER TABLE ruta ADD CONSTRAINT uq_ruta_hoja_fecha UNIQUE (hoja_ruta_id, fecha_ruta);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tipo_asiento_nombre_key') THEN
        ALTER TABLE tipo_asiento ADD CONSTRAINT tipo_asiento_nombre_key UNIQUE (nombre);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tipo_descuento_nombre_key') THEN
        ALTER TABLE tipo_descuento ADD CONSTRAINT tipo_descuento_nombre_key UNIQUE (nombre);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'metodo_pago_nombre_key') THEN
        ALTER TABLE metodo_pago ADD CONSTRAINT metodo_pago_nombre_key UNIQUE (nombre);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'boleto_codigo_boleto_key') THEN
        ALTER TABLE boleto ADD CONSTRAINT boleto_codigo_boleto_key UNIQUE (codigo_boleto);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bus_placa_key') THEN
        ALTER TABLE bus ADD CONSTRAINT bus_placa_key UNIQUE (placa);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'configuracion_app_clave_key') THEN
        ALTER TABLE configuracion_app ADD CONSTRAINT configuracion_app_clave_key UNIQUE (clave);
      END IF;
    END $$;
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
