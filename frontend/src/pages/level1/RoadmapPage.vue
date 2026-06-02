<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getProgramRoadmap } from '@/api/programs';
import EmptyState from '@/components/common/EmptyState.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import SummaryCard from '@/components/common/SummaryCard.vue';
import RoadmapTimeline from '@/components/level1/RoadmapTimeline.vue';
import CourseDetailModal from '@/components/level1/CourseDetailModal.vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

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

const courseChartData = computed(() => ({
  labels: ['Core', 'Elective'],
  datasets: [{
    data: [coreCourses.value, electiveCourses.value],
    backgroundColor: ['#140f50', '#e65100'],
    borderWidth: 0,
    hoverOffset: 4,
  }],
}));

const courseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } },
    tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} courses` } },
  },
  cutout: '65%',
};

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
    <!-- Loading State -->
    <LoadingState v-if="loading" />

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <span class="material-symbols-outlined error-icon">error</span>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="fetchRoadmap">Try Again</button>
    </div>

    <!-- Roadmap Content -->
    <template v-else-if="roadmap.length">
      <section class="roadmap-hero">
        <div class="roadmap-hero__copy">
          <p class="hero-eyebrow">Program Overview</p>
          <div class="hero-title">
            <span class="material-symbols-outlined page-icon">route</span>
            <div>
              <h1 class="page-title">My Study Roadmap</h1>
              <p v-if="program" class="page-subtitle">{{ program.code }} - {{ program.name }}</p>
            </div>
          </div>
          <p class="hero-note">Review your complete study structure, course mix, and progression across each year and semester.</p>
        </div>

        <div class="hero-summary">
          <SummaryCard icon="calendar_today" :value="program?.duration_years" label="Years" />
          <SummaryCard icon="menu_book" :value="totalCourses" label="Courses" />
          <SummaryCard icon="school" :value="totalUnits" label="Total Units" />
        </div>
      </section>

      <!-- Stats + Chart -->
      <div class="stats-section">
        <div class="stats-bar">
          <div class="stats-bar__header">
            <div>
              <p class="stats-eyebrow">Program Summary</p>
              <h2>Roadmap Summary</h2>
            </div>
            <p class="stats-note">A summary of your study load and course composition.</p>
          </div>
          <div class="stats-grid">
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
        </div>
        <div class="chart-card">
          <p class="chart-title">Course Breakdown</p>
          <div class="chart-wrap">
            <Doughnut :data="courseChartData" :options="courseChartOptions" />
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
    <EmptyState
      v-else
      icon="school"
      title="No Roadmap Data"
      message="Course roadmap data is not yet available for your program."
    />

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

.roadmap-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: var(--space-lg);
  padding: 24px;
  margin-bottom: var(--space-lg);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 247, 251, 0.96));
  box-shadow: 0 18px 32px rgba(20, 15, 80, 0.08);
}

.roadmap-hero__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-title {
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

.hero-note {
  margin: 14px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  max-width: 54ch;
}

.hero-summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* Stats Section */
.stats-section {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  align-items: stretch;
}

.stats-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  background: linear-gradient(180deg, #fbfbfd, #f4f6fb);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 22px;
  padding: 22px 24px;
  flex: 1;
}

.stats-bar__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-lg);
}

.stats-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-light);
  margin-bottom: 6px;
}

.stats-bar__header h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
}

.stats-note {
  max-width: 260px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.chart-card {
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 22px;
  padding: var(--space-md) var(--space-lg);
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-title {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-sm);
}

.chart-wrap {
  width: 150px;
  height: 140px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  min-height: 86px;
  border-radius: 18px;
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.07);
  box-shadow: 0 10px 20px rgba(20, 15, 80, 0.05);
}

.stat-item .material-symbols-outlined {
  font-size: 22px;
  color: var(--color-primary);
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(20, 15, 80, 0.06);
  flex-shrink: 0;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.05;
}

.stat-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-top: 4px;
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

/* Responsive */
@media (max-width: 768px) {
  .roadmap-page {
    padding: var(--space-md);
  }

  .roadmap-hero {
    grid-template-columns: 1fr;
    padding: 20px 18px;
  }

  .stats-section {
    flex-direction: column;
  }

  .stats-bar__header {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .stats-note {
    max-width: none;
  }

  .stats-bar {
    padding: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .chart-card {
    width: 100%;
  }

  .legend {
    flex-wrap: wrap;
  }
}
</style>
