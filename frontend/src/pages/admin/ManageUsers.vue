<script setup>
import { ref, onMounted } from 'vue';
import LoadingState from '@/components/common/LoadingState.vue';
import { getUsers, changeUserRole, deleteUser } from '@/api/admin';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const loading = ref(true);
const users = ref([]);
const search = ref('');
const roleFilter = ref('');

async function fetchUsers() {
  try {
    loading.value = true;
    const params = { limit: 100 };
    if (search.value) params.search = search.value;
    if (roleFilter.value) params.role = roleFilter.value;
    const res = await getUsers(params);
    users.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function handleRoleChange(user, newRole) {
  if (user.id === authStore.user?.id) {
    alert('Cannot change your own role');
    return;
  }
  if (!confirm(`Change ${user.first_name}'s role to "${newRole}"?`)) return;
  try {
    await changeUserRole(user.id, newRole);
    await fetchUsers();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to change role');
  }
}

async function handleDelete(user) {
  if (user.id === authStore.user?.id) {
    alert('Cannot delete your own account');
    return;
  }
  if (!confirm(`Delete user "${user.first_name} ${user.last_name}"? This cannot be undone.`)) return;
  try {
    await deleteUser(user.id);
    await fetchUsers();
  } catch (err) {
    alert(err.response?.data?.error?.message || 'Failed to delete');
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function getRoleBadgeClass(role) {
  return {
    admin: 'badge--error',
    student: 'badge--success',
    prospective: 'badge--warning',
  }[role] || '';
}

onMounted(fetchUsers);
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">manage_accounts</span>
        <h1>Manage Users</h1>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="search-bar">
      <div class="search-input-wrap">
        <span class="material-symbols-outlined">search</span>
        <input v-model="search" placeholder="Search by name or email..." @keyup.enter="fetchUsers" />
      </div>
      <select v-model="roleFilter" class="role-filter" @change="fetchUsers">
        <option value="">All Roles</option>
        <option value="student">Student</option>
        <option value="prospective">Prospective</option>
        <option value="admin">Admin</option>
      </select>
      <button class="btn btn-secondary" @click="fetchUsers">Search</button>
    </div>

    <!-- Table -->
    <LoadingState v-if="loading" />
    <div v-else class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Student ID</th>
            <th>Joined</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>
              {{ u.first_name }} {{ u.last_name }}
              <span v-if="u.id === authStore.user?.id" class="you-tag">(you)</span>
            </td>
            <td class="td-truncate">{{ u.email }}</td>
            <td>
              <select
                :value="u.role"
                class="role-select"
                :class="getRoleBadgeClass(u.role)"
                :disabled="u.id === authStore.user?.id"
                @change="handleRoleChange(u, $event.target.value)"
              >
                <option value="student">Student</option>
                <option value="prospective">Prospective</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>{{ u.student_id || '-' }}</td>
            <td>{{ formatDate(u.created_at) }}</td>
            <td class="td-actions">
              <button
                class="icon-btn icon-btn--danger"
                title="Delete"
                :disabled="u.id === authStore.user?.id"
                @click="handleDelete(u)"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="!users.length">
            <td colspan="6" class="td-empty">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/styles/admin-common.css';

.role-filter {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-family: inherit;
}

.role-select {
  padding: 2px 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-transform: capitalize;
  background: var(--color-white);
}

.role-select:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.you-tag {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-weight: 400;
}
</style>
