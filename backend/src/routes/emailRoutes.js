/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Endpoints para envío de correos electrónicos
 */

/**
 * @swagger
 * /api/email/send:
 *   post:
 *     summary: Enviar correo electrónico
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 *       400:
 *         description: Error al enviar correo
 */
const express = require('express');
const emailController = require('../controllers/emailController');
const router = express.Router();

// Endpoint para enviar correo
router.post('/send', emailController.sendEmail);

module.exports = router;
