const pool = require('../../config/db');
const { success, error, paginated } = require('../../utils/response');

async function listCourses(req, res, next) {
  try {
    const { search, level, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM courses WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM courses WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' AND (name LIKE ? OR code LIKE ?)';
      countQuery += ' AND (name LIKE ? OR code LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
      countParams.push(term, term);
    }

    if (level) {
      query += ' AND level = ?';
      countQuery += ' AND level = ?';
      params.push(level);
      countParams.push(level);
    }

    query += ' ORDER BY code ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [courses] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    return paginated(res, courses, page, limit, countResult[0].total);
  } catch (err) {
    next(err);
  }
}

async function createCourse(req, res, next) {
  let connection;
  try {
    const {
      code, name, units, level, semester_offered, description,
      learning_outcomes, assessment_summary, is_elective,
      program_id, year_level, semester, course_group, sort_order,
    } = req.body;

    if (!code || !name || !level || !semester_offered) {
      return error(res, 'Code, name, level, and semester_offered are required', 400, 'VALIDATION_ERROR');
    }

    const hasProgramMapping =
      program_id !== undefined && program_id !== null && program_id !== '' &&
      year_level !== undefined && year_level !== null && year_level !== '' &&
      semester !== undefined && semester !== null && semester !== '';

    if (!hasProgramMapping && (program_id || year_level || semester)) {
      return error(
        res,
        'program_id, year_level, and semester are all required when assigning a course to a program',
        400,
        'VALIDATION_ERROR'
      );
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO courses (code, name, units, level, semester_offered, description,
        learning_outcomes, assessment_summary, is_elective)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, name, units || 3, level, semester_offered, description || null,
       learning_outcomes || null, assessment_summary || null, is_elective || false]
    );

    if (hasProgramMapping) {
      await connection.query(
        `INSERT INTO program_courses (program_id, course_id, year_level, semester, is_core, course_group, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          program_id,
          result.insertId,
          year_level,
          semester,
          is_elective ? false : true,
          course_group || null,
          sort_order || 0,
        ]
      );
    }

    await connection.commit();

    const [created] = await pool.query('SELECT * FROM courses WHERE id = ?', [result.insertId]);
    return success(res, created[0], 201);
  } catch (err) {
    if (connection) await connection.rollback();
    next(err);
  } finally {
    if (connection) connection.release();
  }
}

async function updateCourse(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    const allowed = [
      'code', 'name', 'units', 'level', 'semester_offered', 'description',
      'learning_outcomes', 'assessment_summary', 'is_elective', 'is_active',
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
    await pool.query(`UPDATE courses SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (updated.length === 0) return error(res, 'Course not found', 404, 'NOT_FOUND');

    return success(res, updated[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM courses WHERE id = ?', [id]);
    if (result.affectedRows === 0) return error(res, 'Course not found', 404, 'NOT_FOUND');
    return success(res, { message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
}

async function addCourseToProgram(req, res, next) {
  try {
    const { programId } = req.params;
    const { course_id, year_level, semester, is_core, course_group, sort_order } = req.body;

    if (!course_id || !year_level || !semester) {
      return error(res, 'course_id, year_level, and semester are required', 400, 'VALIDATION_ERROR');
    }

    await pool.query(
      `INSERT INTO program_courses (program_id, course_id, year_level, semester, is_core, course_group, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [programId, course_id, year_level, semester, is_core !== false, course_group || null, sort_order || 0]
    );

    return success(res, { message: 'Course added to program' }, 201);
  } catch (err) {
    next(err);
  }
}

async function removeCourseFromProgram(req, res, next) {
  try {
    const { programId, courseId } = req.params;
    const [result] = await pool.query(
      'DELETE FROM program_courses WHERE program_id = ? AND course_id = ?',
      [programId, courseId]
    );
    if (result.affectedRows === 0) return error(res, 'Mapping not found', 404, 'NOT_FOUND');
    return success(res, { message: 'Course removed from program' });
  } catch (err) {
    next(err);
  }
}

async function addPrerequisite(req, res, next) {
  try {
    const { course_id, prerequisite_course_id, is_corequisite } = req.body;

    if (!course_id || !prerequisite_course_id) {
      return error(res, 'course_id and prerequisite_course_id are required', 400, 'VALIDATION_ERROR');
    }

    await pool.query(
      'INSERT INTO prerequisites (course_id, prerequisite_course_id, is_corequisite) VALUES (?, ?, ?)',
      [course_id, prerequisite_course_id, is_corequisite || false]
    );

    return success(res, { message: 'Prerequisite added' }, 201);
  } catch (err) {
    next(err);
  }
}

async function removePrerequisite(req, res, next) {
  try {
    const { courseId, prereqId } = req.params;
    const [result] = await pool.query(
      'DELETE FROM prerequisites WHERE course_id = ? AND prerequisite_course_id = ?',
      [courseId, prereqId]
    );
    if (result.affectedRows === 0) return error(res, 'Prerequisite not found', 404, 'NOT_FOUND');
    return success(res, { message: 'Prerequisite removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseToProgram,
  removeCourseFromProgram,
  addPrerequisite,
  removePrerequisite,
};
