/**
 * Script para cargar datos de ejemplo en la base de datos para el entorno de pruebas
 * Ejecutar con: node src/scripts/seedTestData.js
 */

require('dotenv').config();
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// Importar modelos necesarios
const User = require('../models/User');
const Role = require('../models/Role');
const Property = require('../models/Property');
const Offer = require('../models/Offer');

// Datos de usuarios de ejemplo para el piloto
const testUsers = [
    {
        firstName: 'Ana',
        lastName: 'Torres',
        email: 'ana.torres.piloto@inmotech.com',
        password: 'Piloto2025!',
        phone: '+57 300 123 4567',
        role: 'buyer',
        isVerified: true,
        city: 'Bogotá',
        department: 'Cundinamarca'
    },
    {
        firstName: 'Luis',
        lastName: 'Gómez',
        email: 'luis.gomez.piloto@inmotech.com',
        password: 'Piloto2025!',
        phone: '+57 301 234 5678',
        role: 'seller',
        isVerified: true,
        city: 'Medellín',
        department: 'Antioquia'
    },
    {
        firstName: 'Carla',
        lastName: 'Ruiz',
        email: 'carla.ruiz.piloto@inmotech.com',
        password: 'Piloto2025!',
        phone: '+57 302 345 6789',
        role: 'agent',
        isVerified: true,
        city: 'Cali',
        department: 'Valle del Cauca',
        licenseNumber: 'AG-2024-001'
    },
    {
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin.piloto@inmotech.com',
        password: 'AdminPiloto2025!',
        phone: '+57 303 456 7890',
        role: 'admin',
        isVerified: true,
        city: 'Bogotá',
        department: 'Cundinamarca'
    }
];

// Propiedades de ejemplo
const testProperties = [
    {
        title: 'Apartamento Moderno en Chapinero',
        description: 'Hermoso apartamento de 2 habitaciones en el corazón de Chapinero, cerca del transporte público y centros comerciales.',
        type: 'apartment',
        status: 'available',
        price: 450000000,
        currency: 'COP',
        area: 85,
        bedrooms: 2,
        bathrooms: 2,
        parkingSpaces: 1,
        floor: 8,
        isNew: false,
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Carrera 13 #63-45',
        coordinates: JSON.stringify({ lat: 4.6482837, lng: -74.0647635 }),
        amenities: JSON.stringify(['gym', 'pool', 'security', 'elevator', 'balcony']),
        images: JSON.stringify(['/images/prop1-1.jpg', '/images/prop1-2.jpg', '/images/prop1-3.jpg'])
    },
    {
        title: 'Casa Familiar en Laureles',
        description: 'Amplia casa de 3 pisos con jardín, perfecta para una familia grande. Ubicada en el tradicional barrio Laureles.',
        type: 'house',
        status: 'available',
        price: 680000000,
        currency: 'COP',
        area: 220,
        bedrooms: 4,
        bathrooms: 3,
        parkingSpaces: 2,
        floors: 3,
        isNew: false,
        city: 'Medellín',
        department: 'Antioquia',
        address: 'Calle 70 #45-23',
        coordinates: JSON.stringify({ lat: 6.2442, lng: -75.5812 }),
        amenities: JSON.stringify(['garden', 'garage', 'bbq_area', 'storage_room']),
        images: JSON.stringify(['/images/prop2-1.jpg', '/images/prop2-2.jpg', '/images/prop2-3.jpg'])
    },
    {
        title: 'Oficina Ejecutiva Torre Empresarial',
        description: 'Moderna oficina en torre empresarial con excelente ubicación y vista panorámica de la ciudad.',
        type: 'office',
        status: 'available',
        price: 25000000,
        currency: 'COP',
        transactionType: 'rent',
        area: 120,
        bedrooms: 0,
        bathrooms: 2,
        parkingSpaces: 3,
        floor: 15,
        isNew: true,
        city: 'Cali',
        department: 'Valle del Cauca',
        address: 'Avenida 6N #28-50',
        coordinates: JSON.stringify({ lat: 3.4516, lng: -76.5320 }),
        amenities: JSON.stringify(['elevator', 'security', 'meeting_rooms', 'reception']),
        images: JSON.stringify(['/images/prop3-1.jpg', '/images/prop3-2.jpg'])
    }
];

// Ofertas de ejemplo
const testOffers = [
    {
        amount: 420000000,
        currency: 'COP',
        status: 'pending',
        message: 'Oferta inicial por el apartamento en Chapinero. Estoy muy interesada y tengo financiación pre-aprobada.',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días desde ahora
    },
    {
        amount: 650000000,
        currency: 'COP',
        status: 'pending',
        message: 'Oferta por la casa en Laureles. Mi familia está muy interesada en mudarse pronto.',
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 días desde ahora
    }
];

async function seedTestData() {
    try {
        console.log('🌱 Iniciando carga de datos de ejemplo para el piloto...');
        
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida.');

        // Sincronizar modelos (crear tablas si no existen)
        await sequelize.sync();
        console.log('✅ Modelos sincronizados.');

        // 1. Crear usuarios de ejemplo
        console.log('\n👥 Creando usuarios de ejemplo...');
        const createdUsers = [];
        
        for (const userData of testUsers) {
            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            
            const [user, created] = await User.findOrCreate({
                where: { email: userData.email },
                defaults: {
                    ...userData,
                    password: hashedPassword
                }
            });

            createdUsers.push(user);
            
            if (created) {
                console.log(`✅ Usuario creado: ${userData.firstName} ${userData.lastName} (${userData.role})`);
            } else {
                console.log(`ℹ️  Usuario ya existe: ${userData.firstName} ${userData.lastName} (${userData.role})`);
            }
        }

        // 2. Crear propiedades de ejemplo
        console.log('\n🏠 Creando propiedades de ejemplo...');
        const createdProperties = [];
        
        // Asignar propiedades a vendedores
        const seller = createdUsers.find(u => u.firstName === 'Luis'); // Luis es el vendedor
        
        for (const propertyData of testProperties) {
            const [property, created] = await Property.findOrCreate({
                where: { 
                    title: propertyData.title,
                    address: propertyData.address
                },
                defaults: {
                    ...propertyData,
                    ownerId: seller.id
                }
            });

            createdProperties.push(property);
            
            if (created) {
                console.log(`✅ Propiedad creada: ${propertyData.title}`);
            } else {
                console.log(`ℹ️  Propiedad ya existe: ${propertyData.title}`);
            }
        }

        // 3. Crear ofertas de ejemplo
        console.log('\n💰 Creando ofertas de ejemplo...');
        const buyer = createdUsers.find(u => u.firstName === 'Ana'); // Ana es la compradora
        
        for (let i = 0; i < testOffers.length && i < createdProperties.length; i++) {
            const offerData = testOffers[i];
            const property = createdProperties[i];
            
            const [offer, created] = await Offer.findOrCreate({
                where: { 
                    buyerId: buyer.id,
                    propertyId: property.id
                },
                defaults: {
                    ...offerData,
                    buyerId: buyer.id,
                    propertyId: property.id,
                    sellerId: property.ownerId
                }
            });
            
            if (created) {
                console.log(`✅ Oferta creada: $${offerData.amount.toLocaleString()} COP por ${property.title}`);
            } else {
                console.log(`ℹ️  Oferta ya existe para ${property.title}`);
            }
        }

        // 4. Resumen de datos creados
        console.log('\n📊 Resumen de datos de ejemplo creados:');
        console.log(`   👥 Usuarios: ${createdUsers.length}`);
        console.log(`   🏠 Propiedades: ${createdProperties.length}`);
        console.log(`   💰 Ofertas: ${Math.min(testOffers.length, createdProperties.length)}`);

        // 5. Información de acceso para el piloto
        console.log('\n🔑 Credenciales de acceso para el piloto:');
        testUsers.forEach(user => {
            console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
        });

        console.log('\n⚠️  IMPORTANTE: Cambiar las contraseñas en producción.');

        return {
            users: createdUsers.length,
            properties: createdProperties.length,
            offers: Math.min(testOffers.length, createdProperties.length)
        };

    } catch (error) {
        console.error('❌ Error al cargar datos de ejemplo:', error.message);
        throw error;
    } finally {
        await sequelize.close();
        console.log('🔌 Conexión a la base de datos cerrada.');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    seedTestData()
        .then((result) => {
            console.log(`🎉 Datos de ejemplo cargados exitosamente:`);
            console.log(`   ${result.users} usuarios, ${result.properties} propiedades, ${result.offers} ofertas`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error en el script:', error);
            process.exit(1);
        });
}

module.exports = seedTestData;