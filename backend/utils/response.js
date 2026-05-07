/**
 * Standardized API response helpers
 */

function success(res, data, statusCode = 200, meta = null) {
  const response = { success: true, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
}

function error(res, message, statusCode = 400, code = 'ERROR', details = null) {
  const response = {
    success: false,
    error: { code, message },
  };
  if (details) response.error.details = details;
  return res.status(statusCode).json(response);
}

function paginated(res, data, page, limit, total) {
  const safeLimit = Math.max(1, parseInt(limit, 10) || 1);
  return success(res, data, 200, {
    page: parseInt(page),
    limit: safeLimit,
    total,
    totalPages: Math.ceil(total / safeLimit),
  });
}

module.exports = { success, error, paginated };
