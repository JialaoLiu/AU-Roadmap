<script setup>
const sections = [
  {
    id: 'partner',
    title: 'Partner With Us',
    icon: 'handshake',
    description: 'Adelaide University partners with industry, government, and community organisations to create real-world impact. Our researchers work collaboratively to solve complex problems and drive innovation.',
    items: [
      { title: 'Industry Research Partnerships', desc: 'Collaborate with our researchers on joint projects, from fundamental research to applied solutions. We offer flexible partnership models to suit your needs.', icon: 'business' },
      { title: 'Contract Research', desc: 'Commission our experts to conduct research on your behalf. Access world-class facilities and researchers across all disciplines.', icon: 'assignment' },
      { title: 'Consulting Services', desc: 'Engage our academic experts for specialised consulting, technical advice, and professional development programs.', icon: 'support_agent' },
      { title: 'Collaborative Grants', desc: 'Partner with us on competitive grant applications. Our dedicated grants team supports the development of compelling proposals.', icon: 'payments' },
    ],
  },
  {
    id: 'thinclab',
    title: 'ThincLab',
    icon: 'lightbulb',
    description: 'ThincLab Adelaide is the University\'s startup incubator, supporting early-stage ventures from ideation to market. Since 2001, we have supported over 700 startups, creating jobs and driving economic growth in South Australia.',
    highlights: [
      { value: '700+', label: 'Startups Supported' },
      { value: '$1B+', label: 'Value Created' },
      { value: '50+', label: 'Current Companies' },
    ],
  },
  {
    id: 'graduate',
    title: 'Graduate Research Training Opportunities',
    icon: 'school',
    description: 'Adelaide University offers a range of graduate research opportunities including PhD, Masters by Research, and professional doctorate programs. Our graduate researchers benefit from world-class supervision, state-of-the-art facilities, and a vibrant research community.',
    items: [
      { title: 'PhD Programs', desc: 'Undertake original research under expert supervision across all faculties and research institutes.', icon: 'history_edu' },
      { title: 'Masters by Research', desc: 'Develop advanced research skills through a focused research project in your chosen discipline.', icon: 'menu_book' },
      { title: 'Scholarships', desc: 'A range of scholarships are available for domestic and international research students, covering tuition and living expenses.', icon: 'card_giftcard' },
    ],
  },
  {
    id: 'work',
    title: 'Work With Us',
    icon: 'work',
    description: 'Join our research community. Adelaide University is always seeking talented researchers, research support staff, and technical specialists to contribute to our mission of research excellence.',
    links: [
      { text: 'Current Research Vacancies', href: 'https://www.adelaide.edu.au/jobs' },
      { text: 'Postdoctoral Fellowships', href: 'https://www.adelaide.edu.au/research/postdocs' },
      { text: 'Research Support Roles', href: 'https://www.adelaide.edu.au/jobs' },
    ],
  },
  {
    id: 'commercialisation',
    title: 'Innovation & Commercialisation Services',
    icon: 'trending_up',
    description: 'Our Innovation & Commercialisation team helps researchers translate their discoveries into products, services, and policies that benefit society. We provide expert support in intellectual property protection, licensing, and startup creation.',
    items: [
      { title: 'Intellectual Property', desc: 'We help researchers protect and manage their inventions, providing guidance on patents, copyright, and trade secrets.', icon: 'verified_user' },
      { title: 'Licensing & Agreements', desc: 'Our team negotiates and manages licensing agreements, material transfer agreements, and collaborative research contracts.', icon: 'gavel' },
      { title: 'Startup Support', desc: 'From proof-of-concept funding to ThincLab incubation, we help researchers build successful ventures from their research.', icon: 'rocket_launch' },
    ],
  },
];
</script>

<template>
  <div class="connect-page">
    <div class="connect-hero">
      <div class="hero-inner">
        <h1>Connect With Us</h1>
        <p>Partner with Adelaide University to drive innovation, commercialise research, and create real-world impact.</p>
      </div>
    </div>

    <div class="connect-content">
      <section v-for="sec in sections" :key="sec.id" :id="sec.id" class="section">
        <div class="section-header">
          <span class="material-symbols-outlined section-icon">{{ sec.icon }}</span>
          <h2>{{ sec.title }}</h2>
        </div>
        <p class="section-desc">{{ sec.description }}</p>

        <!-- Card items -->
        <div v-if="sec.items" class="card-grid">
          <div v-for="item in sec.items" :key="item.title" class="info-card">
            <span class="material-symbols-outlined card-icon">{{ item.icon }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>

        <!-- ThincLab highlights -->
        <div v-if="sec.highlights" class="highlights-row">
          <div v-for="h in sec.highlights" :key="h.label" class="highlight-item">
            <span class="highlight-value">{{ h.value }}</span>
            <span class="highlight-label">{{ h.label }}</span>
          </div>
        </div>

        <!-- External links -->
        <div v-if="sec.links" class="links-list">
          <a v-for="l in sec.links" :key="l.text" :href="l.href" target="_blank" rel="noopener" class="ext-link">
            <span class="material-symbols-outlined">open_in_new</span>
            {{ l.text }}
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.connect-page { min-height: 100vh; }

.connect-hero { background: var(--color-primary); padding: var(--space-3xl) var(--space-lg); }
.hero-inner { max-width: 720px; margin: 0 auto; text-align: center; color: var(--color-white); }
.hero-inner h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--color-white); }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.85; }

.connect-content { max-width: 1000px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }

.section { margin-bottom: var(--space-3xl); padding-top: var(--space-lg); }
.section-header { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md); }
.section-icon { font-size: 32px; color: var(--color-primary); }
.section-header h2 { font-size: var(--font-size-2xl); font-weight: 700; }
.section-desc { font-size: var(--font-size-md); color: var(--color-text-secondary); line-height: 1.7; margin-bottom: var(--space-lg); }

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

.highlights-row { display: flex; gap: var(--space-xl); }
.highlight-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
.highlight-value { font-size: var(--font-size-3xl); font-weight: 700; color: var(--color-primary); }
.highlight-label { font-size: var(--font-size-sm); color: var(--color-text-light); }

.links-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.ext-link {
  display: inline-flex; align-items: center; gap: var(--space-sm);
  font-size: var(--font-size-md); font-weight: 500; color: var(--color-primary);
  padding: var(--space-sm) 0;
}
.ext-link:hover { text-decoration: underline; }
.ext-link .material-symbols-outlined { font-size: 18px; }

@media (max-width: 768px) {
  .card-grid { grid-template-columns: 1fr; }
  .highlights-row { flex-direction: column; align-items: center; }
}
</style>
