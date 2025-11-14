/**
 * @swagger
 * /api/v1/users/change-password:
 *   put:
 *     summary: Cambiar la contraseña del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Error en la solicitud o contraseña incorrecta
 *       401:
 *         description: No autenticado
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestión de usuarios
 *
 * /api/v1/users/profile:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                 preferences:
 *                   type: object
 *       401:
 *         description: No autorizado
 *   put:
 *     summary: Actualizar el perfil del usuario autenticado
 *     tags: [Users]
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
 *               preferences:
 *                 type: object
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *
 * /api/v1/users/avatar:
 *   post:
 *     summary: Subir o actualizar avatar del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar actualizado
 *       400:
 *         description: Archivo inválido
 *       401:
 *         description: No autorizado
 */

const { body, validationResult } = require('express-validator');
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Crear usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               roleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Email ya registrado
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { generalLimiter } = require('../middlewares/rateLimiters');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.put('/change-password', verifyToken, userController.changePassword);

// Perfil del usuario autenticado
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.post('/avatar', verifyToken, upload.single('avatar'), userController.uploadAvatar);

router.get('/', verifyToken, requireRole('admin'), generalLimiter, userController.getAllUsers);
router.get('/:id', verifyToken, generalLimiter, userController.getUserById);
router.post('/',
	verifyToken,
	requireRole('admin'),
	generalLimiter,
	[
		body('name').isString().notEmpty().trim().escape(),
		body('email').isEmail().normalizeEmail(),
		body('password').isLength({ min: 6 })
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	userController.createUser
);
router.put('/:id', verifyToken, generalLimiter, userController.updateUser);
router.delete('/:id', verifyToken, requireRole('admin'), generalLimiter, userController.deleteUser);

module.exports = router;