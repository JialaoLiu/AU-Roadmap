<script setup>
const stats = [
  { value: '4,000+', label: 'Research Staff & Students', icon: 'groups' },
  { value: 'Top 1%', label: 'World Universities', icon: 'military_tech' },
  { value: '5', label: 'Nobel Laureates', icon: 'emoji_events' },
  { value: '110+', label: 'Rhodes Scholars', icon: 'school' },
  { value: '700+', label: 'Startups Supported', icon: 'rocket_launch' },
  { value: '1,625', label: 'Academic Research Experts', icon: 'science' },
];

const sections = [
  {
    id: 'leadership',
    title: 'Division & Leadership',
    icon: 'account_balance',
    description: 'The Division of Research and Innovation provides strategic leadership and support for research across the University. Our leadership team drives research excellence, industry partnerships, and innovation initiatives.',
    items: [
      { title: 'Vice-Chancellor & President', desc: 'Provides overall strategic direction for the University\'s research agenda and global engagement.' },
      { title: 'Deputy Vice-Chancellor (Research & Innovation)', desc: 'Oversees the Division of Research and Innovation, managing research strategy, partnerships, and commercialisation.' },
      { title: 'Pro Vice-Chancellor (Research Operations)', desc: 'Responsible for research integrity, ethics, compliance, and operational support for researchers.' },
      { title: 'Pro Vice-Chancellor (Research Partnerships)', desc: 'Drives industry engagement, collaborative research programs, and knowledge transfer activities.' },
    ],
  },
  {
    id: 'performance',
    title: 'Our Performance',
    icon: 'trending_up',
    description: 'Adelaide University is consistently ranked in the top 1% of the world\'s universities and is a proud member of the Group of Eight — Australia\'s leading research-intensive universities.',
    rankings: [
      { source: 'Times Higher Education', rank: 'Top 100', year: '2025' },
      { source: 'QS World University Rankings', rank: 'Top 100', year: '2025' },
      { source: 'Academic Ranking of World Universities (ARWU)', rank: 'Top 100', year: '2024' },
    ],
    era: [
      { rating: '5 — Well above world standard', count2018: 41, count2015: 35, count2012: 18 },
      { rating: '4 — Above world standard', count2018: 16, count2015: 20, count2012: 21 },
      { rating: '3 — At world standard', count2018: 10, count2015: 11, count2012: 21 },
    ],
  },
  {
    id: 'researchers',
    title: 'Find A Researcher',
    icon: 'person_search',
    description: 'Connect with our world-leading researchers across a wide range of disciplines. Adelaide University employs over 1,625 academic research experts and supports more than 2,340 research students.',
    areas: [
      'Agricultural & Biological Sciences', 'Arts & Humanities', 'Biochemistry & Molecular Biology',
      'Business & Economics', 'Computer Science & AI', 'Earth & Environmental Sciences',
      'Engineering & Technology', 'Health & Medical Sciences', 'Law & Social Sciences',
      'Mathematical Sciences', 'Physics & Astronomy', 'Wine & Food Sciences',
    ],
  },
  {
    id: 'institutes',
    title: 'Research Institutes',
    icon: 'domain',
    description: 'Our research institutes bring together approximately 1,200 staff and students in a collaborative research community. Each institute addresses significant global challenges through interdisciplinary research.',
    link: { text: 'View All Institutes', to: '/research/institutes' },
  },
  {
    id: 'centres',
    title: 'Research Centres',
    icon: 'hub',
    description: 'Adelaide University hosts numerous research centres that provide focused expertise in specific disciplines. These centres attract funding, foster collaboration, and deliver research outcomes with real-world impact.',
    centres: [
      'Centre for Automotive Safety Research', 'Centre for Energy Technology', 'Centre for Global Food & Resources',
      'Centre for Housing, Urban & Regional Planning', 'Centre for Music, Language & Brain', 'Centre for Nanoscale Science & Technology',
    ],
  },
  {
    id: 'facilities',
    title: 'Research Facilities & Precincts',
    icon: 'precision_manufacturing',
    description: 'Adelaide University provides cutting-edge research facilities and services across our campuses, supporting researchers with state-of-the-art equipment, laboratories, and collaborative spaces.',
    facilities: [
      { name: 'Adelaide Microscopy', desc: 'Advanced electron and optical microscopy facilities for materials, biological, and geological research.' },
      { name: 'Thebarton Campus', desc: 'Dedicated research precinct housing defence, cybersecurity, and engineering research laboratories.' },
      { name: 'Waite Campus', desc: 'Australia\'s premier agricultural research precinct with plant genomics, wine science, and food technology facilities.' },
      { name: 'South Australian Health & Medical Research Institute (SAHMRI)', desc: 'Collaborative medical research facility adjacent to the Royal Adelaide Hospital.' },
    ],
  },
];
</script>

<template>
  <div class="research-page">
    <div class="research-hero">
      <div class="hero-inner">
        <h1>Research & Innovation</h1>
        <p>More than 4,000 research staff and students working together, supported by modern facilities and a proud tradition of groundbreaking discoveries — from x-ray crystallography and penicillin to the Olympic torch relay.</p>
        <div class="hero-badges">
          <span class="hero-badge">Group of Eight</span>
          <span class="hero-badge">Top 100 Worldwide</span>
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stats-inner">
        <div v-for="s in stats" :key="s.label" class="stat-item">
          <span class="material-symbols-outlined stat-icon">{{ s.icon }}</span>
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <div class="research-content">
      <!-- Sections -->
      <section v-for="sec in sections" :key="sec.id" :id="sec.id" class="content-section">
        <div class="section-header">
          <span class="material-symbols-outlined section-icon">{{ sec.icon }}</span>
          <h2>{{ sec.title }}</h2>
        </div>
        <p class="section-desc">{{ sec.description }}</p>

        <!-- Leadership items -->
        <div v-if="sec.items" class="card-grid">
          <div v-for="item in sec.items" :key="item.title" class="info-card">
            <span class="material-symbols-outlined card-icon">person</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>

        <!-- Performance rankings -->
        <template v-if="sec.rankings">
          <div class="rankings-grid">
            <div v-for="r in sec.rankings" :key="r.source" class="ranking-card">
              <span class="ranking-rank">{{ r.rank }}</span>
              <span class="ranking-source">{{ r.source }}</span>
              <span class="ranking-year">{{ r.year }}</span>
            </div>
          </div>
          <div class="era-section">
            <h3>Excellence in Research Australia (ERA)</h3>
            <table class="era-table">
              <thead>
                <tr><th>Rating</th><th>2018</th><th>2015</th><th>2012</th></tr>
              </thead>
              <tbody>
                <tr v-for="e in sec.era" :key="e.rating">
                  <td>{{ e.rating }}</td>
                  <td><strong>{{ e.count2018 }}</strong></td>
                  <td>{{ e.count2015 }}</td>
                  <td>{{ e.count2012 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <!-- Research areas -->
        <div v-if="sec.areas" class="areas-grid">
          <span v-for="area in sec.areas" :key="area" class="area-chip">{{ area }}</span>
        </div>

        <!-- Link to institutes page -->
        <RouterLink v-if="sec.link" :to="sec.link.to" class="section-link">
          {{ sec.link.text }}
          <span class="material-symbols-outlined">arrow_forward</span>
        </RouterLink>

        <!-- Centres list -->
        <div v-if="sec.centres" class="centres-list">
          <div v-for="c in sec.centres" :key="c" class="centre-chip">
            <span class="material-symbols-outlined">science</span>
            {{ c }}
          </div>
        </div>

        <!-- Facilities -->
        <div v-if="sec.facilities" class="card-grid">
          <div v-for="f in sec.facilities" :key="f.name" class="info-card">
            <span class="material-symbols-outlined card-icon">location_city</span>
            <h3>{{ f.name }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.research-page { min-height: 100vh; }

.research-hero {
  background: var(--color-primary);
  padding: var(--space-3xl) var(--space-lg);
}
.hero-inner { max-width: 800px; margin: 0 auto; text-align: center; color: var(--color-white); }
.hero-inner h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: var(--space-md); color: var(--color-white); }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.85; line-height: 1.7; margin-bottom: var(--space-lg); }

.hero-badges { display: flex; gap: var(--space-sm); justify-content: center; flex-wrap: wrap; }
.hero-badge {
  padding: var(--space-xs) var(--space-md);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm); font-weight: 500; color: var(--color-white);
}

/* Stats */
.stats-bar { background: var(--color-gray-50); border-bottom: 1px solid var(--color-border); }
.stats-inner {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(6, 1fr);
  padding: var(--space-lg) var(--space-md);
}
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
.stat-icon { font-size: 24px; color: var(--color-primary); }
.stat-value { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary); }
.stat-label { font-size: var(--font-size-xs); color: var(--color-text-light); }

/* Content */
.research-content { max-width: 1000px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }

.content-section {
  margin-bottom: var(--space-3xl);
  padding-top: var(--space-lg);
}
.section-header { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md); }
.section-icon { font-size: 32px; color: var(--color-primary); }
.section-header h2 { font-size: var(--font-size-2xl); font-weight: 700; }
.section-desc { font-size: var(--font-size-md); color: var(--color-text-secondary); line-height: 1.7; margin-bottom: var(--space-lg); }

/* Card Grid */
.card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md); }
.info-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  transition: all var(--transition-fast);
}
.info-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }
.card-icon { font-size: 28px; color: var(--color-primary); margin-bottom: var(--space-sm); display: block; }
.info-card h3 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-xs); }
.info-card p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; }

/* Rankings */
.rankings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin-bottom: var(--space-xl); }
.ranking-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  text-align: center; display: flex; flex-direction: column; gap: var(--space-xs);
}
.ranking-rank { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary); }
.ranking-source { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.ranking-year { font-size: var(--font-size-xs); color: var(--color-text-light); }

/* ERA Table */
.era-section { margin-top: var(--space-lg); }
.era-section h3 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-md); }
.era-table {
  width: 100%; border-collapse: collapse;
  background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--border-radius-md); overflow: hidden;
}
.era-table th, .era-table td { padding: var(--space-sm) var(--space-md); text-align: left; font-size: var(--font-size-sm); border-bottom: 1px solid var(--color-border); }
.era-table th { background: var(--color-gray-50); font-weight: 600; color: var(--color-text-secondary); }
.era-table td strong { color: var(--color-primary); }

/* Areas */
.areas-grid { display: flex; flex-wrap: wrap; gap: var(--space-sm); }
.area-chip {
  padding: var(--space-xs) var(--space-md);
  background: rgba(20,15,80,0.06); color: var(--color-primary);
  border-radius: var(--border-radius-full); font-size: var(--font-size-sm); font-weight: 500;
}

/* Section Link */
.section-link {
  display: inline-flex; align-items: center; gap: var(--space-sm);
  font-size: var(--font-size-md); font-weight: 600; color: var(--color-primary);
  margin-top: var(--space-md);
}
.section-link:hover { text-decoration: underline; }
.section-link .material-symbols-outlined { font-size: 20px; }

/* Centres */
.centres-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-sm); }
.centre-chip {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md); font-size: var(--font-size-sm);
}
.centre-chip .material-symbols-outlined { font-size: 18px; color: var(--color-primary); }

@media (max-width: 768px) {
  .stats-inner { grid-template-columns: repeat(3, 1fr); gap: var(--space-md); }
  .card-grid, .rankings-grid, .centres-list { grid-template-columns: 1fr; }
}
</style>
