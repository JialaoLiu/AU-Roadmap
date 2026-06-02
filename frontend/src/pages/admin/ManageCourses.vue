<script setup>
import { ref, onMounted } from 'vue';
import LoadingState from '@/components/common/LoadingState.vue';
import { getProgramList } from '@/api/programs';
import { listCourses, createCourse, updateCourse, deleteCourse } from '@/api/admin';

const loading = ref(true);
const courses = ref([]);
const programs = ref([]);
const search = ref('');
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);

const emptyForm = {
  code: '', name: '', units: 3, level: '1000',
  semester_offered: 'S1', description: '', is_elective: false,
  program_id: '', year_level: 1, semester: 1, course_group: '', sort_order: 0,
};
const form = ref({ ...emptyForm });

async function fetchCourses() {
  try {
    loading.value = true;
    const res = await listCourses({ search: search.value || undefined, limit: 100 });
    courses.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function fetchPrograms() {
  try {
    const res = await getProgramList({ limit: 100 });
    programs.value = res.data.data;
  } catch (err) {
    console.error(err);
  }
}

function openCreate() {
  editing.value = null;
  form.value = { ...emptyForm };
  showForm.value = true;
}

function openEdit(c) {
  editing.value = c.id;
  form.value = {
    code: c.code, name: c.name, units: c.units, level: c.level,
    semester_offered: c.semester_offered, description: c.description || '',
    is_elective: c.is_elective,
  };
  showForm.value = true;
}

async function handleSubmit() {
  saving.value = true;
  try {
    const payload = { ...form.value };
    if (editing.value) {
      delete payload.program_id;
      delete payload.year_level;
      delete payload.semester;
      delete payload.course_group;
      delete payload.sort_order;
    } else if (!payload.program_id) {
      delete payload.program_id;
      delete payload.year_level;
      delete payload.semester;
      delete payload.course_group;
      delete payload.sort_order;
    }

    if (editing.value) {
      await updateCourse(editing.value, payload);
    } else {
      await createCourse(payload);
    }
    showForm.value = false;
    await fetchCourses();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to save');
  } finally {
    saving.value = false;
  }
}

async function handleDelete(c) {
  if (!confirm(`Delete "${c.code} - ${c.name}"?`)) return;
  try {
    await deleteCourse(c.id);
    await fetchCourses();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to delete');
  }
}

function handleSearch() {
  fetchCourses();
}

onMounted(async () => {
  await Promise.all([fetchCourses(), fetchPrograms()]);
});
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">class</span>
        <h1>Manage Courses</h1>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <span class="material-symbols-outlined">add</span>
        Add Course
      </button>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <div class="search-input-wrap">
        <span class="material-symbols-outlined">search</span>
        <input
          v-model="search"
          placeholder="Search by code or name..."
          @keyup.enter="handleSearch"
        />
      </div>
      <button class="btn btn-secondary" @click="handleSearch">Search</button>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h2>{{ editing ? 'Edit Course' : 'Add Course' }}</h2>
            <button class="modal-close" @click="showForm = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="modal-body" @submit.prevent="handleSubmit">
            <div class="form-grid">
              <div class="form-group">
                <label>Code *</label>
                <input v-model="form.code" required placeholder="e.g. COMP1101" />
              </div>
              <div class="form-group">
                <label>Units</label>
                <input v-model.number="form.units" type="number" min="1" max="24" />
              </div>
              <div class="form-group form-group--full">
                <label>Name *</label>
                <input v-model="form.name" required placeholder="e.g. Introduction to Programming" />
              </div>
              <div class="form-group">
                <label>Level *</label>
                <select v-model="form.level" required>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                  <option value="3000">3000</option>
                  <option value="4000">4000</option>
                  <option value="postgrad">Postgrad</option>
                </select>
              </div>
              <div class="form-group">
                <label>Semester Offered *</label>
                <select v-model="form.semester_offered" required>
                  <option value="S1">Semester 1</option>
                  <option value="S2">Semester 2</option>
                  <option value="S1,S2">Both Semesters</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
              <div class="form-group form-group--full">
                <label>
                  <input type="checkbox" v-model="form.is_elective" />
                  This is an elective course
                </label>
              </div>
              <div class="form-group form-group--full">
                <label>Description</label>
                <textarea v-model="form.description" rows="3" placeholder="Course description..."></textarea>
              </div>

              <template v-if="!editing">
                <div class="form-group form-group--full">
                  <label>Program Assignment (Optional)</label>
                  <select v-model="form.program_id">
                    <option value="">Create course only</option>
                    <option v-for="program in programs" :key="program.id" :value="program.id">
                      {{ program.code }} - {{ program.name }}
                    </option>
                  </select>
                </div>

                <template v-if="form.program_id">
                  <div class="form-group">
                    <label>Roadmap Year *</label>
                    <input v-model.number="form.year_level" type="number" min="1" required />
                  </div>
                  <div class="form-group">
                    <label>Roadmap Semester *</label>
                    <select v-model.number="form.semester" required>
                      <option :value="1">Semester 1</option>
                      <option :value="2">Semester 2</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Course Group</label>
                    <input v-model="form.course_group" placeholder="e.g. Core Stream A" />
                  </div>
                  <div class="form-group">
                    <label>Sort Order</label>
                    <input v-model.number="form.sort_order" type="number" min="0" />
                  </div>
                </template>
              </template>
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
            <th>Units</th>
            <th>Level</th>
            <th>Semester</th>
            <th>Type</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in courses" :key="c.id">
            <td class="td-code">{{ c.code }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.units }}</td>
            <td>{{ c.level }}</td>
            <td>{{ c.semester_offered }}</td>
            <td>
              <span class="badge" :class="c.is_elective ? 'badge--warning' : ''">
                {{ c.is_elective ? 'Elective' : 'Core' }}
              </span>
            </td>
            <td class="td-actions">
              <button class="icon-btn" title="Edit" @click="openEdit(c)">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="icon-btn icon-btn--danger" title="Delete" @click="handleDelete(c)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="!courses.length">
            <td colspan="7" class="td-empty">No courses found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/styles/admin-common.css';
</style>
