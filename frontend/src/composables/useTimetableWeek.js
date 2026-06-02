import { computed, ref } from 'vue';
import {
  getCourseStyle,
  getNextSession,
  getTimetableToday,
  getTimetableWeekStart,
  getTotalContactHours,
  getWeekDays,
  getWeekLabel,
  groupCoursesByDay,
  timetableCourses,
  timeSlots,
} from '@/utils/timetableDisplay';

export function useTimetableWeek() {
  const weekOffset = ref(0);
  const selectedCourse = ref(null);
  const courses = timetableCourses;
  const { today, todayStr } = getTimetableToday();

  const weekStart = computed(() => getTimetableWeekStart(weekOffset.value, today));
  const weekDays = computed(() => getWeekDays(weekStart.value, todayStr));
  const weekLabel = computed(() => getWeekLabel(weekStart.value));
  const totalSessions = computed(() => courses.length);
  const totalContactHours = computed(() => getTotalContactHours(courses));
  const currentFocusDay = computed(() => weekDays.value.find((day) => day.isToday) || weekDays.value[0]);
  const coursesByDay = computed(() => groupCoursesByDay(courses));
  const nextSession = computed(() => getNextSession({
    courses,
    coursesByDay: coursesByDay.value,
    weekDays: weekDays.value,
  }));

  function dayCoursesForDay(dayIndex) {
    return coursesByDay.value[dayIndex] || [];
  }

  return {
    weekOffset,
    selectedCourse,
    courses,
    timeSlots,
    weekDays,
    weekLabel,
    totalSessions,
    totalContactHours,
    currentFocusDay,
    nextSession,
    courseStyle: getCourseStyle,
    dayCoursesForDay,
  };
}
