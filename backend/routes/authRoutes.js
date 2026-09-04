const express = require('express');
const { body, validationResult } = require('express-validator');
const { register,login } = require('../controllers/authController');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

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

module.exports = router;


