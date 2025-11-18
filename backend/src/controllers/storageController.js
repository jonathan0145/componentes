const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { File } = require('../models');

// Configuración de Multer para almacenamiento local temporal
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Configuración de Google Cloud Storage con verificación de variables
let storage, bucket;

// Comentar temporalmente Google Cloud Storage para enfocarnos en la migración de BD
/*
try {
  if (process.env.GCLOUD_PROJECT_ID && process.env.GCLOUD_STORAGE_BUCKET) {
    storage = new Storage({
      keyFilename: path.join(__dirname, '../../firebase-service-account.json'),
      projectId: process.env.GCLOUD_PROJECT_ID
    });
    bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
  } else {
    console.warn('⚠️  Google Cloud Storage no configurado. Usando almacenamiento local.');
  }
} catch (error) {
  console.error('❌ Error configurando Google Cloud Storage:', error.message);
}
*/

console.log('📂 Usando almacenamiento local para archivos');

// Subir archivo a GCS y guardar en BD
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_001',
          message: 'No se recibió archivo'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (!bucket) {
      // Fallback: guardar solo la información del archivo local
      const file = await File.create({ 
        filename: req.file.originalname, 
        url: `/uploads/${req.file.filename}`, 
        userId: req.body.userId || req.user?.id 
      });
      
      return res.status(201).json({
        success: true,
        data: file,
        message: 'Archivo subido (almacenamiento local)',
        timestamp: new Date().toISOString()
      });
    }

    const blob = bucket.file(Date.now() + '-' + req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      res.status(500).json({
        success: false,
        error: {
          code: 'STORAGE_001',
          message: 'Error al subir a Google Cloud Storage',
          details: err.message
        },
        timestamp: new Date().toISOString()
      });
    });

    blobStream.on('finish', async () => {
      try {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        const file = await File.create({ 
          filename: req.file.originalname, 
          url: publicUrl, 
          userId: req.body.userId || req.user?.id 
        });
        
        res.status(201).json({
          success: true,
          data: file,
          message: 'Archivo subido a Google Cloud Storage',
          timestamp: new Date().toISOString()
        });
      } catch (dbError) {
        res.status(500).json({
          success: false,
          error: {
            code: 'STORAGE_002',
            message: 'Error al guardar en base de datos',
            details: dbError.message
          },
          timestamp: new Date().toISOString()
        });
      }
    });

    blobStream.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'STORAGE_003',
        message: 'Error al procesar el archivo',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Descargar archivo desde GCS
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'STORAGE_004',
          message: 'Archivo no encontrado'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    res.redirect(file.url);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'STORAGE_005',
        message: 'Error al descargar el archivo',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Exportar el middleware de upload
exports.uploadMiddleware = upload.single('file');
