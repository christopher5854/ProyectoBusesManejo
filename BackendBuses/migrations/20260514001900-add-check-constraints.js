/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  // Agregar restricciones CHECK
  db.runSql(`
    -- Restricciones para cooperativa
    ALTER TABLE cooperativa ADD CONSTRAINT ck_cooperativa_ruc_len CHECK (length(ruc) = 13);
    
    -- Restricciones para usuario
    ALTER TABLE usuario ADD CONSTRAINT ck_usuario_cedula_len CHECK (length(cedula) = 10);
    ALTER TABLE usuario ADD CONSTRAINT ck_usuario_discapacidad_pct 
      CHECK (discapacidad = false OR (discapacidad = true AND porcentaje_discapacidad >= 1 AND porcentaje_discapacidad <= 100));
    
    -- Restricciones para bus
    ALTER TABLE bus ADD CONSTRAINT ck_bus_capacidad CHECK (capacidad_total >= 1 AND capacidad_total <= 100);
    
    -- Restricciones para tipo_asiento
    ALTER TABLE tipo_asiento ADD CONSTRAINT ck_tipo_asiento_precio CHECK (precio_base >= 0);
    
    -- Restricciones para asiento
    ALTER TABLE asiento ADD CONSTRAINT ck_asiento_piso CHECK (piso = ANY (ARRAY[1, 2]));
    
    -- Restricciones para frecuencia
    ALTER TABLE frecuencia ADD CONSTRAINT ck_frecuencia_ciudades CHECK (ciudad_origen_id <> ciudad_destino_id);
    ALTER TABLE frecuencia ADD CONSTRAINT ck_frecuencia_precio CHECK (precio > 0);
    ALTER TABLE frecuencia ADD CONSTRAINT ck_frecuencia_tipo 
      CHECK (tipo_viaje::text = ANY (ARRAY['ordinario', 'ejecutivo', 'directo', 'nocturno']::text[]));
    
    -- Restricciones para parada_frecuencia
    ALTER TABLE parada_frecuencia ADD CONSTRAINT ck_parada_orden CHECK (orden > 0);
    ALTER TABLE parada_frecuencia ADD CONSTRAINT ck_parada_precio CHECK (precio >= 0);
    
    -- Restricciones para hoja_ruta
    ALTER TABLE hoja_ruta ADD CONSTRAINT ck_hoja_ruta_fechas CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio);
    ALTER TABLE hoja_ruta ADD CONSTRAINT ck_hoja_ruta_generacion 
      CHECK (generacion::text = ANY (ARRAY['manual', 'automatica', 'importada']::text[]));
    
    -- Restricciones para ruta
    ALTER TABLE ruta ADD CONSTRAINT ck_ruta_estado 
      CHECK (estado::text = ANY (ARRAY['programada', 'en_curso', 'completada', 'cancelada']::text[]));
    
    -- Restricciones para tipo_descuento
    ALTER TABLE tipo_descuento ADD CONSTRAINT ck_tipo_descuento_pct CHECK (porcentaje >= 0 AND porcentaje <= 100);
    
    -- Restricciones para boleto
    ALTER TABLE boleto ADD CONSTRAINT ck_boleto_ciudades CHECK (ciudad_abordaje_id <> ciudad_destino_id);
    ALTER TABLE boleto ADD CONSTRAINT ck_boleto_precios 
      CHECK (precio_base > 0 AND descuento_aplicado >= 0 AND precio_final >= 0);
    ALTER TABLE boleto ADD CONSTRAINT ck_boleto_descuento CHECK (descuento_aplicado <= precio_base);
    ALTER TABLE boleto ADD CONSTRAINT ck_boleto_precio_final 
      CHECK (precio_final = (precio_base - descuento_aplicado));
    ALTER TABLE boleto ADD CONSTRAINT ck_boleto_estado_pago 
      CHECK (estado_pago::text = ANY (ARRAY['pendiente', 'pagado', 'rechazado', 'reembolsado']::text[]));
    ALTER TABLE boleto ADD CONSTRAINT ck_boleto_estado_boleto 
      CHECK (estado_boleto::text = ANY (ARRAY['emitido', 'usado', 'cancelado', 'expirado']::text[]));
    
    -- Restricciones para acceso_pasajero
    ALTER TABLE acceso_pasajero ADD CONSTRAINT ck_acceso_resultado 
      CHECK (resultado::text = ANY (ARRAY['valido', 'invalido', 'expirado', 'ya_usado']::text[]));
  `, callback);
};

exports.down = function (db, callback) {
  db.runSql(`
    ALTER TABLE cooperativa DROP CONSTRAINT IF EXISTS ck_cooperativa_ruc_len;
    ALTER TABLE usuario DROP CONSTRAINT IF EXISTS ck_usuario_cedula_len;
    ALTER TABLE usuario DROP CONSTRAINT IF EXISTS ck_usuario_discapacidad_pct;
    ALTER TABLE bus DROP CONSTRAINT IF EXISTS ck_bus_capacidad;
    ALTER TABLE tipo_asiento DROP CONSTRAINT IF EXISTS ck_tipo_asiento_precio;
    ALTER TABLE asiento DROP CONSTRAINT IF EXISTS ck_asiento_piso;
    ALTER TABLE frecuencia DROP CONSTRAINT IF EXISTS ck_frecuencia_ciudades;
    ALTER TABLE frecuencia DROP CONSTRAINT IF EXISTS ck_frecuencia_precio;
    ALTER TABLE frecuencia DROP CONSTRAINT IF EXISTS ck_frecuencia_tipo;
    ALTER TABLE parada_frecuencia DROP CONSTRAINT IF EXISTS ck_parada_orden;
    ALTER TABLE parada_frecuencia DROP CONSTRAINT IF EXISTS ck_parada_precio;
    ALTER TABLE hoja_ruta DROP CONSTRAINT IF EXISTS ck_hoja_ruta_fechas;
    ALTER TABLE hoja_ruta DROP CONSTRAINT IF EXISTS ck_hoja_ruta_generacion;
    ALTER TABLE ruta DROP CONSTRAINT IF EXISTS ck_ruta_estado;
    ALTER TABLE tipo_descuento DROP CONSTRAINT IF EXISTS ck_tipo_descuento_pct;
    ALTER TABLE boleto DROP CONSTRAINT IF EXISTS ck_boleto_ciudades;
    ALTER TABLE boleto DROP CONSTRAINT IF EXISTS ck_boleto_precios;
    ALTER TABLE boleto DROP CONSTRAINT IF EXISTS ck_boleto_descuento;
    ALTER TABLE boleto DROP CONSTRAINT IF EXISTS ck_boleto_precio_final;
    ALTER TABLE boleto DROP CONSTRAINT IF EXISTS ck_boleto_estado_pago;
    ALTER TABLE boleto DROP CONSTRAINT IF EXISTS ck_boleto_estado_boleto;
    ALTER TABLE acceso_pasajero DROP CONSTRAINT IF EXISTS ck_acceso_resultado;
  `, callback);
};
