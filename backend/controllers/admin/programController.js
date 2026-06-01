const pool = require('../../config/db');
const { success, error } = require('../../utils/response');

async function createProgram(req, res, next) {
  try {
    const {
      code, name, level, duration_years, faculty, description,
      overview_html, entry_requirements, atar_requirement,
      international_requirements, fees_domestic, fees_international,
      application_deadline, thumbnail_url, banner_url,
      seo_title, seo_description,
    } = req.body;

    if (!code || !name || !level || !duration_years || !faculty) {
      return error(res, 'Code, name, level, duration and faculty are required', 400, 'VALIDATION_ERROR');
    }

    const [result] = await pool.query(
      `INSERT INTO programs (code, name, level, duration_years, faculty, description,
        overview_html, entry_requirements, atar_requirement,
        international_requirements, fees_domestic, fees_international,
        application_deadline, thumbnail_url, banner_url, seo_title, seo_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, name, level, duration_years, faculty, description || null,
       overview_html || null, entry_requirements || null, atar_requirement || null,
       international_requirements || null, fees_domestic || null, fees_international || null,
       application_deadline || null, thumbnail_url || null, banner_url || null,
       seo_title || null, seo_description || null]
    );

    const [created] = await pool.query('SELECT * FROM programs WHERE id = ?', [result.insertId]);
    return success(res, created[0], 201);
  } catch (err) {
    next(err);
  }
}

async function updateProgram(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    const allowed = [
      'code', 'name', 'level', 'duration_years', 'faculty', 'description',
      'overview_html', 'entry_requirements', 'atar_requirement',
      'international_requirements', 'fees_domestic', 'fees_international',
      'application_deadline', 'is_active', 'thumbnail_url', 'banner_url',
      'seo_title', 'seo_description',
    ];

    const updates = [];
    const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (updates.length === 0) {
      return error(res, 'No valid fields to update', 400, 'VALIDATION_ERROR');
    }

    values.push(id);
    await pool.query(`UPDATE programs SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query('SELECT * FROM programs WHERE id = ?', [id]);
    if (updated.length === 0) return error(res, 'Program not found', 404, 'NOT_FOUND');

    return success(res, updated[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteProgram(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM programs WHERE id = ?', [id]);
    if (result.affectedRows === 0) return error(res, 'Program not found', 404, 'NOT_FOUND');
    return success(res, { message: 'Program deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProgram,
  updateProgram,
  deleteProgram,
};
