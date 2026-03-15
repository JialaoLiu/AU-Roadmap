import api from './axios';

// Stats
export function getAdminStats() {
  return api.get('/admin/stats');
}

// Programs
export function createProgram(data) {
  return api.post('/admin/programs', data);
}

export function updateProgram(id, data) {
  return api.put(`/admin/programs/${id}`, data);
}

export function deleteProgram(id) {
  return api.delete(`/admin/programs/${id}`);
}

// Courses
export function listCourses(params = {}) {
  return api.get('/admin/courses', { params });
}

export function createCourse(data) {
  return api.post('/admin/courses', data);
}

export function updateCourse(id, data) {
  return api.put(`/admin/courses/${id}`, data);
}

export function deleteCourse(id) {
  return api.delete(`/admin/courses/${id}`);
}

// Program-Course Mapping
export function addCourseToProgram(programId, data) {
  return api.post(`/admin/programs/${programId}/courses`, data);
}

export function removeCourseFromProgram(programId, courseId) {
  return api.delete(`/admin/programs/${programId}/courses/${courseId}`);
}

// Prerequisites
export function addPrerequisite(data) {
  return api.post('/admin/prerequisites', data);
}

export function removePrerequisite(courseId, prereqId) {
  return api.delete(`/admin/prerequisites/${courseId}/${prereqId}`);
}

// Alumni
export function listAlumni(params = {}) {
  return api.get('/admin/alumni', { params });
}

export function createAlumni(data) {
  return api.post('/admin/alumni', data);
}

export function updateAlumni(id, data) {
  return api.put(`/admin/alumni/${id}`, data);
}

export function deleteAlumni(id) {
  return api.delete(`/admin/alumni/${id}`);
}

// Industry Partners
export function listIndustryPartners(params = {}) {
  return api.get('/admin/industry', { params });
}

export function createIndustryPartner(data) {
  return api.post('/admin/industry', data);
}

export function updateIndustryPartner(id, data) {
  return api.put(`/admin/industry/${id}`, data);
}

export function deleteIndustryPartner(id) {
  return api.delete(`/admin/industry/${id}`);
}

// Career Outcomes
export function createCareerOutcome(data) {
  return api.post('/admin/careers/outcomes', data);
}

export function updateCareerOutcome(id, data) {
  return api.put(`/admin/careers/outcomes/${id}`, data);
}

export function deleteCareerOutcome(id) {
  return api.delete(`/admin/careers/outcomes/${id}`);
}

// Career Paths
export function createCareerPath(data) {
  return api.post('/admin/careers/paths', data);
}

export function updateCareerPath(id, data) {
  return api.put(`/admin/careers/paths/${id}`, data);
}

export function deleteCareerPath(id) {
  return api.delete(`/admin/careers/paths/${id}`);
}

// Users
export function getUsers(params = {}) {
  return api.get('/admin/users', { params });
}

export function changeUserRole(id, role) {
  return api.put(`/admin/users/${id}/role`, { role });
}

export function deleteUser(id) {
  return api.delete(`/admin/users/${id}`);
}

// Image Upload
export function uploadImage(formData) {
  return api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
