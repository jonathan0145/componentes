/**
 * Script para crear todos los permisos del sistema
 * Ejecutar con: node src/scripts/createPermissions.js
 */

require('dotenv').config();
const sequelize = require('../config/database');

// Importar modelos necesarios
const Permission = require('../models/Permission');

// Definir todos los permisos del sistema
const permissions = [
    // Usuarios
    { name: 'users.create', description: 'Crear nuevos usuarios', category: 'users' },
    { name: 'users.read', description: 'Ver información de usuarios', category: 'users' },
    { name: 'users.update', description: 'Actualizar información de usuarios', category: 'users' },
    { name: 'users.delete', description: 'Eliminar usuarios', category: 'users' },
    { name: 'users.verify', description: 'Verificar usuarios', category: 'users' },
    { name: 'users.suspend', description: 'Suspender usuarios', category: 'users' },

    // Propiedades
    { name: 'properties.create', description: 'Crear nuevas propiedades', category: 'properties' },
    { name: 'properties.read', description: 'Ver propiedades', category: 'properties' },
    { name: 'properties.update', description: 'Actualizar propiedades', category: 'properties' },
    { name: 'properties.delete', description: 'Eliminar propiedades', category: 'properties' },
    { name: 'properties.approve', description: 'Aprobar propiedades', category: 'properties' },
    { name: 'properties.feature', description: 'Destacar propiedades', category: 'properties' },

    // Ofertas
    { name: 'offers.create', description: 'Crear ofertas', category: 'offers' },
    { name: 'offers.read', description: 'Ver ofertas', category: 'offers' },
    { name: 'offers.update', description: 'Actualizar ofertas', category: 'offers' },
    { name: 'offers.delete', description: 'Eliminar ofertas', category: 'offers' },
    { name: 'offers.approve', description: 'Aprobar ofertas', category: 'offers' },
    { name: 'offers.negotiate', description: 'Negociar ofertas', category: 'offers' },

    // Chat y Mensajería
    { name: 'chat.read', description: 'Leer mensajes de chat', category: 'chat' },
    { name: 'chat.write', description: 'Enviar mensajes de chat', category: 'chat' },
    { name: 'chat.moderate', description: 'Moderar conversaciones', category: 'chat' },
    { name: 'chat.delete', description: 'Eliminar mensajes', category: 'chat' },
    { name: 'chat.archive', description: 'Archivar conversaciones', category: 'chat' },

    // Archivos
    { name: 'files.upload', description: 'Subir archivos', category: 'files' },
    { name: 'files.download', description: 'Descargar archivos', category: 'files' },
    { name: 'files.delete', description: 'Eliminar archivos', category: 'files' },
    { name: 'files.moderate', description: 'Moderar archivos subidos', category: 'files' },

    // Notificaciones
    { name: 'notifications.send', description: 'Enviar notificaciones', category: 'notifications' },
    { name: 'notifications.read', description: 'Leer notificaciones', category: 'notifications' },
    { name: 'notifications.configure', description: 'Configurar notificaciones', category: 'notifications' },

    // Citas/Appointments
    { name: 'appointments.create', description: 'Crear citas', category: 'appointments' },
    { name: 'appointments.read', description: 'Ver citas', category: 'appointments' },
    { name: 'appointments.update', description: 'Actualizar citas', category: 'appointments' },
    { name: 'appointments.delete', description: 'Cancelar citas', category: 'appointments' },

    // Verificaciones
    { name: 'verifications.request', description: 'Solicitar verificaciones', category: 'verifications' },
    { name: 'verifications.process', description: 'Procesar verificaciones', category: 'verifications' },
    { name: 'verifications.approve', description: 'Aprobar verificaciones', category: 'verifications' },
    { name: 'verifications.reject', description: 'Rechazar verificaciones', category: 'verifications' },

    // Reportes y Analytics
    { name: 'reports.access', description: 'Acceder a reportes', category: 'reports' },
    { name: 'reports.export', description: 'Exportar reportes', category: 'reports' },
    { name: 'analytics.view', description: 'Ver analytics', category: 'analytics' },

    // Sistema
    { name: 'system.configure', description: 'Configurar sistema', category: 'system' },
    { name: 'system.backup', description: 'Realizar respaldos', category: 'system' },
    { name: 'system.logs', description: 'Acceder a logs del sistema', category: 'system' },

    // Agentes/Intermediarios
    { name: 'agents.manage', description: 'Gestionar agentes', category: 'agents' },
    { name: 'agents.assign', description: 'Asignar agentes a propiedades', category: 'agents' },
    { name: 'agents.commission', description: 'Gestionar comisiones', category: 'agents' }
];

async function createPermissions() {
    try {
        console.log('🔧 Iniciando creación de permisos del sistema...');
        
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida.');

        // Sincronizar modelos (crear tablas si no existen)
        await sequelize.sync();
        console.log('✅ Modelos sincronizados.');

        let createdCount = 0;
        let existingCount = 0;

        // Crear cada permiso
        for (const permissionData of permissions) {
            const [permission, created] = await Permission.findOrCreate({
                where: { name: permissionData.name },
                defaults: permissionData
            });

            if (created) {
                createdCount++;
                console.log(`✅ Permiso creado: ${permissionData.name}`);
            } else {
                existingCount++;
                console.log(`ℹ️  Permiso ya existe: ${permissionData.name}`);
            }
        }

        console.log(`\n📊 Resumen de creación de permisos:`);
        console.log(`   Permisos creados: ${createdCount}`);
        console.log(`   Permisos existentes: ${existingCount}`);
        console.log(`   Total de permisos: ${permissions.length}`);

        // Mostrar permisos por categoría
        const categories = [...new Set(permissions.map(p => p.category))];
        console.log(`\n📋 Permisos organizados por categoría:`);
        categories.forEach(category => {
            const categoryPermissions = permissions.filter(p => p.category === category);
            console.log(`   ${category}: ${categoryPermissions.length} permisos`);
        });

        return permissions.length;

    } catch (error) {
        console.error('❌ Error al crear permisos:', error.message);
        throw error;
    } finally {
        await sequelize.close();
        console.log('🔌 Conexión a la base de datos cerrada.');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    createPermissions()
        .then((count) => {
            console.log(`🎉 Script completado exitosamente. ${count} permisos procesados.`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error en el script:', error);
            process.exit(1);
        });
}

module.exports = createPermissions;