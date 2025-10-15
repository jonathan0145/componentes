const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { File } = require('../models');

// Configuración de Multer (subida local temporal)
const upload = multer({ dest: 'uploads/' });

// Configuración de Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, '../../google-cloud-key.json'),
  projectId: process.env.GCLOUD_PROJECT_ID
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

// Subir archivo a GCS y guardar en BD
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_001',
        message: 'No se recibió archivo'
      },
      timestamp: new Date().toISOString()
    });
    const blob = bucket.file(Date.now() + '-' + req.file.originalname);
    const blobStream = blob.createWriteStream();
    blobStream.end(req.file.buffer);
    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const file = await File.create({ filename: req.file.originalname, url: publicUrl, userId: req.body.userId });
      res.status(201).json({
        success: true,
        data: file,
        message: 'Archivo subido',
        timestamp: new Date().toISOString()
      });
    });
    blobStream.on('error', err => {
      res.status(500).json({
        success: false,
        error: {
          code: 'STORAGE_001',
          message: 'Error al subir a GCS',
          details: err.message
        },
        timestamp: new Date().toISOString()
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'STORAGE_002',
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
    if (!file) return res.status(404).json({
      success: false,
      error: {
        code: 'STORAGE_003',
        message: 'Archivo no encontrado'
      },
      timestamp: new Date().toISOString()
    });
    res.redirect(file.url);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'STORAGE_004',
        message: 'Error al descargar el archivo',
        details: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

exports.upload = upload.single('file');
