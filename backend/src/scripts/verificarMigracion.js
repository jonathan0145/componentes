const { sequelize } = require('../models');

async function verificarMigracion() {
  try {
    console.log('🔍 Verificando estado de la migración de base de datos...\n');

    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos: EXITOSA');

    // Obtener lista de tablas
    const [results] = await sequelize.query("SHOW TABLES");
    console.log(`\n📊 Tablas encontradas en la base de datos (${results.length}):`);
    
    const tablas = results.map(row => Object.values(row)[0]);
    tablas.forEach(tabla => {
      console.log(`   ✅ ${tabla}`);
    });

    // Verificar tablas específicas requeridas
    const tablasRequeridas = [
      'Users', 'Roles', 'Permissions', 'Properties', 'Offers', 
      'Chats', 'Messages', 'Notifications', 'Files', 'Appointments',
      'Verifications', 'PriceHistories'
    ];

    console.log('\n🎯 Verificando tablas requeridas:');
    const tablasFaltantes = [];
    
    tablasRequeridas.forEach(tabla => {
      const existe = tablas.some(t => t.toLowerCase() === tabla.toLowerCase());
      if (existe) {
        console.log(`   ✅ ${tabla} - OK`);
      } else {
        console.log(`   ❌ ${tabla} - FALTANTE`);
        tablasFaltantes.push(tabla);
      }
    });

    // Verificar registros en tablas principales
    console.log('\n📈 Conteo de registros por tabla:');
    
    for (const tabla of tablas) {
      try {
        const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tabla}`);
        const count = countResult[0].count;
        console.log(`   📊 ${tabla}: ${count} registros`);
      } catch (error) {
        console.log(`   ⚠️ ${tabla}: Error al contar registros`);
      }
    }

    // Verificar estructura de tabla Users
    console.log('\n🔍 Verificando estructura de tabla Users:');
    try {
      const [columns] = await sequelize.query("DESCRIBE Users");
      console.log('   Columnas encontradas:');
      columns.forEach(column => {
        console.log(`     - ${column.Field} (${column.Type}) ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } catch (error) {
      console.log('   ❌ Error al obtener estructura de Users:', error.message);
    }

    // Resultado final
    console.log('\n🎉 RESUMEN DE MIGRACIÓN:');
    if (tablasFaltantes.length === 0) {
      console.log('✅ MIGRACIÓN COMPLETA: Todas las tablas requeridas están presentes');
      console.log('✅ Base de datos lista para uso en desarrollo');
    } else {
      console.log('⚠️ MIGRACIÓN PARCIAL: Faltan algunas tablas');
      console.log(`❌ Tablas faltantes: ${tablasFaltantes.join(', ')}`);
    }

    console.log('\n📱 Endpoints disponibles después de la migración:');
    console.log('   🔐 POST /api/auth/register - Registro de usuarios');
    console.log('   🔐 POST /api/auth/login - Login de usuarios');
    console.log('   🏠 GET /api/properties - Listar propiedades');
    console.log('   💬 GET /api/messages - Listar mensajes');
    console.log('   📄 GET /api-docs - Documentación Swagger');

  } catch (error) {
    console.error('❌ Error durante verificación:', error.message);
    
    if (error.original?.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 La base de datos no existe. Créala con:');
      console.error('   CREATE DATABASE inmotech;');
    } else if (error.original?.code === 'ECONNREFUSED') {
      console.error('💡 No se puede conectar a MySQL. Verifica que esté ejecutándose.');
    }
  } finally {
    await sequelize.close();
  }
}

// Ejecutar verificación
if (require.main === module) {
  require('dotenv').config();
  verificarMigracion();
}

module.exports = { verificarMigracion };