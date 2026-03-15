<script setup>
import { ref, onMounted } from 'vue';
import { getProgramList } from '@/api/programs';
import {
  createCareerOutcome, updateCareerOutcome, deleteCareerOutcome,
  createCareerPath, updateCareerPath, deleteCareerPath,
} from '@/api/admin';

const loading = ref(true);
const programs = ref([]);
const selectedProgram = ref(null);
const outcomes = ref([]);
const paths = ref([]);
const activeTab = ref('outcomes');

// Outcome form
const showOutcomeForm = ref(false);
const editingOutcome = ref(null);
const savingOutcome = ref(false);
const emptyOutcome = {
  program_id: '', year: new Date().getFullYear(), employment_rate: '',
  median_salary: '', salary_range_low: '', salary_range_high: '',
  further_study_rate: '', satisfaction_rate: '', source: '',
};
const outcomeForm = ref({ ...emptyOutcome });

// Path form
const showPathForm = ref(false);
const editingPath = ref(null);
const savingPath = ref(false);
const emptyPath = {
  program_id: '', job_title: '', description: '',
  average_salary: '', demand_level: 'medium', industry_sector: '',
};
const pathForm = ref({ ...emptyPath });

async function fetchData() {
  try {
    loading.value = true;
    const programsRes = await getProgramList({ limit: 100 });
    programs.value = programsRes.data.data;
    if (programs.value.length && !selectedProgram.value) {
      selectedProgram.value = programs.value[0].id;
    }
    if (selectedProgram.value) {
      await fetchProgramCareers();
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function fetchProgramCareers() {
  try {
    const { getProgramCareers } = await import('@/api/programs');
    const res = await getProgramCareers(selectedProgram.value);
    outcomes.value = res.data.data.outcomes || [];
    paths.value = res.data.data.paths || [];
  } catch (err) {
    console.error(err);
  }
}

function handleProgramChange() {
  fetchProgramCareers();
}

// ─── Outcomes ───
function openCreateOutcome() {
  editingOutcome.value = null;
  outcomeForm.value = { ...emptyOutcome, program_id: selectedProgram.value };
  showOutcomeForm.value = true;
}

function openEditOutcome(o) {
  editingOutcome.value = o.id;
  outcomeForm.value = {
    program_id: o.program_id, year: o.year,
    employment_rate: o.employment_rate ?? '', median_salary: o.median_salary ?? '',
    salary_range_low: o.salary_range_low ?? '', salary_range_high: o.salary_range_high ?? '',
    further_study_rate: o.further_study_rate ?? '', satisfaction_rate: o.satisfaction_rate ?? '',
    source: o.source || '',
  };
  showOutcomeForm.value = true;
}

async function handleOutcomeSubmit() {
  savingOutcome.value = true;
  try {
    const data = { ...outcomeForm.value };
    Object.keys(data).forEach(k => { if (data[k] === '') data[k] = null; });

    if (editingOutcome.value) {
      await updateCareerOutcome(editingOutcome.value, data);
    } else {
      await createCareerOutcome(data);
    }
    showOutcomeForm.value = false;
    await fetchProgramCareers();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to save');
  } finally {
    savingOutcome.value = false;
  }
}

async function handleDeleteOutcome(o) {
  if (!confirm(`Delete outcome for year ${o.year}?`)) return;
  try {
    await deleteCareerOutcome(o.id);
    await fetchProgramCareers();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to delete');
  }
}

// ─── Paths ───
function openCreatePath() {
  editingPath.value = null;
  pathForm.value = { ...emptyPath, program_id: selectedProgram.value };
  showPathForm.value = true;
}

function openEditPath(p) {
  editingPath.value = p.id;
  pathForm.value = {
    program_id: p.program_id, job_title: p.job_title,
    description: p.description || '', average_salary: p.average_salary ?? '',
    demand_level: p.demand_level, industry_sector: p.industry_sector || '',
  };
  showPathForm.value = true;
}

async function handlePathSubmit() {
  savingPath.value = true;
  try {
    const data = { ...pathForm.value };
    if (data.average_salary === '') data.average_salary = null;

    if (editingPath.value) {
      await updateCareerPath(editingPath.value, data);
    } else {
      await createCareerPath(data);
    }
    showPathForm.value = false;
    await fetchProgramCareers();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to save');
  } finally {
    savingPath.value = false;
  }
}

async function handleDeletePath(p) {
  if (!confirm(`Delete "${p.job_title}"?`)) return;
  try {
    await deleteCareerPath(p.id);
    await fetchProgramCareers();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to delete');
  }
}

function formatCurrency(val) {
  if (!val) return '-';
  return '$' + Number(val).toLocaleString();
}

onMounted(fetchData);
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">work</span>
        <h1>Manage Career Data</h1>
      </div>
    </div>

    <!-- Program Selector -->
    <div class="program-selector">
      <label>Select Program:</label>
      <select v-model="selectedProgram" @change="handleProgramChange">
        <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.code }} - {{ p.name }}</option>
      </select>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab" :class="{ 'tab--active': activeTab === 'outcomes' }" @click="activeTab = 'outcomes'">
        <span class="material-symbols-outlined">trending_up</span>
        Graduate Outcomes ({{ outcomes.length }})
      </button>
      <button class="tab" :class="{ 'tab--active': activeTab === 'paths' }" @click="activeTab = 'paths'">
        <span class="material-symbols-outlined">fork_right</span>
        Career Paths ({{ paths.length }})
      </button>
    </div>

    <div v-if="loading" class="loading-state"><div class="loading-spinner"></div></div>

    <template v-else>
      <!-- Outcomes Tab -->
      <div v-if="activeTab === 'outcomes'">
        <div class="tab-header">
          <button class="btn btn-primary" @click="openCreateOutcome">
            <span class="material-symbols-outlined">add</span>
            Add Outcome
          </button>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Employment %</th>
                <th>Median Salary</th>
                <th>Salary Range</th>
                <th>Further Study %</th>
                <th>Satisfaction %</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in outcomes" :key="o.id">
                <td class="td-code">{{ o.year }}</td>
                <td>{{ o.employment_rate ? o.employment_rate + '%' : '-' }}</td>
                <td>{{ formatCurrency(o.median_salary) }}</td>
                <td>{{ formatCurrency(o.salary_range_low) }} - {{ formatCurrency(o.salary_range_high) }}</td>
                <td>{{ o.further_study_rate ? o.further_study_rate + '%' : '-' }}</td>
                <td>{{ o.satisfaction_rate ? o.satisfaction_rate + '%' : '-' }}</td>
                <td class="td-actions">
                  <button class="icon-btn" @click="openEditOutcome(o)"><span class="material-symbols-outlined">edit</span></button>
                  <button class="icon-btn icon-btn--danger" @click="handleDeleteOutcome(o)"><span class="material-symbols-outlined">delete</span></button>
                </td>
              </tr>
              <tr v-if="!outcomes.length"><td colspan="7" class="td-empty">No outcome data</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paths Tab -->
      <div v-if="activeTab === 'paths'">
        <div class="tab-header">
          <button class="btn btn-primary" @click="openCreatePath">
            <span class="material-symbols-outlined">add</span>
            Add Career Path
          </button>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Avg Salary</th>
                <th>Demand</th>
                <th>Sector</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in paths" :key="p.id">
                <td class="td-code">{{ p.job_title }}</td>
                <td>{{ formatCurrency(p.average_salary) }}</td>
                <td>
                  <span class="badge" :class="{
                    'badge--success': p.demand_level === 'high',
                    'badge--warning': p.demand_level === 'medium',
                    'badge--error': p.demand_level === 'low',
                  }">{{ p.demand_level }}</span>
                </td>
                <td>{{ p.industry_sector || '-' }}</td>
                <td class="td-actions">
                  <button class="icon-btn" @click="openEditPath(p)"><span class="material-symbols-outlined">edit</span></button>
                  <button class="icon-btn icon-btn--danger" @click="handleDeletePath(p)"><span class="material-symbols-outlined">delete</span></button>
                </td>
              </tr>
              <tr v-if="!paths.length"><td colspan="5" class="td-empty">No career paths</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Outcome Form Modal -->
    <Teleport to="body">
      <div v-if="showOutcomeForm" class="modal-overlay" @click.self="showOutcomeForm = false">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h2>{{ editingOutcome ? 'Edit Outcome' : 'Add Outcome' }}</h2>
            <button class="modal-close" @click="showOutcomeForm = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="modal-body" @submit.prevent="handleOutcomeSubmit">
            <div class="form-grid">
              <div class="form-group">
                <label>Year *</label>
                <input v-model.number="outcomeForm.year" type="number" required />
              </div>
              <div class="form-group">
                <label>Employment Rate (%)</label>
                <input v-model="outcomeForm.employment_rate" type="number" step="0.01" />
              </div>
              <div class="form-group">
                <label>Median Salary ($)</label>
                <input v-model="outcomeForm.median_salary" type="number" step="0.01" />
              </div>
              <div class="form-group">
                <label>Salary Range Low ($)</label>
                <input v-model="outcomeForm.salary_range_low" type="number" step="0.01" />
              </div>
              <div class="form-group">
                <label>Salary Range High ($)</label>
                <input v-model="outcomeForm.salary_range_high" type="number" step="0.01" />
              </div>
              <div class="form-group">
                <label>Further Study Rate (%)</label>
                <input v-model="outcomeForm.further_study_rate" type="number" step="0.01" />
              </div>
              <div class="form-group">
                <label>Satisfaction Rate (%)</label>
                <input v-model="outcomeForm.satisfaction_rate" type="number" step="0.01" />
              </div>
              <div class="form-group">
                <label>Data Source</label>
                <input v-model="outcomeForm.source" placeholder="e.g. Graduate Outcomes Survey" />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="showOutcomeForm = false">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="savingOutcome">
                {{ savingOutcome ? 'Saving...' : (editingOutcome ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Path Form Modal -->
    <Teleport to="body">
      <div v-if="showPathForm" class="modal-overlay" @click.self="showPathForm = false">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingPath ? 'Edit Career Path' : 'Add Career Path' }}</h2>
            <button class="modal-close" @click="showPathForm = false"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form class="modal-body" @submit.prevent="handlePathSubmit">
            <div class="form-grid">
              <div class="form-group form-group--full">
                <label>Job Title *</label>
                <input v-model="pathForm.job_title" required placeholder="e.g. Software Engineer" />
              </div>
              <div class="form-group">
                <label>Average Salary ($)</label>
                <input v-model="pathForm.average_salary" type="number" step="0.01" />
              </div>
              <div class="form-group">
                <label>Demand Level</label>
                <select v-model="pathForm.demand_level">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div class="form-group form-group--full">
                <label>Industry Sector</label>
                <input v-model="pathForm.industry_sector" placeholder="e.g. Technology" />
              </div>
              <div class="form-group form-group--full">
                <label>Description</label>
                <textarea v-model="pathForm.description" rows="3" placeholder="Job role description..."></textarea>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="showPathForm = false">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="savingPath">
                {{ savingPath ? 'Saving...' : (editingPath ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@import '@/assets/styles/admin-common.css';

.program-selector {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.program-selector label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.program-selector select {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-family: inherit;
  min-width: 300px;
}

.tabs {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  border-bottom: 2px solid var(--color-border);
}

.tab {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  border: none;
  background: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  font-family: inherit;
  color: var(--color-text-light);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all var(--transition-fast);
}

.tab .material-symbols-outlined {
  font-size: 18px;
}

.tab:hover {
  color: var(--color-text-primary);
}

.tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-md);
}
</style>
