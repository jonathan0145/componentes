const { Storage } = require('@google-cloud/storage');
const path = require('path');

async function createBucketIfNotExists() {
  try {
    console.log('🔧 Configurando Google Cloud Storage...');
    
    const storage = new Storage({
      keyFilename: path.join(__dirname, '../../firebase-service-account.json'),
      projectId: process.env.GCLOUD_PROJECT_ID || 'inmotech-1b4fd'
    });
    
    const bucketName = process.env.GCLOUD_STORAGE_BUCKET || 'inmotech-uploads';
    const bucket = storage.bucket(bucketName);
    
    // Verificar si el bucket existe
    const [exists] = await bucket.exists();
    
    if (exists) {
      console.log(`✅ Bucket '${bucketName}' ya existe y está disponible`);
    } else {
      console.log(`📦 Creando bucket '${bucketName}'...`);
      
      // Crear el bucket
      await storage.createBucket(bucketName, {
        location: 'US',
        storageClass: 'STANDARD',
      });
      
      console.log(`✅ Bucket '${bucketName}' creado exitosamente`);
    }
    
    // Verificar permisos
    const [metadata] = await bucket.getMetadata();
    console.log(`📊 Información del bucket:`);
    console.log(`   - Nombre: ${metadata.name}`);
    console.log(`   - Ubicación: ${metadata.location}`);
    console.log(`   - Clase de almacenamiento: ${metadata.storageClass}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error configurando Google Cloud Storage:', error.message);
    
    if (error.code === 'ENOENT' && error.message.includes('firebase-service-account.json')) {
      console.error('💡 Solución: Asegúrate de que el archivo firebase-service-account.json existe en la raíz del proyecto');
    } else if (error.code === 409) {
      console.error('💡 El bucket ya existe o el nombre está en uso');
    } else if (error.code === 403) {
      console.error('💡 Problema de permisos. Verifica tu service account');
    }
    
    return false;
  }
}

module.exports = { createBucketIfNotExists };

// Si se ejecuta directamente
if (require.main === module) {
  require('dotenv').config();
  createBucketIfNotExists();
}