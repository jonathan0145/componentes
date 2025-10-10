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
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

// Subir archivo a GCS y guardar en BD
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });
    const blob = bucket.file(Date.now() + '-' + req.file.originalname);
    const blobStream = blob.createWriteStream();
    blobStream.end(req.file.buffer);
    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const file = await File.create({ filename: req.file.originalname, url: publicUrl, userId: req.body.userId });
      res.status(201).json({ mensaje: 'Archivo subido', file });
    });
    blobStream.on('error', err => {
      res.status(500).json({ error: 'Error al subir a GCS', detalle: err.message });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el archivo', detalle: error.message });
  }
};

// Descargar archivo desde GCS
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'Archivo no encontrado' });
    res.redirect(file.url);
  } catch (error) {
    res.status(500).json({ error: 'Error al descargar el archivo', detalle: error.message });
  }
};

exports.upload = upload.single('file');
