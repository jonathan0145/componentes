/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Endpoints para gestión de conversaciones, mensajes, ofertas y citas dentro de una conversación
 */

/**
 * @swagger
 * /api/v1/conversations/{id}/offers:
 *   get:
 *     summary: Obtener ofertas de una conversación
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la conversación
 *     responses:
 *       200:
 *         description: Ofertas de la conversación
 *   post:
 *     summary: Crear oferta en una conversación
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la conversación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               paymentTerms:
 *                 type: string
 *               closingDate:
 *                 type: string
 *                 format: date
 *               conditions:
 *                 type: string
 *               validUntil:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Oferta creada
 *
 * /api/v1/conversations/{id}/appointments:
 *   post:
 *     summary: Crear cita en una conversación
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la conversación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduledFor:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *               type:
 *                 type: string
 *               notes:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cita creada
 *
 * /api/v1/conversations/{id}/messages/file:
 *   post:
 *     summary: Enviar archivo en una conversación
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la conversación
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
 *               caption:
 *                 type: string
 *     responses:
 *       201:
 *         description: Archivo enviado
 *
 * /api/v1/conversations/{id}/messages/read:
 *   put:
 *     summary: Marcar mensajes como leídos en una conversación
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la conversación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Mensajes marcados como leídos
 */
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { verifyToken } = require('../middlewares/authMiddleware');
const { generalLimiter } = require('../middlewares/rateLimiters');
const conversationController = require('../controllers/conversationController');
const router = express.Router();

// GET /conversations/:id/offers
router.get('/:id/offers', verifyToken, generalLimiter, conversationController.getConversationOffers);

// POST /conversations/:id/appointments
router.post('/:id/appointments', verifyToken, generalLimiter, conversationController.createAppointment);

// POST /conversations/:id/messages/file
router.post('/:id/messages/file', verifyToken, upload.single('file'), generalLimiter, conversationController.sendFileMessage);

// PUT /conversations/:id/messages/read
router.put('/:id/messages/read', verifyToken, generalLimiter, conversationController.markMessagesAsRead);

// POST /conversations/:id/offers
router.post('/:id/offers', verifyToken, generalLimiter, conversationController.createOfferInConversation);

module.exports = router;
