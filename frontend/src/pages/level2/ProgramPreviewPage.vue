<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ContentCard from '@/components/common/ContentCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import SummaryCard from '@/components/common/SummaryCard.vue';
import SummaryGrid from '@/components/common/SummaryGrid.vue';
import TabBar from '@/components/common/TabBar.vue';
import { useProgramPreviewData } from '@/composables/useProgramPreviewData';
import {
  formatCurrency,
  getAlumniInitials,
  getCourseBreakdown,
  getCourseYears,
  getLatestOutcome,
  getProgramPreviewHeroStyle,
  groupCoursesByYear,
} from '@/utils/programPreviewDisplay';

const route = useRoute();
const router = useRouter();
const activeTab = ref('overview');
const overviewSection = ref(null);
const {
  loading,
  program,
  courses,
  alumni,
  careers,
  fetchProgramPreviewData,
} = useProgramPreviewData(route);

const courseBreakdown = computed(() => getCourseBreakdown(courses.value));
const coreCourses = computed(() => courseBreakdown.value.coreCourses);
const electiveCourses = computed(() => courseBreakdown.value.electiveCourses);
const totalUnits = computed(() => courseBreakdown.value.totalUnits);
const latestOutcome = computed(() => getLatestOutcome(careers.value));
const courseYears = computed(() => getCourseYears(courses.value));
const coursesByYear = computed(() => groupCoursesByYear(courses.value));
const heroStyle = computed(() => getProgramPreviewHeroStyle(program.value));
const previewTabs = computed(() => [
  { key: 'overview', label: 'Overview' },
  { key: 'courses', label: `Courses (${courses.value.length})` },
  { key: 'careers', label: 'Careers' },
  { key: 'alumni', label: `Alumni (${alumni.value.length})` },
]);

async function openOverview() {
  activeTab.value = 'overview';
  await nextTick();
  overviewSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

onMounted(fetchProgramPreviewData);
</script>

<template>
  <div class="preview-page">
    <LoadingState v-if="loading" />

    <template v-else-if="program">
      <div class="preview-shell">
        <div class="preview-hero" :style="heroStyle">
          <div class="hero-inner">
            <div class="hero-grid">
              <div class="hero-content">
                <div class="hero-meta">
                  <button class="back-btn" @click="router.push('/explore')">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Back to Programs
                  </button>
                  <span class="hero-level">{{ program.level }}</span>
                </div>

                <span class="hero-eyebrow">Program Guide</span>
                <h1>{{ program.name }}</h1>
                <p class="hero-code">{{ program.code }}</p>
                <p class="hero-note">
                  Review the structure, requirements, career outcomes, and alumni pathways connected with this program.
                </p>

                <div class="hero-stats">
                  <div class="hero-stat">
                    <span class="material-symbols-outlined">calendar_today</span>
                    {{ program.duration_years }} years
                  </div>
                  <div v-if="program.atar_requirement" class="hero-stat">
                    <span class="material-symbols-outlined">grade</span>
                    ATAR {{ program.atar_requirement }}
                  </div>
                  <div class="hero-stat">
                    <span class="material-symbols-outlined">menu_book</span>
                    {{ courses.length }} courses
                  </div>
                  <div class="hero-stat">
                    <span class="material-symbols-outlined">school</span>
                    {{ totalUnits }} units
                  </div>
                </div>

                <div class="hero-cta">
                  <button class="cta-btn" @click="router.push('/explore/apply')">
                    Apply Now
                  </button>
                  <button class="hero-link-btn" @click="openOverview">Learn More</button>
                </div>
              </div>

              <div class="hero-panel">
                <span class="hero-panel__eyebrow">Program Snapshot</span>
                <div class="hero-panel__item">
                  <span>Faculty</span>
                  <strong>{{ program.faculty }}</strong>
                </div>
                <div class="hero-panel__item">
                  <span>Study Duration</span>
                  <strong>{{ program.duration_years }} years</strong>
                </div>
                <div v-if="latestOutcome && latestOutcome.employment_rate" class="hero-panel__item">
                  <span>Employment Rate</span>
                  <strong>{{ latestOutcome.employment_rate }}%</strong>
                </div>
                <div v-if="latestOutcome && latestOutcome.median_salary" class="hero-panel__item">
                  <span>Median Salary</span>
                  <strong>{{ formatCurrency(latestOutcome.median_salary) }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SummaryGrid class="summary-grid" variant="auto">
          <SummaryCard variant="plain" value="Faculty" :label="program.faculty" />
          <SummaryCard variant="plain" value="Duration" :label="`${program.duration_years} years`" />
          <SummaryCard v-if="program.atar_requirement" variant="plain" value="ATAR" :label="program.atar_requirement" />
          <SummaryCard v-if="program.fees_domestic" variant="plain" value="Domestic Fees" :label="`${formatCurrency(program.fees_domestic)}/yr`" />
          <SummaryCard v-if="program.fees_international" variant="plain" value="International Fees" :label="`${formatCurrency(program.fees_international)}/yr`" />
          <SummaryCard v-if="latestOutcome && latestOutcome.median_salary" variant="plain" value="Median Salary" :label="formatCurrency(latestOutcome.median_salary)" />
        </SummaryGrid>

        <TabBar v-model="activeTab" :tabs="previewTabs" variant="sticky" />

        <div ref="overviewSection" class="tab-content">
          <div v-if="activeTab === 'overview'" class="overview-tab">
            <div class="overview-grid">
              <div class="overview-main">
                <ContentCard v-if="program.description" as="section" class="section">
                  <span class="section-eyebrow">Overview</span>
                  <h2>About This Program</h2>
                  <p>{{ program.description }}</p>
                </ContentCard>
                <ContentCard v-if="program.entry_requirements" as="section" class="section">
                  <span class="section-eyebrow">Admission</span>
                  <h2>Entry Requirements</h2>
                  <p>{{ program.entry_requirements }}</p>
                </ContentCard>
              </div>

              <aside class="overview-sidebar">
                <ContentCard class="info-card">
                  <span class="section-eyebrow">Program Details</span>
                  <h3>Key Information</h3>
                  <div class="info-row"><span>Faculty</span><strong>{{ program.faculty }}</strong></div>
                  <div class="info-row"><span>Duration</span><strong>{{ program.duration_years }} years</strong></div>
                  <div v-if="program.atar_requirement" class="info-row"><span>ATAR</span><strong>{{ program.atar_requirement }}</strong></div>
                  <div v-if="program.fees_domestic" class="info-row"><span>Domestic Fees</span><strong>{{ formatCurrency(program.fees_domestic) }}/yr</strong></div>
                  <div v-if="program.fees_international" class="info-row"><span>International Fees</span><strong>{{ formatCurrency(program.fees_international) }}/yr</strong></div>
                </ContentCard>

                <ContentCard v-if="latestOutcome" class="info-card info-card--highlight" variant="highlight">
                  <span class="section-eyebrow">Graduate Outcomes</span>
                  <h3>{{ latestOutcome.year }} Snapshot</h3>
                  <div v-if="latestOutcome.employment_rate" class="outcome-stat">
                    <span class="outcome-value">{{ latestOutcome.employment_rate }}%</span>
                    <span class="outcome-label">Employment Rate</span>
                  </div>
                  <div v-if="latestOutcome.median_salary" class="outcome-stat">
                    <span class="outcome-value">{{ formatCurrency(latestOutcome.median_salary) }}</span>
                    <span class="outcome-label">Median Salary</span>
                  </div>
                </ContentCard>

                <ContentCard class="action-card">
                  <span class="section-eyebrow">Next Step</span>
                  <h3>Ready to apply?</h3>
                  <p>Review the application guide and prepare your submission requirements.</p>
                  <button class="apply-btn" @click="router.push('/explore/apply')">
                    <span class="material-symbols-outlined">edit_note</span>
                    How to Apply
                  </button>
                </ContentCard>
              </aside>
            </div>
          </div>

          <div v-if="activeTab === 'courses'" class="courses-tab">
            <ContentCard>
              <div class="tab-section-header">
                <div>
                  <span class="section-eyebrow">Course Structure</span>
                  <h2>Program Courses</h2>
                </div>
                <div class="course-summary">
                  <span class="summary-chip"><strong>{{ coreCourses.length }}</strong> Core</span>
                  <span class="summary-chip"><strong>{{ electiveCourses.length }}</strong> Elective</span>
                  <span class="summary-chip"><strong>{{ totalUnits }}</strong> Total Units</span>
                </div>
              </div>

              <div v-for="year in courseYears" :key="year" class="year-section">
                <h3 class="year-title">Year {{ year }}</h3>
                <div class="course-grid">
                  <div
                    v-for="c in coursesByYear[year]"
                    :key="c.id"
                    class="course-item"
                    :class="c.is_core ? 'course-item--core' : 'course-item--elective'"
                  >
                    <div class="course-item__header">
                      <span class="course-code">{{ c.code }}</span>
                      <span class="course-badge" :class="c.is_core ? '' : 'course-badge--elective'">
                        {{ c.is_core ? 'Core' : 'Elective' }}
                      </span>
                    </div>
                    <h4>{{ c.name }}</h4>
                    <div class="course-meta">
                      <span>{{ c.units }} units</span>
                      <span>Semester {{ c.semester }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ContentCard>
          </div>

          <div v-if="activeTab === 'careers'" class="careers-tab">
            <ContentCard v-if="careers.paths?.length" class="section">
              <span class="section-eyebrow">Career Direction</span>
              <h2>Career Paths</h2>
              <div class="paths-grid">
                <div v-for="p in careers.paths" :key="p.id" class="path-card">
                  <h3>{{ p.job_title }}</h3>
                  <p v-if="p.description">{{ p.description }}</p>
                  <div class="path-meta">
                    <span v-if="p.average_salary">{{ formatCurrency(p.average_salary) }}/yr</span>
                    <span v-if="p.demand_level" class="demand-badge" :class="'demand--' + p.demand_level">
                      {{ p.demand_level }} demand
                    </span>
                    <span v-if="p.industry_sector">{{ p.industry_sector }}</span>
                  </div>
                </div>
              </div>
            </ContentCard>

            <ContentCard v-if="careers.outcomes?.length" class="section">
              <span class="section-eyebrow">Outcomes</span>
              <h2>Graduate Outcomes</h2>
              <div class="outcomes-table-wrap">
                <table class="outcomes-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Employment</th>
                      <th>Median Salary</th>
                      <th>Salary Range</th>
                      <th>Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="o in careers.outcomes" :key="o.id">
                      <td><strong>{{ o.year }}</strong></td>
                      <td>{{ o.employment_rate ? o.employment_rate + '%' : '-' }}</td>
                      <td>{{ formatCurrency(o.median_salary) }}</td>
                      <td>{{ formatCurrency(o.salary_range_low) }} - {{ formatCurrency(o.salary_range_high) }}</td>
                      <td>{{ o.satisfaction_rate ? o.satisfaction_rate + '%' : '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ContentCard>

            <EmptyState
              v-if="!careers.paths?.length && !careers.outcomes?.length"
              icon="info"
              title="Career data unavailable"
              message="Career data is not yet available for this program."
            />
          </div>

          <div v-if="activeTab === 'alumni'" class="alumni-tab">
            <ContentCard v-if="alumni.length">
              <div class="tab-section-header">
                <div>
                  <span class="section-eyebrow">Graduate Network</span>
                  <h2>Alumni</h2>
                </div>
              </div>
              <div class="alumni-grid">
                <div v-for="a in alumni" :key="a.id" class="alumni-card">
                  <div class="alumni-avatar">{{ getAlumniInitials(a) }}</div>
                  <h3>{{ a.first_name }} {{ a.last_name }}</h3>
                  <p class="alumni-role">{{ a.current_role }}</p>
                  <p class="alumni-company">{{ a.current_company }}</p>
                  <span class="alumni-year">Class of {{ a.graduation_year }}</span>
                  <p v-if="a.bio" class="alumni-bio">{{ a.bio }}</p>
                </div>
              </div>
            </ContentCard>
            <EmptyState
              v-else
              icon="info"
              title="No alumni profiles"
              message="No alumni profiles available for this program yet."
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.preview-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(20, 15, 80, 0.06), transparent 34%),
    linear-gradient(180deg, #f7f8fc 0%, #f3f5fb 100%);
}

.preview-shell {
  padding-bottom: var(--space-3xl);
}

.preview-hero {
  background: var(--color-primary);
  color: var(--color-white);
  background-size: cover;
  background-position: center 40%;
  min-height: 34rem;
  padding: var(--space-xl) var(--space-lg) 8.5rem;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(18rem, 0.85fr);
  gap: var(--space-2xl);
  align-items: end;
}

.hero-content {
  max-width: 44rem;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: var(--space-lg);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: var(--color-white);
  padding: var(--space-xs) var(--space-md);
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-family: inherit;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-1px);
}
.back-btn .material-symbols-outlined { font-size: 16px; }

.hero-level {
  display: inline-flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.96);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: var(--space-xs) var(--space-md);
  border-radius: 999px;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  font-weight: 600;
}

.hero-eyebrow {
  display: inline-flex;
  margin-bottom: var(--space-sm);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.74);
}

.preview-hero h1 {
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  font-weight: 700;
  line-height: 1.05;
  margin-bottom: var(--space-xs);
}

.hero-code {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--space-md);
}

.hero-note {
  max-width: 40rem;
  font-size: 1.02rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.84);
  margin-bottom: var(--space-xl);
}

.hero-stats {
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.hero-stat {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.92);
}
.hero-stat .material-symbols-outlined { font-size: 20px; }

.hero-cta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
}

.hero-link-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 1px solid rgba(255, 255, 255, 0.55);
  color: #fff;
  border-radius: 999px;
  padding: var(--space-md) var(--space-xl);
  font-size: 0.95rem;
  font-weight: 600;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.hero-link-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: none;
  background-color: white;
  color: rgb(20, 15, 80);
  border-radius: 999px;
  padding: var(--space-md) var(--space-xl);
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.cta-btn:hover {
  background: var(--color-gray-100);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.hero-panel {
  padding: 1.5rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 48px rgba(10, 12, 38, 0.25);
}

.hero-panel__eyebrow {
  display: inline-flex;
  margin-bottom: 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.hero-panel__item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.hero-panel__item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.hero-panel__item span {
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.68);
}

.hero-panel__item strong {
  font-size: 1.05rem;
  color: #fff;
}

.summary-grid {
  width: calc(100% - 2rem);
  max-width: 1200px;
  margin: -5rem auto 0;
  position: relative;
  z-index: 2;
}

.tab-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl) 1rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(18rem, 0.75fr);
  gap: var(--space-xl);
  align-items: start;
}

.overview-main,
.overview-sidebar,
.careers-tab,
.alumni-tab {
  display: grid;
  gap: var(--space-lg);
}

.section { margin-bottom: var(--space-2xl); }

.section:last-child {
  margin-bottom: 0;
}

.section-eyebrow {
  display: inline-flex;
  margin-bottom: 0.6rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b7394;
}

.section h2,
.content-card h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.section p,
.content-card p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.75;
}

.info-card {
  margin-bottom: 0;
}

.info-card h3,
.action-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
  padding: 0.8rem 0;
  font-size: var(--font-size-sm);
  border-bottom: 1px solid rgba(20, 15, 80, 0.08);
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-row span { color: var(--color-text-secondary); }
.info-row strong { color: var(--color-text-primary); }

.info-card--highlight {
  background: linear-gradient(180deg, rgba(20, 15, 80, 0.05), rgba(49, 65, 145, 0.08));
  border-color: rgba(20, 15, 80, 0.16);
}

.outcome-stat {
  text-align: center;
  margin-bottom: var(--space-md);
}

.outcome-stat:last-child {
  margin-bottom: 0;
}

.outcome-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
}

.outcome-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.action-card p {
  margin-bottom: var(--space-lg);
}

.apply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-md);
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 999px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.apply-btn:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
}

.tab-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.course-summary {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.summary-chip {
  padding: 0.55rem 0.9rem;
  background: rgba(20, 15, 80, 0.06);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.summary-chip strong { color: var(--color-text-primary); }

.year-section { margin-bottom: var(--space-2xl); }

.year-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--space-md);
  display: inline-flex;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(20, 15, 80, 0.08);
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

.course-item {
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  padding: 1rem;
  box-shadow: 0 12px 26px rgba(20, 15, 80, 0.05);
}
.course-item--core { border-left: 4px solid var(--color-primary); }
.course-item--elective { border-left: 4px solid var(--color-accent); }

.course-item__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs); }
.course-code { font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text-secondary); }
.course-badge { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: var(--border-radius-full); background: rgba(20,15,80,0.08); color: var(--color-primary); }
.course-badge--elective { background: rgba(240,171,0,0.15); color: #b38600; }

.course-item h4 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-xs); }
.course-meta { display: flex; gap: var(--space-md); font-size: var(--font-size-xs); color: var(--color-text-light); }

/* Careers */
.paths-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

.path-card {
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  padding: var(--space-lg);
}
.path-card h3 { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-xs); }
.path-card p { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md); line-height: 1.5; }
.path-meta { display: flex; gap: var(--space-md); font-size: var(--font-size-xs); color: var(--color-text-secondary); flex-wrap: wrap; }
.demand-badge { padding: 2px 8px; border-radius: var(--border-radius-full); font-weight: 600; text-transform: capitalize; }
.demand--high { background: rgba(46,125,50,0.1); color: var(--color-success); }
.demand--medium { background: rgba(240,171,0,0.15); color: #b38600; }
.demand--low { background: rgba(211,47,47,0.1); color: var(--color-error); }

.outcomes-table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
}

.outcomes-table { width: 100%; border-collapse: collapse; }
.outcomes-table th {
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-secondary);
  background: rgba(20, 15, 80, 0.05);
  border-bottom: 1px solid rgba(20, 15, 80, 0.08);
}

.outcomes-table td {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  border-bottom: 1px solid rgba(20, 15, 80, 0.08);
  background: rgba(255, 255, 255, 0.92);
}

.alumni-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);
}

.alumni-card {
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 20px;
  padding: var(--space-lg);
  text-align: center;
}
.alumni-avatar {
  width: 56px; height: 56px; border-radius: 50%; margin: 0 auto var(--space-sm);
  display: flex; align-items: center; justify-content: center;
  background: rgba(20,15,80,0.08); color: var(--color-primary);
  font-weight: 700; font-size: var(--font-size-md);
}
.alumni-card h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.alumni-role { font-size: var(--font-size-xs); color: var(--color-text-secondary); }
.alumni-company { font-size: var(--font-size-xs); font-weight: 500; color: var(--color-primary); }
.alumni-year { font-size: 11px; color: var(--color-text-light); }
.alumni-bio { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-sm); line-height: 1.5; }

@media (max-width: 960px) {
  .hero-grid,
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    max-width: 28rem;
  }

  .tab-section-header {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .preview-hero {
    min-height: 28rem;
    padding: var(--space-lg) 1rem 7rem;
  }

  .summary-grid {
    width: calc(100% - 1.5rem);
  }

  .course-grid,
  .paths-grid,
  .alumni-grid {
    grid-template-columns: 1fr;
  }
}
</style>
