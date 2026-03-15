<script setup>
import { RouterLink } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
  { to: '/admin/programs', label: 'Programs', icon: 'school' },
  { to: '/admin/courses', label: 'Courses', icon: 'class' },
  { to: '/admin/alumni', label: 'Alumni', icon: 'group' },
  { to: '/admin/industry', label: 'Industry', icon: 'business' },
  { to: '/admin/careers', label: 'Careers', icon: 'work' },
  { to: '/admin/users', label: 'Users', icon: 'manage_accounts' },
];
</script>

<template>
  <div class="admin-layout">
    <AppHeader />
    <div class="layout-body">
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <span class="material-symbols-outlined">admin_panel_settings</span>
          <span>Admin Panel</span>
        </div>
        <nav class="sidebar-nav">
          <RouterLink
            v-for="link in adminLinks"
            :key="link.to"
            :to="link.to"
            class="sidebar-link"
          >
            <span class="material-symbols-outlined">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
          </RouterLink>
        </nav>
      </aside>
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-body {
  flex: 1;
  display: flex;
}

.admin-sidebar {
  width: var(--sidebar-width);
  background: var(--color-gray-900);
  color: var(--color-white);
  padding: var(--space-md);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  font-weight: 600;
  font-size: var(--font-size-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--space-md);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-md);
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
}

.sidebar-link.router-link-active {
  background: var(--color-primary);
  color: var(--color-white);
}

.main-content {
  flex: 1;
  padding: var(--space-xl);
  background: var(--color-bg-secondary);
}
</style>
