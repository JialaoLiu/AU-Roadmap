<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import EmptyState from '@/components/common/EmptyState.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import SummaryCard from '@/components/common/SummaryCard.vue';
import SummaryGrid from '@/components/common/SummaryGrid.vue';
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

const latestOutcome = computed(() => {
  const outcomes = [...(careers.value.outcomes || [])].sort((a, b) => b.year - a.year);
  return outcomes[0] || null;
});

const averageSalary = computed(() => {
  const salaries = (careers.value.paths || []).map(path => Number(path.average_salary)).filter(Boolean);
  if (!salaries.length) return null;
  return Math.round(salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length);
});

onMounted(fetchPrograms);
</script>

<template>
  <div class="careers-page">
    <div class="careers-hero">
      <div class="hero-inner">
        <span class="hero-eyebrow">Graduate Outcomes</span>
        <h1>Career Outcomes</h1>
        <p>Review employment trends, salary data, and common professional pathways connected with Adelaide University programs.</p>
      </div>
    </div>

    <SummaryGrid class="summary-grid" variant="auto">
      <SummaryCard variant="plain" value="Selected Program" :label="selectedProgramName || 'Loading program'" />
      <SummaryCard
        v-if="latestOutcome && latestOutcome.employment_rate"
        variant="plain"
        value="Latest Employment Rate"
        :label="`${latestOutcome.employment_rate}%`"
      />
      <SummaryCard
        v-if="latestOutcome && latestOutcome.median_salary"
        variant="plain"
        value="Latest Median Salary"
        :label="formatCurrency(latestOutcome.median_salary)"
      />
      <SummaryCard
        v-else-if="averageSalary"
        variant="plain"
        value="Average Path Salary"
        :label="formatCurrency(averageSalary)"
      />
    </SummaryGrid>

    <div class="careers-content">
      <div class="selector-card">
        <div class="selector-copy">
          <span class="section-eyebrow">Program Filter</span>
          <h2>Compare Career Outcomes by Program</h2>
          <p>Select a program to review graduate outcomes and professional pathways.</p>
        </div>
        <div class="program-selector">
          <label>Select Program</label>
          <select v-model="selectedProgram">
            <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.code }} - {{ p.name }}</option>
          </select>
        </div>
      </div>

      <LoadingState v-if="loading" />

      <template v-else-if="careers.outcomes?.length || careers.paths?.length">
        <div v-if="careers.outcomes?.length" class="charts-grid">
          <div class="chart-card">
            <span class="section-eyebrow">Salary Trend</span>
            <h3>Median Salary by Year</h3>
            <div class="chart-wrap"><Bar :data="salaryChartData" :options="chartOptions" /></div>
          </div>
          <div class="chart-card">
            <span class="section-eyebrow">Employment Trend</span>
            <h3>Employment Rate by Year</h3>
            <div class="chart-wrap"><Bar :data="employmentChartData" :options="chartOptions" /></div>
          </div>
        </div>

        <div v-if="careers.paths?.length" class="paths-section">
          <div class="paths-main">
            <span class="section-eyebrow">Career Directions</span>
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
            <span class="section-eyebrow">Demand Profile</span>
            <h3>Demand Distribution</h3>
            <div class="chart-wrap chart-wrap--sm"><Doughnut :data="demandChartData" :options="doughnutOptions" /></div>
          </div>
        </div>

        <div v-if="careers.outcomes?.length" class="outcomes-section">
          <span class="section-eyebrow">Outcome Details</span>
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

      <EmptyState
        v-else
        icon="analytics"
        title="No Career Data Available"
        message="Career outcome data is not yet available for this program."
      />
    </div>
  </div>
</template>

<style scoped>
.careers-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(20, 15, 80, 0.06), transparent 34%),
    linear-gradient(180deg, #f7f8fc 0%, #f3f5fb 100%);
}

.careers-hero {
  background: linear-gradient(135deg, #140f50 0%, #1e1870 55%, #314191 100%);
  color: var(--color-white);
  padding: 5.5rem var(--space-lg) 5rem;
}

.hero-inner {
  max-width: 50rem;
  margin: 0 auto;
  text-align: center;
}

.hero-eyebrow {
  display: inline-flex;
  margin-bottom: var(--space-sm);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.74);
}

.hero-inner h1 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.hero-inner p {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.84);
}

.summary-grid {
  max-width: 1100px;
  margin: 1rem auto 0;
}

.careers-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.25rem 1rem var(--space-3xl);
}

.section-eyebrow {
  display: inline-flex;
  margin-bottom: 0.6rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b7394;
}

.selector-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(20, 15, 80, 0.08);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.selector-copy h2 {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.55rem;
}

.selector-copy p {
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.program-selector label {
  display: block;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.program-selector select {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid rgba(20, 15, 80, 0.12);
  border-radius: 16px;
  font-size: var(--font-size-sm);
  font-family: inherit;
  min-width: 360px;
  background: #fff;
  color: var(--color-text-primary);
}

.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); margin-bottom: var(--space-2xl); }

.chart-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(20, 15, 80, 0.08);
  padding: var(--space-lg);
}
.chart-card h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-md); }
.chart-wrap { height: 260px; }
.chart-wrap--sm { height: 200px; }

.paths-section { display: grid; grid-template-columns: 1fr 320px; gap: var(--space-xl); margin-bottom: var(--space-2xl); }
.paths-section h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-lg); }

.paths-main,
.demand-chart-card,
.outcomes-section {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(20, 15, 80, 0.08);
  padding: 1.5rem;
}

.paths-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.path-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  padding: var(--space-md) var(--space-lg);
}
.path-info h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.path-info p { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 2px; }

.path-stats { text-align: right; flex-shrink: 0; }
.path-salary { font-size: var(--font-size-md); font-weight: 700; color: var(--color-primary); }
.path-salary small { font-size: var(--font-size-xs); font-weight: 400; color: var(--color-text-light); }

.demand-badge { display: inline-block; padding: 2px 8px; border-radius: var(--border-radius-full); font-size: 11px; font-weight: 600; text-transform: capitalize; margin-top: 4px; }
.demand--high { background: rgba(46,125,50,0.1); color: var(--color-success); }
.demand--medium { background: rgba(240,171,0,0.15); color: #b38600; }
.demand--low { background: rgba(211,47,47,0.1); color: var(--color-error); }

.demand-chart-card { height: fit-content; }
.demand-chart-card h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-md); }

.outcomes-section h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-lg); }
.table-wrap {
  overflow-x: auto;
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
}
table { width: 100%; border-collapse: collapse; }
th {
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  background: rgba(20, 15, 80, 0.05);
  border-bottom: 1px solid rgba(20, 15, 80, 0.08);
  text-transform: uppercase;
}
td {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  border-bottom: 1px solid rgba(20, 15, 80, 0.08);
}
tbody tr:last-child td { border-bottom: none; }
.source-cell { font-size: var(--font-size-xs); color: var(--color-text-light); }

@media (max-width: 768px) {
  .summary-grid {
    margin-inline: 1rem;
  }

  .selector-card {
    flex-direction: column;
    align-items: stretch;
  }

  .program-selector select {
    min-width: 0;
    width: 100%;
  }

  .charts-grid { grid-template-columns: 1fr; }
  .paths-section { grid-template-columns: 1fr; }
}
</style>
