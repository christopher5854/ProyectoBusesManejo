/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  // Crear triggers
  db.runSql(`
    -- Trigger para actualizar estado de boleto al escanear
    CREATE TRIGGER trg_after_insert_acceso 
    AFTER INSERT ON acceso_pasajero 
    FOR EACH ROW 
    EXECUTE FUNCTION trg_acceso_usar_boleto();

    -- Trigger para marcar asiento como ocupado al vender boleto
    CREATE TRIGGER trg_after_insert_boleto 
    AFTER INSERT ON boleto 
    FOR EACH ROW 
    EXECUTE FUNCTION trg_boleto_marcar_asiento();

    -- Trigger para liberar asiento al cancelar boleto
    CREATE TRIGGER trg_after_update_boleto 
    AFTER UPDATE ON boleto 
    FOR EACH ROW 
    EXECUTE FUNCTION trg_boleto_liberar_asiento();
  `, callback);
};

exports.down = function (db, callback) {
  db.runSql(`
    DROP TRIGGER IF EXISTS trg_after_insert_acceso ON acceso_pasajero;
    DROP TRIGGER IF EXISTS trg_after_insert_boleto ON boleto;
    DROP TRIGGER IF EXISTS trg_after_update_boleto ON boleto;
  `, callback);
};
