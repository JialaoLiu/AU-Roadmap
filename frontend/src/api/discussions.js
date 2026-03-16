import api from './axios';

export function getThreads(programId) {
  return api.get(`/discussions/${programId}`);
}

export function getThread(threadId) {
  return api.get(`/discussions/thread/${threadId}`);
}

export function createThread(programId, data) {
  return api.post(`/discussions/${programId}`, data);
}

export function createReply(threadId, data) {
  return api.post(`/discussions/thread/${threadId}/reply`, data);
}

export function deleteThread(threadId) {
  return api.delete(`/discussions/thread/${threadId}`);
}

export function deleteReply(replyId) {
  return api.delete(`/discussions/reply/${replyId}`);
}
