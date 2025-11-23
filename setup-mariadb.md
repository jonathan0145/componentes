# Configuración Inicial de MariaDB para Inmotech

## 1. Instalación de MariaDB (si no está instalado)

### En Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mariadb-server mariadb-client
```

### En CentOS/RHEL:
```bash
sudo yum install mariadb-server mariadb
```

### En Arch Linux:
```bash
sudo pacman -S mariadb
```

### Verificar instalación:
```bash
mysql --version
```

## 2. Iniciar y Habilitar MariaDB

```bash
# Iniciar el servicio
sudo systemctl start mariadb

# Habilitar inicio automático
sudo systemctl enable mariadb

# Verificar estado
sudo systemctl status mariadb
```

## 3. Configuración Inicial de Seguridad

### Opción A: Usar el Script Automático (Si está disponible)

```bash
sudo mysql_secure_installation
```

**Responde a las preguntas:**
1. **Enter current password for root**: Presiona Enter (no hay contraseña inicialmente)
2. **Switch to unix_socket authentication**: N
3. **Change the root password**: Y (Sí, elige una contraseña segura)
4. **Remove anonymous users**: Y
5. **Disallow root login remotely**: Y
6. **Remove test database**: Y
7. **Reload privilege tables**: Y

### Opción B: Configuración Manual (Si el comando no funciona)

Si el comando `mysql_secure_installation` no está disponible, configura la seguridad manualmente:

```bash
# Acceder a MariaDB como root (sin contraseña inicialmente)
sudo mysql
```

Dentro de MariaDB, ejecuta estos comandos:

```sql
-- Establecer contraseña para root (CAMBIA 'TuContraseñaSegura' por tu contraseña)
ALTER USER 'root'@'localhost' IDENTIFIED BY 'TuContraseñaSegura';

-- Eliminar usuarios anónimos
DELETE FROM mysql.user WHERE User='';

-- Eliminar acceso remoto de root
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- Eliminar base de datos de prueba
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Verificar usuarios
SELECT User, Host FROM mysql.user;

EXIT;
```

**Verificar que funciona:**

```bash
# Ahora deberías poder acceder con la contraseña
sudo mysql -u root -p
```

## 4. Acceder a MariaDB como Root

```bash
sudo mysql -u root -p
```

Ingresa la contraseña que configuraste en el paso anterior.

## 5. Crear la Base de Datos Inmotech

Una vez dentro de MariaDB, ejecuta:

```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS inmotech 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_general_ci;

-- Verificar que se creó correctamente
SHOW DATABASES;

-- Seleccionar la base de datos
USE inmotech;
```

## 6. Crear Usuario para la Aplicación

### Opción A: Usuario para Localhost (Recomendado para Desarrollo)

```sql
-- Crear el usuario
CREATE USER 'inmotech_user'@'localhost' IDENTIFIED BY 'TuContraseñaSegura123!';

-- Otorgar todos los privilegios en la base de datos inmotech
GRANT ALL PRIVILEGES ON inmotech.* TO 'inmotech_user'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;
```

### Opción B: Usuario con Acceso Remoto (Para Producción/Red)

```sql
-- Crear usuario con acceso desde cualquier host
CREATE USER 'inmotech_user'@'%' IDENTIFIED BY 'TuContraseñaSegura123!';

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON inmotech.* TO 'inmotech_user'@'%';

-- Aplicar los cambios
FLUSH PRIVILEGES;
```

### Opción C: Usuario con Acceso desde IP Específica

```sql
-- Averigua primero la IP desde donde te conectarás
-- Para ver tu IP actual: ip a
-- Para ver IPs que se conectan: SELECT host FROM information_schema.processlist;

-- Ejemplo 1: IP de máquina virtual (10.0.2.15)
CREATE USER 'inmotech_user'@'10.0.2.15' IDENTIFIED BY 'TuContraseñaSegura123!';
GRANT ALL PRIVILEGES ON inmotech.* TO 'inmotech_user'@'10.0.2.15';

-- Ejemplo 2: IP del host de VirtualBox (normalmente 10.0.2.2)
CREATE USER 'inmotech_user'@'10.0.2.2' IDENTIFIED BY 'TuContraseñaSegura123!';
GRANT ALL PRIVILEGES ON inmotech.* TO 'inmotech_user'@'10.0.2.2';

-- Ejemplo 3: Rango de IPs de tu red local (10.0.2.%)
CREATE USER 'inmotech_user'@'10.0.2.%' IDENTIFIED BY 'TuContraseñaSegura123!';
GRANT ALL PRIVILEGES ON inmotech.* TO 'inmotech_user'@'10.0.2.%';

-- Aplicar los cambios
FLUSH PRIVILEGES;
```

**Comandos útiles para encontrar tu IP:**

```bash
# Ver tu IP actual
ip a

# Ver la IP del gateway (host en VirtualBox)
ip route | grep default

# Dentro de MariaDB, ver desde dónde te conectas
SELECT user, host FROM information_schema.processlist WHERE user = 'inmotech_user';
```

## 7. Verificar el Usuario Creado

```sql
-- Ver todos los usuarios
SELECT User, Host FROM mysql.user;

-- Ver privilegios del usuario
SHOW GRANTS FOR 'inmotech_user'@'localhost';

-- Salir de MariaDB
EXIT;
```

## 8. Probar la Conexión con el Nuevo Usuario

```bash
mysql -u inmotech_user -p inmotech
```

Ingresa la contraseña que configuraste. Si todo está bien, deberías estar dentro de la base de datos.

```sql
-- Verificar que estás en la base de datos correcta
SELECT DATABASE();

-- Ver las tablas (estará vacía hasta que importes el SQL)
SHOW TABLES;

EXIT;
```

## 9. Importar el Archivo SQL

Ahora que tienes la base de datos y el usuario creados, importa el archivo SQL.

**IMPORTANTE:** Asegúrate de estar en el directorio donde está el archivo SQL o usa la ruta completa.

### Opción A: Navegar al directorio primero

```bash
# Ir al directorio donde está el archivo SQL
cd /home/developer/Desktop/clonaciones/componentes

# Importar el archivo
mysql -u inmotech_user -p inmotech < "inmotech (1).sql"
```

### Opción B: Usar la ruta completa

```bash
mysql -u inmotech_user -p inmotech < "/home/developer/Desktop/clonaciones/componentes/inmotech (1).sql"
```

### Opción C: Como root (alternativa)

```bash
mysql -u root -p inmotech < "/home/developer/Desktop/clonaciones/componentes/inmotech (1).sql"
```

**Verificar la importación:**

```bash
mysql -u inmotech_user -p inmotech

# Dentro de MySQL
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM properties;
EXIT;
```

## 10. Configurar el Backend

Actualiza el archivo `backend/config/config.json`:

```json
{
  "development": {
    "username": "inmotech_user",
    "password": "TuContraseñaSegura123!",
    "database": "inmotech",
    "host": "localhost",
    "dialect": "mysql",
    "port": 3306,
    "logging": false
  },
  "production": {
    "username": "inmotech_user",
    "password": "TuContraseñaSegura123!",
    "database": "inmotech",
    "host": "localhost",
    "dialect": "mysql",
    "port": 3306,
    "logging": false,
    "pool": {
      "max": 5,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    }
  }
}
```

**IMPORTANTE:** En producción, usa variables de entorno en lugar de hardcodear las credenciales.

## 11. Usar Variables de Entorno (Recomendado)

Crea un archivo `.env` en la raíz de `backend/`:

```bash
# Backend .env
DB_USERNAME=inmotech_user
DB_PASSWORD=TuContraseñaSegura123!
DB_NAME=inmotech
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
```

Actualiza `backend/config/database.js` para usar variables de entorno:

```javascript
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'inmotech_user',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'inmotech',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
```

## 12. Comandos Útiles de Gestión

### Gestión de Usuarios

```sql
-- Ver todos los usuarios
SELECT User, Host FROM mysql.user;

-- Cambiar contraseña de usuario
ALTER USER 'inmotech_user'@'localhost' IDENTIFIED BY 'NuevaContraseña';

-- Eliminar usuario
DROP USER 'inmotech_user'@'localhost';

-- Revocar privilegios
REVOKE ALL PRIVILEGES ON inmotech.* FROM 'inmotech_user'@'localhost';
```

### Gestión de Base de Datos

```sql
-- Ver todas las bases de datos
SHOW DATABASES;

-- Ver tamaño de la base de datos
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'inmotech'
GROUP BY table_schema;

-- Eliminar base de datos (¡CUIDADO!)
DROP DATABASE IF EXISTS inmotech;

-- Hacer backup
-- Ejecutar desde terminal (no desde MySQL)
```

```bash
mysqldump -u inmotech_user -p inmotech > backup_inmotech_$(date +%Y%m%d_%H%M%S).sql
```

### Gestión de Tablas

```sql
USE inmotech;

-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE users;

-- Ver contenido de una tabla
SELECT * FROM users LIMIT 5;

-- Contar registros
SELECT COUNT(*) FROM users;
```

## 13. Habilitar Acceso Remoto (Opcional)

Si necesitas conectarte desde otra máquina:

### Paso 1: Editar configuración de MariaDB

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

Busca la línea:
```
bind-address = 127.0.0.1
```

Cámbiala a:
```
bind-address = 0.0.0.0
```

### Paso 2: Reiniciar MariaDB

```bash
sudo systemctl restart mariadb
```

### Paso 3: Configurar firewall

```bash
# Ubuntu/Debian con UFW
sudo ufw allow 3306/tcp

# CentOS/RHEL con firewalld
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

## 14. Solución de Problemas

### Error: "Access denied for user"
```bash
# Reiniciar MySQL sin verificación de contraseñas
sudo systemctl stop mariadb
sudo mysqld_safe --skip-grant-tables &
mysql -u root

# Dentro de MySQL
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nueva_contraseña';
EXIT;

# Reiniciar normalmente
sudo systemctl restart mariadb
```

### Error: "Can't connect to MySQL server"
```bash
# Verificar que MariaDB está corriendo
sudo systemctl status mariadb

# Verificar el puerto
sudo netstat -tlnp | grep 3306

# Ver logs
sudo tail -f /var/log/mysql/error.log
```

### Resetear contraseña de root
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nueva_contraseña';
FLUSH PRIVILEGES;
EXIT;
```

## Resumen de Comandos Rápidos

```bash
# Instalar MariaDB
sudo apt install mariadb-server mariadb-client

# Configurar seguridad
sudo mysql_secure_installation

# Acceder como root
sudo mysql -u root -p

# Crear base de datos y usuario (dentro de MySQL)
CREATE DATABASE inmotech DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'inmotech_user'@'localhost' IDENTIFIED BY 'TuContraseña';
GRANT ALL PRIVILEGES ON inmotech.* TO 'inmotech_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Importar SQL
mysql -u inmotech_user -p inmotech < "inmotech (1).sql"

# Verificar
mysql -u inmotech_user -p inmotech
SHOW TABLES;
```

¡Listo! Ya tienes MariaDB configurado con tu base de datos Inmotech y un usuario específico para la aplicación.
