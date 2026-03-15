<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { getProgramList, getProgramCareers } from '@/api/programs';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend, Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const loading = ref(true);
const programs = ref([]);
const selectedProgram = ref(null);
const careers = ref({ outcomes: [], paths: [] });

async function fetchPrograms() {
  try {
    const res = await getProgramList({ limit: 100 });
    programs.value = res.data.data;
    if (programs.value.length) {
      selectedProgram.value = programs.value[0].id;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function fetchCareers() {
  if (!selectedProgram.value) return;
  try {
    const res = await getProgramCareers(selectedProgram.value);
    careers.value = res.data.data;
  } catch (err) {
    console.error(err);
  }
}

watch(selectedProgram, fetchCareers);

const salaryChartData = computed(() => {
  const outcomes = [...(careers.value.outcomes || [])].sort((a, b) => a.year - b.year);
  return {
    labels: outcomes.map(o => String(o.year)),
    datasets: [{
      label: 'Median Salary ($)',
      data: outcomes.map(o => o.median_salary || 0),
      backgroundColor: 'rgba(20, 15, 80, 0.7)',
      borderRadius: 6,
    }],
  };
});

const employmentChartData = computed(() => {
  const outcomes = [...(careers.value.outcomes || [])].sort((a, b) => a.year - b.year);
  return {
    labels: outcomes.map(o => String(o.year)),
    datasets: [{
      label: 'Employment Rate (%)',
      data: outcomes.map(o => o.employment_rate || 0),
      backgroundColor: 'rgba(46, 125, 50, 0.7)',
      borderRadius: 6,
    }],
  };
});

const demandChartData = computed(() => {
  const paths = careers.value.paths || [];
  const counts = { high: 0, medium: 0, low: 0 };
  paths.forEach(p => { if (counts[p.demand_level] !== undefined) counts[p.demand_level]++; });
  return {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [counts.high, counts.medium, counts.low],
      backgroundColor: ['rgba(46,125,50,0.7)', 'rgba(240,171,0,0.7)', 'rgba(211,47,47,0.7)'],
    }],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
};

function formatCurrency(val) {
  if (!val) return '-';
  return '$' + Number(val).toLocaleString();
}

const selectedProgramName = computed(() => {
  const p = programs.value.find(p => p.id === selectedProgram.value);
  return p ? `${p.code} - ${p.name}` : '';
});

onMounted(fetchPrograms);
</script>

<template>
  <div class="careers-page">
    <!-- Hero -->
    <div class="careers-hero">
      <div class="hero-inner">
        <h1>Career Outcomes</h1>
        <p>Discover graduate employment rates, salary data, and career paths for Adelaide University programs.</p>
      </div>
    </div>

    <div class="careers-content">
      <!-- Program Selector -->
      <div class="program-selector">
        <label>Select Program</label>
        <select v-model="selectedProgram">
          <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.code }} - {{ p.name }}</option>
        </select>
      </div>

      <div v-if="loading" class="loading-state"><div class="loading-spinner"></div></div>

      <template v-else-if="careers.outcomes?.length || careers.paths?.length">
        <!-- Charts Grid -->
        <div v-if="careers.outcomes?.length" class="charts-grid">
          <div class="chart-card">
            <h3>Median Salary by Year</h3>
            <div class="chart-wrap"><Bar :data="salaryChartData" :options="chartOptions" /></div>
          </div>
          <div class="chart-card">
            <h3>Employment Rate by Year</h3>
            <div class="chart-wrap"><Bar :data="employmentChartData" :options="chartOptions" /></div>
          </div>
        </div>

        <!-- Career Paths + Demand -->
        <div v-if="careers.paths?.length" class="paths-section">
          <div class="paths-main">
            <h2>Career Paths for {{ selectedProgramName }}</h2>
            <div class="paths-list">
              <div v-for="p in careers.paths" :key="p.id" class="path-item">
                <div class="path-info">
                  <h3>{{ p.job_title }}</h3>
                  <p v-if="p.description">{{ p.description }}</p>
                </div>
                <div class="path-stats">
                  <div v-if="p.average_salary" class="path-salary">{{ formatCurrency(p.average_salary) }}<small>/yr</small></div>
                  <span class="demand-badge" :class="'demand--' + p.demand_level">{{ p.demand_level }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="demand-chart-card">
            <h3>Demand Distribution</h3>
            <div class="chart-wrap chart-wrap--sm"><Doughnut :data="demandChartData" :options="doughnutOptions" /></div>
          </div>
        </div>

        <!-- Detailed Outcomes Table -->
        <div v-if="careers.outcomes?.length" class="outcomes-section">
          <h2>Detailed Graduate Outcomes</h2>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Employment</th>
                  <th>Median Salary</th>
                  <th>Salary Range</th>
                  <th>Further Study</th>
                  <th>Satisfaction</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in careers.outcomes" :key="o.id">
                  <td><strong>{{ o.year }}</strong></td>
                  <td>{{ o.employment_rate ? o.employment_rate + '%' : '-' }}</td>
                  <td>{{ formatCurrency(o.median_salary) }}</td>
                  <td>{{ formatCurrency(o.salary_range_low) }} - {{ formatCurrency(o.salary_range_high) }}</td>
                  <td>{{ o.further_study_rate ? o.further_study_rate + '%' : '-' }}</td>
                  <td>{{ o.satisfaction_rate ? o.satisfaction_rate + '%' : '-' }}</td>
                  <td class="source-cell">{{ o.source || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <div v-else class="empty-state">
        <span class="material-symbols-outlined">analytics</span>
        <h2>No Career Data Available</h2>
        <p>Career outcome data is not yet available for this program.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.careers-page { min-height: 100vh; }

.careers-hero { background: var(--color-primary); color: var(--color-white); padding: var(--space-3xl) var(--space-lg); }
.hero-inner { max-width: 720px; margin: 0 auto; text-align: center; }
.hero-inner h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-sm); }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.8; }

.careers-content { max-width: 1200px; margin: 0 auto; padding: var(--space-xl) var(--space-lg); }

.program-selector { margin-bottom: var(--space-xl); }
.program-selector label { display: block; font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; }
.program-selector select { padding: var(--space-sm) var(--space-md); border: 1px solid var(--color-border); border-radius: var(--border-radius-md); font-size: var(--font-size-sm); font-family: inherit; min-width: 360px; }

/* Charts */
.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); margin-bottom: var(--space-2xl); }

.chart-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--border-radius-lg); padding: var(--space-lg); }
.chart-card h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-md); }
.chart-wrap { height: 260px; }
.chart-wrap--sm { height: 200px; }

/* Paths */
.paths-section { display: grid; grid-template-columns: 1fr 320px; gap: var(--space-xl); margin-bottom: var(--space-2xl); }
.paths-section h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-lg); }

.paths-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.path-item { display: flex; justify-content: space-between; align-items: center; gap: var(--space-md); background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--border-radius-md); padding: var(--space-md) var(--space-lg); }
.path-info h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.path-info p { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 2px; }

.path-stats { text-align: right; flex-shrink: 0; }
.path-salary { font-size: var(--font-size-md); font-weight: 700; color: var(--color-primary); }
.path-salary small { font-size: var(--font-size-xs); font-weight: 400; color: var(--color-text-light); }

.demand-badge { display: inline-block; padding: 2px 8px; border-radius: var(--border-radius-full); font-size: 11px; font-weight: 600; text-transform: capitalize; margin-top: 4px; }
.demand--high { background: rgba(46,125,50,0.1); color: var(--color-success); }
.demand--medium { background: rgba(240,171,0,0.15); color: #b38600; }
.demand--low { background: rgba(211,47,47,0.1); color: var(--color-error); }

.demand-chart-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--border-radius-lg); padding: var(--space-lg); height: fit-content; }
.demand-chart-card h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-md); }

/* Table */
.outcomes-section h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-lg); }
.table-wrap { overflow-x: auto; background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--border-radius-lg); }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: var(--space-sm) var(--space-md); font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text-secondary); background: var(--color-bg-secondary); border-bottom: 1px solid var(--color-border); text-transform: uppercase; }
td { padding: var(--space-sm) var(--space-md); font-size: var(--font-size-sm); border-bottom: 1px solid var(--color-border); }
tbody tr:last-child td { border-bottom: none; }
.source-cell { font-size: var(--font-size-xs); color: var(--color-text-light); }

/* Empty / Loading */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: var(--space-3xl); text-align: center; }
.empty-state .material-symbols-outlined { font-size: 48px; color: var(--color-text-light); margin-bottom: var(--space-md); }
.empty-state h2 { color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.empty-state p { color: var(--color-text-secondary); }

.loading-state { display: flex; justify-content: center; padding: var(--space-3xl); }
.loading-spinner { width: 40px; height: 40px; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .charts-grid { grid-template-columns: 1fr; }
  .paths-section { grid-template-columns: 1fr; }
}
</style>
