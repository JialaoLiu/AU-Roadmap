<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAdminStats } from '@/api/admin';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const router = useRouter();
const loading = ref(true);
const stats = ref(null);

const statCards = [
  { key: 'programs', label: 'Programs', icon: 'school', route: '/admin/programs', color: '#140f50' },
  { key: 'courses', label: 'Courses', icon: 'class', route: '/admin/courses', color: '#1976d2' },
  { key: 'users', label: 'Users', icon: 'manage_accounts', route: '/admin/users', color: '#2e7d32' },
  { key: 'alumni', label: 'Alumni', icon: 'group', route: '/admin/alumni', color: '#e65100' },
  { key: 'partners', label: 'Industry Partners', icon: 'business', route: '/admin/industry', color: '#6a1b9a' },
  { key: 'resources', label: 'Resources', icon: 'menu_book', route: '/admin/programs', color: '#00838f' },
];

async function fetchStats() {
  try {
    const res = await getAdminStats();
    stats.value = res.data.data;
  } catch (err) {
    console.error('Failed to load stats:', err);
  } finally {
    loading.value = false;
  }
}

const statsChartData = computed(() => ({
  labels: ['Programs', 'Courses', 'Users', 'Alumni', 'Partners', 'Resources'],
  datasets: [{
    label: 'Total records',
    data: stats.value ? [
      stats.value.programs ?? 0, stats.value.courses ?? 0, stats.value.users ?? 0,
      stats.value.alumni ?? 0, stats.value.partners ?? 0, stats.value.resources ?? 0,
    ] : [],
    backgroundColor: ['#140f5022', '#1976d222', '#2e7d3222', '#e6510022', '#6a1b9a22', '#00838f22'],
    borderColor: ['#140f50', '#1976d2', '#2e7d32', '#e65100', '#6a1b9a', '#00838f'],
    borderWidth: 2,
    borderRadius: 6,
  }],
}));

const statsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: ctx => ` ${ctx.raw}` } },
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 }, grid: { color: '#f0f0f0' } },
    x: { grid: { display: false } },
  },
};

onMounted(fetchStats);
</script>

<template>
  <div class="admin-dashboard">
    <div class="page-header">
      <span class="material-symbols-outlined page-icon">admin_panel_settings</span>
      <div>
        <h1>Admin Dashboard</h1>
        <p class="page-subtitle">Manage your platform content and users</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
    </div>

    <template v-else>
      <div class="stats-grid">
        <div
          v-for="card in statCards"
          :key="card.key"
          class="stat-card"
          @click="router.push(card.route)"
        >
          <div class="stat-card__icon" :style="{ background: card.color + '12', color: card.color }">
            <span class="material-symbols-outlined">{{ card.icon }}</span>
          </div>
          <div class="stat-card__data">
            <span class="stat-card__value">{{ stats?.[card.key] ?? 0 }}</span>
            <span class="stat-card__label">{{ card.label }}</span>
          </div>
          <span class="material-symbols-outlined stat-card__arrow">chevron_right</span>
        </div>
      </div>

      <!-- Platform Overview Chart -->
      <div class="chart-section">
        <h2 class="section-title">
          <span class="material-symbols-outlined">bar_chart</span>
          Platform Overview
        </h2>
        <div class="chart-card">
          <div class="chart-wrap">
            <Bar :data="statsChartData" :options="statsChartOptions" />
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2 class="section-title">
          <span class="material-symbols-outlined">bolt</span>
          Quick Actions
        </h2>
        <div class="actions-grid">
          <button class="action-btn" @click="router.push('/admin/programs')">
            <span class="material-symbols-outlined">add_circle</span>
            Add Program
          </button>
          <button class="action-btn" @click="router.push('/admin/courses')">
            <span class="material-symbols-outlined">add_circle</span>
            Add Course
          </button>
          <button class="action-btn" @click="router.push('/admin/alumni')">
            <span class="material-symbols-outlined">person_add</span>
            Add Alumni
          </button>
          <button class="action-btn" @click="router.push('/admin/industry')">
            <span class="material-symbols-outlined">domain_add</span>
            Add Partner
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.admin-dashboard {
  padding: var(--space-lg);
}

.page-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.page-icon {
  font-size: 32px;
  color: var(--color-primary);
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.stat-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  flex-shrink: 0;
}

.stat-card__icon .material-symbols-outlined {
  font-size: 24px;
}

.stat-card__value {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-card__label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-top: 2px;
}

.stat-card__arrow {
  margin-left: auto;
  color: var(--color-text-light);
  font-size: 20px;
}

/* Chart */
.chart-section {
  margin-bottom: var(--space-2xl);
}

.chart-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
}

.chart-wrap {
  height: 220px;
}

/* Quick Actions */
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

.actions-grid {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(20, 15, 80, 0.04);
}

.action-btn .material-symbols-outlined {
  font-size: 20px;
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

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
