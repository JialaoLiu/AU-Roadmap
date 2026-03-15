<script setup>
import { ref, onMounted } from 'vue';
import { getProgramList } from '@/api/programs';
import { listAlumni, createAlumni, updateAlumni, deleteAlumni } from '@/api/admin';

const loading = ref(true);
const alumni = ref([]);
const programs = ref([]);
const search = ref('');
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);

const emptyForm = {
  first_name: '', last_name: '', graduation_year: new Date().getFullYear(),
  program_id: '', current_role: '', current_company: '',
  location: '', bio: '', success_story: '', linkedin_url: '', is_featured: false,
};
const form = ref({ ...emptyForm });

async function fetchData() {
  try {
    loading.value = true;
    const [alumniRes, programsRes] = await Promise.all([
      listAlumni({ search: search.value || undefined, limit: 100 }),
      getProgramList({ limit: 100 }),
    ]);
    alumni.value = alumniRes.data.data;
    programs.value = programsRes.data.data;
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

function openEdit(a) {
  editing.value = a.id;
  form.value = {
    first_name: a.first_name, last_name: a.last_name,
    graduation_year: a.graduation_year, program_id: a.program_id,
    current_role: a.current_role || '', current_company: a.current_company || '',
    location: a.location || '', bio: a.bio || '',
    success_story: a.success_story || '', linkedin_url: a.linkedin_url || '',
    is_featured: a.is_featured,
  };
  showForm.value = true;
}

async function handleSubmit() {
  saving.value = true;
  try {
    if (editing.value) {
      await updateAlumni(editing.value, form.value);
    } else {
      await createAlumni(form.value);
    }
    showForm.value = false;
    await fetchData();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to save');
  } finally {
    saving.value = false;
  }
}

async function handleDelete(a) {
  if (!confirm(`Delete "${a.first_name} ${a.last_name}"?`)) return;
  try {
    await deleteAlumni(a.id);
    await fetchData();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to delete');
  }
}

onMounted(fetchData);
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">group</span>
        <h1>Manage Alumni</h1>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <span class="material-symbols-outlined">person_add</span>
        Add Alumni
      </button>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <div class="search-input-wrap">
        <span class="material-symbols-outlined">search</span>
        <input v-model="search" placeholder="Search by name or company..." @keyup.enter="fetchData" />
      </div>
      <button class="btn btn-secondary" @click="fetchData">Search</button>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h2>{{ editing ? 'Edit Alumni' : 'Add Alumni' }}</h2>
            <button class="modal-close" @click="showForm = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="modal-body" @submit.prevent="handleSubmit">
            <div class="form-grid">
              <div class="form-group">
                <label>First Name *</label>
                <input v-model="form.first_name" required />
              </div>
              <div class="form-group">
                <label>Last Name *</label>
                <input v-model="form.last_name" required />
              </div>
              <div class="form-group">
                <label>Graduation Year *</label>
                <input v-model.number="form.graduation_year" type="number" min="1990" required />
              </div>
              <div class="form-group">
                <label>Program *</label>
                <select v-model="form.program_id" required>
                  <option value="" disabled>Select program</option>
                  <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.code }} - {{ p.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Current Role</label>
                <input v-model="form.current_role" placeholder="e.g. Software Engineer" />
              </div>
              <div class="form-group">
                <label>Current Company</label>
                <input v-model="form.current_company" placeholder="e.g. Google" />
              </div>
              <div class="form-group">
                <label>Location</label>
                <input v-model="form.location" placeholder="e.g. Sydney, NSW" />
              </div>
              <div class="form-group">
                <label>LinkedIn URL</label>
                <input v-model="form.linkedin_url" placeholder="https://linkedin.com/in/..." />
              </div>
              <div class="form-group form-group--full">
                <label>Bio</label>
                <textarea v-model="form.bio" rows="2" placeholder="Short bio..."></textarea>
              </div>
              <div class="form-group form-group--full">
                <label>Success Story</label>
                <textarea v-model="form.success_story" rows="3" placeholder="Their journey and achievements..."></textarea>
              </div>
              <div class="form-group form-group--full">
                <label>
                  <input type="checkbox" v-model="form.is_featured" />
                  Featured alumni (show on homepage)
                </label>
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
    <div v-if="loading" class="loading-state"><div class="loading-spinner"></div></div>
    <div v-else class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Program</th>
            <th>Year</th>
            <th>Role</th>
            <th>Company</th>
            <th>Featured</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in alumni" :key="a.id">
            <td>{{ a.first_name }} {{ a.last_name }}</td>
            <td class="td-code">{{ a.program_code || '-' }}</td>
            <td>{{ a.graduation_year }}</td>
            <td>{{ a.current_role || '-' }}</td>
            <td>{{ a.current_company || '-' }}</td>
            <td>
              <span class="material-symbols-outlined" :style="{ color: a.is_featured ? 'var(--color-accent)' : 'var(--color-text-light)', fontSize: '18px' }">
                {{ a.is_featured ? 'star' : 'star_outline' }}
              </span>
            </td>
            <td class="td-actions">
              <button class="icon-btn" title="Edit" @click="openEdit(a)">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="icon-btn icon-btn--danger" title="Delete" @click="handleDelete(a)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="!alumni.length">
            <td colspan="7" class="td-empty">No alumni found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/styles/admin-common.css';
</style>
