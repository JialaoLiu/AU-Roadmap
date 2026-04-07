const pool = require('../config/db');
const { success, error } = require('../utils/response');

// ==================== PEOPLE (Alumni) ====================

async function getAlumniProfiles(req, res, next) {
  try {
    const { search, program_id } = req.query;
    let query = `
      SELECT u.id, u.first_name, u.last_name, u.avatar_url,
             ap.graduation_year, ap.program_id, ap.current_role, ap.current_company,
             ap.location, ap.bio, ap.linkedin_url, ap.is_featured,
             p.name AS program_name
      FROM users u
      JOIN alumni_profiles ap ON u.id = ap.user_id
      LEFT JOIN programs p ON ap.program_id = p.id
      WHERE u.role = 'alumni'
    `;
    const params = [];

    if (program_id) {
      query += ' AND ap.program_id = ?';
      params.push(program_id);
    }
    if (search) {
      query += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR ap.current_company LIKE ? OR ap.current_role LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY ap.is_featured DESC, ap.graduation_year DESC';

    const [alumni] = await pool.query(query, params);

    // If user is authenticated, attach connection status
    if (req.user) {
      const [connections] = await pool.query(
        `SELECT id, requester_id, receiver_id, status FROM user_connections
         WHERE requester_id = ? OR receiver_id = ?`,
        [req.user.id, req.user.id]
      );
      alumni.forEach(a => {
        const conn = connections.find(
          c => (c.requester_id === req.user.id && c.receiver_id === a.id) ||
               (c.receiver_id === req.user.id && c.requester_id === a.id)
        );
        a.connection_status = conn ? conn.status : null;
        a.connection_id = conn ? conn.id : null;
      });
    }

    return success(res, alumni);
  } catch (err) {
    next(err);
  }
}

async function getAlumniProfile(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.avatar_url,
              ap.graduation_year, ap.program_id, ap.current_role, ap.current_company,
              ap.location, ap.bio, ap.success_story, ap.linkedin_url, ap.is_featured,
              p.name AS program_name
       FROM users u
       JOIN alumni_profiles ap ON u.id = ap.user_id
       LEFT JOIN programs p ON ap.program_id = p.id
       WHERE u.id = ? AND u.role = 'alumni'`,
      [id]
    );

    if (rows.length === 0) {
      return error(res, 'Alumni not found', 404, 'NOT_FOUND');
    }

    const alumni = rows[0];

    // Connection count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as count FROM user_connections
       WHERE (requester_id = ? OR receiver_id = ?) AND status = 'accepted'`,
      [id, id]
    );
    alumni.connection_count = countResult[0].count;

    return success(res, alumni);
  } catch (err) {
    next(err);
  }
}

// ==================== CONNECTIONS ====================

async function sendConnectionRequest(req, res, next) {
  try {
    const { receiver_id } = req.body;
    const requesterId = req.user.id;

    if (requesterId === receiver_id) {
      return error(res, 'Cannot connect with yourself', 400);
    }

    // Check if connection already exists (in either direction)
    const [existing] = await pool.query(
      `SELECT * FROM user_connections
       WHERE (requester_id = ? AND receiver_id = ?) OR (requester_id = ? AND receiver_id = ?)`,
      [requesterId, receiver_id, receiver_id, requesterId]
    );

    if (existing.length > 0) {
      return error(res, 'Connection already exists', 400);
    }

    await pool.query(
      'INSERT INTO user_connections (requester_id, receiver_id, status) VALUES (?, ?, ?)',
      [requesterId, receiver_id, 'pending']
    );

    return success(res, { message: 'Connection request sent' }, 201);
  } catch (err) {
    next(err);
  }
}

async function respondToConnection(req, res, next) {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    const [connections] = await pool.query(
      'SELECT * FROM user_connections WHERE id = ? AND receiver_id = ?',
      [id, req.user.id]
    );

    if (connections.length === 0) {
      return error(res, 'Connection request not found', 404);
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    await pool.query(
      'UPDATE user_connections SET status = ? WHERE id = ?',
      [newStatus, id]
    );

    return success(res, { message: `Connection ${newStatus}` });
  } catch (err) {
    next(err);
  }
}

async function getConnections(req, res, next) {
  try {
    const userId = req.user.id;
    const [connections] = await pool.query(
      `SELECT uc.id AS connection_id, uc.status, uc.created_at,
              u.id, u.first_name, u.last_name, u.avatar_url, u.role,
              ap.current_role, ap.current_company, ap.location
       FROM user_connections uc
       JOIN users u ON (CASE WHEN uc.requester_id = ? THEN uc.receiver_id ELSE uc.requester_id END) = u.id
       LEFT JOIN alumni_profiles ap ON u.id = ap.user_id
       WHERE (uc.requester_id = ? OR uc.receiver_id = ?) AND uc.status = 'accepted'
       ORDER BY uc.created_at DESC`,
      [userId, userId, userId]
    );

    return success(res, connections);
  } catch (err) {
    next(err);
  }
}

async function getPendingRequests(req, res, next) {
  try {
    const userId = req.user.id;
    const [requests] = await pool.query(
      `SELECT uc.id AS connection_id, uc.created_at,
              u.id, u.first_name, u.last_name, u.avatar_url, u.role,
              ap.current_role, ap.current_company
       FROM user_connections uc
       JOIN users u ON uc.requester_id = u.id
       LEFT JOIN alumni_profiles ap ON u.id = ap.user_id
       WHERE uc.receiver_id = ? AND uc.status = 'pending'
       ORDER BY uc.created_at DESC`,
      [userId]
    );

    return success(res, requests);
  } catch (err) {
    next(err);
  }
}

// ==================== MESSAGES ====================

async function getConversations(req, res, next) {
  try {
    const userId = req.user.id;

    // Get latest message per conversation partner using subquery
    const [conversations] = await pool.query(
      `SELECT
         u.id AS partner_id, u.first_name, u.last_name, u.avatar_url, u.role,
         ap.current_role, ap.current_company,
         latest.content AS last_message, latest.created_at AS last_message_at, latest.sender_id AS last_sender_id,
         (SELECT COUNT(*) FROM messages m2
          WHERE m2.sender_id = u.id AND m2.receiver_id = ? AND m2.is_read = FALSE) AS unread_count
       FROM (
         SELECT m1.*
         FROM messages m1
         INNER JOIN (
           SELECT MAX(id) AS max_id
           FROM messages
           WHERE sender_id = ? OR receiver_id = ?
           GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
         ) m2 ON m1.id = m2.max_id
       ) latest
       JOIN users u ON (CASE WHEN latest.sender_id = ? THEN latest.receiver_id ELSE latest.sender_id END) = u.id
       LEFT JOIN alumni_profiles ap ON u.id = ap.user_id
       ORDER BY latest.created_at DESC`,
      [userId, userId, userId, userId]
    );

    return success(res, conversations);
  } catch (err) {
    next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const userId = req.user.id;
    const partnerId = req.params.userId;

    const [messages] = await pool.query(
      `SELECT m.*, u.first_name, u.last_name, u.avatar_url
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.created_at ASC`,
      [userId, partnerId, partnerId, userId]
    );

    // Mark messages from partner as read
    await pool.query(
      'UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE',
      [partnerId, userId]
    );

    return success(res, messages);
  } catch (err) {
    next(err);
  }
}

async function sendMessage(req, res, next) {
  try {
    const senderId = req.user.id;
    const { receiver_id, content } = req.body;

    if (!content || !content.trim()) {
      return error(res, 'Message content is required', 400);
    }

    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [senderId, receiver_id, content.trim()]
    );

    const [msg] = await pool.query(
      `SELECT m.*, u.first_name, u.last_name, u.avatar_url
       FROM messages m JOIN users u ON m.sender_id = u.id
       WHERE m.id = ?`,
      [result.insertId]
    );

    return success(res, msg[0], 201);
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const userId = req.user.id;
    const partnerId = req.params.userId;

    await pool.query(
      'UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE',
      [partnerId, userId]
    );

    return success(res, { message: 'Messages marked as read' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAlumniProfiles,
  getAlumniProfile,
  sendConnectionRequest,
  respondToConnection,
  getConnections,
  getPendingRequests,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
};
