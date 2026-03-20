const pool = require('../config/db');
const { success, error, paginated } = require('../utils/response');

async function listPrograms(req, res, next) {
  try {
    const { level, faculty, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM programs WHERE is_active = TRUE';
    let countQuery = 'SELECT COUNT(*) as total FROM programs WHERE is_active = TRUE';
    const params = [];
    const countParams = [];

    if (level) {
      query += ' AND level = ?';
      countQuery += ' AND level = ?';
      params.push(level);
      countParams.push(level);
    }

    if (faculty) {
      query += ' AND faculty = ?';
      countQuery += ' AND faculty = ?';
      params.push(faculty);
      countParams.push(faculty);
    }

    if (search) {
      query += ' AND (name LIKE ? OR code LIKE ? OR description LIKE ?)';
      countQuery += ' AND (name LIKE ? OR code LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [programs] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    return paginated(res, programs, page, limit, countResult[0].total);
  } catch (err) {
    next(err);
  }
}

async function getProgramDetail(req, res, next) {
  try {
    const { id } = req.params;
    const [programs] = await pool.query('SELECT * FROM programs WHERE id = ? AND is_active = TRUE', [id]);

    if (programs.length === 0) {
      return error(res, 'Program not found', 404, 'NOT_FOUND');
    }

    return success(res, programs[0]);
  } catch (err) {
    next(err);
  }
}

async function getProgramCourses(req, res, next) {
  try {
    const { id } = req.params;

    const [courses] = await pool.query(
      `SELECT c.*, pc.year_level, pc.semester, pc.is_core, pc.course_group, pc.sort_order
       FROM courses c
       JOIN program_courses pc ON c.id = pc.course_id
       WHERE pc.program_id = ? AND c.is_active = TRUE
       ORDER BY pc.year_level ASC, pc.semester ASC, pc.sort_order ASC`,
      [id]
    );

    return success(res, courses);
  } catch (err) {
    next(err);
  }
}

async function getProgramRoadmap(req, res, next) {
  try {
    const { id } = req.params;

    // Get program info
    const [programs] = await pool.query('SELECT id, code, name, duration_years FROM programs WHERE id = ?', [id]);
    if (programs.length === 0) {
      return error(res, 'Program not found', 404, 'NOT_FOUND');
    }

    // Get courses with mapping
    const [courses] = await pool.query(
      `SELECT c.id, c.code, c.name, c.units, c.level, c.semester_offered, c.is_elective,
              pc.year_level, pc.semester, pc.is_core, pc.course_group, pc.sort_order
       FROM courses c
       JOIN program_courses pc ON c.id = pc.course_id
       WHERE pc.program_id = ? AND c.is_active = TRUE
       ORDER BY pc.year_level ASC, pc.semester ASC, pc.sort_order ASC`,
      [id]
    );

    // Get all prerequisites for courses in this program
    const courseIds = courses.map(c => c.id);
    let prerequisites = [];
    if (courseIds.length > 0) {
      const [prereqs] = await pool.query(
        `SELECT course_id, prerequisite_course_id, is_corequisite
         FROM prerequisites
         WHERE course_id IN (?)`,
        [courseIds]
      );
      prerequisites = prereqs;
    }

    // Build roadmap structure: year -> semester -> courses
    const roadmapMap = {};
    courses.forEach(course => {
      const year = course.year_level;
      const sem = course.semester;

      if (!roadmapMap[year]) roadmapMap[year] = {};
      if (!roadmapMap[year][sem]) roadmapMap[year][sem] = [];

      const coursePrereqs = prerequisites
        .filter(p => p.course_id === course.id)
        .map(p => ({
          course_id: p.prerequisite_course_id,
          is_corequisite: p.is_corequisite,
        }));

      const prerequisiteFor = prerequisites
        .filter(p => p.prerequisite_course_id === course.id)
        .map(p => p.course_id);

      roadmapMap[year][sem].push({
        id: course.id,
        code: course.code,
        name: course.name,
        units: course.units,
        is_core: course.is_core,
        course_group: course.course_group,
        prerequisites: coursePrereqs,
        prerequisite_for: prerequisiteFor,
      });
    });

    // Convert to array structure
    const roadmap = Object.keys(roadmapMap)
      .sort((a, b) => a - b)
      .map(year => ({
        year: parseInt(year),
        semesters: Object.keys(roadmapMap[year])
          .sort((a, b) => a - b)
          .map(sem => ({
            semester: parseInt(sem),
            courses: roadmapMap[year][sem],
          })),
      }));

    return success(res, {
      program: programs[0],
      roadmap,
    });
  } catch (err) {
    next(err);
  }
}

async function getProgramAlumni(req, res, next) {
  try {
    const { id } = req.params;
    const [alumni] = await pool.query(
      'SELECT * FROM alumni WHERE program_id = ? AND is_active = TRUE ORDER BY graduation_year DESC',
      [id]
    );
    return success(res, alumni);
  } catch (err) {
    next(err);
  }
}

async function getProgramIndustry(req, res, next) {
  try {
    const { id } = req.params;
    const [partners] = await pool.query(
      `SELECT ip.*, pi.opportunity_description
       FROM industry_partners ip
       JOIN program_industry pi ON ip.id = pi.industry_partner_id
       WHERE pi.program_id = ? AND ip.is_active = TRUE`,
      [id]
    );
    return success(res, partners);
  } catch (err) {
    next(err);
  }
}

async function getProgramCareers(req, res, next) {
  try {
    const { id } = req.params;

    const [outcomes] = await pool.query(
      'SELECT * FROM career_outcomes WHERE program_id = ? ORDER BY year DESC',
      [id]
    );

    const [paths] = await pool.query(
      'SELECT * FROM career_paths WHERE program_id = ? ORDER BY sort_order ASC',
      [id]
    );

    return success(res, { outcomes, paths });
  } catch (err) {
    next(err);
  }
}

async function getProgramResources(req, res, next) {
  try {
    const { id } = req.params;
    const [resources] = await pool.query(
      `SELECT * FROM resources
       WHERE (program_id = ? OR program_id IS NULL) AND is_active = TRUE
       ORDER BY sort_order ASC`,
      [id]
    );
    return success(res, resources);
  } catch (err) {
    next(err);
  }
}

async function getFeaturedAlumni(req, res, next) {
  try {
    const [alumni] = await pool.query(
      'SELECT * FROM alumni WHERE is_featured = TRUE AND is_active = TRUE ORDER BY graduation_year DESC LIMIT 3'
    );
    return success(res, alumni);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listPrograms,
  getProgramDetail,
  getProgramCourses,
  getProgramRoadmap,
  getProgramAlumni,
  getProgramIndustry,
  getProgramCareers,
  getProgramResources,
  getFeaturedAlumni,
};
