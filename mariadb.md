# Guía para Importar la Base de Datos en MariaDB

## Requisitos Previos
- MariaDB instalado y ejecutándose
- Acceso a la línea de comandos (terminal)
- Archivo `inmotech (1).sql` en el directorio del proyecto

## Opción 1: Importar desde la Terminal (Recomendado)

### Paso 1: Acceder a MariaDB
```bash
mysql -u root -p
```
Te pedirá la contraseña del usuario root de MariaDB.

### Paso 2: Crear la base de datos (opcional)
Si quieres crear manualmente la base de datos primero:
```sql
CREATE DATABASE IF NOT EXISTS inmotech DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
EXIT;
```

### Paso 3: Importar el archivo SQL
```bash
mysql -u root -p inmotech < "inmotech (1).sql"
```

O si prefieres especificar la base de datos dentro del comando:
```bash
mysql -u root -p < "inmotech (1).sql"
```

### Paso 4: Verificar la importación
```bash
mysql -u root -p inmotech
```

Luego ejecuta:
```sql
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM properties;
EXIT;
```

## Opción 2: Importar desde MySQL Client

### Paso 1: Conectar a MariaDB
```bash
mysql -u root -p
```

### Paso 2: Usar el comando SOURCE
```sql
SOURCE /home/developer/Desktop/clonaciones/componentes/inmotech (1).sql;
```

**Nota:** Reemplaza la ruta con la ruta absoluta donde está ubicado tu archivo SQL.

## Opción 3: Usando phpMyAdmin (si lo tienes instalado)

1. Accede a phpMyAdmin desde tu navegador
2. Click en "Importar" en el menú superior
3. Click en "Elegir archivo" y selecciona `inmotech (1).sql`
4. Asegúrate que el formato está en "SQL"
5. Click en "Continuar" al final de la página

## Crear Usuario para la Aplicación

Es recomendable crear un usuario específico para tu aplicación:

```sql
-- Conectarse a MariaDB
mysql -u root -p

-- Crear usuario
CREATE USER 'inmotech_user'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON inmotech.* TO 'inmotech_user'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

EXIT;
```

## Configurar la Conexión en tu Aplicación

Actualiza tu archivo de configuración `backend/config/config.json` con las credenciales:

```json
{
  "development": {
    "username": "inmotech_user",
    "password": "tu_contraseña_segura",
    "database": "inmotech",
    "host": "localhost",
    "dialect": "mysql",
    "port": 3306
  }
}
```

## Verificación Final

Ejecuta estos comandos para verificar que todo está correcto:

```sql
mysql -u root -p

USE inmotech;

-- Ver todas las tablas
SHOW TABLES;

-- Verificar estructura de tablas principales
DESCRIBE users;
DESCRIBE properties;
DESCRIBE roles;

-- Verificar datos importados
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_properties FROM properties;
SELECT COUNT(*) as total_roles FROM roles;

-- Ver los roles existentes
SELECT * FROM roles;

EXIT;
```

## Solución de Problemas Comunes

### Error: "Access denied"
- Verifica que estés usando la contraseña correcta
- Asegúrate de que MariaDB esté ejecutándose: `sudo systemctl status mariadb`

### Error: "Database already exists"
- Elimina la base de datos existente si quieres empezar de nuevo:
```sql
DROP DATABASE IF EXISTS inmotech;
```

### Error de permisos
- En Linux, asegúrate de tener permisos de lectura en el archivo SQL:
```bash
chmod 644 "inmotech (1).sql"
```

### MariaDB no inicia
```bash
# Verificar estado
sudo systemctl status mariadb

# Iniciar MariaDB
sudo systemctl start mariadb

# Habilitar inicio automático
sudo systemctl enable mariadb
```

## Comandos Útiles

```bash
# Ver versión de MariaDB
mysql --version

# Iniciar MariaDB
sudo systemctl start mariadb

# Detener MariaDB
sudo systemctl stop mariadb

# Reiniciar MariaDB
sudo systemctl restart mariadb

# Ver logs de MariaDB
sudo journalctl -u mariadb -f
```

## Notas Importantes

1. **Backup**: Antes de importar, haz un backup si ya tienes datos:
   ```bash
   mysqldump -u root -p inmotech > backup_$(date +%Y%m%d).sql
   ```

2. **Seguridad**: Cambia las contraseñas por defecto y no uses el usuario root en producción.

3. **Permisos**: El archivo SQL ya incluye la creación de la base de datos, así que no necesitas crearla manualmente.

4. **Datos de Prueba**: El archivo incluye algunos datos de ejemplo en las tablas `users`, `properties`, `profiles` y `roles`.

5. **Migraciones**: Si usas Sequelize, asegúrate de que las migraciones estén sincronizadas con la estructura de la base de datos.
