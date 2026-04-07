const pool = require('../config/db');
const { success, error } = require('../utils/response');

// GET all threads (supports optional program_id and category filters)
async function getAllThreads(req, res, next) {
  try {
    const { category, program_id } = req.query;
    let query = `
      SELECT t.*, u.first_name, u.last_name, u.role AS user_role, u.avatar_url
      FROM discussion_threads t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (program_id) {
      query += ' AND t.program_id = ?';
      params.push(program_id);
    }
    if (category && category !== 'all') {
      query += ' AND t.category = ?';
      params.push(category);
    }

    query += ' ORDER BY t.is_pinned DESC, t.updated_at DESC';
    const [threads] = await pool.query(query, params);
    return success(res, threads);
  } catch (err) {
    next(err);
  }
}

// GET threads for a program (legacy route)
async function getThreads(req, res, next) {
  try {
    const { programId } = req.params;
    const [threads] = await pool.query(
      `SELECT t.*, u.first_name, u.last_name, u.role AS user_role, u.avatar_url
       FROM discussion_threads t
       JOIN users u ON t.user_id = u.id
       WHERE t.program_id = ?
       ORDER BY t.is_pinned DESC, t.updated_at DESC`,
      [programId]
    );
    return success(res, threads);
  } catch (err) {
    next(err);
  }
}

// GET single thread with replies
async function getThread(req, res, next) {
  try {
    const { threadId } = req.params;

    const [threads] = await pool.query(
      `SELECT t.*, u.first_name, u.last_name, u.role AS user_role, u.avatar_url
       FROM discussion_threads t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [threadId]
    );

    if (threads.length === 0) {
      return error(res, 'Thread not found', 404, 'NOT_FOUND');
    }

    const [replies] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.role AS user_role, u.avatar_url
       FROM discussion_replies r
       JOIN users u ON r.user_id = u.id
       WHERE r.thread_id = ?
       ORDER BY r.created_at ASC`,
      [threadId]
    );

    return success(res, { thread: threads[0], replies });
  } catch (err) {
    next(err);
  }
}

// POST create thread
async function createThread(req, res, next) {
  try {
    const programId = req.params.programId || req.body.program_id || null;
    const { title, content, category } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO discussion_threads (program_id, user_id, title, content, category) VALUES (?, ?, ?, ?, ?)',
      [programId, userId, title, content, category || 'general']
    );

    const [rows] = await pool.query(
      `SELECT t.*, u.first_name, u.last_name, u.role AS user_role, u.avatar_url
       FROM discussion_threads t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [result.insertId]
    );

    return success(res, rows[0], 201);
  } catch (err) {
    next(err);
  }
}

// POST create reply
async function createReply(req, res, next) {
  try {
    const { threadId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO discussion_replies (thread_id, user_id, content) VALUES (?, ?, ?)',
      [threadId, userId, content]
    );

    // Update reply count
    await pool.query(
      'UPDATE discussion_threads SET reply_count = reply_count + 1 WHERE id = ?',
      [threadId]
    );

    const [rows] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.role AS user_role, u.avatar_url
       FROM discussion_replies r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [result.insertId]
    );

    return success(res, rows[0], 201);
  } catch (err) {
    next(err);
  }
}

// DELETE thread (owner or admin)
async function deleteThread(req, res, next) {
  try {
    const { threadId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const [threads] = await pool.query('SELECT user_id FROM discussion_threads WHERE id = ?', [threadId]);
    if (threads.length === 0) {
      return error(res, 'Thread not found', 404, 'NOT_FOUND');
    }

    if (threads[0].user_id !== userId && userRole !== 'admin') {
      return error(res, 'Not authorized', 403, 'FORBIDDEN');
    }

    await pool.query('DELETE FROM discussion_threads WHERE id = ?', [threadId]);
    return success(res, { message: 'Thread deleted' });
  } catch (err) {
    next(err);
  }
}

// DELETE reply (owner or admin)
async function deleteReply(req, res, next) {
  try {
    const { replyId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const [replies] = await pool.query(
      'SELECT thread_id, user_id FROM discussion_replies WHERE id = ?',
      [replyId]
    );
    if (replies.length === 0) {
      return error(res, 'Reply not found', 404, 'NOT_FOUND');
    }

    if (replies[0].user_id !== userId && userRole !== 'admin') {
      return error(res, 'Not authorized', 403, 'FORBIDDEN');
    }

    await pool.query('DELETE FROM discussion_replies WHERE id = ?', [replyId]);

    // Update reply count
    await pool.query(
      'UPDATE discussion_threads SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = ?',
      [replies[0].thread_id]
    );

    return success(res, { message: 'Reply deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllThreads, getThreads, getThread, createThread, createReply, deleteThread, deleteReply };
