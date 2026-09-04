const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const SALT_ROUNDS = 10;

// REGISTER
exports.register = async (req, res) => {
  const { email, password, role_id } = req.body;

  try {
    // check if email already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // hash the password before storing
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // insert user, return safe fields only
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role_id)
       VALUES ($1, $2, $3)
       RETURNING id, email, role_id, created_at`,
      [email, password_hash, role_id]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};


// LOGIN


exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check that both fields were provided
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password required'
    });
  }

  try {
    // Find the user by email and also get their role
    const result = await pool.query(
      `SELECT u.id, u.email, u.password_hash, r.name AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    // User not found
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Compare entered password with stored bcrypt hash
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    // Wrong password
    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Create JWT
    const token = jwt.sign(              // This is where the JWT is created using the user's id, email, and role. The secret key and expiration time are taken from environment variables. 
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    // Send token and safe user information to frontend
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Server error during login'
    });
  }
};

