const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: PriceHistory
 *   description: Endpoints para gestión de historial de precios
 */

/**
 * @swagger
 * /api/pricehistories:
 *   get:
 *     summary: Obtener todos los historiales de precios
 *     tags: [PriceHistory]
 *     responses:
 *       200:
 *         description: Lista de historiales
 *   post:
 *     summary: Crear historial de precio
 *     tags: [PriceHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: integer
 *               price:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Historial creado
 *       400:
 *         description: Datos inválidos
 */
const express = require('express');
const priceHistoryController = require('../controllers/priceHistoryController');
const router = express.Router();

router.get('/', priceHistoryController.getAllPriceHistories);
router.get('/:id', priceHistoryController.getPriceHistoryById);
router.post('/',
	[
		body('propertyId').isInt(),
		body('price').isNumeric().toFloat(),
		body('date').optional().isISO8601()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	priceHistoryController.createPriceHistory
);
router.put('/:id', priceHistoryController.updatePriceHistory);
router.delete('/:id', priceHistoryController.deletePriceHistory);

module.exports = router;
