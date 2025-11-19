const express = require('express');
const router = express.Router();
const privacyController = require('../controllers/privacyController');
// const authenticate = require('../middlewares/authenticate');
const { verifyToken } = require('../middlewares/authMiddleware');


/**
 * @swagger
 * /api/v1/user/privacy:
 *   get:
 *     summary: Obtiene la configuración de privacidad del usuario autenticado
 *     tags:
 *       - Privacidad
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración de privacidad obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 showContactInfo:
 *                   type: boolean
 *                 receiveEmailNotifications:
 *                   type: boolean
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualiza la configuración de privacidad del usuario autenticado
 *     tags:
 *       - Privacidad
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               showContactInfo:
 *                 type: boolean
 *               receiveEmailNotifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Configuración de privacidad actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 showContactInfo:
 *                   type: boolean
 *                 receiveEmailNotifications:
 *                   type: boolean
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', verifyToken, privacyController.getPrivacy);
router.put('/', verifyToken, privacyController.updatePrivacy);

module.exports = router;
