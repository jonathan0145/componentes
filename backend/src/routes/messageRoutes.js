const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Endpoints para gestión de mensajes
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Obtener todos los mensajes
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Lista de mensajes
 *   post:
 *     summary: Crear mensaje
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: integer
 *               senderId:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensaje creado
 *       400:
 *         description: Datos inválidos
 */
const express = require('express');
const messageController = require('../controllers/messageController');
const { generalLimiter } = require('../middlewares/rateLimiters');
const router = express.Router();

router.get('/', generalLimiter, messageController.getAllMessages);
router.get('/:id', generalLimiter, messageController.getMessageById);
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/',
	verifyToken,
	generalLimiter,
	[
		body('chatId').isString(),
		body('senderId').optional().isInt(),
		body('content').isString().notEmpty().trim().escape()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	messageController.createMessage
);
// Enviar mensaje avanzado (valida chat y destinatario)
router.post('/send', messageController.sendMessage);
router.put('/:id', messageController.updateMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
