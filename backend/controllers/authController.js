const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/db');
const { success, error } = require('../utils/response');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const avatarDir = path.join(__dirname, '../../frontend/public/avatar');

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `user_${req.user.id}_${Date.now()}${ext}`);
  },
});

const avatarFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext) ? cb(null, true) : cb(new Error('Only image files are allowed'));
};

const uploadAvatar = multer({ storage: avatarStorage, fileFilter: avatarFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('avatar');

const SALT_ROUNDS = 12;

async function verifyTurnstile(token) {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success === true;
}

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR');
    }

    const { first_name, last_name, email, password, role, captcha } = req.body;

    if (!captcha) {
      return error(res, 'Please complete the CAPTCHA', 400, 'CAPTCHA_REQUIRED');
    }
    const captchaOk = await verifyTurnstile(captcha);
    if (!captchaOk) {
      return error(res, 'CAPTCHA verification failed', 400, 'CAPTCHA_FAILED');
    }

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR');
    }

    const { email, password, captcha } = req.body;

    if (!captcha) {
      return error(res, 'Please complete the CAPTCHA', 400, 'CAPTCHA_REQUIRED');
    }
    const captchaOk = await verifyTurnstile(captcha);
    if (!captchaOk) {
      return error(res, 'CAPTCHA verification failed', 400, 'CAPTCHA_FAILED');
    }

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

async function updateProfile(req, res, next) {
  try {
    const { first_name, last_name, avatar_url } = req.body;

    if (!first_name || !last_name) {
      return error(res, 'First name and last name are required', 400, 'VALIDATION_ERROR');
    }

    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, avatar_url = ? WHERE id = ?',
      [first_name.trim(), last_name.trim(), avatar_url || null, req.user.id]
    );

    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email, role, avatar_url, student_id, program_id, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    return success(res, users[0]);
  } catch (err) {
    next(err);
  }
}

async function uploadAvatarHandler(req, res, next) {
  uploadAvatar(req, res, async (err) => {
    if (err) return error(res, err.message, 400, 'UPLOAD_ERROR');
    if (!req.file) return error(res, 'No file uploaded', 400, 'NO_FILE');

    const avatarUrl = `/avatar/${req.file.filename}`;

    // Delete old avatar file if it was locally stored
    try {
      const [rows] = await pool.query('SELECT avatar_url FROM users WHERE id = ?', [req.user.id]);
      const oldUrl = rows[0]?.avatar_url;
      if (oldUrl && oldUrl.startsWith('/avatar/')) {
        const oldPath = path.join(avatarDir, path.basename(oldUrl));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    } catch (cleanupErr) {
      console.warn('Old avatar cleanup failed:', cleanupErr.message);
    }

    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id]);

    return success(res, { avatar_url: avatarUrl });
  });
}

module.exports = { register, login, getMe, updateProfile, uploadAvatarHandler };
