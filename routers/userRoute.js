const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User Authentication and Account Management
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: mohamed
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mohamed@example.com
 *               password:
 *                 type: string
 *                 example: yourSecurePassword
 *               image:
 *                 type: string
 *                 description: URL of the user's profile image
 *                 example: https://example.com/images/user1.png
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 123456
 *                     name:
 *                       type: string
 *                       example: mohamed
 *                     email:
 *                       type: string
 *                       example: mohamed@example.com
 *                     image:
 *                       type: string
 *                       example: https://example.com/images/user1.png
 *                     is_admin:
 *                       type: boolean
 *                       example: false
 *                     is_verified:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Bad request - validation errors or missing fields
 *       500:
 *         description: Server error
 */
router.post('/register', userController.Register);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourSecurePassword
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/user/verify-email:
 *   post:
 *     summary: Verify user's email using OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP or email
 */
router.post('/verify-email', userController.verifyEmail);

/**
 * @swagger
 * /api/user/send-reset-code:
 *   post:
 *     summary: Send password reset code to email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset code sent
 *       404:
 *         description: User not found
 */
router.post('/send-reset-code', userController.sendResetCode);

/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Reset password using the code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: newSecurePassword
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid code or email
 */
router.post('/reset-password', userController.resetPassword);

module.exports = router;
