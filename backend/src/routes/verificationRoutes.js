const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Verification
 *   description: Endpoints para gestión de verificaciones
 */

/**
 * @swagger
 * /api/verifications:
 *   get:
 *     summary: Obtener todas las verificaciones
 *     tags: [Verification]
 *     responses:
 *       200:
 *         description: Lista de verificaciones
 *   post:
 *     summary: Crear verificación
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Verificación creada
 *       400:
 *         description: Datos inválidos
 */
const express = require('express');
const verificationController = require('../controllers/verificationController');
const router = express.Router();

router.get('/', verificationController.getAllVerifications);
router.get('/:id', verificationController.getVerificationById);
router.post('/',
	[
		body('userId').isInt(),
		body('type').isString().notEmpty().trim().escape(),
		body('status').isString().notEmpty().trim().escape()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	verificationController.createVerification
);
router.put('/:id', verificationController.updateVerification);
router.delete('/:id', verificationController.deleteVerification);

module.exports = router;
