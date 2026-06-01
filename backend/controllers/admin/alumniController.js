const bcrypt = require('bcrypt');
const pool = require('../../config/db');
const { success, error, paginated } = require('../../utils/response');

async function listAlumni(req, res, next) {
  try {
    const { search, program_id, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.avatar_url,
             ap.graduation_year, ap.program_id, ap.current_role, ap.current_company,
             ap.location, ap.bio, ap.success_story, ap.linkedin_url, ap.is_featured,
             p.code as program_code, p.name as program_name
      FROM users u
      JOIN alumni_profiles ap ON u.id = ap.user_id
      LEFT JOIN programs p ON ap.program_id = p.id
      WHERE u.role = 'alumni'
    `;
    let countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      JOIN alumni_profiles ap ON u.id = ap.user_id
      WHERE u.role = 'alumni'
    `;
    const params = [];
    const countParams = [];

    if (search) {
      query += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR ap.current_company LIKE ? OR ap.current_role LIKE ?)';
      countQuery += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR ap.current_company LIKE ? OR ap.current_role LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
      countParams.push(term, term, term, term, term);
    }

    if (program_id) {
      query += ' AND ap.program_id = ?';
      countQuery += ' AND ap.program_id = ?';
      params.push(program_id);
      countParams.push(program_id);
    }

    query += ' ORDER BY ap.is_featured DESC, ap.graduation_year DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [alumni] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    return paginated(res, alumni, page, limit, countResult[0].total);
  } catch (err) {
    next(err);
  }
}

async function createAlumni(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      email, first_name, last_name, graduation_year, program_id,
      current_role, current_company, location, bio, success_story,
      avatar_url, linkedin_url, is_featured,
    } = req.body;

    if (!email || !first_name || !last_name || !graduation_year || !program_id) {
      return error(res, 'email, first_name, last_name, graduation_year, and program_id are required', 400, 'VALIDATION_ERROR');
    }

    await connection.beginTransaction();

    const passwordHash = await bcrypt.hash('11111111', 12);
    const [userResult] = await connection.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, avatar_url)
       VALUES (?, ?, ?, ?, 'alumni', ?)`,
      [email, passwordHash, first_name, last_name, avatar_url || null]
    );

    await connection.query(
      `INSERT INTO alumni_profiles (
        user_id, graduation_year, program_id, current_role, current_company,
        location, bio, success_story, linkedin_url, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userResult.insertId, graduation_year, program_id,
        current_role || null, current_company || null, location || null,
        bio || null, success_story || null, linkedin_url || null, is_featured || false,
      ]
    );

    await connection.commit();

    const [created] = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.avatar_url,
              ap.graduation_year, ap.program_id, ap.current_role, ap.current_company,
              ap.location, ap.bio, ap.success_story, ap.linkedin_url, ap.is_featured
       FROM users u
       JOIN alumni_profiles ap ON u.id = ap.user_id
       WHERE u.id = ?`,
      [userResult.insertId]
    );
    return success(res, created[0], 201);
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

async function updateAlumni(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    const userFields = ['email', 'first_name', 'last_name', 'avatar_url'];
    const profileFields = [
      'graduation_year', 'program_id',
      'current_role', 'current_company', 'location', 'bio', 'success_story',
      'linkedin_url', 'is_featured',
    ];

    const userUpdates = [];
    const userValues = [];
    for (const key of userFields) {
      if (fields[key] !== undefined) {
        userUpdates.push(`${key} = ?`);
        userValues.push(fields[key] || null);
      }
    }

    const profileUpdates = [];
    const profileValues = [];
    for (const key of profileFields) {
      if (fields[key] !== undefined) {
        profileUpdates.push(`${key} = ?`);
        profileValues.push(fields[key]);
      }
    }

    if (userUpdates.length === 0 && profileUpdates.length === 0) {
      return error(res, 'No valid fields to update', 400, 'VALIDATION_ERROR');
    }

    if (userUpdates.length) {
      userValues.push(id);
      await pool.query(`UPDATE users SET ${userUpdates.join(', ')} WHERE id = ? AND role = 'alumni'`, userValues);
    }

    if (profileUpdates.length) {
      profileValues.push(id);
      await pool.query(`UPDATE alumni_profiles SET ${profileUpdates.join(', ')} WHERE user_id = ?`, profileValues);
    }

    const [updated] = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.avatar_url,
              ap.graduation_year, ap.program_id, ap.current_role, ap.current_company,
              ap.location, ap.bio, ap.success_story, ap.linkedin_url, ap.is_featured,
              p.code as program_code, p.name as program_name
       FROM users u
       JOIN alumni_profiles ap ON u.id = ap.user_id
       LEFT JOIN programs p ON ap.program_id = p.id
       WHERE u.id = ? AND u.role = 'alumni'`,
      [id]
    );
    if (updated.length === 0) return error(res, 'Alumni not found', 404, 'NOT_FOUND');

    return success(res, updated[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteAlumni(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM users WHERE id = ? AND role = 'alumni'", [id]);
    if (result.affectedRows === 0) return error(res, 'Alumni not found', 404, 'NOT_FOUND');
    return success(res, { message: 'Alumni deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
};
