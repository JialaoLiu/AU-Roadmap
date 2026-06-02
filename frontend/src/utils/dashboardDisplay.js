export const dashboardKeyDates = [
  { title: 'Semester 1 Begins', date: '2026-03-03', category: 'semester' },
  { title: 'Mid-Semester Break', date: '2026-04-14', category: 'semester' },
  { title: 'Semester 1 Examinations', date: '2026-06-16', category: 'examination' },
  { title: 'Semester 2 Begins', date: '2026-07-21', category: 'semester' },
];

export const dashboardQuickLinks = [
  { label: 'Study Roadmap', icon: 'route', to: '/student/roadmap', desc: 'View your course progression' },
  { label: 'Industry Connections', icon: 'business', to: '/student/industry', desc: 'Explore partner companies' },
  { label: 'Alumni Network', icon: 'group', to: '/student/alumni', desc: 'Connect with graduates' },
  { label: 'Student Resources', icon: 'menu_book', to: '/student/resources', desc: 'Academic support & tools' },
];

export const programChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
    tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } },
  },
  cutout: '60%',
};

export function getUpcomingDates(keyDates = dashboardKeyDates, now = new Date()) {
  return keyDates
    .filter(date => new Date(date.date) >= now)
    .slice(0, 4);
}

export function formatDashboardDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getCategoryIcon(category) {
  const icons = {
    semester: 'event',
    examination: 'quiz',
    application: 'edit_note',
    orientation: 'groups',
    graduation: 'school',
  };
  return icons[category] || 'event';
}

export function getStudentInitials(user = {}) {
  const firstInitial = user.first_name?.[0] || '';
  const lastInitial = user.last_name?.[0] || '';
  return (firstInitial + lastInitial).toUpperCase();
}

export function getRoadmapYears(roadmapSummary) {
  return roadmapSummary?.roadmap || [];
}

export function getRoadmapStats(roadmapSummary) {
  const years = getRoadmapYears(roadmapSummary);
  return years.reduce((stats, year) => {
    year.semesters.forEach((semester) => {
      semester.courses.forEach((course) => {
        stats.totalCourses += 1;
        stats.totalUnits += course.units || 0;
        if (course.is_core) {
          stats.coreCourses += 1;
        }
      });
    });
    return stats;
  }, {
    totalCourses: 0,
    totalUnits: 0,
    coreCourses: 0,
  });
}

export function getCurrentSemesterLabel(now = new Date()) {
  return now.getMonth() >= 6 ? 'Semester 2' : 'Semester 1';
}

export function getRoadmapSpan(roadmapYears) {
  if (!roadmapYears.length) return 'Roadmap unavailable';
  return `Year 1 - Year ${roadmapYears.length}`;
}

export function getFocusSemester(roadmapYears, currentSemesterLabel) {
  if (!roadmapYears.length) return null;

  const currentSemesterNumber = currentSemesterLabel === 'Semester 2' ? 2 : 1;
  const firstYear = roadmapYears[0];

  return (
    firstYear?.semesters?.find((semester) => semester.semester_number === currentSemesterNumber) ||
    firstYear?.semesters?.[0] ||
    null
  );
}

export function getFocusSemesterLabel(focusSemester, currentSemesterLabel) {
  if (!focusSemester) return currentSemesterLabel;
  return `Year 1 · Semester ${focusSemester.semester_number}`;
}

export function createDashboardSummary(program, stats) {
  return [
    {
      label: 'Program Duration',
      value: `${program?.duration_years ?? 0} years`,
      icon: 'calendar_today',
    },
    {
      label: 'Total Courses',
      value: stats.totalCourses,
      icon: 'menu_book',
    },
    {
      label: 'Total Units',
      value: stats.totalUnits,
      icon: 'school',
    },
  ];
}

export function createRoadmapSnapshot({
  program,
  roadmapYears,
  focusSemester,
  focusSemesterLabel,
  nextMilestone,
  stats,
}) {
  if (!program || !roadmapYears.length) return null;

  const electiveCourses = stats.totalCourses - stats.coreCourses;

  return {
    stageTitle: focusSemesterLabel,
    stageDetail: focusSemester
      ? `${focusSemester.courses.length} courses mapped in this study stage`
      : 'Roadmap structure is ready to explore',
    nextMilestone: nextMilestone
      ? `${nextMilestone.title} · ${formatDashboardDate(nextMilestone.date)}`
      : 'No upcoming milestone yet',
    roadmapSpan: getRoadmapSpan(roadmapYears),
    progressNote: `${stats.coreCourses} core and ${electiveCourses} elective courses across your program`,
  };
}

export function createProgramChartData(coreCourses, electiveCourses) {
  return {
    labels: ['Core', 'Elective'],
    datasets: [{
      data: [coreCourses, electiveCourses],
      backgroundColor: ['#140f50', '#e65100'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };
}
