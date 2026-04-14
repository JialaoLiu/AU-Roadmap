<script setup>
import { ref, computed } from 'vue';
import CourseCard from './CourseCard.vue';

const props = defineProps({
  program: { type: Object, required: true },
  roadmap: { type: Array, required: true },
});

// Build a flat id → course map for prerequisite name lookup
const courseMap = computed(() => {
  const map = {};
  props.roadmap.forEach(year => {
    year.semesters.forEach(sem => {
      sem.courses.forEach(c => { map[c.id] = c; });
    });
  });
  return map;
});

const emit = defineEmits(['course-select']);

const hoveredCourse = ref(null);
const selectedCourse = ref(null);

// Collect all course IDs that are prerequisites or dependents of hovered course
const relatedCourseIds = computed(() => {
  if (!hoveredCourse.value) return new Set();
  const ids = new Set();
  // Add prerequisites
  if (hoveredCourse.value.prerequisites) {
    hoveredCourse.value.prerequisites.forEach(p => ids.add(p.course_id));
  }
  // Add courses that depend on this one
  if (hoveredCourse.value.prerequisite_for) {
    hoveredCourse.value.prerequisite_for.forEach(id => ids.add(id));
  }
  return ids;
});

function isCourseHighlighted(course) {
  if (!hoveredCourse.value) return false;
  if (course.id === hoveredCourse.value.id) return true;
  return relatedCourseIds.value.has(course.id);
}

function handleCourseHover(course) {
  hoveredCourse.value = course;
}

function handleCourseLeave() {
  hoveredCourse.value = null;
}

function handleCourseSelect(course) {
  selectedCourse.value = selectedCourse.value?.id === course.id ? null : course;
  emit('course-select', selectedCourse.value);
}

function getSemesterLabel(semester) {
  return `Semester ${semester}`;
}

function getTotalUnits(courses) {
  return courses.reduce((sum, c) => sum + (c.units || 0), 0);
}
</script>

<template>
  <div class="roadmap-timeline">
    <!-- Year blocks -->
    <div v-for="yearData in roadmap" :key="yearData.year" class="year-block">
      <div class="year-header">
        <div class="year-marker">
          <span class="year-number">Year {{ yearData.year }}</span>
        </div>
        <div class="year-line"></div>
      </div>

      <div class="semesters-row">
        <div
          v-for="semData in yearData.semesters"
          :key="semData.semester"
          class="semester-block"
        >
          <div class="semester-header">
            <h3 class="semester-title">{{ getSemesterLabel(semData.semester) }}</h3>
            <span class="semester-units">{{ getTotalUnits(semData.courses) }} units</span>
          </div>

          <div class="courses-grid">
            <CourseCard
              v-for="course in semData.courses"
              :key="course.id"
              :course="course"
              :highlighted="isCourseHighlighted(course)"
              @select="handleCourseSelect"
              @hover="handleCourseHover"
              @leave="handleCourseLeave"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Course Detail Panel -->
    <Transition name="slide">
      <div v-if="selectedCourse" class="course-detail-panel">
        <div class="detail-header">
          <div>
            <span class="detail-code">{{ selectedCourse.code }}</span>
            <h3 class="detail-name">{{ selectedCourse.name }}</h3>
          </div>
          <button class="detail-close" @click="selectedCourse = null">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="detail-body">
          <div class="detail-info-row">
            <div class="detail-info-item">
              <span class="material-symbols-outlined">school</span>
              <span>{{ selectedCourse.units }} units</span>
            </div>
            <div class="detail-info-item">
              <span class="material-symbols-outlined">category</span>
              <span>{{ selectedCourse.is_core ? 'Core' : 'Elective' }}</span>
            </div>
            <div v-if="selectedCourse.course_group" class="detail-info-item">
              <span class="material-symbols-outlined">folder</span>
              <span>{{ selectedCourse.course_group }}</span>
            </div>
          </div>

          <div v-if="selectedCourse.prerequisites && selectedCourse.prerequisites.length" class="detail-section">
            <h4>
              <span class="material-symbols-outlined">arrow_back</span>
              Prerequisites
            </h4>
            <ul class="prereq-list">
              <li v-for="prereq in selectedCourse.prerequisites" :key="prereq.course_id">
                <span class="prereq-dot prereq-dot--required"></span>
                <span v-if="courseMap[prereq.course_id]">
                  {{ courseMap[prereq.course_id].code }} — {{ courseMap[prereq.course_id].name }}
                </span>
                <span v-else>Course {{ prereq.course_id }}</span>
                <span v-if="prereq.is_corequisite" class="coreq-badge">Corequisite</span>
              </li>
            </ul>
          </div>

          <div v-if="selectedCourse.prerequisite_for && selectedCourse.prerequisite_for.length" class="detail-section">
            <h4>
              <span class="material-symbols-outlined">arrow_forward</span>
              Required For
            </h4>
            <ul class="prereq-list">
              <li v-for="depId in selectedCourse.prerequisite_for" :key="depId">
                <span class="prereq-dot prereq-dot--dependent"></span>
                <span v-if="courseMap[depId]">
                  {{ courseMap[depId].code }} — {{ courseMap[depId].name }}
                </span>
                <span v-else>Course {{ depId }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.roadmap-timeline {
  position: relative;
}

/* Year Block */
.year-block {
  margin-bottom: var(--space-2xl);
}

.year-block:last-child {
  margin-bottom: 0;
}

.year-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.year-marker {
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-xs) var(--space-lg);
  border-radius: var(--border-radius-full);
  flex-shrink: 0;
}

.year-number {
  font-size: var(--font-size-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.year-line {
  flex: 1;
  height: 2px;
  background: var(--color-border);
}

/* Semesters */
.semesters-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
}

.semester-block {
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
}

.semester-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.semester-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
}

.semester-units {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  background: var(--color-white);
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
}

.courses-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* Course Detail Panel */
.course-detail-panel {
  position: fixed;
  right: 0;
  top: var(--header-height);
  width: 380px;
  height: calc(100vh - var(--header-height));
  background: var(--color-white);
  border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  z-index: 100;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.detail-code {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.5px;
}

.detail-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-top: 2px;
}

.detail-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 4px;
  border-radius: var(--border-radius-sm);
}

.detail-close:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
}

.detail-body {
  padding: var(--space-lg);
}

.detail-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.detail-info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.detail-info-item .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-primary);
}

.detail-section {
  margin-bottom: var(--space-lg);
}

.detail-section h4 {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.detail-section h4 .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-primary);
}

.prereq-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.prereq-list li {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
}

.prereq-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.prereq-dot--required {
  background: var(--color-secondary);
}

.prereq-dot--dependent {
  background: var(--color-success);
}

.coreq-badge {
  font-size: 10px;
  background: rgba(25, 118, 210, 0.1);
  color: var(--color-info);
  padding: 1px 6px;
  border-radius: var(--border-radius-full);
  margin-left: auto;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 768px) {
  .semesters-row {
    grid-template-columns: 1fr;
  }

  .course-detail-panel {
    width: 100%;
  }
}
</style>
