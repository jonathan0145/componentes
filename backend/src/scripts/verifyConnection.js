/**
 * Script para verificar la conexión entre frontend y backend
 * Ejecutar con: node src/scripts/verifyConnection.js
 */

require('dotenv').config();
const sequelize = require('../config/database');
const axios = require('axios');

// URLs para verificar
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Credenciales de prueba
const testCredentials = {
    buyer: {
        email: 'ana.torres.piloto@inmotech.com',
        password: 'Piloto2025!'
    },
    seller: {
        email: 'luis.gomez.piloto@inmotech.com',
        password: 'Piloto2025!'
    },
    agent: {
        email: 'carla.ruiz.piloto@inmotech.com',
        password: 'Piloto2025!'
    },
    admin: {
        email: 'admin.piloto@inmotech.com',
        password: 'AdminPiloto2025!'
    }
};

async function verifyConnection() {
    console.log('🔍 Iniciando verificación de conexión y configuración...\n');
    
    let allTestsPassed = true;
    const results = {
        database: false,
        backend: false,
        endpoints: false,
        authentication: false,
        testData: false
    };

    try {
        // 1. Verificar conexión a base de datos
        console.log('1️⃣ Verificando conexión a base de datos...');
        try {
            await sequelize.authenticate();
            console.log('   ✅ Conexión a base de datos exitosa');
            results.database = true;
        } catch (error) {
            console.log('   ❌ Error de conexión a base de datos:', error.message);
            allTestsPassed = false;
        }

        // 2. Verificar que el backend esté ejecutándose
        console.log('\n2️⃣ Verificando backend...');
        try {
            const healthResponse = await axios.get(`${BACKEND_URL}/api/v1/health`, {
                timeout: 5000
            });
            console.log('   ✅ Backend respondiendo en', BACKEND_URL);
            console.log('   📊 Status:', healthResponse.status);
            results.backend = true;
        } catch (error) {
            console.log('   ❌ Backend no responde:', error.message);
            console.log('   ⚠️  Asegúrate de que el backend esté ejecutándose en', BACKEND_URL);
            allTestsPassed = false;
        }

        // 3. Verificar endpoints principales
        console.log('\n3️⃣ Verificando endpoints principales...');
        const endpointsToTest = [
            '/api/v1/auth/register',
            '/api/v1/users',
            '/api/v1/properties',
            '/api/v1/offers'
        ];

        let endpointsWorking = 0;
        for (const endpoint of endpointsToTest) {
            try {
                const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
                    timeout: 3000,
                    validateStatus: (status) => status < 500 // Aceptar 401, 403, etc.
                });
                console.log(`   ✅ ${endpoint} - Status: ${response.status}`);
                endpointsWorking++;
            } catch (error) {
                console.log(`   ❌ ${endpoint} - Error: ${error.message}`);
            }
        }

        if (endpointsWorking === endpointsToTest.length) {
            console.log('   ✅ Todos los endpoints principales responden');
            results.endpoints = true;
        } else {
            console.log(`   ⚠️  ${endpointsWorking}/${endpointsToTest.length} endpoints funcionando`);
            allTestsPassed = false;
        }

        // 4. Verificar autenticación con usuarios de prueba
        console.log('\n4️⃣ Verificando autenticación con usuarios de prueba...');
        let usersAuthenticated = 0;

        for (const [role, credentials] of Object.entries(testCredentials)) {
            try {
                const loginResponse = await axios.post(
                    `${BACKEND_URL}/api/v1/auth/login`,
                    credentials,
                    {
                        timeout: 5000,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                if (loginResponse.data.token) {
                    console.log(`   ✅ ${role.toUpperCase()}: Login exitoso`);
                    usersAuthenticated++;
                } else {
                    console.log(`   ❌ ${role.toUpperCase()}: Login falló - Sin token`);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log(`   ❌ ${role.toUpperCase()}: Credenciales incorrectas`);
                } else {
                    console.log(`   ❌ ${role.toUpperCase()}: Error de autenticación - ${error.message}`);
                }
            }
        }

        if (usersAuthenticated === Object.keys(testCredentials).length) {
            console.log('   ✅ Todos los usuarios de prueba se autentican correctamente');
            results.authentication = true;
        } else {
            console.log(`   ⚠️  ${usersAuthenticated}/${Object.keys(testCredentials).length} usuarios autenticados`);
            allTestsPassed = false;
        }

        // 5. Verificar datos de prueba en base de datos
        console.log('\n5️⃣ Verificando datos de prueba en base de datos...');
        try {
            const User = require('../models/User');
            const Property = require('../models/Property');
            const Offer = require('../models/Offer');

            const userCount = await User.count();
            const propertyCount = await Property.count();
            const offerCount = await Offer.count();

            console.log(`   📊 Usuarios en DB: ${userCount}`);
            console.log(`   📊 Propiedades en DB: ${propertyCount}`);
            console.log(`   📊 Ofertas en DB: ${offerCount}`);

            if (userCount >= 4 && propertyCount >= 3 && offerCount >= 2) {
                console.log('   ✅ Datos de prueba suficientes encontrados');
                results.testData = true;
            } else {
                console.log('   ⚠️  Datos de prueba insuficientes');
                console.log('   💡 Ejecuta: node src/scripts/seedTestData.js');
                allTestsPassed = false;
            }
        } catch (error) {
            console.log('   ❌ Error verificando datos de prueba:', error.message);
            allTestsPassed = false;
        }

        // 6. Resumen final
        console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Base de datos:     ${results.database ? '✅ OK' : '❌ FALLO'}`);
        console.log(`Backend:           ${results.backend ? '✅ OK' : '❌ FALLO'}`);
        console.log(`Endpoints:         ${results.endpoints ? '✅ OK' : '❌ FALLO'}`);
        console.log(`Autenticación:     ${results.authentication ? '✅ OK' : '❌ FALLO'}`);
        console.log(`Datos de prueba:   ${results.testData ? '✅ OK' : '❌ FALLO'}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (allTestsPassed) {
            console.log('\n🎉 VERIFICACIÓN EXITOSA: El sistema está listo para el piloto');
            console.log('\n📝 Próximos pasos:');
            console.log('   1. Iniciar el frontend: npm start (en carpeta frontend)');
            console.log('   2. Acceder a http://localhost:3001');
            console.log('   3. Probar login con usuarios de prueba');
            console.log('   4. Comenzar capacitación de usuarios piloto');
        } else {
            console.log('\n⚠️  VERIFICACIÓN INCOMPLETA: Revisar y corregir los fallos detectados');
            console.log('\n🔧 Acciones recomendadas:');
            if (!results.database) console.log('   - Verificar configuración de base de datos en .env');
            if (!results.backend) console.log('   - Verificar que el backend esté ejecutándose: npm run dev');
            if (!results.endpoints) console.log('   - Revisar rutas y controladores del backend');
            if (!results.authentication) console.log('   - Ejecutar: node src/scripts/seedTestData.js');
            if (!results.testData) console.log('   - Ejecutar scripts de inicialización');
        }

        return {
            success: allTestsPassed,
            results: results
        };

    } catch (error) {
        console.error('💥 Error general en la verificación:', error.message);
        return {
            success: false,
            error: error.message
        };
    } finally {
        await sequelize.close();
    }
}

// Función auxiliar para verificar frontend
async function verifyFrontend() {
    console.log('\n🌐 Verificando frontend...');
    try {
        const response = await axios.get(FRONTEND_URL, {
            timeout: 5000
        });
        console.log('   ✅ Frontend accesible en', FRONTEND_URL);
        return true;
    } catch (error) {
        console.log('   ❌ Frontend no accesible:', error.message);
        console.log('   💡 Ejecutar: npm start (en carpeta frontend)');
        return false;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    verifyConnection()
        .then(async (result) => {
            // También verificar frontend si es posible
            await verifyFrontend();
            
            if (result.success) {
                console.log('\n✅ Verificación completada exitosamente.');
                process.exit(0);
            } else {
                console.log('\n❌ Verificación completada con errores.');
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error('💥 Error en el script de verificación:', error);
            process.exit(1);
        });
}

module.exports = verifyConnection;