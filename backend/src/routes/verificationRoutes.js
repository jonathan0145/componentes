/**
 * @swagger
 * /api/v1/verifications/email/send:
 *   post:
 *     summary: Enviar código de verificación al email
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *     responses:
 *       200:
 *         description: Código enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Email requerido o error de envío
 *       404:
 *         description: Usuario no encontrado
 *
 * /api/v1/verifications/email/confirm:
 *   post:
 *     summary: Confirmar código de verificación de email
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verificado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Código incorrecto, expirado o datos faltantes
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * tags:
 *   name: Verification
 *   description: Endpoints para gestión de verificaciones
 */

/**
 * @swagger
 * /api/v1/verifications:
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
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Endpoint para enviar código de verificación de email
router.post('/email/send', verificationController.sendEmailVerificationCode);
// Endpoint para confirmar código de verificación de email
router.post('/email/confirm', verificationController.confirmEmailVerificationCode);

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
