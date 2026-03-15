<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { getProgramDetail, getProgramRoadmap } from '@/api/programs';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(true);
const program = ref(null);
const roadmapSummary = ref(null);

// Key dates (would come from API in production)
const keyDates = ref([
  { title: 'Semester 1 Begins', date: '2026-03-03', category: 'semester' },
  { title: 'Mid-Semester Break', date: '2026-04-14', category: 'semester' },
  { title: 'Semester 1 Examinations', date: '2026-06-16', category: 'examination' },
  { title: 'Semester 2 Begins', date: '2026-07-21', category: 'semester' },
]);

const upcomingDates = computed(() => {
  const now = new Date();
  return keyDates.value
    .filter(d => new Date(d.date) >= now)
    .slice(0, 4);
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getCategoryIcon(category) {
  const icons = {
    semester: 'event',
    examination: 'quiz',
    application: 'edit_note',
    orientation: 'groups',
    graduation: 'school',
  };
  return icons[category] || 'event';
}

const quickLinks = [
  { label: 'Study Roadmap', icon: 'route', to: '/student/roadmap', desc: 'View your course progression' },
  { label: 'Industry Connections', icon: 'business', to: '/student/industry', desc: 'Explore partner companies' },
  { label: 'Alumni Network', icon: 'group', to: '/student/alumni', desc: 'Connect with graduates' },
  { label: 'Student Resources', icon: 'menu_book', to: '/student/resources', desc: 'Academic support & tools' },
];

async function fetchDashboardData() {
  const programId = authStore.user?.program_id;
  if (!programId) {
    loading.value = false;
    return;
  }

  try {
    const [programRes, roadmapRes] = await Promise.all([
      getProgramDetail(programId),
      getProgramRoadmap(programId),
    ]);
    program.value = programRes.data.data;
    roadmapSummary.value = roadmapRes.data.data;
  } catch (err) {
    console.error('Dashboard fetch error:', err);
  } finally {
    loading.value = false;
  }
}

const totalCourses = computed(() => {
  if (!roadmapSummary.value) return 0;
  let count = 0;
  roadmapSummary.value.roadmap.forEach(y => y.semesters.forEach(s => count += s.courses.length));
  return count;
});

const totalUnits = computed(() => {
  if (!roadmapSummary.value) return 0;
  let units = 0;
  roadmapSummary.value.roadmap.forEach(y => y.semesters.forEach(s => s.courses.forEach(c => units += c.units || 0)));
  return units;
});

onMounted(fetchDashboardData);
</script>

<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <div class="welcome-text">
        <h1>Welcome back, {{ authStore.user?.first_name || 'Student' }}</h1>
        <p v-if="program">{{ program.code }} - {{ program.name }}</p>
        <p v-else class="welcome-no-program">No program assigned yet</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
    </div>

    <template v-else>
      <!-- Program Overview Cards -->
      <div v-if="program" class="overview-cards">
        <div class="overview-card">
          <span class="material-symbols-outlined card-icon">calendar_today</span>
          <div class="card-data">
            <span class="card-value">{{ program.duration_years }} years</span>
            <span class="card-label">Program Duration</span>
          </div>
        </div>
        <div class="overview-card">
          <span class="material-symbols-outlined card-icon">menu_book</span>
          <div class="card-data">
            <span class="card-value">{{ totalCourses }}</span>
            <span class="card-label">Total Courses</span>
          </div>
        </div>
        <div class="overview-card">
          <span class="material-symbols-outlined card-icon">school</span>
          <div class="card-data">
            <span class="card-value">{{ totalUnits }}</span>
            <span class="card-label">Total Units</span>
          </div>
        </div>
        <div class="overview-card overview-card--cta" @click="router.push('/student/roadmap')">
          <span class="material-symbols-outlined card-icon">route</span>
          <div class="card-data">
            <span class="card-value">View Roadmap</span>
            <span class="card-label">See your full plan</span>
          </div>
          <span class="material-symbols-outlined card-arrow">arrow_forward</span>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Quick Links -->
        <div class="dashboard-section">
          <h2 class="section-title">
            <span class="material-symbols-outlined">apps</span>
            Quick Access
          </h2>
          <div class="quick-links">
            <RouterLink
              v-for="link in quickLinks"
              :key="link.to"
              :to="link.to"
              class="quick-link"
            >
              <span class="material-symbols-outlined quick-link-icon">{{ link.icon }}</span>
              <div>
                <span class="quick-link-label">{{ link.label }}</span>
                <span class="quick-link-desc">{{ link.desc }}</span>
              </div>
              <span class="material-symbols-outlined quick-link-arrow">chevron_right</span>
            </RouterLink>
          </div>
        </div>

        <!-- Key Dates -->
        <div class="dashboard-section">
          <h2 class="section-title">
            <span class="material-symbols-outlined">event</span>
            Key Dates
          </h2>
          <div class="dates-list">
            <div v-for="date in upcomingDates" :key="date.title" class="date-item">
              <div class="date-icon-wrap">
                <span class="material-symbols-outlined">{{ getCategoryIcon(date.category) }}</span>
              </div>
              <div class="date-info">
                <span class="date-title">{{ date.title }}</span>
                <span class="date-value">{{ formatDate(date.date) }}</span>
              </div>
            </div>
            <p v-if="!upcomingDates.length" class="no-dates">No upcoming dates</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--space-lg);
}

/* Welcome */
.welcome-section {
  margin-bottom: var(--space-xl);
}

.welcome-text h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.welcome-text p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.welcome-no-program {
  color: var(--color-text-light);
}

/* Overview Cards */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.overview-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-md) var(--space-lg);
}

.overview-card--cta {
  cursor: pointer;
  background: var(--color-primary);
  border-color: var(--color-primary);
  transition: all var(--transition-fast);
}

.overview-card--cta:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.overview-card--cta .card-icon,
.overview-card--cta .card-value,
.overview-card--cta .card-label {
  color: var(--color-white);
}

.overview-card--cta .card-label {
  color: rgba(255, 255, 255, 0.7);
}

.card-icon {
  font-size: 28px;
  color: var(--color-primary);
}

.card-value {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.card-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.card-arrow {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.section-title .material-symbols-outlined {
  font-size: 22px;
  color: var(--color-primary);
}

/* Quick Links */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.quick-link {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.quick-link:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateX(4px);
}

.quick-link-icon {
  font-size: 24px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.quick-link-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.quick-link-desc {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.quick-link-arrow {
  margin-left: auto;
  font-size: 20px;
  color: var(--color-text-light);
}

/* Key Dates */
.dates-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.date-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
}

.date-icon-wrap {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 15, 80, 0.08);
  border-radius: var(--border-radius-sm);
  flex-shrink: 0;
}

.date-icon-wrap .material-symbols-outlined {
  font-size: 20px;
  color: var(--color-primary);
}

.date-title {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.date-value {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.no-dates {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  padding: var(--space-md);
}

/* Loading */
.loading-state {
  display: flex;
  justify-content: center;
  padding: var(--space-3xl);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
