<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getProgramRoadmap } from '@/api/programs';
import RoadmapTimeline from '@/components/level1/RoadmapTimeline.vue';
import CourseDetailModal from '@/components/level1/CourseDetailModal.vue';

const authStore = useAuthStore();
const loading = ref(true);
const error = ref(null);
const program = ref(null);
const roadmap = ref([]);
const selectedCourse = ref(null);

// Flatten all courses for lookup
const allCourses = computed(() => {
  const courses = [];
  roadmap.value.forEach(year => {
    year.semesters.forEach(sem => {
      sem.courses.forEach(course => courses.push(course));
    });
  });
  return courses;
});

// Summary stats
const totalCourses = computed(() => allCourses.value.length);
const coreCourses = computed(() => allCourses.value.filter(c => c.is_core).length);
const electiveCourses = computed(() => allCourses.value.filter(c => !c.is_core).length);
const totalUnits = computed(() => allCourses.value.reduce((sum, c) => sum + (c.units || 0), 0));

async function fetchRoadmap() {
  const programId = authStore.user?.program_id;
  if (!programId) {
    error.value = 'No program assigned to your account. Please contact administration.';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    const response = await getProgramRoadmap(programId);
    program.value = response.data.data.program;
    roadmap.value = response.data.data.roadmap;
  } catch (err) {
    error.value = 'Failed to load roadmap data. Please try again later.';
    console.error('Roadmap fetch error:', err);
  } finally {
    loading.value = false;
  }
}

function handleCourseSelect(course) {
  selectedCourse.value = course;
}

function handleModalNavigate(courseId) {
  const course = allCourses.value.find(c => c.id === courseId);
  if (course) {
    selectedCourse.value = course;
  }
}

onMounted(fetchRoadmap);
</script>

<template>
  <div class="roadmap-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">route</span>
        <div>
          <h1 class="page-title">My Study Roadmap</h1>
          <p v-if="program" class="page-subtitle">{{ program.code }} - {{ program.name }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your roadmap...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <span class="material-symbols-outlined error-icon">error</span>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="fetchRoadmap">Try Again</button>
    </div>

    <!-- Roadmap Content -->
    <template v-else-if="roadmap.length">
      <!-- Stats Summary -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="material-symbols-outlined">calendar_today</span>
          <div>
            <span class="stat-value">{{ program?.duration_years }}</span>
            <span class="stat-label">Years</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="material-symbols-outlined">menu_book</span>
          <div>
            <span class="stat-value">{{ totalCourses }}</span>
            <span class="stat-label">Courses</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="material-symbols-outlined">check_circle</span>
          <div>
            <span class="stat-value">{{ coreCourses }}</span>
            <span class="stat-label">Core</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="material-symbols-outlined">tune</span>
          <div>
            <span class="stat-value">{{ electiveCourses }}</span>
            <span class="stat-label">Electives</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="material-symbols-outlined">school</span>
          <div>
            <span class="stat-value">{{ totalUnits }}</span>
            <span class="stat-label">Total Units</span>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-item">
          <span class="legend-swatch legend-swatch--core"></span>
          Core Course
        </div>
        <div class="legend-item">
          <span class="legend-swatch legend-swatch--elective"></span>
          Elective Course
        </div>
        <div class="legend-item">
          <span class="material-symbols-outlined legend-icon">link</span>
          Has Prerequisites
        </div>
      </div>

      <!-- Timeline -->
      <RoadmapTimeline
        :program="program"
        :roadmap="roadmap"
        @course-select="handleCourseSelect"
      />
    </template>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <span class="material-symbols-outlined empty-icon">school</span>
      <h2>No Roadmap Data</h2>
      <p>Course roadmap data is not yet available for your program.</p>
    </div>

    <!-- Course Detail Modal -->
    <CourseDetailModal
      :course="selectedCourse"
      :all-courses="allCourses"
      @close="selectedCourse = null"
      @navigate="handleModalNavigate"
    />
  </div>
</template>

<style scoped>
.roadmap-page {
  padding: var(--space-lg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xl);
}

.page-header__left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.page-icon {
  font-size: 32px;
  color: var(--color-primary);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  gap: var(--space-lg);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-md) var(--space-xl);
  margin-bottom: var(--space-lg);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.stat-item .material-symbols-outlined {
  font-size: 24px;
  color: var(--color-primary);
}

.stat-value {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

/* Legend */
.legend {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-swatch--core {
  background: var(--color-primary);
}

.legend-swatch--elective {
  background: var(--color-accent);
}

.legend-icon {
  font-size: 16px;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl);
  color: var(--color-text-light);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl);
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: var(--color-error);
  margin-bottom: var(--space-md);
}

.error-state p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl);
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
}

.empty-state h2 {
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.empty-state p {
  color: var(--color-text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .stats-bar {
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .legend {
    flex-wrap: wrap;
  }
}
</style>
