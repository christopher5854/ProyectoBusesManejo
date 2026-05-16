/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  // Crear funciones y triggers para mantener integridad de datos
  db.runSql(`
    -- Función para validar y actualizar estado de boleto cuando se escanea
    CREATE OR REPLACE FUNCTION trg_acceso_usar_boleto()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.resultado = 'valido' THEN
        UPDATE boleto SET estado_boleto = 'usado' WHERE id = NEW.boleto_id;
      ELSIF NEW.resultado = 'expirado' THEN
        UPDATE boleto SET estado_boleto = 'expirado' WHERE id = NEW.boleto_id;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Función para marcar asiento como no disponible cuando se vende boleto
    CREATE OR REPLACE FUNCTION trg_boleto_marcar_asiento()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE asiento SET disponible = false WHERE id = NEW.asiento_id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Función para liberar asiento cuando se cancela boleto
    CREATE OR REPLACE FUNCTION trg_boleto_liberar_asiento()
    RETURNS TRIGGER AS $$
    BEGIN
      IF OLD.estado_boleto != NEW.estado_boleto AND NEW.estado_boleto = 'cancelado' THEN
        UPDATE asiento SET disponible = true WHERE id = NEW.asiento_id;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `, callback);
};

exports.down = function (db, callback) {
  db.runSql(`
    DROP FUNCTION IF EXISTS trg_acceso_usar_boleto() CASCADE;
    DROP FUNCTION IF EXISTS trg_boleto_marcar_asiento() CASCADE;
    DROP FUNCTION IF EXISTS trg_boleto_liberar_asiento() CASCADE;
  `, callback);
};
