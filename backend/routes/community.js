const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
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
} = require('../controllers/communityController');

// People (Alumni)
router.get('/people', optionalAuth, getAlumniProfiles);
router.get('/people/:id', getAlumniProfile);

// Connections
router.post('/connect', authenticate, sendConnectionRequest);
router.put('/connect/:id', authenticate, respondToConnection);
router.get('/connections', authenticate, getConnections);
router.get('/requests', authenticate, getPendingRequests);

// Messages
router.get('/conversations', authenticate, getConversations);
router.get('/messages/:userId', authenticate, getMessages);
router.post('/messages', authenticate, sendMessage);
router.put('/messages/read/:userId', authenticate, markAsRead);

module.exports = router;
