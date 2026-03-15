import api from './axios';

export function searchAll(q, type = 'all', limit = 10) {
  return api.get('/search', { params: { q, type, limit } });
}
