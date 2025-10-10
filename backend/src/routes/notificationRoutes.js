const { verifyToken } = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Endpoints para gestión de notificaciones
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtener todas las notificaciones
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *   post:
 *     summary: Crear notificación
 *     tags: [Notifications]
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
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notificación creada
 *       400:
 *         description: Datos inválidos
 */
const express = require('express');
const notificationController = require('../controllers/notificationController');
const router = express.Router();

router.get('/', notificationController.getAllNotifications);
router.get('/:id', notificationController.getNotificationById);
router.post('/', notificationController.createNotification);
router.post('/',
	verifyToken,
	[
		body('userId').isInt(),
		body('type').isString().notEmpty().trim().escape(),
		body('message').isString().notEmpty().trim().escape()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	notificationController.createNotification
);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
