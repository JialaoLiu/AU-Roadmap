const { error } = require('../utils/response');

function roleGuard(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }
    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'Access denied', 403, 'FORBIDDEN');
    }
    next();
  };
}

module.exports = roleGuard;
