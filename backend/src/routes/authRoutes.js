/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para autenticación y registro de usuarios
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
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
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 *
 * /api/auth/register:
 *   post:
 *     summary: Registrar usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: Nombre del rol (Buyer, Seller, Agent)
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Datos inválidos
 */
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Registro de usuario
router.post('/register', authController.register);
// Login de usuario
router.post('/login', authController.login);

module.exports = router;
