import api from './axios';

export function getProgramList(params = {}) {
  return api.get('/programs', { params });
}

export function getProgramDetail(id) {
  return api.get(`/programs/${id}`);
}

export function getProgramCourses(id) {
  return api.get(`/programs/${id}/courses`);
}

export function getProgramRoadmap(id) {
  return api.get(`/programs/${id}/roadmap`);
}

export function getProgramAlumni(id) {
  return api.get(`/programs/${id}/alumni`);
}

export function getProgramIndustry(id) {
  return api.get(`/programs/${id}/industry`);
}

export function getProgramCareers(id) {
  return api.get(`/programs/${id}/careers`);
}

export function getProgramResources(id) {
  return api.get(`/programs/${id}/resources`);
}

export function comparePrograms(ids) {
  return api.get('/programs/compare', { params: { ids: ids.join(',') } });
}

export function getFeaturedAlumni() {
  return api.get('/programs/featured-alumni');
}
