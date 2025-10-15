const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Endpoints para gestión de ofertas
 */

/**
 * @swagger
 * /api/offers:
 *   get:
 *     summary: Obtener todas las ofertas
 *     tags: [Offers]
 *     responses:
 *       200:
 *         description: Lista de ofertas
 *   post:
 *     summary: Crear oferta
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: integer
 *               buyerId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Oferta creada
 *       400:
 *         description: Datos inválidos
 */

const express = require('express');
const offerController = require('../controllers/offerController');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { generalLimiter } = require('../middlewares/rateLimiters');

router.get('/', generalLimiter, offerController.getAllOffers);
router.get('/:id', generalLimiter, offerController.getOfferById);
router.post('/',
	verifyToken,
	generalLimiter,
	[
		body('propertyId').isInt(),
	body('buyerId').isInt(),
		body('amount').isNumeric().toFloat()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	offerController.createOffer
);
router.put('/:id', verifyToken, generalLimiter, offerController.updateOffer);
// Aceptar oferta
router.post('/:id/accept', verifyToken, generalLimiter, offerController.acceptOffer);
// Rechazar oferta
router.post('/:id/reject', verifyToken, generalLimiter, offerController.rejectOffer);
// Responder oferta
router.post('/:id/respond', verifyToken, generalLimiter, offerController.respondOffer);
router.delete('/:id', verifyToken, generalLimiter, offerController.deleteOffer);

module.exports = router;
