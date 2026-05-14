# ⚡ Guía Rápida de Migraciones - Sistema de Cooperativa de Buses

## 🎯 Para Ejecutar Migraciones (PRIMERA VEZ)

### Windows:
```bash
cd BackendBuses
npm install
run-migrations.bat
```

### macOS/Linux:
```bash
cd BackendBuses
npm install
chmod +x run-migrations.sh
./run-migrations.sh
```

### Manual (cualquier SO):
```bash
cd BackendBuses
npm install
npm run migrate:up
```

---

## ✅ Verificar Éxito

Conectarse a la BD:
```bash
psql -U postgres -d cooperativa_db
```

Ver tablas (deberían ser 17):
```sql
\dt
```

Deberías ver:
```
acceso_pasajero
asiento
boleto
bus
ciudad
configuracion_app
cooperativa
frecuencia
hoja_ruta
metodo_pago
notificacion
parada_frecuencia
rol
ruta
tipo_asiento
tipo_descuento
usuario
```

Ver funciones y triggers:
```sql
\df+  -- Ver funciones
\dy   -- Ver triggers
```

---

## 📦 22 Migraciones Aplicadas

✅ 01-07: Tablas maestras y estructuras base  
✅ 08-17: Tablas complejas con relaciones  
✅ 18-19: Índices y restricciones CHECK  
✅ 20-21: Funciones y triggers automáticos  
✅ 22: Restricciones UNIQUE finales  

---

## 🔄 Comandos Útiles

```bash
# Avanzar migraciones
npm run migrate:up

# Retroceder una migración
npm run migrate:down

# Ver estado
npx db-migrate db:migration:unlock --env dev
```

---

## 📊 Datos de Prueba (Opcional)

Después de migraciones, conecta a PostgreSQL e inserta datos básicos:

```sql
-- Roles básicos
INSERT INTO rol (nombre, descripcion) VALUES 
('admin', 'Administrador'),
('operador', 'Operador de cooperativa'),
('cliente', 'Cliente del sistema');

-- Cooperativa
INSERT INTO cooperativa (nombre, ruc) VALUES
('CoopBuses Quito', '1234567890001');

-- Ciudades
INSERT INTO ciudad (nombre, provincia) VALUES 
('Quito', 'Pichincha'),
('Guayaquil', 'Guayas'),
('Cuenca', 'Azuay');
```

---

## ⚠️ Si Hay Error

1. **Verificar conexión PostgreSQL:**
   ```bash
   psql -U postgres -h localhost
   ```

2. **Verificar variables de entorno (.env):**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cooperativa_db
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña
   ```

3. **Ver logs detallados:**
   ```bash
   npm run migrate:up -- --verbose
   ```

4. **Reset completo (⚠️ CUIDADO - elimina datos):**
   ```bash
   npm run migrate:down -- --count 22
   ```

---

## 📝 Para Nuevo Miembro del Equipo

1. Clonar repo
2. `cd BackendBuses && npm install`
3. Crear `.env` (copiar de `.env.example`)
4. `npm run migrate:up`
5. ¡Listo! BD sincronizada con 17 tablas + triggers

---

## 🔗 Relaciones Principales

```
cooperativa → usuario, bus, frecuencia, hoja_ruta
ciudad → frecuencia, parada_frecuencia, boleto
bus → asiento → boleto
frecuencia → parada_frecuencia, hoja_ruta → ruta → boleto
usuario → acceso_pasajero (trigger al escanear)
boleto → acceso_pasajero (marca como usado)
```

---
