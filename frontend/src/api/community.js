import api from './axios';

// People
export const getAlumniProfiles = (params) => api.get('/community/people', { params });
export const getAlumniProfile = (id) => api.get(`/community/people/${id}`);

// Connections
export const sendConnectionRequest = (receiverId) => api.post('/community/connect', { receiver_id: receiverId });
export const respondToConnection = (id, action) => api.put(`/community/connect/${id}`, { action });
export const getConnections = () => api.get('/community/connections');
export const getPendingRequests = () => api.get('/community/requests');

// Messages
export const getConversations = () => api.get('/community/conversations');
export const getMessages = (userId) => api.get(`/community/messages/${userId}`);
export const sendMessage = (receiverId, content) => api.post('/community/messages', { receiver_id: receiverId, content });
export const markAsRead = (userId) => api.put(`/community/messages/read/${userId}`);

// Discussions (feed)
export const getAllThreads = (params) => api.get('/discussions/all', { params });
export const getThread = (threadId) => api.get(`/discussions/thread/${threadId}`);
export const createThread = (data) => api.post('/discussions/create', data);
export const createReply = (threadId, content) => api.post(`/discussions/thread/${threadId}/reply`, { content });
export const deleteThread = (threadId) => api.delete(`/discussions/thread/${threadId}`);
export const deleteReply = (replyId) => api.delete(`/discussions/reply/${replyId}`);
