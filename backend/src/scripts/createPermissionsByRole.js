/**
 * Script para asignar permisos a roles según el sistema de la plataforma Inmotech
 * Ejecutar con: node src/scripts/createPermissionsByRole.js
 */

require('dotenv').config();
const sequelize = require('../config/database');

// Importar modelos necesarios
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Definir permisos por rol
const rolePermissions = {
    'admin': [
        // Acceso completo a todo
        'users.create', 'users.read', 'users.update', 'users.delete', 'users.verify', 'users.suspend',
        'properties.create', 'properties.read', 'properties.update', 'properties.delete', 'properties.approve', 'properties.feature',
        'offers.create', 'offers.read', 'offers.update', 'offers.delete', 'offers.approve', 'offers.negotiate',
        'chat.read', 'chat.write', 'chat.moderate', 'chat.delete', 'chat.archive',
        'files.upload', 'files.download', 'files.delete', 'files.moderate',
        'notifications.send', 'notifications.read', 'notifications.configure',
        'appointments.create', 'appointments.read', 'appointments.update', 'appointments.delete',
        'verifications.request', 'verifications.process', 'verifications.approve', 'verifications.reject',
        'reports.access', 'reports.export', 'analytics.view',
        'system.configure', 'system.backup', 'system.logs',
        'agents.manage', 'agents.assign', 'agents.commission'
    ],
    
    'agent': [
        // Intermediarios/Agentes
        'users.read', 'users.update', // Solo su propio perfil
        'properties.create', 'properties.read', 'properties.update', // Gestión de propiedades
        'offers.create', 'offers.read', 'offers.update', 'offers.negotiate', // Gestión de ofertas
        'chat.read', 'chat.write', 'chat.archive', // Comunicación con clientes
        'files.upload', 'files.download', // Manejo de documentos
        'notifications.read', 'notifications.configure', // Sus notificaciones
        'appointments.create', 'appointments.read', 'appointments.update', 'appointments.delete', // Gestión de citas
        'verifications.request', // Solicitar verificaciones
        'reports.access', 'analytics.view', // Ver sus estadísticas
        'agents.commission' // Ver sus comisiones
    ],
    
    'seller': [
        // Vendedores
        'users.read', 'users.update', // Solo su propio perfil
        'properties.create', 'properties.read', 'properties.update', // Sus propiedades
        'offers.read', 'offers.update', 'offers.negotiate', // Ver y responder ofertas
        'chat.read', 'chat.write', // Comunicación
        'files.upload', 'files.download', // Documentos de sus propiedades
        'notifications.read', 'notifications.configure', // Sus notificaciones
        'appointments.create', 'appointments.read', 'appointments.update', // Citas para mostrar propiedades
        'verifications.request', // Verificar su identidad
        'agents.assign' // Asignar agentes a sus propiedades
    ],
    
    'buyer': [
        // Compradores
        'users.read', 'users.update', // Solo su propio perfil
        'properties.read', // Ver propiedades disponibles
        'offers.create', 'offers.read', 'offers.update', // Hacer ofertas
        'chat.read', 'chat.write', // Comunicación con vendedores/agentes
        'files.upload', 'files.download', // Documentos para ofertas
        'notifications.read', 'notifications.configure', // Sus notificaciones
        'appointments.create', 'appointments.read', 'appointments.update', // Solicitar citas
        'verifications.request' // Verificar su identidad
    ],
    
    'guest': [
        // Usuarios no registrados/invitados
        'properties.read', // Solo ver propiedades públicas
        'users.create' // Registrarse
    ]
};

async function createPermissionsByRole() {
    try {
        console.log('🔧 Iniciando asignación de permisos por rol...');
        
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida.');

        // Sincronizar modelos
        await sequelize.sync();
        console.log('✅ Modelos sincronizados.');

        let processedRoles = 0;

        // Procesar cada rol
        for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
            console.log(`\n🔄 Procesando rol: ${roleName}`);
            
            // Buscar o crear el rol
            const [role, roleCreated] = await Role.findOrCreate({
                where: { name: roleName },
                defaults: {
                    name: roleName,
                    description: getRoleDescription(roleName),
                    permissions: JSON.stringify(permissionNames)
                }
            });

            if (roleCreated) {
                console.log(`✅ Rol '${roleName}' creado.`);
            } else {
                // Actualizar permisos del rol existente
                await role.update({
                    permissions: JSON.stringify(permissionNames)
                });
                console.log(`🔄 Permisos actualizados para rol '${roleName}'.`);
            }

            // Verificar que todos los permisos existan
            let validPermissions = 0;
            let invalidPermissions = 0;

            for (const permissionName of permissionNames) {
                const permission = await Permission.findOne({ where: { name: permissionName } });
                if (permission) {
                    validPermissions++;
                } else {
                    invalidPermissions++;
                    console.log(`⚠️  Permiso no encontrado: ${permissionName}`);
                }
            }

            console.log(`   📊 Permisos válidos: ${validPermissions}`);
            console.log(`   ⚠️  Permisos inválidos: ${invalidPermissions}`);
            console.log(`   📋 Total asignados: ${permissionNames.length}`);

            processedRoles++;
        }

        console.log(`\n🎉 Procesamiento completado:`);
        console.log(`   Roles procesados: ${processedRoles}`);
        console.log(`   Total de roles: ${Object.keys(rolePermissions).length}`);

        // Mostrar resumen de roles y permisos
        console.log(`\n📋 Resumen de permisos por rol:`);
        for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
            console.log(`   ${roleName}: ${permissionNames.length} permisos`);
        }

        return processedRoles;

    } catch (error) {
        console.error('❌ Error al asignar permisos por rol:', error.message);
        throw error;
    } finally {
        await sequelize.close();
        console.log('🔌 Conexión a la base de datos cerrada.');
    }
}

function getRoleDescription(roleName) {
    const descriptions = {
        'admin': 'Administrador del sistema con acceso completo a todas las funcionalidades',
        'agent': 'Intermediario inmobiliario que facilita transacciones entre compradores y vendedores',
        'seller': 'Propietario que ofrece sus propiedades para venta o alquiler',
        'buyer': 'Usuario interesado en adquirir o alquilar propiedades',
        'guest': 'Usuario no registrado con acceso limitado de solo lectura'
    };
    return descriptions[roleName] || `Rol de ${roleName}`;
}

// Ejecutar si se llama directamente
if (require.main === module) {
    createPermissionsByRole()
        .then((count) => {
            console.log(`🎉 Script completado exitosamente. ${count} roles procesados.`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error en el script:', error);
            process.exit(1);
        });
}

module.exports = createPermissionsByRole;