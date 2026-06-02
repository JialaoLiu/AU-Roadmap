<script setup>
import { onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import LoadingState from '@/components/common/LoadingState.vue';
import SectionTitle from '@/components/common/SectionTitle.vue';
import SummaryCard from '@/components/common/SummaryCard.vue';
import SummaryGrid from '@/components/common/SummaryGrid.vue';
import { useDashboardData } from '@/composables/useDashboardData';
import {
  createDashboardSummary,
  createProgramChartData,
  createRoadmapSnapshot,
  dashboardKeyDates,
  dashboardQuickLinks,
  formatDashboardDate,
  getCategoryIcon,
  getCurrentSemesterLabel,
  getFocusSemester,
  getFocusSemesterLabel,
  getRoadmapStats,
  getRoadmapYears,
  getStudentInitials,
  getUpcomingDates,
  programChartOptions,
} from '@/utils/dashboardDisplay';
ChartJS.register(ArcElement, Tooltip, Legend);

const authStore = useAuthStore();
const router = useRouter();
const {
  loading,
  program,
  roadmapSummary,
  fetchDashboardData,
} = useDashboardData(authStore);

const quickLinks = dashboardQuickLinks;
const upcomingDates = computed(() => getUpcomingDates(dashboardKeyDates));
const nextMilestone = computed(() => upcomingDates.value[0] || null);
const roadmapYears = computed(() => getRoadmapYears(roadmapSummary.value));
const roadmapStats = computed(() => getRoadmapStats(roadmapSummary.value));
const totalCourses = computed(() => roadmapStats.value.totalCourses);
const totalUnits = computed(() => roadmapStats.value.totalUnits);
const coreCourses = computed(() => roadmapStats.value.coreCourses);
const electiveCourses = computed(() => totalCourses.value - coreCourses.value);
const dashboardSummary = computed(() => createDashboardSummary(program.value, roadmapStats.value));
const currentSemesterLabel = computed(() => getCurrentSemesterLabel());
const focusSemester = computed(() => getFocusSemester(roadmapYears.value, currentSemesterLabel.value));
const focusSemesterLabel = computed(() => getFocusSemesterLabel(focusSemester.value, currentSemesterLabel.value));
const roadmapSnapshot = computed(() => createRoadmapSnapshot({
  program: program.value,
  roadmapYears: roadmapYears.value,
  focusSemester: focusSemester.value,
  focusSemesterLabel: focusSemesterLabel.value,
  nextMilestone: nextMilestone.value,
  stats: roadmapStats.value,
}));
const programChartData = computed(() => createProgramChartData(coreCourses.value, electiveCourses.value));

function getInitials() {
  return getStudentInitials(authStore.user);
}

function formatDate(dateStr) {
  return formatDashboardDate(dateStr);
}

onMounted(fetchDashboardData);
</script>

<template>
  <div class="dashboard">
    <!-- Loading -->
    <LoadingState v-if="loading" />

    <template v-else>
      <section class="dashboard-hero">
        <div class="dashboard-hero__copy">
          <div class="hero-eyebrow">Program Overview</div>
          <div class="hero-profile">
            <div v-if="authStore.user?.avatar_url" class="hero-avatar">
              <img :src="authStore.user.avatar_url" :alt="authStore.user?.first_name || 'Student'" />
            </div>
            <div v-else class="hero-avatar hero-avatar--initials">{{ getInitials() }}</div>
            <div>
              <h1>Welcome back, {{ authStore.user?.first_name || 'Student' }}</h1>
              <p class="hero-caption">Overview of your program roadmap and key milestones.</p>
            </div>
          </div>
          <p v-if="program" class="hero-subtitle">{{ program.code }} - {{ program.name }}</p>
          <p v-else class="welcome-no-program">
            <span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;">info</span>
            No program assigned yet — please contact your administrator.
          </p>
        </div>

        <div v-if="program" class="hero-summary">
          <SummaryGrid>
            <SummaryCard
              v-for="item in dashboardSummary"
              :key="item.label"
              :icon="item.icon"
              :value="item.value"
              :label="item.label"
            />
            <SummaryCard
              as="button"
              variant="cta"
              icon="route"
              value="View Roadmap"
              label="See your full plan"
              show-arrow
              @click="router.push('/student/roadmap')"
            />
          </SummaryGrid>
        </div>
      </section>

      <section v-if="roadmapSnapshot" class="roadmap-snapshot">
        <div class="roadmap-snapshot__copy">
          <p class="roadmap-snapshot__eyebrow">Program Progress</p>
          <h2>Roadmap Overview</h2>
          <p class="roadmap-snapshot__text">
            Review your current study stage here, then open your full roadmap for the detailed course-by-course plan.
          </p>
          <div class="roadmap-snapshot__chips">
            <span class="snapshot-chip">
              <span class="material-symbols-outlined">calendar_today</span>
              {{ roadmapSnapshot.stageTitle }}
            </span>
            <span class="snapshot-chip">
              <span class="material-symbols-outlined">timeline</span>
              {{ roadmapSnapshot.roadmapSpan }}
            </span>
          </div>
        </div>

        <div class="roadmap-snapshot__panel">
          <div class="snapshot-panel__row">
            <span class="snapshot-panel__label">Current focus</span>
            <strong>{{ roadmapSnapshot.stageTitle }}</strong>
            <p>{{ roadmapSnapshot.stageDetail }}</p>
          </div>
          <div class="snapshot-panel__row">
            <span class="snapshot-panel__label">Next milestone</span>
            <strong>{{ roadmapSnapshot.nextMilestone }}</strong>
          </div>
          <div class="snapshot-panel__row">
            <span class="snapshot-panel__label">Roadmap mix</span>
            <strong>{{ roadmapSnapshot.progressNote }}</strong>
          </div>
          <button class="snapshot-panel__cta" @click="router.push('/student/roadmap')">
            <span class="material-symbols-outlined">route</span>
            Open full roadmap
          </button>
        </div>
      </section>

      <!-- Program Chart -->
      <div v-if="program && totalCourses > 0" class="program-chart-section">
          <SectionTitle icon="donut_large" title="Program Structure" />
        <div class="program-chart-card">
          <div class="program-chart-wrap">
            <Doughnut :data="programChartData" :options="programChartOptions" />
          </div>
          <div class="program-chart-stats">
            <div class="chart-stat">
              <span class="chart-stat-dot" style="background:#140f50"></span>
              <span class="chart-stat-label">Core Courses</span>
              <span class="chart-stat-value">{{ coreCourses }}</span>
            </div>
            <div class="chart-stat">
              <span class="chart-stat-dot" style="background:#e65100"></span>
              <span class="chart-stat-label">Elective Courses</span>
              <span class="chart-stat-value">{{ electiveCourses }}</span>
            </div>
            <div class="chart-stat chart-stat--total">
              <span class="chart-stat-dot" style="background:transparent"></span>
              <span class="chart-stat-label">Total Units</span>
              <span class="chart-stat-value">{{ totalUnits }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Quick Links -->
        <div class="dashboard-section">
          <SectionTitle icon="apps" title="Quick Access" />
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
          <SectionTitle icon="event" title="Key Dates" />
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

/* Hero */
.dashboard-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: var(--space-lg);
  padding: 24px;
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 247, 251, 0.96));
  box-shadow: 0 18px 32px rgba(20, 15, 80, 0.08);
  margin-bottom: var(--space-xl);
}

.dashboard-hero__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-profile {
  display: flex;
  align-items: center;
  gap: 14px;
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

.hero-avatar {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(20, 15, 80, 0.1);
  background: rgba(20, 15, 80, 0.08);
  flex-shrink: 0;
}

.hero-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 700;
}

.dashboard-hero__copy h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.08;
}

.hero-caption {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.hero-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 10px;
}

.welcome-no-program {
  color: var(--color-text-light);
}

.hero-summary {
  min-width: 0;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
}

.roadmap-snapshot {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 20px;
  margin-bottom: var(--space-xl);
  padding: 22px 24px;
  border-radius: 24px;
  border: 1px solid rgba(20, 15, 80, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(242, 245, 251, 0.98));
  box-shadow: 0 14px 28px rgba(20, 15, 80, 0.06);
}

.roadmap-snapshot__copy h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text-primary);
}

.roadmap-snapshot__eyebrow {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.roadmap-snapshot__text {
  margin: 10px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  max-width: 56ch;
}

.roadmap-snapshot__chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.snapshot-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(20, 15, 80, 0.06);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
}

.snapshot-chip .material-symbols-outlined {
  font-size: 16px;
}

.roadmap-snapshot__panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(20, 15, 80, 0.04);
  border: 1px solid rgba(20, 15, 80, 0.08);
}

.snapshot-panel__row {
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(20, 15, 80, 0.08);
}

.snapshot-panel__row:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.snapshot-panel__label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-light);
  margin-bottom: 6px;
}

.snapshot-panel__row strong {
  display: block;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.snapshot-panel__row p {
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.snapshot-panel__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  margin-top: 4px;
  border: none;
  border-radius: 16px;
  background: #140f50;
  color: var(--color-white);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.snapshot-panel__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(20, 15, 80, 0.18);
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
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  box-shadow: 0 10px 20px rgba(20, 15, 80, 0.05);
  transition: all var(--transition-fast);
}

.quick-link:hover {
  border-color: rgba(20, 15, 80, 0.16);
  box-shadow: 0 16px 28px rgba(20, 15, 80, 0.08);
  transform: translateY(-2px);
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
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  box-shadow: 0 10px 20px rgba(20, 15, 80, 0.05);
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

/* Program Chart */
.program-chart-section {
  margin-bottom: var(--space-xl);
}

.program-chart-card {
  display: flex;
  align-items: center;
  gap: var(--space-2xl);
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 22px;
  padding: var(--space-lg) var(--space-xl);
  box-shadow: 0 14px 26px rgba(20, 15, 80, 0.06);
}

.program-chart-wrap {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
}

.program-chart-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  flex: 1;
}

.chart-stat {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.chart-stat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chart-stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  flex: 1;
}

.chart-stat-value {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--color-text-primary);
}

.chart-stat--total {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-md);
  margin-top: var(--space-xs);
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    padding: var(--space-md);
  }

  .dashboard-hero {
    grid-template-columns: 1fr;
    padding: 20px 18px;
  }

  .hero-profile {
    align-items: flex-start;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .roadmap-snapshot {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .program-chart-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .program-chart-wrap {
    width: 150px;
    height: 150px;
  }
}
</style>
