import api from './axios';

export function register(data) {
  return api.post('/auth/register', data);
}

export function login(credentials) {
  return api.post('/auth/login', credentials);
}

export function getMe() {
  return api.get('/auth/me');
}

export function updateProfile(data) {
  return api.put('/auth/profile', data);
}

export function changePassword(data) {
  return api.post('/users/change-password', data);
}

export function uploadAvatar(formData) {
  return api.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
