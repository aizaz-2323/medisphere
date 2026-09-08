const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

// Register route with validation
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('role_id')
      .isInt()
      .withMessage('role_id must be an integer'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

// Login route with validation
router.post('/login', login);
router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});

// GOOGLE OAUTH - START
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// GOOGLE OAUTH - CALLBACK
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login-failed',
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
    );
  }
);

module.exports = router;


