<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getProgramResources } from '@/api/programs';

const authStore = useAuthStore();
const loading = ref(true);
const resources = ref([]);
const filterCategory = ref('');

const categories = {
  academic: { label: 'Academic', icon: 'edit_note', color: '#1976d2' },
  career: { label: 'Career', icon: 'work', color: '#e65100' },
  wellbeing: { label: 'Wellbeing', icon: 'psychology', color: '#2e7d32' },
  financial: { label: 'Financial', icon: 'payments', color: '#6a1b9a' },
  technology: { label: 'Technology', icon: 'computer', color: '#00838f' },
  library: { label: 'Library', icon: 'local_library', color: '#d32f2f' },
};

const filteredResources = computed(() => {
  if (!filterCategory.value) return resources.value;
  return resources.value.filter(r => r.category === filterCategory.value);
});

const uniqueCategories = computed(() => {
  const cats = new Set(resources.value.map(r => r.category));
  return [...cats];
});

const summaryStats = computed(() => [
  { label: 'Available Resources', value: resources.value.length, icon: 'menu_book' },
  { label: 'Categories', value: uniqueCategories.value.length, icon: 'apps' },
  { label: 'Current Filter', value: filterCategory.value ? (categories[filterCategory.value]?.label || filterCategory.value) : 'All', icon: 'tune' },
]);

async function fetchResources() {
  const programId = authStore.user?.program_id;
  if (!programId) { loading.value = false; return; }
  try {
    const res = await getProgramResources(programId);
    resources.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchResources);
</script>

<template>
  <div class="resources-page">
    <section class="resources-hero">
      <div class="page-header__left">
        <div>
          <p class="hero-eyebrow">Student Support</p>
          <div class="hero-title">
            <span class="material-symbols-outlined page-icon">menu_book</span>
            <div>
              <h1>Student Resources</h1>
              <p class="page-subtitle">Academic support, career services, and helpful tools for your studies.</p>
            </div>
          </div>
          <p class="hero-note">Access the support services and tools most relevant to your study progress and current needs.</p>
        </div>
      </div>

      <div v-if="resources.length" class="hero-summary">
        <div v-for="item in summaryStats" :key="item.label" class="summary-card">
          <span class="material-symbols-outlined summary-icon">{{ item.icon }}</span>
          <div>
            <span class="summary-value">{{ item.value }}</span>
            <span class="summary-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <div v-if="loading" class="loading-state"><div class="loading-spinner"></div></div>

    <div v-else-if="!authStore.user?.program_id" class="no-program-state">
      <span class="material-symbols-outlined no-program-icon">info</span>
      <h2>No Program Assigned</h2>
      <p>Resources are tailored to your program. Please contact your administrator to get a program assigned to your account.</p>
    </div>

    <template v-else-if="resources.length">
      <!-- Category Filter -->
      <div class="filter-bar">
        <button
          class="filter-btn"
          :class="{ 'filter-btn--active': !filterCategory }"
          @click="filterCategory = ''"
        >
          <span class="material-symbols-outlined">apps</span>
          All
        </button>
        <button
          v-for="cat in uniqueCategories"
          :key="cat"
          class="filter-btn"
          :class="{ 'filter-btn--active': filterCategory === cat }"
          @click="filterCategory = cat"
        >
          <span class="material-symbols-outlined">{{ categories[cat]?.icon || 'link' }}</span>
          {{ categories[cat]?.label || cat }}
        </button>
      </div>

      <!-- Resource Cards -->
      <div class="resources-grid">
        <a
          v-for="r in filteredResources"
          :key="r.id"
          :href="r.url"
          target="_blank"
          rel="noopener"
          class="resource-card"
        >
          <div class="resource-icon" :style="{ background: (categories[r.category]?.color || '#140f50') + '12', color: categories[r.category]?.color || '#140f50' }">
            <span class="material-symbols-outlined">{{ r.icon || categories[r.category]?.icon || 'link' }}</span>
          </div>
          <div class="resource-content">
            <h3>{{ r.title }}</h3>
            <p v-if="r.description">{{ r.description }}</p>
            <span class="resource-category-badge" :style="{ color: categories[r.category]?.color || '#140f50' }">
              {{ categories[r.category]?.label || r.category }}
            </span>
          </div>
          <span class="material-symbols-outlined resource-arrow">open_in_new</span>
        </a>
      </div>
    </template>

    <div v-else class="empty-state">
      <span class="material-symbols-outlined empty-icon">menu_book</span>
      <h2>No Resources Available</h2>
      <p>Student resources are not yet configured for your program.</p>
    </div>
  </div>
</template>

<style scoped>
.resources-page { padding: var(--space-lg); }

.resources-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: var(--space-lg);
  padding: 24px;
  margin-bottom: var(--space-lg);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 247, 251, 0.96));
  box-shadow: 0 18px 32px rgba(20, 15, 80, 0.08);
}

.page-header__left { display: flex; align-items: stretch; }
.hero-eyebrow {
  display: inline-flex;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(20, 15, 80, 0.06);
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.hero-title { display: flex; align-items: center; gap: var(--space-md); }
.page-icon { font-size: 32px; color: var(--color-primary); }
.page-header h1 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text-primary); }
.page-subtitle { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 2px; }
.hero-note {
  margin: 14px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  max-width: 54ch;
}

.hero-summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 10px 20px rgba(20, 15, 80, 0.05);
}

.summary-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--color-primary);
  background: rgba(20, 15, 80, 0.06);
  flex-shrink: 0;
}

.summary-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.15;
}

.summary-label {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

/* No program */
.no-program-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: var(--space-3xl); text-align: center;
}
.no-program-icon { font-size: 48px; color: var(--color-text-light); margin-bottom: var(--space-md); }
.no-program-state h2 { color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.no-program-state p { color: var(--color-text-secondary); max-width: 380px; }

/* Filter */
.filter-bar {
  display: flex; gap: var(--space-sm); margin-bottom: var(--space-xl); flex-wrap: wrap;
}

.filter-btn {
  display: flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border: 1px solid rgba(20, 15, 80, 0.08); border-radius: var(--border-radius-full);
  background: var(--color-white);
  font-size: var(--font-size-xs); font-weight: 500; font-family: inherit;
  color: var(--color-text-secondary); cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn .material-symbols-outlined { font-size: 16px; }
.filter-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }

.filter-btn--active {
  background: var(--color-primary); border-color: var(--color-primary);
  color: var(--color-white);
}

/* Resource Cards */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.resource-card {
  display: flex; align-items: flex-start; gap: var(--space-md);
  background: var(--color-white); border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 22px; padding: var(--space-lg);
  transition: all var(--transition-fast); text-decoration: none;
  box-shadow: 0 12px 24px rgba(20, 15, 80, 0.06);
}

.resource-card:hover {
  border-color: rgba(20, 15, 80, 0.18); box-shadow: 0 18px 32px rgba(20, 15, 80, 0.1);
  transform: translateY(-2px);
}

.resource-icon {
  width: 48px; height: 48px; border-radius: var(--border-radius-md);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.resource-icon .material-symbols-outlined { font-size: 24px; }

.resource-content { flex: 1; }

.resource-content h3 {
  font-size: var(--font-size-sm); font-weight: 600;
  color: var(--color-text-primary); margin-bottom: 4px;
}

.resource-content p {
  font-size: var(--font-size-xs); color: var(--color-text-secondary);
  line-height: 1.5; margin-bottom: var(--space-sm);
}

.resource-category-badge {
  font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
}

.resource-arrow {
  color: var(--color-text-light); font-size: 18px;
  flex-shrink: 0; margin-top: 2px;
}

/* Empty / Loading */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: var(--space-3xl); text-align: center;
}
.empty-icon { font-size: 48px; color: var(--color-text-light); margin-bottom: var(--space-md); }
.empty-state h2 { color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.empty-state p { color: var(--color-text-secondary); }

.loading-state { display: flex; justify-content: center; padding: var(--space-3xl); }
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid var(--color-border);
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .resources-page { padding: var(--space-md); }
  .resources-hero { grid-template-columns: 1fr; padding: 20px 18px; }
  .resources-grid { grid-template-columns: 1fr; }
}
</style>
