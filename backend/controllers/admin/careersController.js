const pool = require('../../config/db');
const { success, error } = require('../../utils/response');

async function createCareerOutcome(req, res, next) {
  try {
    const {
      program_id, year, employment_rate, median_salary,
      salary_range_low, salary_range_high, further_study_rate,
      satisfaction_rate, source,
    } = req.body;

    if (!program_id || !year) {
      return error(res, 'program_id and year are required', 400, 'VALIDATION_ERROR');
    }

    const [result] = await pool.query(
      `INSERT INTO career_outcomes (program_id, year, employment_rate, median_salary,
        salary_range_low, salary_range_high, further_study_rate, satisfaction_rate, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [program_id, year, employment_rate || null, median_salary || null,
       salary_range_low || null, salary_range_high || null,
       further_study_rate || null, satisfaction_rate || null, source || null]
    );

    const [created] = await pool.query('SELECT * FROM career_outcomes WHERE id = ?', [result.insertId]);
    return success(res, created[0], 201);
  } catch (err) {
    next(err);
  }
}

async function updateCareerOutcome(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    const allowed = [
      'program_id', 'year', 'employment_rate', 'median_salary',
      'salary_range_low', 'salary_range_high', 'further_study_rate',
      'satisfaction_rate', 'source',
    ];

    const updates = [];
    const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (updates.length === 0) return error(res, 'No valid fields to update', 400, 'VALIDATION_ERROR');

    values.push(id);
    await pool.query(`UPDATE career_outcomes SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query('SELECT * FROM career_outcomes WHERE id = ?', [id]);
    if (updated.length === 0) return error(res, 'Career outcome not found', 404, 'NOT_FOUND');

    return success(res, updated[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteCareerOutcome(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM career_outcomes WHERE id = ?', [id]);
    if (result.affectedRows === 0) return error(res, 'Career outcome not found', 404, 'NOT_FOUND');
    return success(res, { message: 'Career outcome deleted' });
  } catch (err) {
    next(err);
  }
}

async function createCareerPath(req, res, next) {
  try {
    const { program_id, job_title, description, average_salary, demand_level, industry_sector, sort_order } = req.body;

    if (!program_id || !job_title) {
      return error(res, 'program_id and job_title are required', 400, 'VALIDATION_ERROR');
    }

    const [result] = await pool.query(
      `INSERT INTO career_paths (program_id, job_title, description, average_salary, demand_level, industry_sector, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [program_id, job_title, description || null, average_salary || null,
       demand_level || 'medium', industry_sector || null, sort_order || 0]
    );

    const [created] = await pool.query('SELECT * FROM career_paths WHERE id = ?', [result.insertId]);
    return success(res, created[0], 201);
  } catch (err) {
    next(err);
  }
}

async function updateCareerPath(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    const allowed = ['program_id', 'job_title', 'description', 'average_salary', 'demand_level', 'industry_sector', 'sort_order'];

    const updates = [];
    const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (updates.length === 0) return error(res, 'No valid fields to update', 400, 'VALIDATION_ERROR');

    values.push(id);
    await pool.query(`UPDATE career_paths SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query('SELECT * FROM career_paths WHERE id = ?', [id]);
    if (updated.length === 0) return error(res, 'Career path not found', 404, 'NOT_FOUND');

    return success(res, updated[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteCareerPath(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM career_paths WHERE id = ?', [id]);
    if (result.affectedRows === 0) return error(res, 'Career path not found', 404, 'NOT_FOUND');
    return success(res, { message: 'Career path deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCareerOutcome,
  updateCareerOutcome,
  deleteCareerOutcome,
  createCareerPath,
  updateCareerPath,
  deleteCareerPath,
};
