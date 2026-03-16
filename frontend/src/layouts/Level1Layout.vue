<script setup>
import { RouterLink } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

const sidebarLinks = [
  { to: '/student', label: 'Dashboard', icon: 'dashboard', exact: true },
  { to: '/student/roadmap', label: 'My Roadmap', icon: 'route' },
  { to: '/student/industry', label: 'Industry', icon: 'business' },
  { to: '/student/alumni', label: 'Alumni', icon: 'group' },
  { to: '/student/discussion', label: 'Discussion', icon: 'forum' },
  { to: '/student/resources', label: 'Resources', icon: 'menu_book' },
];
</script>

<template>
  <div class="level1-layout">
    <AppHeader />
    <div class="layout-body">
      <aside class="sidebar" :class="{ collapsed: !uiStore.sidebarOpen }">
        <button class="sidebar-toggle" @click="uiStore.toggleSidebar">
          <span class="material-symbols-outlined">
            {{ uiStore.sidebarOpen ? 'chevron_left' : 'chevron_right' }}
          </span>
        </button>
        <nav class="sidebar-nav">
          <RouterLink
            v-for="link in sidebarLinks"
            :key="link.to"
            :to="link.to"
            class="sidebar-link"
            :class="{ 'exact-active': link.exact }"
          >
            <span class="material-symbols-outlined">{{ link.icon }}</span>
            <span v-if="uiStore.sidebarOpen" class="link-label">{{ link.label }}</span>
          </RouterLink>
        </nav>
      </aside>
      <main class="main-content">
        <RouterView />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.level1-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-body {
  flex: 1;
  display: flex;
}

.sidebar {
  width: var(--sidebar-width);
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  padding: var(--space-md);
  transition: width var(--transition-normal);
  position: relative;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-toggle {
  position: absolute;
  top: var(--space-sm);
  right: calc(-1 * var(--space-md));
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.sidebar-toggle .material-symbols-outlined {
  font-size: 18px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-top: var(--space-lg);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.sidebar-link:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-primary);
}

.sidebar-link.router-link-active {
  background: var(--color-primary);
  color: var(--color-white);
}

.main-content {
  flex: 1;
  padding: var(--space-xl);
  max-width: calc(100% - var(--sidebar-width));
}

.sidebar.collapsed + .main-content {
  max-width: calc(100% - 64px);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: var(--header-height);
    bottom: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
  }

  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .main-content {
    max-width: 100%;
    padding: var(--space-md);
  }
}
</style>
