const pool = require('../../config/db');
const { success } = require('../../utils/response');

async function getStats(req, res, next) {
  try {
    const [[{ programs }]] = await pool.query('SELECT COUNT(*) as programs FROM programs');
    const [[{ courses }]] = await pool.query('SELECT COUNT(*) as courses FROM courses');
    const [[{ users }]] = await pool.query('SELECT COUNT(*) as users FROM users');
    const [[{ alumni }]] = await pool.query(
      `SELECT COUNT(*) as alumni
       FROM users u
       JOIN alumni_profiles ap ON u.id = ap.user_id
       WHERE u.role = 'alumni'`
    );
    const [[{ partners }]] = await pool.query('SELECT COUNT(*) as partners FROM industry_partners');
    const [[{ resources }]] = await pool.query('SELECT COUNT(*) as resources FROM resources');

    return success(res, { programs, courses, users, alumni, partners, resources });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats,
};
