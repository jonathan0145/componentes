const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * tags:
 *   name: Permisos
 *   description: Endpoints para gestión de permisos
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Obtener todos los permisos
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permisos
 *   post:
 *     summary: Crear permiso
 *     tags: [Permisos]
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
 *         description: Permiso creado
 *       400:
 *         description: Datos inválidos
 */

const express = require('express');
const permissionController = require('../controllers/permissionController');
const router = express.Router();
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, requireRole('admin'), permissionController.getAllPermissions);
router.get('/:id', verifyToken, requireRole('admin'), permissionController.getPermissionById);
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
	permissionController.createPermission
);
router.put('/:id', verifyToken, requireRole('admin'), permissionController.updatePermission);
router.delete('/:id', verifyToken, requireRole('admin'), permissionController.deletePermission);

module.exports = router;
