<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { getProgramList, getFeaturedAlumni } from '@/api/programs';

const programs = ref([]);
const alumni = ref([]);

async function fetchData() {
  try {
    const [programRes, alumniRes] = await Promise.all([
      getProgramList({ limit: 4 }),
      getFeaturedAlumni(),
    ]);
    programs.value = programRes.data.data;
    alumni.value = alumniRes.data.data;
  } catch (err) {
    console.error('Failed to load homepage data:', err);
  }
}

function getLevelLabel(level) {
  const labels = { undergraduate: 'Undergraduate', postgraduate: 'Postgraduate', research: 'Research' };
  return labels[level] || level;
}

function getDurationText(years) {
  const y = parseFloat(years);
  return y === 1 ? '1 year' : `${y} years`;
}

function getInitials(a) {
  return (a.first_name?.[0] || '') + (a.last_name?.[0] || '');
}

onMounted(fetchData);
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <h1>Find Your Path at<br/>Adelaide University</h1>
        <p class="hero-subtitle">
          Explore programs, plan your studies, and discover career opportunities
          with our interactive Program Roadmap.
        </p>
        <div class="hero-actions">
          <RouterLink to="/explore" class="btn btn-hero-primary">
            <span class="material-symbols-outlined">explore</span>
            Find Your Degree
          </RouterLink>
          <RouterLink to="/student/roadmap" class="btn btn-hero-secondary">
            <span class="material-symbols-outlined">route</span>
            View My Roadmap
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Quick Access Cards -->
    <section class="quick-access">
      <div class="container">
        <div class="access-grid">
          <RouterLink to="/student" class="access-card">
            <div class="access-icon-wrap">
              <span class="material-symbols-outlined">school</span>
            </div>
            <div class="access-text">
              <h3>Current Students</h3>
              <p>Access your program roadmap, industry connections, and student resources.</p>
            </div>
            <span class="material-symbols-outlined access-arrow">arrow_forward</span>
          </RouterLink>

          <RouterLink to="/explore" class="access-card">
            <div class="access-icon-wrap">
              <span class="material-symbols-outlined">search</span>
            </div>
            <div class="access-text">
              <h3>Prospective Students</h3>
              <p>Explore programs, career outcomes, and campus life at Adelaide University.</p>
            </div>
            <span class="material-symbols-outlined access-arrow">arrow_forward</span>
          </RouterLink>

          <RouterLink to="/explore/careers" class="access-card">
            <div class="access-icon-wrap">
              <span class="material-symbols-outlined">work</span>
            </div>
            <div class="access-text">
              <h3>Career Outcomes</h3>
              <p>Discover graduate employment rates, salary data, and career pathways.</p>
            </div>
            <span class="material-symbols-outlined access-arrow">arrow_forward</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Featured Programs -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2>Featured Programs</h2>
          <p class="section-subtitle">Discover our most popular degree programs</p>
        </div>
        <div class="programs-grid">
          <RouterLink
            v-for="p in programs"
            :key="p.id"
            :to="`/explore/programs/${p.id}`"
            class="program-card"
          >
            <div class="program-card-img"></div>
            <div class="program-card-body">
              <span class="program-tag">{{ getLevelLabel(p.level) }}</span>
              <h4>{{ p.name }}</h4>
              <p>{{ p.description?.slice(0, 100) }}{{ p.description?.length > 100 ? '...' : '' }}</p>
              <div class="program-meta">
                <span><span class="material-symbols-outlined">schedule</span> {{ getDurationText(p.duration_years) }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
        <div class="section-cta">
          <RouterLink to="/explore" class="btn btn-primary">
            View All Programs
            <span class="material-symbols-outlined">arrow_forward</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">92%</span>
            <span class="stat-label">Graduate Employment Rate</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">$75K</span>
            <span class="stat-label">Median Starting Salary</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">Industry Partners</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">100+</span>
            <span class="stat-label">Student Clubs</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Alumni Spotlight -->
    <section class="alumni-section">
      <div class="container">
        <div class="section-header">
          <h2>Alumni Spotlight</h2>
          <p class="section-subtitle">Hear from our graduates about their journeys</p>
        </div>
        <div class="alumni-grid">
          <div class="alumni-card" v-for="a in alumni" :key="a.id">
            <div class="alumni-avatar" v-if="a.photo_url">
              <img :src="a.photo_url" :alt="a.first_name" />
            </div>
            <div class="alumni-avatar alumni-avatar--initials" v-else>
              {{ getInitials(a) }}
            </div>
            <blockquote>"{{ a.success_story?.slice(0, 150) }}{{ a.success_story?.length > 150 ? '...' : '' }}"</blockquote>
            <div class="alumni-info">
              <strong>{{ a.first_name }} {{ a.last_name }}</strong>
              <span>{{ a.current_role }} at {{ a.current_company }}</span>
              <span class="alumni-year">Class of {{ a.graduation_year }}</span>
            </div>
          </div>
        </div>
        <div class="section-cta">
          <RouterLink to="/student/alumni" class="btn btn-secondary">
            Meet More Alumni
            <span class="material-symbols-outlined">arrow_forward</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ==========================================
   HERO
   ========================================== */
.hero {
  position: relative;
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-3xl) 0 80px;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-primary) 100%);
  opacity: 0.95;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero h1 {
  color: var(--color-white);
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: var(--space-md);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.85);
  max-width: 560px;
  margin: 0 auto var(--space-xl);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-white);
  color: var(--color-primary);
  padding: 14px 28px;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: var(--font-size-md);
  transition: all var(--transition-fast);
}

.btn-hero-primary:hover {
  background: var(--color-gray-100);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: transparent;
  color: var(--color-white);
  padding: 14px 28px;
  border-radius: var(--border-radius-md);
  border: 2px solid rgba(255, 255, 255, 0.4);
  font-weight: 600;
  font-size: var(--font-size-md);
  transition: all var(--transition-fast);
}

.btn-hero-secondary:hover {
  border-color: var(--color-white);
  background: rgba(255, 255, 255, 0.1);
}

/* ==========================================
   QUICK ACCESS CARDS
   ========================================== */
.quick-access {
  padding: var(--space-2xl) 0;
  margin-top: -48px;
  position: relative;
  z-index: 2;
}

.access-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

.access-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: var(--color-white);
  padding: var(--space-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border);
}

.access-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
  border-color: var(--color-primary);
}

.access-icon-wrap {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  background: rgba(20, 15, 80, 0.08);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.access-icon-wrap .material-symbols-outlined {
  font-size: 28px;
  color: var(--color-primary);
}

.access-text {
  flex: 1;
}

.access-text h3 {
  font-size: var(--font-size-md);
  margin-bottom: 4px;
}

.access-text p {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.access-arrow {
  color: var(--color-text-light);
  font-size: 20px;
  transition: transform var(--transition-fast);
}

.access-card:hover .access-arrow {
  transform: translateX(4px);
  color: var(--color-primary);
}

/* ==========================================
   FEATURED PROGRAMS
   ========================================== */
.featured-section {
  padding: var(--space-2xl) 0 var(--space-3xl);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.section-header h2 {
  margin-bottom: var(--space-xs);
}

.section-subtitle {
  color: var(--color-text-secondary);
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.program-card {
  display: block;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  color: inherit;
}

.program-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.program-card-img {
  height: 160px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
}

.program-card-body {
  padding: var(--space-md);
}

.program-tag {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(20, 15, 80, 0.08);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: 500;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-sm);
}

.program-card-body h4 {
  margin-bottom: var(--space-xs);
  font-size: var(--font-size-md);
}

.program-card-body p {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: 1.4;
  margin-bottom: var(--space-md);
}

.program-meta {
  display: flex;
  gap: var(--space-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.program-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.program-meta .material-symbols-outlined {
  font-size: 16px;
}

.section-cta {
  text-align: center;
  margin-top: var(--space-xl);
}

/* ==========================================
   STATS
   ========================================== */
.stats-section {
  background: var(--color-primary);
  padding: var(--space-2xl) 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: var(--space-xs);
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
}

/* ==========================================
   ALUMNI SPOTLIGHT
   ========================================== */
.alumni-section {
  padding: var(--space-3xl) 0;
  background: var(--color-bg-secondary);
}

.alumni-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

.alumni-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  text-align: center;
}

.alumni-avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--border-radius-full);
  background: var(--color-gray-200);
  margin: 0 auto var(--space-md);
  overflow: hidden;
}

.alumni-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.alumni-avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 15, 80, 0.08);
  color: var(--color-primary);
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.alumni-card blockquote {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-style: italic;
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.alumni-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alumni-info strong {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.alumni-info span {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.alumni-year {
  color: var(--color-primary) !important;
  font-weight: 500;
}

/* ==========================================
   RESPONSIVE
   ========================================== */
@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .hero-actions { flex-direction: column; align-items: center; }
  .access-grid { grid-template-columns: 1fr; }
  .programs-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-xl); }
  .alumni-grid { grid-template-columns: 1fr; }
  .quick-access { margin-top: 0; }
}

@media (max-width: 480px) {
  .programs-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
