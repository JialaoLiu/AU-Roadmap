<script setup>
const sections = [
  {
    id: 'portal',
    title: 'Researcher Portal',
    icon: 'dashboard',
    description: 'The Researcher Portal is your one-stop hub for managing research activities at Adelaide University. Access grant applications, ethics approvals, research data management tools, and compliance resources.',
    features: [
      { title: 'Grant Management', desc: 'Search for funding opportunities, prepare applications, and manage awarded grants through a streamlined online system.', icon: 'payments' },
      { title: 'Ethics & Compliance', desc: 'Submit and track human research ethics applications, animal ethics protocols, and biosafety approvals.', icon: 'policy' },
      { title: 'Research Data Management', desc: 'Tools and guidance for managing, storing, and sharing research data in compliance with national standards.', icon: 'storage' },
      { title: 'Research Outputs', desc: 'Register publications, manage your researcher profile, and track citation metrics and research impact.', icon: 'article' },
    ],
  },
  {
    id: 'graduate-school',
    title: 'Adelaide Graduate Research School',
    icon: 'school',
    description: 'The Adelaide Graduate Research School provides comprehensive support for research higher degree students, from candidature management to thesis submission. We are committed to helping you achieve your research goals.',
    features: [
      { title: 'Candidature Support', desc: 'Guidance on enrolment, milestones, supervision arrangements, and progression through your research degree.', icon: 'person' },
      { title: 'Skills Development', desc: 'Professional development workshops, writing groups, and training programs to build your research and career skills.', icon: 'psychology' },
      { title: 'Thesis & Examination', desc: 'Support through the thesis submission process, examination procedures, and completion requirements.', icon: 'menu_book' },
      { title: 'Scholarships & Funding', desc: 'Information on scholarships, top-up awards, travel grants, and conference funding for research students.', icon: 'card_giftcard' },
    ],
  },
  {
    id: 'tech',
    title: 'Research Technology Support',
    icon: 'computer',
    description: 'Adelaide University provides world-class technology infrastructure and support services to enable cutting-edge research. From high-performance computing to specialised software, our technology team supports researchers across all disciplines.',
    features: [
      { title: 'High-Performance Computing (HPC)', desc: 'Access Phoenix, our HPC cluster, for computationally intensive research including AI/ML, genomics, and climate modelling.', icon: 'memory' },
      { title: 'Research Cloud', desc: 'Flexible cloud computing resources for data analysis, virtual machines, and collaborative research environments.', icon: 'cloud' },
      { title: 'Specialised Software', desc: 'Licensed access to research software including MATLAB, SPSS, NVivo, ArcGIS, and discipline-specific tools.', icon: 'apps' },
      { title: 'Data Storage & Security', desc: 'Secure research data storage solutions with backup, encryption, and access controls to protect sensitive data.', icon: 'security' },
    ],
  },
];
</script>

<template>
  <div class="support-page">
    <div class="support-hero">
      <div class="hero-inner">
        <h1>Research Support</h1>
        <p>Comprehensive resources, tools, and services to support your research journey at Adelaide University.</p>
      </div>
    </div>

    <div class="support-content">
      <section v-for="sec in sections" :key="sec.id" :id="sec.id" class="section">
        <div class="section-header">
          <span class="material-symbols-outlined section-icon">{{ sec.icon }}</span>
          <h2>{{ sec.title }}</h2>
        </div>
        <p class="section-desc">{{ sec.description }}</p>

        <div class="features-grid">
          <div v-for="f in sec.features" :key="f.title" class="feature-card">
            <div class="feature-icon-wrap">
              <span class="material-symbols-outlined">{{ f.icon }}</span>
            </div>
            <div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.support-page { min-height: 100vh; }

.support-hero { background: var(--color-primary); padding: var(--space-3xl) var(--space-lg); }
.hero-inner { max-width: 720px; margin: 0 auto; text-align: center; color: var(--color-white); }
.hero-inner h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--color-white); }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.85; }

.support-content { max-width: 1000px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }

.section { margin-bottom: var(--space-3xl); padding-top: var(--space-lg); }
.section-header { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md); }
.section-icon { font-size: 32px; color: var(--color-primary); }
.section-header h2 { font-size: var(--font-size-2xl); font-weight: 700; }
.section-desc { font-size: var(--font-size-md); color: var(--color-text-secondary); line-height: 1.7; margin-bottom: var(--space-lg); }

.features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md); }
.feature-card {
  display: flex; gap: var(--space-md);
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  transition: all var(--transition-fast);
}
.feature-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }

.feature-icon-wrap {
  flex-shrink: 0; width: 44px; height: 44px;
  background: rgba(20,15,80,0.06); border-radius: var(--border-radius-md);
  display: flex; align-items: center; justify-content: center;
}
.feature-icon-wrap .material-symbols-outlined { font-size: 24px; color: var(--color-primary); }

.feature-card h3 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-xs); }
.feature-card p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; }

@media (max-width: 768px) { .features-grid { grid-template-columns: 1fr; } }
</style>
