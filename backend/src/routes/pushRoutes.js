/**
 * @swagger
 * tags:
 *   name: Push
 *   description: Endpoints para envío de notificaciones push
 */

/**
 * @swagger
 * /api/push/send:
 *   post:
 *     summary: Enviar notificación push
 *     tags: [Push]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notificación enviada correctamente
 *       400:
 *         description: Error al enviar notificación
 */
const express = require('express');
const pushController = require('../controllers/pushController');
const router = express.Router();

// Endpoint para enviar notificación push
router.post('/send', pushController.sendPush);

module.exports = router;
