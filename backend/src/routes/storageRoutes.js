/**
 * @swagger
 * tags:
 *   name: Storage
 *   description: Endpoints para gestión de almacenamiento en la nube
 */

/**
 * @swagger
 * /api/storage/upload:
 *   post:
 *     summary: Subir archivo a la nube
 *     tags: [Storage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Archivo subido correctamente
 *       400:
 *         description: Error al subir archivo
 *
 * /api/storage/download/{filename}:
 *   get:
 *     summary: Descargar archivo de la nube
 *     tags: [Storage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Archivo descargado
 *       404:
 *         description: Archivo no encontrado
 */
const express = require('express');
const storageController = require('../controllers/storageController');
const router = express.Router();

// Subir archivo (Multer + GCS)
router.post('/upload', storageController.upload, storageController.uploadFile);
// Descargar archivo
router.get('/download/:id', storageController.downloadFile);

module.exports = router;
