import { getProgramBanner } from '@/utils/programMedia';

const previewFallbackHero = 'linear-gradient(135deg, rgba(20, 15, 80, 1) 0%, rgba(30, 24, 112, 1) 55%, rgba(49, 65, 145, 1) 100%)';

export function getProgramPreviewHeroStyle(program) {
  const banner = getProgramBanner(program);
  return {
    backgroundImage: banner
      ? `linear-gradient(110deg, rgba(20, 15, 80, 0.9) 0%, rgba(20, 15, 80, 0.78) 42%, rgba(20, 15, 80, 0.45) 100%), url(${banner})`
      : previewFallbackHero,
  };
}

export function formatCurrency(val) {
  if (!val) return '-';
  return `$${Number(val).toLocaleString()}`;
}

export function getCourseBreakdown(courses = []) {
  return {
    coreCourses: courses.filter(course => course.is_core),
    electiveCourses: courses.filter(course => !course.is_core),
    totalUnits: courses.reduce((sum, course) => sum + (course.units || 0), 0),
  };
}

export function getCourseYears(courses = []) {
  return [...new Set(courses.map(course => course.year_level))].sort();
}

export function groupCoursesByYear(courses = []) {
  return courses.reduce((groups, course) => {
    const year = course.year_level;
    if (!groups[year]) groups[year] = [];
    groups[year].push(course);
    return groups;
  }, {});
}

export function getLatestOutcome(careers = {}) {
  return careers.outcomes?.[0];
}

export function getAlumniInitials(alumni = {}) {
  return (alumni.first_name?.[0] || '') + (alumni.last_name?.[0] || '');
}
