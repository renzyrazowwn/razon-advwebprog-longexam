const express = require('express');

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");
const { registerValidation } = require("../middleware/validationMiddleware");
const { globalLimiter, loginLimiter } = require("../middleware/rateLimiterMiddleware");

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser
} = require('../controllers/userController');

const router = express.Router();

// PART 5: Documenting Authentication APIs (Register)
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new customer account
 *     description: >
 *       Public endpoint. Creates a **Customer** account (the role is always Customer, even if a
 *       different role is sent). The password is hashed with bcrypt before saving.
 *       Validation rules - firstName/lastName letters only, phoneNumber exactly 11 digits,
 *       valid email, password at least 6 characters.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation failed, or the email is already registered
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: Invalid field (express-validator)
 *                 value:
 *                   errors:
 *                     - type: field
 *                       value: "0917"
 *                       msg: Phone number must be 11 digits long
 *                       path: phoneNumber
 *                       location: body
 *               emailExists:
 *                 summary: Email already used
 *                 value:
 *                   message: Email already exists
 */
router.post('/register', registerValidation, registerUser);

// PART 5: Documenting Authentication APIs (Login)
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in and receive a JWT
 *     description: >
 *       Public endpoint. Returns a JWT (valid for 7 days) to use as `Authorization: Bearer <token>`.
 *       Protected by a rate limiter (20 requests / 15 minutes) and an account lockout after
 *       repeated failed attempts (5 = 3 min, 8 = 5 min, 10 = 30 min).
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Missing fields, unknown email, or wrong password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 summary: Email or password not sent
 *                 value:
 *                   message: Email and password are required.
 *               userNotFound:
 *                 summary: Email is not registered
 *                 value:
 *                   message: User not found.
 *               wrongPassword:
 *                 summary: Wrong password
 *                 value:
 *                   message: Invalid credentials.
 *       403:
 *         description: Account is deactivated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Your account is inactive. Please contact support.
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Server error.
 */
router.post('/login', loginLimiter, loginUser);

// PART 8: Users (protected)
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Returns every user without the password field.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create a user (Admin only)
 *     description: Lets an Admin create any account, including other Admins. The password is hashed.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       201:
 *         description: User created (returns the saved user document)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing password or validation/duplicate email error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Password is required
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.route('/')
  .get(authentication, authorize("Admin"), getUsers)
  .post(authentication, authorize("Admin"), createUser);

// PART 8: Users by id
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by id
 *     description: A Customer can only view their own profile. An Admin can view anyone.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Trying to view another user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: You are not allowed to view another user's information.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: User not found
 *   put:
 *     summary: Update a user
 *     description: A Customer can only update their own account. An Admin can update anyone.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid id or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Trying to update another user's account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: You are not allowed to update another user's information.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: User deleted successfully
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.route('/:id')
  .get(authentication, getUserById)
  .put(authentication, updateUser)
  .delete(authentication, authorize("Admin"), deleteUser);

module.exports = router;