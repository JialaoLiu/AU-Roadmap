const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { success, error } = require('../utils/response');

const SALT_ROUNDS = 10;

async function register(req, res, next) {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return error(res, 'Email already registered', 409, 'DUPLICATE_EMAIL');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Restrict admin registration
    const userRole = (role === 'admin') ? 'prospective' : (role || 'prospective');

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, password_hash, userRole]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: result.insertId, email, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return success(res, {
      token,
      user: { id: result.insertId, first_name, last_name, email, role: userRole },
    }, 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return error(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return error(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return success(res, {
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        program_id: user.program_id,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email, role, avatar_url, student_id, program_id, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return error(res, 'User not found', 404, 'NOT_FOUND');
    }

    return success(res, users[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
