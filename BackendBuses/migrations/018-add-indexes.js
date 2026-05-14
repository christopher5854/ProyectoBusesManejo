/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  // Índices para optimización de queries
  db.runSql(`
    -- Índices para usuario
    CREATE INDEX idx_usuario_cooperativa ON usuario(cooperativa_id);
    CREATE INDEX idx_usuario_rol ON usuario(rol_id);
    
    -- Índices para bus
    CREATE INDEX idx_bus_cooperativa ON bus(cooperativa_id);
    
    -- Índices para asiento
    CREATE INDEX idx_asiento_bus ON asiento(bus_id);
    CREATE INDEX idx_asiento_disponible ON asiento(bus_id, disponible) WHERE disponible = true AND activo = true;
    
    -- Índices para frecuencia
    CREATE INDEX idx_frecuencia_coop ON frecuencia(cooperativa_id);
    CREATE INDEX idx_frecuencia_origen ON frecuencia(ciudad_origen_id);
    CREATE INDEX idx_frecuencia_destino ON frecuencia(ciudad_destino_id);
    
    -- Índices para ruta
    CREATE INDEX idx_ruta_estado ON ruta(estado);
    CREATE INDEX idx_ruta_fecha ON ruta(fecha_ruta);
    
    -- Índices para hoja_ruta
    CREATE INDEX idx_hoja_ruta_frecuencia ON hoja_ruta(frecuencia_id);
    CREATE INDEX idx_hoja_ruta_bus ON hoja_ruta(bus_id);
    
    -- Índices para boleto
    CREATE INDEX idx_boleto_ruta ON boleto(ruta_id);
    CREATE INDEX idx_boleto_cliente ON boleto(cliente_id);
    CREATE INDEX idx_boleto_estado ON boleto(estado_boleto);
    CREATE INDEX idx_acceso_boleto ON acceso_pasajero(boleto_id);
  `, callback);
};

exports.down = function (db, callback) {
  db.runSql(`
    DROP INDEX IF EXISTS idx_usuario_cooperativa;
    DROP INDEX IF EXISTS idx_usuario_rol;
    DROP INDEX IF EXISTS idx_bus_cooperativa;
    DROP INDEX IF EXISTS idx_asiento_bus;
    DROP INDEX IF EXISTS idx_asiento_disponible;
    DROP INDEX IF EXISTS idx_frecuencia_coop;
    DROP INDEX IF EXISTS idx_frecuencia_origen;
    DROP INDEX IF EXISTS idx_frecuencia_destino;
    DROP INDEX IF EXISTS idx_ruta_estado;
    DROP INDEX IF EXISTS idx_ruta_fecha;
    DROP INDEX IF EXISTS idx_hoja_ruta_frecuencia;
    DROP INDEX IF EXISTS idx_hoja_ruta_bus;
    DROP INDEX IF EXISTS idx_boleto_ruta;
    DROP INDEX IF EXISTS idx_boleto_cliente;
    DROP INDEX IF EXISTS idx_boleto_estado;
    DROP INDEX IF EXISTS idx_acceso_boleto;
  `, callback);
};
