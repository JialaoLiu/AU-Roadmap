<script setup>
import { ref, onMounted } from 'vue';
import LoadingState from '@/components/common/LoadingState.vue';
import { getProgramList } from '@/api/programs';
import { createProgram, updateProgram, deleteProgram } from '@/api/admin';

const loading = ref(true);
const programs = ref([]);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);

const emptyForm = {
  code: '', name: '', level: 'undergraduate', duration_years: 3,
  faculty: '', description: '', entry_requirements: '',
  atar_requirement: '', fees_domestic: '', fees_international: '',
  banner_url: '',
};
const form = ref({ ...emptyForm });

async function fetchPrograms() {
  try {
    loading.value = true;
    const res = await getProgramList({ limit: 100 });
    programs.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editing.value = null;
  form.value = { ...emptyForm };
  showForm.value = true;
}

function openEdit(p) {
  editing.value = p.id;
  form.value = {
    code: p.code, name: p.name, level: p.level,
    duration_years: p.duration_years, faculty: p.faculty,
    description: p.description || '', entry_requirements: p.entry_requirements || '',
    atar_requirement: p.atar_requirement || '',
    fees_domestic: p.fees_domestic || '', fees_international: p.fees_international || '',
    banner_url: p.banner_url || '',
  };
  showForm.value = true;
}

async function handleSubmit() {
  saving.value = true;
  try {
    const data = { ...form.value };
    if (data.atar_requirement === '') data.atar_requirement = null;
    if (data.fees_domestic === '') data.fees_domestic = null;
    if (data.fees_international === '') data.fees_international = null;

    if (editing.value) {
      await updateProgram(editing.value, data);
    } else {
      await createProgram(data);
    }
    showForm.value = false;
    await fetchPrograms();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to save');
  } finally {
    saving.value = false;
  }
}

async function handleDelete(p) {
  if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
  try {
    await deleteProgram(p.id);
    await fetchPrograms();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to delete');
  }
}

onMounted(fetchPrograms);
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">school</span>
        <h1>Manage Programs</h1>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <span class="material-symbols-outlined">add</span>
        Add Program
      </button>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h2>{{ editing ? 'Edit Program' : 'Add Program' }}</h2>
            <button class="modal-close" @click="showForm = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="modal-body" @submit.prevent="handleSubmit">
            <div class="form-grid">
              <div class="form-group">
                <label>Code *</label>
                <input v-model="form.code" required placeholder="e.g. BCOMP" />
              </div>
              <div class="form-group">
                <label>Level *</label>
                <select v-model="form.level" required>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="research">Research</option>
                </select>
              </div>
              <div class="form-group form-group--full">
                <label>Name *</label>
                <input v-model="form.name" required placeholder="e.g. Bachelor of Computer Science" />
              </div>
              <div class="form-group">
                <label>Duration (years) *</label>
                <input v-model.number="form.duration_years" type="number" step="0.5" min="1" required />
              </div>
              <div class="form-group">
                <label>Faculty *</label>
                <input v-model="form.faculty" required placeholder="e.g. Sciences, Engineering and Technology" />
              </div>
              <div class="form-group">
                <label>ATAR Requirement</label>
                <input v-model="form.atar_requirement" type="number" step="0.1" placeholder="e.g. 80.0" />
              </div>
              <div class="form-group">
                <label>Domestic Fees ($)</label>
                <input v-model="form.fees_domestic" type="number" step="0.01" placeholder="e.g. 34500" />
              </div>
              <div class="form-group form-group--full">
                <label>International Fees ($)</label>
                <input v-model="form.fees_international" type="number" step="0.01" placeholder="e.g. 46000" />
              </div>
              <div class="form-group form-group--full">
                <label>Description</label>
                <textarea v-model="form.description" rows="3" placeholder="Program description..."></textarea>
              </div>
              <div class="form-group form-group--full">
                <label>Entry Requirements</label>
                <textarea v-model="form.entry_requirements" rows="2" placeholder="Entry requirements..."></textarea>
              </div>
              <div class="form-group form-group--full">
                <label>Banner Image Path</label>
                <input v-model="form.banner_url" placeholder="e.g. /program/hero-banner-computer-science.jpg" />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="showForm = false">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Saving...' : (editing ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Table -->
    <LoadingState v-if="loading" />
    <div v-else class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Level</th>
            <th>Duration</th>
            <th>Faculty</th>
            <th>ATAR</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in programs" :key="p.id">
            <td class="td-code">{{ p.code }}</td>
            <td>{{ p.name }}</td>
            <td><span class="badge">{{ p.level }}</span></td>
            <td>{{ p.duration_years }}yr</td>
            <td class="td-truncate">{{ p.faculty }}</td>
            <td>{{ p.atar_requirement || '-' }}</td>
            <td class="td-actions">
              <button class="icon-btn" title="Edit" @click="openEdit(p)">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="icon-btn icon-btn--danger" title="Delete" @click="handleDelete(p)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="!programs.length">
            <td colspan="7" class="td-empty">No programs found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/styles/admin-common.css';
</style>
