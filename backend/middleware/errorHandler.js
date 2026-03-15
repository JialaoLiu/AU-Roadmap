const { error } = require('../utils/response');

function errorHandler(err, req, res, _next) {
  console.error('Error:', err.message);
  console.error(err.stack);

  if (err.code === 'ER_DUP_ENTRY') {
    return error(res, 'Duplicate entry', 409, 'DUPLICATE');
  }

  if (err.name === 'ValidationError') {
    return error(res, err.message, 400, 'VALIDATION_ERROR');
  }

  return error(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    500,
    'INTERNAL_ERROR'
  );
}

module.exports = errorHandler;
