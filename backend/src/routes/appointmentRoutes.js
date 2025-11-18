const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Endpoints para gestión de citas
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Obtener todas las citas
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de citas
 *   post:
 *     summary: Crear cita
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               propertyId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Cita creada
 *       400:
 *         description: Datos inválidos
 */
const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { generalLimiter } = require('../middlewares/rateLimiters');
const router = express.Router();

router.get('/', generalLimiter, appointmentController.getAllAppointments);
router.get('/:id', generalLimiter, appointmentController.getAppointmentById);
router.post('/',
	generalLimiter,
	[
		body('userId').isInt(),
		body('propertyId').isInt(),
		body('date').isISO8601()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	appointmentController.createAppointment
);
// Agendar cita avanzada (valida disponibilidad)
router.post('/schedule', generalLimiter, appointmentController.scheduleAppointment);
router.put('/:id', generalLimiter, appointmentController.updateAppointment);
router.delete('/:id', generalLimiter, appointmentController.deleteAppointment);

module.exports = router;
