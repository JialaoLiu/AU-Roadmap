const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { success, error, paginated } = require('../utils/response');

// ─── STATS ───────────────────────────────────────────────
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

// ─── PROGRAMS ────────────────────────────────────────────
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

// ─── COURSES ─────────────────────────────────────────────
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

// ─── PROGRAM-COURSE MAPPING ─────────────────────────────
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

// ─── PREREQUISITES ───────────────────────────────────────
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

// ─── ALUMNI ──────────────────────────────────────────────
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

// ─── INDUSTRY PARTNERS ──────────────────────────────────
async function listIndustryPartners(req, res, next) {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM industry_partners WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM industry_partners WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' AND (name LIKE ? OR industry_sector LIKE ?)';
      countQuery += ' AND (name LIKE ? OR industry_sector LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term);
      countParams.push(term, term);
    }

    query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [partners] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);

    return paginated(res, partners, page, limit, countResult[0].total);
  } catch (err) {
    next(err);
  }
}

async function createIndustryPartner(req, res, next) {
  try {
    const {
      name, industry_sector, description, logo_url, website_url,
      partnership_type, contact_email,
    } = req.body;

    if (!name || !partnership_type) {
      return error(res, 'name and partnership_type are required', 400, 'VALIDATION_ERROR');
    }

    const [result] = await pool.query(
      `INSERT INTO industry_partners (name, industry_sector, description, logo_url, website_url, partnership_type, contact_email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, industry_sector || null, description || null, logo_url || null,
       website_url || null, partnership_type, contact_email || null]
    );

    const [created] = await pool.query('SELECT * FROM industry_partners WHERE id = ?', [result.insertId]);
    return success(res, created[0], 201);
  } catch (err) {
    next(err);
  }
}

async function updateIndustryPartner(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    const allowed = [
      'name', 'industry_sector', 'description', 'logo_url', 'website_url',
      'partnership_type', 'contact_email', 'is_active',
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
    await pool.query(`UPDATE industry_partners SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query('SELECT * FROM industry_partners WHERE id = ?', [id]);
    if (updated.length === 0) return error(res, 'Partner not found', 404, 'NOT_FOUND');

    return success(res, updated[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteIndustryPartner(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM industry_partners WHERE id = ?', [id]);
    if (result.affectedRows === 0) return error(res, 'Partner not found', 404, 'NOT_FOUND');
    return success(res, { message: 'Partner deleted' });
  } catch (err) {
    next(err);
  }
}

// ─── CAREER OUTCOMES ─────────────────────────────────────
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

// ─── CAREER PATHS ────────────────────────────────────────
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

// ─── USERS ───────────────────────────────────────────────
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
  getStats,
  createProgram, updateProgram, deleteProgram,
  listCourses, createCourse, updateCourse, deleteCourse,
  addCourseToProgram, removeCourseFromProgram,
  addPrerequisite, removePrerequisite,
  listAlumni, createAlumni, updateAlumni, deleteAlumni,
  listIndustryPartners, createIndustryPartner, updateIndustryPartner, deleteIndustryPartner,
  createCareerOutcome, updateCareerOutcome, deleteCareerOutcome,
  createCareerPath, updateCareerPath, deleteCareerPath,
  listUsers, changeUserRole, deleteUser,
};
