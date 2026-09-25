const { HttpStatus } = require('../config/constants');

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/config");

const failedLoginAttempts = new Map();

function getLockoutDuration(attempts) {
  if (attempts >= 10) {
    return 30 * 60 * 1000; // 30 minutes
  }

  if (attempts >= 8) {
    return 5 * 60 * 1000; // 5 minutes
  }

  if (attempts >= 5) {
    return 3 * 60 * 1000; // 3 minutes
  }

  return 0;
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');

    res.json({ users });

  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {

    // A user may view their own profile; only Admins may view others.
    if (
      req.user.role !== "Admin" &&
      req.user.id !== req.params.id
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You are not allowed to view another user's information."
      });
    }

    const user = await User.findById(req.params.id, '-password');

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    res.status(HttpStatus.OK).json({ user });

  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message
    });
  }
};

const createUser = async (req, res) => {
  try {

    if (!req.body.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Password is required'
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });

    res.status(HttpStatus.CREATED).json(user);

  } catch (error) {

    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message
    });

  }
};

const updateUser = async (req, res) => {
  try {

    // Check if the user is allowed to update this account
    if (
      req.user.role !== "Admin" &&
      req.user.id !== req.params.id
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You are not allowed to update another user's information."
      });
    }

    // Hash password if it is being changed
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    res.status(HttpStatus.OK).json({
      message: "User updated successfully",
      user
    });

  } catch (error) {

    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message
    });

  }
};

const deleteUser = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.status(HttpStatus.OK).json({
      message: 'User deleted successfully'
    });

  } catch (error) {

    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message
    });

  }
};

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Email and password are required.'
      });
    }

    const loginKey = `${req.ip}:${email.toLowerCase()}`;

    const loginRecord = failedLoginAttempts.get(loginKey);

    if (
      loginRecord &&
      loginRecord.blockedUntil &&
      loginRecord.blockedUntil > Date.now()
    ) {

      const remainingTime = Math.ceil(
        (loginRecord.blockedUntil - Date.now()) / 1000
      );

      return res.status(429).json({
        message: `Too many failed login attempts. Please try again in ${remainingTime} seconds.`
      });
    }

    const user = await User.findOne({ email });

    if (!user) {

      const attempts = (loginRecord?.attempts || 0) + 1;

      const lockoutDuration = getLockoutDuration(attempts);

      failedLoginAttempts.set(loginKey, {
        attempts,
        blockedUntil: lockoutDuration
          ? Date.now() + lockoutDuration
          : null
      });

      if (lockoutDuration) {

        const minutes = lockoutDuration / 60000;

        return res.status(429).json({
          message: `Too many failed login attempts. Please try again after ${minutes} minute(s).`
        });

      }

      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User not found.',
      });
    }

    if (!user.isActive) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Your account is inactive. Please contact support.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      const attempts = (loginRecord?.attempts || 0) + 1;

      const lockoutDuration = getLockoutDuration(attempts);

      failedLoginAttempts.set(loginKey, {
        attempts,
        blockedUntil: lockoutDuration
          ? Date.now() + lockoutDuration
          : null
      });

      if (lockoutDuration) {

        const minutes = lockoutDuration / 60000;

        return res.status(429).json({
          message: `Too many failed login attempts. Please try again after ${minutes} minute(s).`
        });

      }

      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid credentials.',
      });
    }

    failedLoginAttempts.delete(loginKey);

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.status(HttpStatus.OK).json({
      message: 'Login successful',
      token,
      firstName: user.firstName,
      role: user.role,
    });

  } catch (error) {

    console.error(error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Server error.',
    });

  }
};

const registerUser = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      password,
    } = req.body;

    // Public self-registration is always a Customer account. Admin
    // accounts can only be created by an existing Admin via POST /users,
    // which is already locked down by the authorize("Admin") middleware.

    if (!password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Password is required'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      password: hashedPassword,
      role: 'Customer'
    });

    res.status(HttpStatus.CREATED).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {

    res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message
    });

  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser,
};