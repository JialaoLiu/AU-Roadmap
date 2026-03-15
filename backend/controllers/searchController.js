const pool = require('../config/db');
const { success } = require('../utils/response');

/**
 * Unified search across programs, courses, alumni, industry partners, career paths
 * GET /api/search?q=keyword&type=all|programs|courses|alumni|industry|careers&limit=10
 */
async function search(req, res, next) {
  try {
    const { q, type = 'all', limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return success(res, { programs: [], courses: [], alumni: [], industry: [], careers: [] });
    }

    const keyword = `%${q.trim()}%`;
    const cap = Math.min(parseInt(limit) || 10, 50);
    const results = {};

    const searches = [];

    if (type === 'all' || type === 'programs') {
      searches.push(
        pool.query(
          `SELECT id, code, name, level, faculty, duration_years,
                  atar_requirement, fees_domestic,
                  SUBSTRING(description, 1, 150) AS description
           FROM programs
           WHERE is_active = TRUE
             AND (name LIKE ? OR code LIKE ? OR faculty LIKE ? OR description LIKE ?)
           ORDER BY CASE
             WHEN name LIKE ? THEN 1
             WHEN code LIKE ? THEN 2
             ELSE 3
           END
           LIMIT ?`,
          [keyword, keyword, keyword, keyword, `${q.trim()}%`, `${q.trim()}%`, cap]
        ).then(([rows]) => { results.programs = rows; })
      );
    }

    if (type === 'all' || type === 'courses') {
      searches.push(
        pool.query(
          `SELECT id, code, name, units, level, semester_offered, is_elective,
                  SUBSTRING(description, 1, 150) AS description
           FROM courses
           WHERE is_active = TRUE
             AND (name LIKE ? OR code LIKE ? OR description LIKE ?)
           ORDER BY CASE
             WHEN code LIKE ? THEN 1
             WHEN name LIKE ? THEN 2
             ELSE 3
           END
           LIMIT ?`,
          [keyword, keyword, keyword, `${q.trim()}%`, `${q.trim()}%`, cap]
        ).then(([rows]) => { results.courses = rows; })
      );
    }

    if (type === 'all' || type === 'alumni') {
      searches.push(
        pool.query(
          `SELECT a.id, a.first_name, a.last_name, a.graduation_year,
                  a.current_role, a.current_company, a.photo_url,
                  p.name AS program_name
           FROM alumni a
           LEFT JOIN programs p ON a.program_id = p.id
           WHERE a.is_active = TRUE
             AND (CONCAT(a.first_name, ' ', a.last_name) LIKE ?
                  OR a.current_role LIKE ? OR a.current_company LIKE ?)
           LIMIT ?`,
          [keyword, keyword, keyword, cap]
        ).then(([rows]) => { results.alumni = rows; })
      );
    }

    if (type === 'all' || type === 'industry') {
      searches.push(
        pool.query(
          `SELECT id, name, industry_sector, partnership_type, logo_url,
                  SUBSTRING(description, 1, 150) AS description
           FROM industry_partners
           WHERE is_active = TRUE
             AND (name LIKE ? OR industry_sector LIKE ? OR description LIKE ?)
           LIMIT ?`,
          [keyword, keyword, keyword, cap]
        ).then(([rows]) => { results.industry = rows; })
      );
    }

    if (type === 'all' || type === 'careers') {
      searches.push(
        pool.query(
          `SELECT cp.id, cp.job_title, cp.average_salary, cp.demand_level,
                  cp.industry_sector, p.name AS program_name, p.id AS program_id,
                  SUBSTRING(cp.description, 1, 150) AS description
           FROM career_paths cp
           LEFT JOIN programs p ON cp.program_id = p.id
           WHERE cp.job_title LIKE ? OR cp.industry_sector LIKE ? OR cp.description LIKE ?
           LIMIT ?`,
          [keyword, keyword, keyword, cap]
        ).then(([rows]) => { results.careers = rows; })
      );
    }

    await Promise.all(searches);

    // Fill missing keys
    for (const key of ['programs', 'courses', 'alumni', 'industry', 'careers']) {
      if (!results[key]) results[key] = [];
    }

    // Total count
    results.total = Object.values(results).reduce(
      (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0
    );

    return success(res, results);
  } catch (err) {
    next(err);
  }
}

module.exports = { search };
