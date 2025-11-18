/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestión de usuarios
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
