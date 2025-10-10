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
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Chat creado
 *       400:
 *         description: Datos inválidos
 */
const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.get('/', chatController.getAllChats);
router.get('/:id', chatController.getChatById);
router.post('/',
	[
		body('userIds').isArray({ min: 2 }).custom(arr => arr.every(Number.isInteger))
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
router.put('/:id', chatController.updateChat);
router.delete('/:id', chatController.deleteChat);

module.exports = router;
