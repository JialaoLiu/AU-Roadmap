const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Authentication required', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
  }
}

module.exports = authenticate;
