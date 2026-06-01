const pool = require('../../config/db');
const { success, error, paginated } = require('../../utils/response');

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

module.exports = {
  listIndustryPartners,
  createIndustryPartner,
  updateIndustryPartner,
  deleteIndustryPartner,
};
