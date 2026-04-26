<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProgramDetail, getProgramCourses, getProgramAlumni, getProgramCareers } from '@/api/programs';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const program = ref(null);
const courses = ref([]);
const alumni = ref([]);
const careers = ref({ outcomes: [], paths: [] });
const activeTab = ref('overview');

async function fetchData() {
  try {
    const id = route.params.id;
    const [progRes, coursesRes, alumniRes, careersRes] = await Promise.all([
      getProgramDetail(id),
      getProgramCourses(id),
      getProgramAlumni(id),
      getProgramCareers(id),
    ]);
    program.value = progRes.data.data;
    courses.value = coursesRes.data.data;
    alumni.value = alumniRes.data.data;
    careers.value = careersRes.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const coreCourses = computed(() => courses.value.filter(c => c.is_core));
const electiveCourses = computed(() => courses.value.filter(c => !c.is_core));
const totalUnits = computed(() => courses.value.reduce((sum, c) => sum + (c.units || 0), 0));
const latestOutcome = computed(() => careers.value.outcomes?.[0]);

function formatCurrency(val) {
  if (!val) return '-';
  return '$' + Number(val).toLocaleString();
}

onMounted(fetchData);
</script>

<template>
  <div class="preview-page">
    <div v-if="loading" class="loading-state"><div class="loading-spinner"></div></div>

    <template v-else-if="program">
      <!-- Hero Banner -->
      <div class="preview-hero" :style="{ backgroundImage: program.banner_url
        ? `linear-gradient(90deg, rgba(20, 15, 80, 0.75) 0%, rgba(0,0,0,0) 100%), url(${program.banner_url})`
        : `linear-gradient(135deg, rgba(20, 15, 80, 1) 0%, rgba(30, 24, 112, 1) 100%)` }">
        <div class="hero-inner">
          <div class="hero-meta">
            <button class="back-btn" @click="router.push('/explore')">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Programs
          </button>
          <span class="hero-level">{{ program.level }}</span>
          </div>

          <h1>{{ program.name }}</h1>
          <p class="hero-code">{{ program.code }}</p>
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
            <a href="" >Learn More</a>

          </div>
        </div>
      </div>

      <!-- info card -->
       <div class="info-card-container">
        <div class="info-card-left">
        
                <div class="info-col"><span>Faculty</span><strong>{{ program.faculty }}</strong></div>
                <div class="info-col"><span>Duration</span><strong>{{ program.duration_years }} years</strong></div>
                <div v-if="program.atar_requirement" class="info-col"><span>ATAR</span><strong>{{ program.atar_requirement }}</strong></div>
        </div>

        <div class="info-card-middle">
          <div v-if="program.fees_domestic" class="info-col"><span>Domestic Fees</span><strong>{{ formatCurrency(program.fees_domestic) }}/yr</strong></div>
          <div v-if="program.fees_international" class="info-col"><span>International Fees</span><strong>{{ formatCurrency(program.fees_international) }}/yr</strong></div>
        </div>

        <div class = "info-card-right">
          <div v-if="latestOutcome && latestOutcome.employment_rate" class="info-col">
              <span>Employment Rate</span>
                  <strong>{{ latestOutcome.employment_rate }}%</strong>
          </div>
           <div v-if="latestOutcome && latestOutcome.median_salary" class="info-col">
                  <span>Median Salary</span>
                  <strong>{{ formatCurrency(latestOutcome.median_salary) }}</strong>

                </div>
        </div>

       
        

      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tabs">
          <button :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">Overview</button>
          <button :class="{ active: activeTab === 'courses' }" @click="activeTab = 'courses'">Courses ({{ courses.length }})</button>
          <button :class="{ active: activeTab === 'careers' }" @click="activeTab = 'careers'">Careers</button>
          <button :class="{ active: activeTab === 'alumni' }" @click="activeTab = 'alumni'">Alumni ({{ alumni.length }})</button>
        </div>
      </div>

      <div class="tab-content">
        <!-- Overview -->
        <div v-if="activeTab === 'overview'" class="overview-tab">
          <div class="overview-grid">
            <div class="overview-main">
              <div v-if="program.description" class="section">
                <h2>About This Program</h2>
                <p>{{ program.description }}</p>
              </div>
              <div v-if="program.entry_requirements" class="section">
                <h2>Entry Requirements</h2>
                <p>{{ program.entry_requirements }}</p>
              </div>
            </div>
            <!-- <div class="overview-sidebar">
              <div class="info-card">
                <h3>Key Information</h3>
                <div class="info-row"><span>Faculty</span><strong>{{ program.faculty }}</strong></div>
                <div class="info-row"><span>Duration</span><strong>{{ program.duration_years }} years</strong></div>
                <div v-if="program.atar_requirement" class="info-row"><span>ATAR</span><strong>{{ program.atar_requirement }}</strong></div>
                <div v-if="program.fees_domestic" class="info-row"><span>Domestic Fees</span><strong>{{ formatCurrency(program.fees_domestic) }}/yr</strong></div>
                <div v-if="program.fees_international" class="info-row"><span>International Fees</span><strong>{{ formatCurrency(program.fees_international) }}/yr</strong></div>
              </div>
              <div v-if="latestOutcome" class="info-card info-card--highlight">
                <h3>Graduate Outcomes {{ latestOutcome.year }}</h3>
                <div v-if="latestOutcome.employment_rate" class="outcome-stat">
                  <span class="outcome-value">{{ latestOutcome.employment_rate }}%</span>
                  <span class="outcome-label">Employment Rate</span>
                </div>
                <div v-if="latestOutcome.median_salary" class="outcome-stat">
                  <span class="outcome-value">{{ formatCurrency(latestOutcome.median_salary) }}</span>
                  <span class="outcome-label">Median Salary</span>
                </div>
              </div>
              <button class="apply-btn" @click="router.push('/explore/apply')">
                <span class="material-symbols-outlined">edit_note</span>
                How to Apply
              </button>
            </div> -->
          </div>
        </div>

    
        <!-- Courses -->
        <div v-if="activeTab === 'courses'" class="courses-tab">
          <div class="course-summary">
            <span class="summary-chip"><strong>{{ coreCourses.length }}</strong> Core</span>
            <span class="summary-chip"><strong>{{ electiveCourses.length }}</strong> Elective</span>
            <span class="summary-chip"><strong>{{ totalUnits }}</strong> Total Units</span>
          </div>
          <div v-for="year in [...new Set(courses.map(c => c.year_level))].sort()" :key="year" class="year-section">
            <h3 class="year-title">Year {{ year }}</h3>
            <div class="course-grid">
              <div
                v-for="c in courses.filter(co => co.year_level === year)"
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
        </div>

        <!-- Careers -->
        <div v-if="activeTab === 'careers'" class="careers-tab">
          <div v-if="careers.paths?.length" class="section">
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
          </div>
          <div v-if="careers.outcomes?.length" class="section">
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
          </div>
          <div v-if="!careers.paths?.length && !careers.outcomes?.length" class="empty-msg">
            <span class="material-symbols-outlined">info</span>
            Career data is not yet available for this program.
          </div>
        </div>

        <!-- Alumni -->
        <div v-if="activeTab === 'alumni'" class="alumni-tab">
          <div v-if="alumni.length" class="alumni-grid">
            <div v-for="a in alumni" :key="a.id" class="alumni-card">
              <div class="alumni-avatar">{{ (a.first_name?.[0] || '') + (a.last_name?.[0] || '') }}</div>
              <h3>{{ a.first_name }} {{ a.last_name }}</h3>
              <p class="alumni-role">{{ a.current_role }}</p>
              <p class="alumni-company">{{ a.current_company }}</p>
              <span class="alumni-year">Class of {{ a.graduation_year }}</span>
              <p v-if="a.bio" class="alumni-bio">{{ a.bio }}</p>
            </div>
          </div>
          <div v-else class="empty-msg">
            <span class="material-symbols-outlined">info</span>
            No alumni profiles available for this program yet.
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.preview-page { min-height: 100vh; }

/* Hero */
.preview-hero {
  background: var(--color-primary);
  color: var(--color-white);
  background-size: cover;
  background-position:center 40%;
  height:80vh;

  padding: var(--space-xl) var(--space-lg) var(--space-2xl);
}

.hero-inner { max-width: 1200px; margin: 0 auto; }
.hero-meta {
  display:flex;
  justify-items: center;
  gap:16px;
}

.back-btn {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(255,255,255,0.15); border: none; color: var(--color-white);
  padding: var(--space-xs) var(--space-md); border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs); font-family: inherit; cursor: pointer;
  margin-bottom: var(--space-lg); transition: background var(--transition-fast);
}
.back-btn:hover { background: rgba(255,255,255,0.25); }
.back-btn .material-symbols-outlined { font-size: 16px; }

.hero-level {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(255,255,255,0.15); border: none; color: var(--color-white);
   padding: var(--space-xs) var(--space-md); border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs); font-family: inherit; cursor: pointer;
  margin-bottom: var(--space-lg); transition: background var(--transition-fast);
  text-transform: uppercase;
  font-weight: 600;
}

.preview-hero h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-xs); }
.hero-code { opacity: 0.7; font-size: var(--font-size-md); margin-bottom: var(--space-lg); }

.hero-stats { display: flex; gap: var(--space-xl); flex-wrap: wrap; }
.hero-stat { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--font-size-sm); opacity: 0.9; }
.hero-stat .material-symbols-outlined { font-size: 20px; }

.hero-cta {
  display: flex;
  align-items: center;
  gap:var(--space-2xl);
  margin-top: var(--space-3xl);

}

.hero-cta a{
  display: inline-flex;
  align-items: center;
  line-height: 1;
  border: 1px solid #fff;
  color: #ffff;
  border-radius: var(--border-radius-md);
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-md);
  font-weight: 600;
}

.hero-cta a:hover {
  border-color: var(--color-white);
  background: rgba(255, 255, 255, 0.1);
}


.cta-btn {
  line-height: 1;
  background-color:white;
  color: rgb(20, 15, 80);
  border-radius: var(--border-radius-md);
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-md);
  font-weight: 600;
}

.cta-btn:hover {
  background: var(--color-gray-100);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}


/* Info cards */ 
.info-card-container{
  background: var(--color-white);
  margin: 0 auto;
  width:100%;
  max-width:var(--max-content-width);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  z-index: 999;
  box-shadow:  var(--shadow-xl);
  transform: translateY(-64px);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl) var(--space-2xl);
  text-align: center;


}

.info-card-container span {
  color:var(#1e1870);
  margin-bottom: var(--space-xs);
}

.info-col { display: flex; flex-direction:column; justify-content: space-between; padding: var(--space-xs) 0; font-size: var(--font-size-sm); }

/* Tabs */
.tabs-container {
  background: var(--color-white); border-bottom: 2px solid var(--color-border);
  position: sticky; top: 0; z-index: 10;
}

.tabs {
  display: flex; gap: var(--space-sm); max-width: 1200px;
  margin: 0 auto; padding: 0 var(--space-lg);
}

.tabs button {
  padding: var(--space-md) var(--space-lg); border: none; background: none;
  font-size: var(--font-size-sm); font-weight: 500; font-family: inherit;
  color: var(--color-text-light); cursor: pointer;
  border-bottom: 2px solid transparent; margin-bottom: -2px;
  transition: all var(--transition-fast);
}
.tabs button:hover { color: var(--color-text-primary); }
.tabs button.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }

.tab-content { max-width: 1200px; margin: 0 auto; padding: var(--space-xl) var(--space-lg); }

/* Overview */
/* .overview-grid { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-2xl); } */

.section { margin-bottom: var(--space-2xl); }
.section h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-md); }
.section p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.7; }

.info-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg); margin-bottom: var(--space-md);
}
.info-card h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-md); }
.info-row { display: flex; justify-content: space-between; padding: var(--space-xs) 0; font-size: var(--font-size-sm); border-bottom: 1px solid var(--color-border); }
.info-row:last-child { border-bottom: none; }
.info-row span { color: var(--color-text-secondary); }
.info-row strong { color: var(--color-text-primary); }

.info-card--highlight { background: rgba(20,15,80,0.03); border-color: var(--color-primary); }
.outcome-stat { text-align: center; margin-bottom: var(--space-sm); }
.outcome-value { display: block; font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary); }
.outcome-label { font-size: var(--font-size-xs); color: var(--color-text-light); }

.apply-btn {
  display: flex; align-items: center; justify-content: center; gap: var(--space-sm);
  width: 100%; padding: var(--space-md);
  background: var(--color-primary); color: var(--color-white);
  border: none; border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 600; font-family: inherit;
  cursor: pointer; transition: background var(--transition-fast);
}
.apply-btn:hover { background: var(--color-primary-light); }

/* Courses */
.course-summary { display: flex; gap: var(--space-md); margin-bottom: var(--space-xl); }
.summary-chip { padding: var(--space-xs) var(--space-md); background: var(--color-bg-secondary); border-radius: var(--border-radius-full); font-size: var(--font-size-xs); color: var(--color-text-secondary); }
.summary-chip strong { color: var(--color-text-primary); }

.year-section { margin-bottom: var(--space-2xl); }
.year-title { font-size: var(--font-size-md); font-weight: 600; color: var(--color-primary); margin-bottom: var(--space-md); padding-bottom: var(--space-xs); border-bottom: 2px solid var(--color-primary); display: inline-block; }

.course-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md); }

.course-item {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md); padding: var(--space-md);
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
.paths-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md); }
.path-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--border-radius-md); padding: var(--space-lg); }
.path-card h3 { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-xs); }
.path-card p { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md); line-height: 1.5; }
.path-meta { display: flex; gap: var(--space-md); font-size: var(--font-size-xs); color: var(--color-text-secondary); flex-wrap: wrap; }
.demand-badge { padding: 2px 8px; border-radius: var(--border-radius-full); font-weight: 600; text-transform: capitalize; }
.demand--high { background: rgba(46,125,50,0.1); color: var(--color-success); }
.demand--medium { background: rgba(240,171,0,0.15); color: #b38600; }
.demand--low { background: rgba(211,47,47,0.1); color: var(--color-error); }

.outcomes-table-wrap { overflow-x: auto; }
.outcomes-table { width: 100%; border-collapse: collapse; }
.outcomes-table th { text-align: left; padding: var(--space-sm) var(--space-md); font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text-secondary); background: var(--color-bg-secondary); border-bottom: 1px solid var(--color-border); }
.outcomes-table td { padding: var(--space-sm) var(--space-md); font-size: var(--font-size-sm); border-bottom: 1px solid var(--color-border); }

/* Alumni */
.alumni-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); }
.alumni-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md); padding: var(--space-lg); text-align: center;
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

.empty-msg { display: flex; align-items: center; gap: var(--space-sm); color: var(--color-text-light); font-size: var(--font-size-sm); padding: var(--space-xl); }
.empty-msg .material-symbols-outlined { font-size: 20px; }

.loading-state { display: flex; justify-content: center; padding: var(--space-3xl); }
.loading-spinner { width: 40px; height: 40px; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .overview-grid { grid-template-columns: 1fr; }
  .course-grid, .paths-grid, .alumni-grid { grid-template-columns: 1fr; }
}
</style>
