const pool = require('../../config/db');
const { success, error, paginated } = require('../../utils/response');

async function listUsers(req, res, next) {
  try {
    const { search, role, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, first_name, last_name, email, role, student_id, program_id, created_at FROM users WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      countQuery += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
      countParams.push(term, term, term);
    }

    if (role) {
      query += ' AND role = ?';
      countQuery += ' AND role = ?';
      params.push(role);
      countParams.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    return paginated(res, users, page, limit, countResult[0].total);
  } catch (err) {
    next(err);
  }
}

async function changeUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'prospective', 'admin'].includes(role)) {
      return error(res, 'Invalid role', 400, 'VALIDATION_ERROR');
    }

    // Prevent self-demotion
    if (parseInt(id) === req.user.id) {
      return error(res, 'Cannot change your own role', 400, 'SELF_MODIFY');
    }

    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    const [updated] = await pool.query(
      'SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = ?', [id]
    );
    if (updated.length === 0) return error(res, 'User not found', 404, 'NOT_FOUND');

    return success(res, updated[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return error(res, 'Cannot delete your own account', 400, 'SELF_MODIFY');
    }

    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return error(res, 'User not found', 404, 'NOT_FOUND');

    return success(res, { message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  changeUserRole,
  deleteUser,
};
