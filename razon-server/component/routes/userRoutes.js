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

// Public authentication routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginLimiter, loginUser);

// Protected user routes
router.route('/')
  .get(authentication, authorize("Admin"), getUsers)
  .post(authentication, authorize("Admin"), createUser);

router.route('/:id')
  .get(authentication, getUserById)
  .put(authentication, updateUser)
  .delete(authentication, authorize("Admin"), deleteUser);

module.exports = router;