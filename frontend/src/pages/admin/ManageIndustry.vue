<script setup>
import { ref, onMounted } from 'vue';
import { listIndustryPartners, createIndustryPartner, updateIndustryPartner, deleteIndustryPartner } from '@/api/admin';

const loading = ref(true);
const partners = ref([]);
const search = ref('');
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);

const emptyForm = {
  name: '', industry_sector: '', description: '',
  website_url: '', partnership_type: 'internship', contact_email: '',
};
const form = ref({ ...emptyForm });

async function fetchPartners() {
  try {
    loading.value = true;
    const res = await listIndustryPartners({ search: search.value || undefined, limit: 100 });
    partners.value = res.data.data;
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
    name: p.name, industry_sector: p.industry_sector || '',
    description: p.description || '', website_url: p.website_url || '',
    partnership_type: p.partnership_type, contact_email: p.contact_email || '',
  };
  showForm.value = true;
}

async function handleSubmit() {
  saving.value = true;
  try {
    if (editing.value) {
      await updateIndustryPartner(editing.value, form.value);
    } else {
      await createIndustryPartner(form.value);
    }
    showForm.value = false;
    await fetchPartners();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to save');
  } finally {
    saving.value = false;
  }
}

async function handleDelete(p) {
  if (!confirm(`Delete "${p.name}"?`)) return;
  try {
    await deleteIndustryPartner(p.id);
    await fetchPartners();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to delete');
  }
}

onMounted(fetchPartners);
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">business</span>
        <h1>Manage Industry Partners</h1>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <span class="material-symbols-outlined">domain_add</span>
        Add Partner
      </button>
    </div>

    <div class="search-bar">
      <div class="search-input-wrap">
        <span class="material-symbols-outlined">search</span>
        <input v-model="search" placeholder="Search by name or sector..." @keyup.enter="fetchPartners" />
      </div>
      <button class="btn btn-secondary" @click="fetchPartners">Search</button>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h2>{{ editing ? 'Edit Partner' : 'Add Partner' }}</h2>
            <button class="modal-close" @click="showForm = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="modal-body" @submit.prevent="handleSubmit">
            <div class="form-grid">
              <div class="form-group form-group--full">
                <label>Company Name *</label>
                <input v-model="form.name" required placeholder="e.g. Google Australia" />
              </div>
              <div class="form-group">
                <label>Industry Sector</label>
                <input v-model="form.industry_sector" placeholder="e.g. Technology" />
              </div>
              <div class="form-group">
                <label>Partnership Type *</label>
                <select v-model="form.partnership_type" required>
                  <option value="internship">Internship</option>
                  <option value="research">Research</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="employment">Employment</option>
                  <option value="guest_lecture">Guest Lecture</option>
                </select>
              </div>
              <div class="form-group">
                <label>Website URL</label>
                <input v-model="form.website_url" placeholder="https://..." />
              </div>
              <div class="form-group">
                <label>Contact Email</label>
                <input v-model="form.contact_email" type="email" placeholder="contact@company.com" />
              </div>
              <div class="form-group form-group--full">
                <label>Description</label>
                <textarea v-model="form.description" rows="3" placeholder="About this partnership..."></textarea>
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
            <th>Sector</th>
            <th>Type</th>
            <th>Website</th>
            <th>Contact</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in partners" :key="p.id">
            <td class="td-code">{{ p.name }}</td>
            <td>{{ p.industry_sector || '-' }}</td>
            <td><span class="badge">{{ p.partnership_type }}</span></td>
            <td>
              <a v-if="p.website_url" :href="p.website_url" target="_blank" class="table-link">Visit</a>
              <span v-else>-</span>
            </td>
            <td class="td-truncate">{{ p.contact_email || '-' }}</td>
            <td class="td-actions">
              <button class="icon-btn" title="Edit" @click="openEdit(p)">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="icon-btn icon-btn--danger" title="Delete" @click="handleDelete(p)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="!partners.length">
            <td colspan="6" class="td-empty">No industry partners found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/styles/admin-common.css';

.table-link {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.table-link:hover {
  text-decoration: underline;
}
</style>
