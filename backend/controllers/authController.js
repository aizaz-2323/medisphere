const bcrypt = require('bcrypt');
const pool = require('../db'); // you'll create this in step 4
const SALT_ROUNDS = 10;

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