/**
 * Script para crear el rol de administrador en la base de datos
 * Ejecutar con: node src/scripts/createAdminRole.js
 */

require('dotenv').config();
const sequelize = require('../config/database');

// Importar modelos necesarios
const Role = require('../models/Role');
const Permission = require('../models/Permission');

async function createAdminRole() {
    try {
        console.log('🔧 Iniciando creación del rol de administrador...');
        
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida.');

        // Sincronizar modelos (crear tablas si no existen)
        await sequelize.sync();
        console.log('✅ Modelos sincronizados.');

        // Verificar si el rol admin ya existe
        const existingAdminRole = await Role.findOne({ where: { name: 'admin' } });
        if (existingAdminRole) {
            console.log('ℹ️  El rol de administrador ya existe.');
            return existingAdminRole;
        }

        // Crear el rol de administrador
        const adminRole = await Role.create({
            name: 'admin',
            description: 'Administrador del sistema con acceso completo a todas las funcionalidades',
            permissions: JSON.stringify([
                'users.create',
                'users.read',
                'users.update',
                'users.delete',
                'properties.create',
                'properties.read',
                'properties.update',
                'properties.delete',
                'offers.create',
                'offers.read',
                'offers.update',
                'offers.delete',
                'chat.read',
                'chat.moderate',
                'notifications.send',
                'reports.access',
                'system.configure'
            ])
        });

        console.log('✅ Rol de administrador creado exitosamente:');
        console.log(`   ID: ${adminRole.id}`);
        console.log(`   Nombre: ${adminRole.name}`);
        console.log(`   Descripción: ${adminRole.description}`);
        
        return adminRole;

    } catch (error) {
        console.error('❌ Error al crear el rol de administrador:', error.message);
        throw error;
    } finally {
        await sequelize.close();
        console.log('🔌 Conexión a la base de datos cerrada.');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    createAdminRole()
        .then(() => {
            console.log('🎉 Script completado exitosamente.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error en el script:', error);
            process.exit(1);
        });
}

module.exports = createAdminRole;