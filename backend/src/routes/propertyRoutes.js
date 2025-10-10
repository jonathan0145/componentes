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

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.post('/',
	verifyToken,
	requireRole('admin'),
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
router.put('/:id', verifyToken, requireRole('admin'), propertyController.updateProperty);
// Cambiar estado de propiedad
router.post('/:id/status', verifyToken, requireRole('admin'), propertyController.changeStatus);
router.delete('/:id', verifyToken, requireRole('admin'), propertyController.deleteProperty);

module.exports = router;
