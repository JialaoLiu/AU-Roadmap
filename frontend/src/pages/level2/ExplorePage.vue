<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getProgramList } from '@/api/programs';

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const programs = ref([]);
const search = ref(route.query.search || '');
const levelFilter = ref(route.query.level || '');
const facultyFilter = ref(route.query.faculty || '');
const featuredProgramCodes = ['BCOMP', 'BENG-SW', 'BDS', 'BCYBER'];
const demoProgramBanners = {
  BCOMP: '/program/hero-banner-computer-science.jpg',
  'BENG-SW': '/program/hero-banner-software-engineer.jpg',
  BDS: '/program/hero-banner-data-science.jpg',
  BCYBER: '/program/hero-banner-cyber-security.jpg',
};
const fallbackThemes = [
  'linear-gradient(135deg, #140f50 0%, #1e1870 52%, #314191 100%)',
  'linear-gradient(135deg, #0f3d5e 0%, #155e75 55%, #1d7f8c 100%)',
  'linear-gradient(135deg, #3f234d 0%, #5f2f73 55%, #7a4491 100%)',
  'linear-gradient(135deg, #1f4a3d 0%, #23634e 52%, #2f7d62 100%)',
  'linear-gradient(135deg, #4c2e14 0%, #744116 52%, #9b5b1e 100%)',
];

const filteredPrograms = computed(() => {
  let result = programs.value;
  if (search.value) {
    const term = search.value.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term)
    );
  }
  if (levelFilter.value) {
    result = result.filter(p => p.level === levelFilter.value);
  }
  if (facultyFilter.value) {
    result = result.filter(p => p.faculty === facultyFilter.value);
  }
  return result;
});

const faculties = computed(() => {
  const set = new Set(programs.value.map(p => p.faculty));
  return [...set].sort();
});

async function fetchPrograms() {
  try {
    const res = await getProgramList({ limit: 100 });
    programs.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function clearFilters() {
  search.value = '';
  levelFilter.value = '';
  facultyFilter.value = '';
}

function getLevelLabel(level) {
  return { undergraduate: 'Undergraduate', postgraduate: 'Postgraduate', research: 'Research', online: 'Online' }[level] || level;
}

function getProgramBanner(program) {
  return program.banner_url || demoProgramBanners[program.code] || '';
}

function hasProgramBanner(program) {
  return Boolean(getProgramBanner(program));
}

function getFallbackTheme(program) {
  const key = `${program.faculty || ''}${program.level || ''}${program.code || ''}`;
  const index = key.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % fallbackThemes.length;
  return fallbackThemes[index];
}

function getProgramMediaStyle(program) {
  const banner = getProgramBanner(program);
  if (banner) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(20, 15, 80, 0.08), rgba(20, 15, 80, 0.4)), url(${banner})`,
    };
  }

  return {
    background: getFallbackTheme(program),
  };
}

function getFeaturedBadge(program) {
  if (featuredProgramCodes.includes(program.code)) return 'Featured';
  return program.level === 'postgraduate' ? 'Popular' : 'Program';
}

onMounted(fetchPrograms);
</script>

<template>
  <div class="explore-page">
    <!-- Hero -->
    <div class="explore-hero">
      <div class="hero-inner">
        <p class="hero-eyebrow">Programs</p>
        <h1>Explore Our Programs</h1>
        <p>Find the right degree for your future. Browse Adelaide University programs by level, faculty, and study interests.</p>
        <div class="hero-search">
          <span class="material-symbols-outlined">search</span>
          <input v-model="search" placeholder="Search programs by name, code, or keyword..." />
        </div>
      </div>
    </div>

    <div class="explore-content">
      <div class="filters-card">
        <div class="filters-copy">
          <p class="filters-eyebrow">Refine Results</p>
          <h2>Find a program that fits your goals.</h2>
          <p>Filter by study level or faculty to narrow the list, then open a program for details, courses, and outcomes.</p>
        </div>
        <div class="filters">
          <div class="filter-group">
            <label>Level</label>
            <select v-model="levelFilter">
              <option value="">All Levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="research">Research</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Faculty</label>
            <select v-model="facultyFilter">
              <option value="">All Faculties</option>
              <option v-for="f in faculties" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>
          <button v-if="search || levelFilter || facultyFilter" class="clear-btn" @click="clearFilters">
            <span class="material-symbols-outlined">close</span>
            Clear Filters
          </button>
          <span class="results-count">{{ filteredPrograms.length }} program{{ filteredPrograms.length !== 1 ? 's' : '' }} found</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state"><div class="loading-spinner"></div></div>

      <!-- Program Grid -->
      <div v-else-if="filteredPrograms.length" class="programs-grid">
        <div
          v-for="p in filteredPrograms"
          :key="p.id"
          class="program-card"
          @click="router.push(`/explore/programs/${p.id}`)"
        >
          <div
            class="program-card__media"
            :class="{ 'program-card__media--fallback': !hasProgramBanner(p) }"
            :style="getProgramMediaStyle(p)"
          >
            <span class="program-card__badge">{{ getFeaturedBadge(p) }}</span>
            <div v-if="!hasProgramBanner(p)" class="program-card__media-fallback">
              <span class="program-card__media-code">{{ p.code }}</span>
              <span class="program-card__media-faculty">{{ p.faculty }}</span>
            </div>
          </div>
          <div class="program-card__level">
            <span class="level-badge">{{ getLevelLabel(p.level) }}</span>
          </div>
          <h3 class="program-card__code">{{ p.code }}</h3>
          <h2 class="program-card__name">{{ p.name }}</h2>
          <p class="program-card__faculty">{{ p.faculty }}</p>
          <p v-if="p.description" class="program-card__desc">{{ p.description }}</p>

          <div class="program-card__stats">
            <div class="program-stat">
              <span class="material-symbols-outlined">calendar_today</span>
              {{ p.duration_years }} years
            </div>
            <div v-if="p.atar_requirement" class="program-stat">
              <span class="material-symbols-outlined">grade</span>
              ATAR {{ p.atar_requirement }}
            </div>
            <div v-if="p.fees_domestic" class="program-stat">
              <span class="material-symbols-outlined">payments</span>
              ${{ Number(p.fees_domestic).toLocaleString() }}/yr
            </div>
          </div>

          <div class="program-card__cta">
            <span>View Details</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="empty-state">
        <span class="material-symbols-outlined">search_off</span>
        <h2>No Programs Found</h2>
        <p>Try adjusting your search or filters.</p>
        <button class="clear-btn" @click="clearFilters">Clear All Filters</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explore-page { min-height: 100vh; }

/* Hero */
.explore-hero {
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.12), transparent 24%),
    linear-gradient(135deg, #140f50 0%, #1d1660 46%, #2b2375 100%);
  color: var(--color-white);
  padding: calc(var(--space-3xl) + 12px) var(--space-lg) var(--space-3xl);
}

.hero-inner {
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
}

.hero-eyebrow {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.88);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-inner h1 {
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.hero-inner p {
  font-size: var(--font-size-md);
  opacity: 0.86;
  margin-bottom: var(--space-xl);
}

.hero-search {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  padding: var(--space-sm) var(--space-lg);
  max-width: 560px;
  margin: 0 auto;
  box-shadow: 0 18px 36px rgba(10, 10, 35, 0.18);
}

.hero-search .material-symbols-outlined {
  color: var(--color-text-light);
  font-size: 24px;
  margin-right: var(--space-sm);
}

.hero-search input {
  flex: 1;
  border: none;
  font-size: var(--font-size-md);
  font-family: inherit;
  color: var(--color-text-primary);
  outline: none;
}

/* Content */
.explore-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
}

/* Filters */
.filters-card {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.1fr);
  gap: 20px;
  align-items: end;
  margin-bottom: var(--space-xl);
  padding: 22px 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,247,251,0.98));
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  box-shadow: 0 14px 28px rgba(20, 15, 80, 0.06);
}

.filters-copy h2 {
  margin: 4px 0 10px;
  font-size: 1.45rem;
  color: var(--color-text-primary);
}

.filters-copy p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.filters-eyebrow {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.filters {
  display: flex;
  align-items: flex-end;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-group label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.filter-group select {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid rgba(20, 15, 80, 0.1);
  border-radius: 14px;
  font-size: var(--font-size-sm);
  font-family: inherit;
  min-width: 180px;
  background: var(--color-white);
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid rgba(20, 15, 80, 0.1);
  border-radius: 14px;
  background: var(--color-white);
  font-size: var(--font-size-xs);
  font-family: inherit;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.clear-btn .material-symbols-outlined { font-size: 16px; }

.results-count {
  margin-left: auto;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: 600;
}

/* Program Grid */
.programs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

.program-card {
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 14px 28px rgba(20, 15, 80, 0.06);
}

.program-card:hover {
  border-color: rgba(20, 15, 80, 0.18);
  box-shadow: 0 18px 34px rgba(20, 15, 80, 0.1);
  transform: translateY(-4px);
}

.program-card__media {
  position: relative;
  min-height: 164px;
  background-color: #f0f3fb;
  background-size: cover;
  background-position: center;
}

.program-card__media--fallback {
  background:
    radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 26%),
    linear-gradient(135deg, #140f50 0%, #1e1870 52%, #314191 100%);
}

.program-card__badge {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.program-card__media-fallback {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.program-card__media-code {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.96);
}

.program-card__media-faculty {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.4;
  max-width: 24ch;
}

.program-card__level {
  margin-bottom: var(--space-sm);
}

.program-card > :not(.program-card__media) {
  padding-left: var(--space-lg);
  padding-right: var(--space-lg);
}

.program-card__cta {
  padding-bottom: var(--space-lg);
}

.level-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--border-radius-full);
  font-size: 11px;
  font-weight: 600;
  background: rgba(20, 15, 80, 0.08);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.program-card__code {
  margin-top: 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.5px;
}

.program-card__name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
  line-height: 1.3;
}

.program-card__faculty {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
}

.program-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.program-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid rgba(20, 15, 80, 0.08);
}

.program-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.program-stat .material-symbols-outlined { font-size: 16px; color: var(--color-primary); }

.program-card__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
}

.program-card__cta .material-symbols-outlined { font-size: 18px; }

/* Empty / Loading */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: var(--space-3xl); text-align: center;
}
.empty-state .material-symbols-outlined { font-size: 48px; color: var(--color-text-light); margin-bottom: var(--space-md); }
.empty-state h2 { color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.empty-state p { color: var(--color-text-secondary); margin-bottom: var(--space-lg); }

.loading-state { display: flex; justify-content: center; padding: var(--space-3xl); }
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid var(--color-border);
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) { .programs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 1024px) {
  .filters-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .explore-hero {
    padding: var(--space-2xl) var(--space-md);
  }

  .hero-inner h1 {
    font-size: 2rem;
  }

  .explore-content {
    padding: var(--space-lg) var(--space-md);
  }

  .programs-grid { grid-template-columns: 1fr; }
}
</style>
