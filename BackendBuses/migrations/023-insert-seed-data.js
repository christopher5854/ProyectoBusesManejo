/** @type {import('db-migrate').Migration} */
exports.up = function (db, callback) {
  db.runSql(`
    -- Insertar roles
    INSERT INTO rol (nombre, descripcion) VALUES 
    ('superadmin', 'Administrador global del sistema'),
    ('admin', 'Administrador de cooperativa'),
    ('oficinista', 'Venta de boletos en oficina'),
    ('conductor', 'Conductor del bus'),
    ('controlador', 'Control de acceso en terminal'),
    ('cliente', 'Pasajero registrado');

    -- Insertar cooperativa
    INSERT INTO cooperativa (nombre, ruc, telefono, email, direccion) VALUES
    ('FlashTour', '1891234560001', '032-123456', 'info@tungurahua.com', 'Av. Los Shyris, Ambato');

    -- Insertar ciudades
    INSERT INTO ciudad (nombre, provincia) VALUES 
    ('Ambato', 'Tungurahua'),
    ('Quito', 'Pichincha'),
    ('Guayaquil', 'Guayas'),
    ('Cuenca', 'Azuay'),
    ('Riobamba', 'Chimborazo'),
    ('Latacunga', 'Cotopaxi'),
    ('Ibarra', 'Imbabura');

    -- Insertar tipos de asiento
    INSERT INTO tipo_asiento (nombre, descripcion, precio_base) VALUES
    ('normal', 'Asiento estándar de bus interprovincial', 0.00),
    ('ejecutivo', 'Asiento reclinable con mayor espacio', 5.00),
    ('VIP', 'Asiento cama con servicios adicionales', 15.00);

    -- Insertar métodos de pago
    INSERT INTO metodo_pago (nombre, activo) VALUES
    ('Efectivo', true),
    ('Tarjeta Débito', true),
    ('Tarjeta Crédito', true),
    ('Transferencia Bancaria', true);

    -- Insertar tipos de descuento
    INSERT INTO tipo_descuento (nombre, porcentaje, requiere_validacion) VALUES
    ('Estudiante', 10, true),
    ('Adulto Mayor', 25, false),
    ('Discapacitado', 50, true);

    -- Insertar buses
    INSERT INTO bus (cooperativa_id, numero_interno, placa, marca_chasis, marca_carroceria, anio_fabricacion, capacidad_total, activo) VALUES
    (1, 'B-001', 'ABD-1234', 'Mercedes Benz', 'Marcopolo', 2020, 40, true),
    (1, 'B-002', 'XYZ-9921', 'Volvo', 'Busscar', 2019, 40, true),
    (1, 'B-003', 'GHJ-4455', 'Scania', 'Irizar', 2021, 44, true);

    -- Insertar frecuencias
    INSERT INTO frecuencia (cooperativa_id, ciudad_origen_id, ciudad_destino_id, hora_salida, duracion_estimada, precio, activa, tipo_viaje) VALUES
    (1, 1, 3, '05:30:00', '02:30:00', 4.50, true, 'ordinario'),
    (1, 1, 3, '08:00:00', '02:30:00', 4.50, true, 'ordinario'),
    (1, 1, 3, '13:00:00', '02:30:00', 4.50, true, 'ordinario'),
    (1, 1, 4, '06:00:00', '04:00:00', 7.00, true, 'ordinario'),
    (1, 1, 4, '14:00:00', '04:00:00', 7.00, true, 'ordinario'),
    (1, 1, 5, '07:00:00', '03:30:00', 6.00, true, 'ordinario'),
    (1, 1, 6, '06:30:00', '01:00:00', 2.50, true, 'ordinario');

    -- Insertar usuarios (con contraseñas encriptadas con bcrypt)
    INSERT INTO usuario (rol_id, cooperativa_id, cedula, nombres, apellidos, email, password_hash) VALUES
    (2, 1, '1803456789', 'Carlos',  'Pérez',   'admin@flashtour.com',      '$2a$06$f/jdlaKJ6haLwMwHNGviceecwNBqtkVDN98uikv.1f2y9mYz12gri'),
    (3, 1, '1804567890', 'María',   'Gómez',   'oficina1@flashtour.com',   '$2a$06$cGHswczAXVtqTYJkDHy1Au0gE7UP67mZkd1t1UOiDeouSkixzApKC'),
    (3, 1, '1805678901', 'Roberto', 'Salazar', 'oficina2@flashtour.com',   '$2a$06$KEcTPTj/Ixtxo7y6/F8aauqj7UHUXJy/TxXnpy77RC5KckSuN9j9S'),
    (4, 1, '1806789012', 'Pedro',   'Ruiz',    'conductor1@flashtour.com', '$2a$06$UO9FiW96.UM7F/wPQSFVzO4ziW71/cyOZn.gKmaiClf08pAbot4za'),
    (4, 1, '1807890123', 'Jorge',   'Medina',  'conductor2@flashtour.com', '$2a$06$5EezULYxN2JL8/vA2Q6GK.VkhL5trgAxs0c0cKz31QiKBZp1lvsIm'),
    (5, 1, '1808901234', 'Luis',    'Castro',  'control1@flashtour.com',   '$2a$06$UAWRG2gBSgri8bMZ3AWyBux03kC4kJ.JKwl0q.YwKi9PkQs1zoD4m'),
    (6, NULL,'1809012345','Juan',   'López',   'juan@gmail.com',           '$2a$06$Ips34b9jg.1rxZ95c1yQSe9XImno0exVZTCz3wGfymeOjtMm2395q'),
    (6, NULL,'1800123456','Ana',    'Torres',  'ana@gmail.com',            '$2a$06$SUbGkZvUdAVfkuNP37vcsOFN87VV343FV5z1fdOgwto9WNXDvSLoK'),
    (6, NULL,'1801234567','Diego',  'Vargas',  'diego@gmail.com',          '$2a$06$Mo3cRpu8I4SyGfBLlf0hvuvKi46bZPahhPRgYbjX/zcV5e79NE3SC');
  `, callback);
};

exports.down = function (db, callback) {
  db.runSql(`
    DELETE FROM acceso_pasajero;
    DELETE FROM boleto;
    DELETE FROM ruta;
    DELETE FROM hoja_ruta;
    DELETE FROM parada_frecuencia;
    DELETE FROM frecuencia;
    DELETE FROM asiento;
    DELETE FROM bus;
    DELETE FROM usuario;
    DELETE FROM tipo_descuento;
    DELETE FROM metodo_pago;
    DELETE FROM tipo_asiento;
    DELETE FROM ciudad;
    DELETE FROM cooperativa;
    DELETE FROM rol;
  `, callback);
};
