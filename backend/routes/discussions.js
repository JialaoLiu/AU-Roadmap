const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const {
  getAllThreads, getThreads, getThread, createThread, createReply, deleteThread, deleteReply,
} = require('../controllers/discussionController');

const threadValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

const replyValidation = [
  body('content').trim().notEmpty().withMessage('Content is required'),
];

// All threads (community feed) - must be before /:programId
router.get('/all', getAllThreads);

// Public: read threads and thread detail
router.get('/:programId', getThreads);
router.get('/thread/:threadId', getThread);

// Auth required: create & delete
router.post('/create', authenticate, threadValidation, createThread);
router.post('/:programId', authenticate, threadValidation, createThread);
router.post('/thread/:threadId/reply', authenticate, replyValidation, createReply);
router.delete('/thread/:threadId', authenticate, deleteThread);
router.delete('/reply/:replyId', authenticate, deleteReply);

module.exports = router;
