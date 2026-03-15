<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getProgramIndustry } from '@/api/programs';

const authStore = useAuthStore();
const loading = ref(true);
const partners = ref([]);
const filterType = ref('');

const partnershipTypes = {
  internship: { label: 'Internship', icon: 'work_history', color: '#1976d2' },
  research: { label: 'Research', icon: 'science', color: '#6a1b9a' },
  sponsorship: { label: 'Sponsorship', icon: 'volunteer_activism', color: '#2e7d32' },
  employment: { label: 'Employment', icon: 'badge', color: '#e65100' },
  guest_lecture: { label: 'Guest Lecture', icon: 'podium', color: '#00838f' },
};

const filteredPartners = computed(() => {
  if (!filterType.value) return partners.value;
  return partners.value.filter(p => p.partnership_type === filterType.value);
});

const uniqueTypes = computed(() => {
  const types = new Set(partners.value.map(p => p.partnership_type));
  return [...types];
});

async function fetchPartners() {
  const programId = authStore.user?.program_id;
  if (!programId) { loading.value = false; return; }
  try {
    const res = await getProgramIndustry(programId);
    partners.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchPartners);
</script>

<template>
  <div class="industry-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">business</span>
        <div>
          <h1>Industry Connections</h1>
          <p class="page-subtitle">Explore industry partners and career opportunities linked to your program</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state"><div class="loading-spinner"></div></div>

    <template v-else-if="partners.length">
      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-chip">
          <span class="material-symbols-outlined">handshake</span>
          <strong>{{ partners.length }}</strong> Partners
        </div>
        <div v-for="t in uniqueTypes" :key="t" class="stat-chip">
          <span class="material-symbols-outlined">{{ partnershipTypes[t]?.icon || 'business' }}</span>
          <strong>{{ partners.filter(p => p.partnership_type === t).length }}</strong>
          {{ partnershipTypes[t]?.label || t }}
        </div>
      </div>

      <!-- Filter -->
      <div class="filter-bar">
        <button
          class="filter-btn"
          :class="{ 'filter-btn--active': !filterType }"
          @click="filterType = ''"
        >All</button>
        <button
          v-for="t in uniqueTypes"
          :key="t"
          class="filter-btn"
          :class="{ 'filter-btn--active': filterType === t }"
          @click="filterType = t"
        >{{ partnershipTypes[t]?.label || t }}</button>
      </div>

      <!-- Partner Cards -->
      <div class="partners-grid">
        <div v-for="p in filteredPartners" :key="p.id" class="partner-card">
          <div class="partner-card__header">
            <div class="partner-logo-placeholder" :style="{ background: (partnershipTypes[p.partnership_type]?.color || '#140f50') + '12' }">
              <span class="material-symbols-outlined" :style="{ color: partnershipTypes[p.partnership_type]?.color || '#140f50' }">
                {{ partnershipTypes[p.partnership_type]?.icon || 'business' }}
              </span>
            </div>
            <div>
              <h3 class="partner-name">{{ p.name }}</h3>
              <span class="partner-sector">{{ p.industry_sector || 'Industry' }}</span>
            </div>
          </div>

          <span class="partner-type-badge" :style="{ background: (partnershipTypes[p.partnership_type]?.color || '#140f50') + '15', color: partnershipTypes[p.partnership_type]?.color || '#140f50' }">
            {{ partnershipTypes[p.partnership_type]?.label || p.partnership_type }}
          </span>

          <p v-if="p.description" class="partner-desc">{{ p.description }}</p>
          <p v-if="p.opportunity_description" class="partner-opportunity">
            <span class="material-symbols-outlined">lightbulb</span>
            {{ p.opportunity_description }}
          </p>

          <a v-if="p.website_url" :href="p.website_url" target="_blank" rel="noopener" class="partner-link">
            <span class="material-symbols-outlined">open_in_new</span>
            Visit Website
          </a>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">
      <span class="material-symbols-outlined empty-icon">business</span>
      <h2>No Industry Partners</h2>
      <p>Industry partner information is not yet available for your program.</p>
    </div>
  </div>
</template>

<style scoped>
.industry-page { padding: var(--space-lg); }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xl);
}

.page-header__left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.page-icon { font-size: 32px; color: var(--color-primary); }

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

/* Stats */
.stats-row {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.stat-chip .material-symbols-outlined { font-size: 16px; color: var(--color-primary); }
.stat-chip strong { color: var(--color-text-primary); }

/* Filter */
.filter-bar {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.filter-btn {
  padding: var(--space-xs) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  background: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: 500;
  font-family: inherit;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }

.filter-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

/* Partner Cards */
.partners-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

.partner-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  transition: all var(--transition-fast);
}

.partner-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.partner-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.partner-logo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.partner-logo-placeholder .material-symbols-outlined { font-size: 24px; }

.partner-name {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
}

.partner-sector {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.partner-type-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--border-radius-full);
  font-size: 11px;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.partner-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-sm);
}

.partner-opportunity {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  background: rgba(20, 15, 80, 0.04);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--space-md);
  line-height: 1.4;
}

.partner-opportunity .material-symbols-outlined { font-size: 18px; flex-shrink: 0; margin-top: 1px; }

.partner-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-primary);
}

.partner-link:hover { text-decoration: underline; }
.partner-link .material-symbols-outlined { font-size: 16px; }

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
  .partners-grid { grid-template-columns: 1fr; }
}
</style>
