const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Endpoints para gestión de propiedades
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Obtener todas las propiedades
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: Lista de propiedades
 *   post:
 *     summary: Crear propiedad
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               address:
 *                 type: string
 *               sellerId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Propiedad creada
 *       400:
 *         description: Datos inválidos
 */

const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { generalLimiter } = require('../middlewares/rateLimiters');

router.get('/', generalLimiter, propertyController.getAllProperties);
router.get('/:id', generalLimiter, propertyController.getPropertyById);
router.post('/',
		verifyToken,
		(req, res, next) => {
			// Permitir admin o seller
			const allowed = ['admin', 'seller'];
			if (!req.user || !allowed.includes(req.user.role)) {
				return res.status(403).json({ error: 'Acceso denegado: solo admin o seller pueden crear propiedades' });
			}
			next();
		},
		generalLimiter,
	[
		body('title').isString().notEmpty().trim().escape(),
		body('price').isNumeric().toFloat(),
		body('address').optional().isString().trim().escape()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	propertyController.createProperty
);
router.put('/:id', verifyToken, (req, res, next) => {
	// Permitir admin o el seller dueño de la propiedad
	if (!req.user) return res.status(401).json({ error: 'Token requerido' });
	if (req.user.role === 'admin') return next();
	// Si es seller, verificar que es dueño de la propiedad
	const propertyId = req.params.id;
	const { Property } = require('../models');
	Property.findByPk(propertyId).then(property => {
		if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });
		if (property.sellerId !== req.user.id) {
			return res.status(403).json({ error: 'Acceso denegado: solo el vendedor dueño o admin pueden editar esta propiedad' });
		}
		next();
	}).catch(() => res.status(500).json({ error: 'Error de autorización' }));
}, generalLimiter, propertyController.updateProperty);
// Cambiar estado de propiedad
router.post('/:id/status', verifyToken, requireRole('admin'), generalLimiter, propertyController.changeStatus);
router.delete('/:id', verifyToken, requireRole('admin'), generalLimiter, propertyController.deleteProperty);

module.exports = router;
