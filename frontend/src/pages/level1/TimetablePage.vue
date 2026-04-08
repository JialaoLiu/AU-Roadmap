<script setup>
import { ref, computed } from 'vue';

// Week navigation
const weekOffset = ref(0);

const today = new Date();
const todayStr = today.toISOString().slice(0, 10);

function getWeekStart(offset = 0) {
  const d = new Date(today);
  const day = d.getDay(); // 0=Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

const weekStart = computed(() => getWeekStart(weekOffset.value));

const weekDays = computed(() => {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart.value);
    d.setDate(d.getDate() + i);
    return {
      label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i],
      date: d,
      dateStr: d.toISOString().slice(0, 10),
      dayNum: d.getDate(),
      isToday: d.toISOString().slice(0, 10) === todayStr,
    };
  });
});

const weekLabel = computed(() => {
  const start = weekStart.value;
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  const fmt = (d) =>
    d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  return `${fmt(start)} – ${fmt(end)}, ${start.getFullYear()}`;
});

// Time slots: 8:00 to 21:00, each row = 1 hour
const TIME_START = 8;
const TIME_END = 21;
const timeSlots = Array.from({ length: TIME_END - TIME_START }, (_, i) => {
  const h = TIME_START + i;
  return `${h.toString().padStart(2, '0')}:00`;
});

// Mock courses (day: 0=Mon, startH, endH)
const courses = [
  {
    id: 1,
    code: 'INFO6003',
    name: 'Security Architecture and Engineering',
    room: 'TBA',
    type: 'Lecture',
    color: '#4f46e5',
    day: 0, startH: 18, endH: 20,
  },
  {
    id: 2,
    code: 'COMP6025',
    name: 'Stakeholders Engagement',
    room: 'TBA',
    type: 'Lecture',
    color: '#0891b2',
    day: 1, startH: 11, endH: 14,
  },
  {
    id: 3,
    code: 'COMP5800',
    name: 'Industry Research Project',
    room: 'TBA',
    type: 'Workshop',
    color: '#d97706',
    day: 2, startH: 12, endH: 16,
  },
];

// Map a course to grid position (top%, height%)
const GRID_HOURS = TIME_END - TIME_START;

function courseStyle(course) {
  const top = ((course.startH - TIME_START) / GRID_HOURS) * 100;
  const height = ((course.endH - course.startH) / GRID_HOURS) * 100;
  return {
    top: `${top}%`,
    height: `calc(${height}% - 4px)`,
    background: course.color,
  };
}

// Get courses for a given day index
function dayCoursesForDay(dayIndex) {
  return courses.filter((c) => c.day === dayIndex);
}

const selectedCourse = ref(null);
</script>

<template>
  <div class="timetable-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <span class="material-symbols-outlined page-icon">calendar_month</span>
        <div>
          <h1>Timetable</h1>
          <p class="subtitle">Your weekly class schedule</p>
        </div>
      </div>
      <div class="week-nav">
        <button class="nav-btn" @click="weekOffset--">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <span class="week-label">{{ weekLabel }}</span>
        <button class="nav-btn" @click="weekOffset++">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
        <button class="today-btn" @click="weekOffset = 0">Today</button>
      </div>
    </div>

    <!-- Legend -->
    <div class="legend">
      <div v-for="c in [
        { code: 'INFO6003', name: 'Security Architecture and Engineering', color: '#4f46e5' },
        { code: 'COMP6025', name: 'Stakeholders Engagement', color: '#0891b2' },
        { code: 'COMP5800', name: 'Industry Research Project', color: '#d97706' },
      ]" :key="c.code" class="legend-item">
        <span class="legend-dot" :style="{ background: c.color }"></span>
        <span class="legend-code">{{ c.code }}</span>
        <span class="legend-name">{{ c.name }}</span>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid-wrapper">
      <!-- Day headers -->
      <div class="grid-header">
        <div class="time-gutter"></div>
        <div
          v-for="day in weekDays"
          :key="day.dateStr"
          class="day-header"
          :class="{ today: day.isToday }"
        >
          <span class="day-label">{{ day.label }}</span>
          <span class="day-num" :class="{ today: day.isToday }">{{ day.dayNum }}</span>
        </div>
      </div>

      <!-- Time grid -->
      <div class="grid-body">
        <!-- Time labels -->
        <div class="time-column">
          <div v-for="slot in timeSlots" :key="slot" class="time-label">{{ slot }}</div>
        </div>

        <!-- Day columns -->
        <div
          v-for="(day, dayIndex) in weekDays"
          :key="day.dateStr"
          class="day-column"
          :class="{ today: day.isToday }"
        >
          <!-- Hour grid lines -->
          <div v-for="slot in timeSlots" :key="slot" class="hour-row"></div>

          <!-- Course blocks -->
          <div
            v-for="course in dayCoursesForDay(dayIndex)"
            :key="course.id"
            class="course-block"
            :style="courseStyle(course)"
            @click="selectedCourse = course"
          >
            <div class="course-type">{{ course.type }}</div>
            <div class="course-code">{{ course.code }}</div>
            <div class="course-name">{{ course.name }}</div>
            <div class="course-room">
              <span class="material-symbols-outlined">location_on</span>
              {{ course.room }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course detail modal -->
    <Teleport to="body">
      <div v-if="selectedCourse" class="modal-overlay" @click.self="selectedCourse = null">
        <div class="modal-card">
          <div class="modal-color-bar" :style="{ background: selectedCourse.color }"></div>
          <button class="modal-close" @click="selectedCourse = null">
            <span class="material-symbols-outlined">close</span>
          </button>
          <div class="modal-body">
            <div class="modal-type-badge" :style="{ background: selectedCourse.color }">
              {{ selectedCourse.type }}
            </div>
            <h2>{{ selectedCourse.code }}</h2>
            <p class="modal-course-name">{{ selectedCourse.name }}</p>
            <div class="modal-details">
              <div class="detail-row">
                <span class="material-symbols-outlined">schedule</span>
                <span>
                  {{ weekDays[selectedCourse.day]?.label }}
                  {{ String(selectedCourse.startH).padStart(2, '0') }}:00 –
                  {{ String(selectedCourse.endH).padStart(2, '0') }}:00
                </span>
              </div>
              <div class="detail-row">
                <span class="material-symbols-outlined">location_on</span>
                <span>{{ selectedCourse.room }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.timetable-page {
  max-width: 1100px;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
  gap: var(--space-md);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.page-icon {
  font-size: 2rem;
  color: var(--color-primary);
}

h1 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.week-nav {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.week-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 200px;
  text-align: center;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: var(--color-bg-secondary);
}

.today-btn {
  padding: 6px 14px;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.today-btn:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

/* Legend */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-md);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-code {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-primary);
}

.legend-name {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

/* Grid wrapper */
.grid-wrapper {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background: var(--color-white);
}

/* Day headers */
.grid-header {
  display: grid;
  grid-template-columns: 60px repeat(5, 1fr);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.time-gutter {
  border-right: 1px solid var(--color-border);
}

.day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-sm) 0;
  border-right: 1px solid var(--color-border);
  gap: 4px;
}

.day-header:last-child {
  border-right: none;
}

.day-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.day-num {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.day-num.today {
  background: var(--color-primary);
  color: white;
}

/* Grid body */
.grid-body {
  display: grid;
  grid-template-columns: 60px repeat(5, 1fr);
}

.time-column {
  border-right: 1px solid var(--color-border);
}

.time-label {
  height: 60px;
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
  padding-right: 8px;
  justify-content: flex-end;
  font-size: 11px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
}

/* Day column */
.day-column {
  position: relative;
  border-right: 1px solid var(--color-border);
}

.day-column:last-child {
  border-right: none;
}

.day-column.today {
  background: rgba(20, 15, 80, 0.02);
}

.hour-row {
  height: 60px;
  border-bottom: 1px solid var(--color-border);
}

/* Course block */
.course-block {
  position: absolute;
  left: 3px;
  right: 3px;
  border-radius: 6px;
  padding: 5px 7px;
  cursor: pointer;
  overflow: hidden;
  color: white;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.course-block:hover {
  opacity: 0.9;
  transform: scale(1.01);
  z-index: 2;
}

.course-type {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.85;
}

.course-code {
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
}

.course-name {
  font-size: 11px;
  opacity: 0.9;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-room {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  opacity: 0.8;
  margin-top: 2px;
}

.course-room .material-symbols-outlined {
  font-size: 12px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  width: 360px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.modal-color-bar {
  height: 6px;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
}

.modal-body {
  padding: var(--space-lg);
}

.modal-type-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-sm);
}

.modal-body h2 {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 4px;
}

.modal-course-name {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--space-md);
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.detail-row .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-text-secondary);
}
</style>
