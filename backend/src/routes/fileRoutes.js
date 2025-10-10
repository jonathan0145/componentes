const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Archivos
 *   description: Endpoints para gestión de archivos (subida, descarga, listado)
 */

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Subir archivo
 *     tags: [Archivos]
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
 * /api/files/download/{filename}:
 *   get:
 *     summary: Descargar archivo
 *     tags: [Archivos]
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
 *
 * /api/files:
 *   get:
 *     summary: Listar archivos
 *     tags: [Archivos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de archivos
 */

const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, fileController.getAllFiles);
router.get('/:id', verifyToken, fileController.getFileById);
router.post('/',
	verifyToken,
	[
		body('filename').isString().notEmpty().trim().escape(),
		body('url').optional().isString().trim()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	fileController.createFile
);
router.put('/:id', verifyToken, fileController.updateFile);
router.delete('/:id', verifyToken, fileController.deleteFile);

module.exports = router;
