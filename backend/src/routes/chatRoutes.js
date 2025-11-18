const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Endpoints para gestión de chats
 */

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Obtener todos los chats
 *     tags: [Chats]
 *     responses:
 *       200:
 *         description: Lista de chats
 *   post:
 *     summary: Crear chat
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: integer
 *               buyerId:
 *                 type: integer
 *               sellerId:
 *                 type: integer
 *               intermediaryId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat creado
 *       400:
 *         description: Datos inválidos
 */
const express = require('express');
const chatController = require('../controllers/chatController');
const { generalLimiter } = require('../middlewares/rateLimiters');
const router = express.Router();

router.get('/', generalLimiter, chatController.getAllChats);
router.get('/:id', generalLimiter, chatController.getChatById);
router.post('/',
	generalLimiter,
	[
		body('propertyId').isInt({ min: 1 }),
		body('buyerId').isInt({ min: 1 }),
		body('sellerId').isInt({ min: 1 }),
		body('intermediaryId').optional().isInt({ min: 1 }),
		body('status').optional().isString()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	chatController.createChat
);
router.put('/:id', generalLimiter, chatController.updateChat);
router.delete('/:id', generalLimiter, chatController.deleteChat);

module.exports = router;
