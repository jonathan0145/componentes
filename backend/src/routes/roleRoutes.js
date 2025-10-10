const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Endpoints para gestión de roles
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 *   post:
 *     summary: Crear rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado
 *       400:
 *         description: Datos inválidos
 */

const express = require('express');
const roleController = require('../controllers/roleController');
const router = express.Router();
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, requireRole('admin'), roleController.getAllRoles);
router.get('/:id', verifyToken, requireRole('admin'), roleController.getRoleById);
router.post('/',
	verifyToken,
	requireRole('admin'),
	[
		body('name').isString().notEmpty().trim().escape()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	roleController.createRole
);
router.put('/:id', verifyToken, requireRole('admin'), roleController.updateRole);
router.delete('/:id', verifyToken, requireRole('admin'), roleController.deleteRole);

module.exports = router;
