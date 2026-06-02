<script setup>
import { useTimetableWeek } from '@/composables/useTimetableWeek';

const {
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
  courseStyle,
  dayCoursesForDay,
} = useTimetableWeek();
</script>

<template>
  <div class="timetable-page">
    <section class="timetable-hero">
      <div class="timetable-hero__copy">
        <p class="hero-eyebrow">Program Schedule</p>
        <div class="header-left">
          <span class="material-symbols-outlined page-icon">calendar_month</span>
          <div>
            <h1>Timetable</h1>
            <p class="subtitle">Review your weekly class schedule.</p>
          </div>
        </div>
        <p class="hero-note">
          Use this view to stay aligned with your program milestones and plan around your teaching week.
        </p>
      </div>

      <div class="timetable-summary">
        <div class="summary-card">
          <span class="material-symbols-outlined summary-icon">event_available</span>
          <div>
            <span class="summary-value">{{ totalSessions }}</span>
            <span class="summary-label">Weekly Sessions</span>
          </div>
        </div>
        <div class="summary-card">
          <span class="material-symbols-outlined summary-icon">schedule</span>
          <div>
            <span class="summary-value">{{ totalContactHours }} hrs</span>
            <span class="summary-label">Contact Hours</span>
          </div>
        </div>
        <div class="summary-card">
          <span class="material-symbols-outlined summary-icon">today</span>
          <div>
            <span class="summary-value">{{ currentFocusDay?.label || 'Week view' }}</span>
            <span class="summary-label">Current Focus</span>
          </div>
        </div>
        <div class="summary-card summary-card--cta">
          <span class="material-symbols-outlined summary-icon">route</span>
          <div>
            <span class="summary-value">{{ nextSession ? nextSession.code : 'No class' }}</span>
            <span class="summary-label">
              {{ nextSession ? `Next: ${String(nextSession.startH).padStart(2, '0')}:00 ${nextSession.type}` : 'No session scheduled' }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <div class="toolbar-card">
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

      <div class="legend">
        <div v-for="c in [
          { code: 'INFO6003', name: 'Security Architecture and Engineering', color: '#140f50' },
          { code: 'COMP6025', name: 'Stakeholders Engagement', color: '#2b6cb0' },
          { code: 'COMP5800', name: 'Industry Research Project', color: '#0f766e' },
        ]" :key="c.code" class="legend-item">
          <span class="legend-dot" :style="{ background: c.color }"></span>
          <span class="legend-code">{{ c.code }}</span>
          <span class="legend-name">{{ c.name }}</span>
        </div>
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
  padding: var(--space-lg);
}

.timetable-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: var(--space-lg);
  padding: 24px;
  margin-bottom: var(--space-lg);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 247, 251, 0.96));
  box-shadow: 0 18px 32px rgba(20, 15, 80, 0.08);
}

.timetable-hero__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.hero-eyebrow {
  display: inline-flex;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(20, 15, 80, 0.06);
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
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

.hero-note {
  margin: 14px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  max-width: 54ch;
}

.timetable-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 10px 20px rgba(20, 15, 80, 0.05);
}

.summary-card--cta {
  background: linear-gradient(135deg, #140f50, #221b68);
  border-color: rgba(20, 15, 80, 0.18);
}

.summary-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--color-primary);
  background: rgba(20, 15, 80, 0.06);
  flex-shrink: 0;
}

.summary-card--cta .summary-icon {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.12);
}

.summary-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.15;
}

.summary-label {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.summary-card--cta .summary-value,
.summary-card--cta .summary-label {
  color: var(--color-white);
}

.summary-card--cta .summary-label {
  color: rgba(255, 255, 255, 0.74);
}

.toolbar-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: 16px 18px;
  margin-bottom: var(--space-lg);
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(20, 15, 80, 0.06);
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
  width: 36px;
  height: 36px;
  border: 1px solid rgba(20, 15, 80, 0.1);
  border-radius: 12px;
  background: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: rgba(20, 15, 80, 0.05);
  border-color: rgba(20, 15, 80, 0.18);
}

.today-btn {
  padding: 8px 14px;
  border: 1px solid var(--color-primary);
  border-radius: 12px;
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

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(20, 15, 80, 0.05);
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

.grid-wrapper {
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  overflow: hidden;
  background: var(--color-white);
  box-shadow: 0 14px 28px rgba(20, 15, 80, 0.06);
}

.grid-header {
  display: grid;
  grid-template-columns: 60px repeat(5, 1fr);
  border-bottom: 1px solid rgba(20, 15, 80, 0.08);
  background: linear-gradient(180deg, rgba(247, 248, 252, 0.96), rgba(241, 244, 250, 0.96));
}

.time-gutter {
  border-right: 1px solid rgba(20, 15, 80, 0.08);
}

.day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  border-right: 1px solid rgba(20, 15, 80, 0.08);
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
  box-shadow: 0 10px 18px rgba(20, 15, 80, 0.18);
}

.grid-body {
  display: grid;
  grid-template-columns: 60px repeat(5, 1fr);
}

.time-column {
  border-right: 1px solid rgba(20, 15, 80, 0.08);
  background: rgba(248, 249, 253, 0.92);
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
  border-bottom: 1px solid rgba(20, 15, 80, 0.08);
}

.day-column {
  position: relative;
  border-right: 1px solid rgba(20, 15, 80, 0.08);
}

.day-column:last-child {
  border-right: none;
}

.day-column.today {
  background: linear-gradient(180deg, rgba(20, 15, 80, 0.05), rgba(20, 15, 80, 0.02));
}

.hour-row {
  height: 60px;
  border-bottom: 1px solid rgba(20, 15, 80, 0.08);
}

.course-block {
  position: absolute;
  left: 5px;
  right: 5px;
  border-radius: 14px;
  padding: 8px 9px;
  cursor: pointer;
  overflow: hidden;
  color: white;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.2);
}

.course-block:hover {
  opacity: 0.96;
  transform: translateY(-1px);
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
  border-radius: 24px;
  width: 380px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
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

@media (max-width: 768px) {
  .timetable-page {
    padding: var(--space-md);
  }

  .timetable-hero {
    grid-template-columns: 1fr;
    padding: 20px 18px;
  }

  .timetable-summary {
    grid-template-columns: 1fr;
  }

  .toolbar-card {
    padding: 14px;
  }

  .week-nav {
    width: 100%;
    justify-content: space-between;
  }

  .week-label {
    min-width: 0;
    flex: 1;
  }
}
</style>
