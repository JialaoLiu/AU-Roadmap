import {
  ADELAIDE_TIME_ZONE,
  formatDateKey,
  getDisplayDate,
  getWeekStart,
} from '@/utils/date';

export const TIME_START = 8;
export const TIME_END = 21;
export const GRID_HOURS = TIME_END - TIME_START;

export const timetableCourses = [
  {
    id: 1,
    code: 'INFO6003',
    name: 'Security Architecture and Engineering',
    room: 'TBA',
    type: 'Lecture',
    color: '#140f50',
    day: 0,
    startH: 18,
    endH: 20,
  },
  {
    id: 2,
    code: 'COMP6025',
    name: 'Stakeholders Engagement',
    room: 'TBA',
    type: 'Lecture',
    color: '#2b6cb0',
    day: 1,
    startH: 11,
    endH: 14,
  },
  {
    id: 3,
    code: 'COMP5800',
    name: 'Industry Research Project',
    room: 'TBA',
    type: 'Workshop',
    color: '#0f766e',
    day: 2,
    startH: 12,
    endH: 16,
  },
];

export const timeSlots = Array.from({ length: TIME_END - TIME_START }, (_, i) => {
  const h = TIME_START + i;
  return `${h.toString().padStart(2, '0')}:00`;
});

export function getTimetableToday() {
  const today = getDisplayDate();
  return {
    today,
    todayStr: formatDateKey(today),
  };
}

export function getWeekDays(weekStart, todayStr) {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = formatDateKey(d);
    return {
      label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i],
      date: d,
      dateStr,
      dayNum: d.getDate(),
      isToday: dateStr === todayStr,
    };
  });
}

export function getTimetableWeekStart(weekOffset, today) {
  return getWeekStart(weekOffset, today);
}

export function getWeekLabel(weekStart) {
  const start = weekStart;
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  const fmt = (d) =>
    d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      timeZone: ADELAIDE_TIME_ZONE,
    });
  return `${fmt(start)} – ${fmt(end)}, ${start.getFullYear()}`;
}

export function groupCoursesByDay(courses = timetableCourses) {
  return courses.reduce((groups, course) => {
    if (!groups[course.day]) groups[course.day] = [];
    groups[course.day].push(course);
    return groups;
  }, {});
}

export function getTotalContactHours(courses = timetableCourses) {
  return courses.reduce((sum, course) => sum + (course.endH - course.startH), 0);
}

export function getNextSession({
  courses = timetableCourses,
  coursesByDay,
  weekDays,
}) {
  const focusDayIndex = weekDays.findIndex((day) => day.isToday);
  if (focusDayIndex !== -1) {
    const todayCourses = [...(coursesByDay[focusDayIndex] || [])].sort((a, b) => a.startH - b.startH);
    if (todayCourses.length) return todayCourses[0];
  }

  const nextCourse = [...courses].sort((a, b) => (a.day - b.day) || (a.startH - b.startH))[0];
  return nextCourse || null;
}

export function getCourseStyle(course) {
  const top = ((course.startH - TIME_START) / GRID_HOURS) * 100;
  const height = ((course.endH - course.startH) / GRID_HOURS) * 100;
  return {
    top: `${top}%`,
    height: `calc(${height}% - 4px)`,
    background: course.color,
  };
}
