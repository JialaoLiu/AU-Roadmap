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

const summaryStats = computed(() => [
  { label: 'Program Partners', value: partners.value.length, icon: 'handshake' },
  { label: 'Opportunity Types', value: uniqueTypes.value.length, icon: 'hub' },
  { label: 'Active Filter', value: filterType.value ? (partnershipTypes[filterType.value]?.label || filterType.value) : 'All', icon: 'tune' },
]);

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
    <section class="industry-hero">
      <div class="page-header__left">
        <div>
          <p class="hero-eyebrow">Industry Engagement</p>
          <div class="hero-title">
            <span class="material-symbols-outlined page-icon">business</span>
            <div>
              <h1>Industry Connections</h1>
              <p class="page-subtitle">Explore industry partners and career opportunities linked to your program.</p>
            </div>
          </div>
          <p class="hero-note">Review how your program connects with placements, projects, and graduate pathways.</p>
        </div>
      </div>

      <div v-if="partners.length" class="hero-summary">
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

    <template v-else-if="partners.length">
      <p class="results-note">
        Showing <strong>{{ filteredPartners.length }}</strong> partner{{ filteredPartners.length === 1 ? '' : 's' }}
        <span v-if="filterType"> for {{ partnershipTypes[filterType]?.label || filterType }}</span>.
      </p>

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

.industry-hero {
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

.page-header__left {
  display: flex;
  align-items: stretch;
}

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

.hero-title {
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

.results-note {
  margin: 0 0 var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.results-note strong {
  color: var(--color-text-primary);
}

/* Filter */
.filter-bar {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--space-xs) var(--space-md);
  border: 1px solid rgba(20, 15, 80, 0.08);
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
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 22px;
  padding: var(--space-lg);
  transition: all var(--transition-fast);
  box-shadow: 0 12px 24px rgba(20, 15, 80, 0.06);
}

.partner-card:hover {
  border-color: rgba(20, 15, 80, 0.18);
  box-shadow: 0 18px 32px rgba(20, 15, 80, 0.1);
  transform: translateY(-2px);
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
  border-radius: 16px;
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
  .industry-page { padding: var(--space-md); }
  .industry-hero { grid-template-columns: 1fr; padding: 20px 18px; }
  .partners-grid { grid-template-columns: 1fr; }
}
</style>
