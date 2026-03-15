<script setup>
const steps = [
  {
    number: 1,
    title: 'Choose Your Program',
    description: 'Browse our range of undergraduate and postgraduate programs. Use our program explorer to filter by level, faculty, and interest area.',
    icon: 'search',
    link: { text: 'Explore Programs', to: '/explore' },
  },
  {
    number: 2,
    title: 'Check Entry Requirements',
    description: 'Review the entry requirements for your chosen program, including ATAR scores, prerequisite subjects, and any additional criteria for international students.',
    icon: 'checklist',
  },
  {
    number: 3,
    title: 'Prepare Your Documents',
    description: 'Gather your academic transcripts, proof of identity, English language test results (if applicable), and any supporting documents required for your application.',
    icon: 'description',
  },
  {
    number: 4,
    title: 'Submit Your Application',
    description: 'Apply online through SATAC (South Australian Tertiary Admissions Centre) for domestic students, or directly through the University portal for international students.',
    icon: 'send',
  },
  {
    number: 5,
    title: 'Receive Your Offer',
    description: 'Applications are assessed and offers are made based on your academic record and other criteria. Accept your offer online and complete enrolment.',
    icon: 'mark_email_read',
  },
  {
    number: 6,
    title: 'Enrol & Get Started',
    description: 'Attend Orientation Week, set up your student account, choose your courses, and begin your journey at Adelaide University.',
    icon: 'school',
  },
];

const keyDates = [
  { title: 'Semester 1 Applications Close', date: '15 January 2026', category: 'application' },
  { title: 'Orientation Week', date: '24 February 2026', category: 'orientation' },
  { title: 'Semester 1 Begins', date: '3 March 2026', category: 'semester' },
  { title: 'Semester 2 Applications Close', date: '30 June 2026', category: 'application' },
  { title: 'Semester 2 Begins', date: '21 July 2026', category: 'semester' },
];

const faqs = [
  { q: 'What is the application deadline?', a: 'For Semester 1, applications typically close in mid-January. For Semester 2, the deadline is usually late June. Check our key dates for exact deadlines.' },
  { q: 'Do I need to submit an ATAR score?', a: 'ATAR requirements vary by program. Some programs have specific ATAR cutoffs, while others consider a range of factors. Check the entry requirements for your chosen program.' },
  { q: 'How do international students apply?', a: 'International students can apply directly through the Adelaide University International Admissions portal. You\'ll need to provide evidence of English language proficiency and have your qualifications assessed.' },
  { q: 'Can I defer my offer?', a: 'Most offers can be deferred for up to 12 months. Contact the Admissions Office for deferral options and conditions.' },
  { q: 'Are scholarships available?', a: 'Adelaide University offers a range of scholarships for both domestic and international students, including merit-based, equity, and faculty-specific scholarships.' },
];
</script>

<template>
  <div class="apply-page">
    <!-- Hero -->
    <div class="apply-hero">
      <div class="hero-inner">
        <h1>How to Apply</h1>
        <p>Your step-by-step guide to applying for admission at Adelaide University.</p>
      </div>
    </div>

    <div class="apply-content">
      <!-- Steps -->
      <section class="steps-section">
        <h2>Application Steps</h2>
        <div class="steps">
          <div v-for="s in steps" :key="s.number" class="step">
            <div class="step-marker">
              <span class="step-number">{{ s.number }}</span>
              <div class="step-line"></div>
            </div>
            <div class="step-content">
              <div class="step-icon-wrap">
                <span class="material-symbols-outlined">{{ s.icon }}</span>
              </div>
              <h3>{{ s.title }}</h3>
              <p>{{ s.description }}</p>
              <RouterLink v-if="s.link" :to="s.link.to" class="step-link">
                {{ s.link.text }}
                <span class="material-symbols-outlined">arrow_forward</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Dates + FAQ -->
      <div class="bottom-grid">
        <!-- Key Dates -->
        <section class="dates-section">
          <h2>Key Dates 2026</h2>
          <div class="dates-list">
            <div v-for="d in keyDates" :key="d.title" class="date-item">
              <div class="date-dot" :class="'dot--' + d.category"></div>
              <div>
                <span class="date-title">{{ d.title }}</span>
                <span class="date-value">{{ d.date }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section class="faq-section">
          <h2>Frequently Asked Questions</h2>
          <details v-for="f in faqs" :key="f.q" class="faq-item">
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        </section>
      </div>

      <!-- CTA -->
      <div class="cta-section">
        <h2>Ready to Apply?</h2>
        <div class="cta-buttons">
          <RouterLink to="/explore" class="cta-btn cta-btn--primary">Find Your Program</RouterLink>
          <RouterLink to="/explore/careers" class="cta-btn cta-btn--secondary">View Career Outcomes</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.apply-page { min-height: 100vh; }

.apply-hero { background: var(--color-primary); color: var(--color-white); padding: var(--space-3xl) var(--space-lg); }
.hero-inner { max-width: 720px; margin: 0 auto; text-align: center; }
.hero-inner h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-sm); }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.8; }

.apply-content { max-width: 1000px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }

/* Steps */
.steps-section { margin-bottom: var(--space-3xl); }
.steps-section h2 { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-xl); text-align: center; }

.steps { display: flex; flex-direction: column; gap: var(--space-md); }

.step { display: flex; gap: var(--space-lg); }

.step-marker { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.step-number {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--color-primary); color: var(--color-white);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-sm); font-weight: 700;
}
.step-line { width: 2px; flex: 1; background: var(--color-border); margin-top: var(--space-sm); }
.step:last-child .step-line { display: none; }

.step-content {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  flex: 1; margin-bottom: var(--space-sm);
}

.step-icon-wrap { margin-bottom: var(--space-sm); }
.step-icon-wrap .material-symbols-outlined { font-size: 28px; color: var(--color-primary); }

.step-content h3 { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-xs); }
.step-content p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; }

.step-link {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: var(--space-sm); font-size: var(--font-size-sm);
  font-weight: 500; color: var(--color-primary);
}
.step-link:hover { text-decoration: underline; }
.step-link .material-symbols-outlined { font-size: 16px; }

/* Bottom Grid */
.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2xl); margin-bottom: var(--space-3xl); }

.dates-section h2, .faq-section h2 {
  font-size: var(--font-size-lg); font-weight: 700;
  color: var(--color-text-primary); margin-bottom: var(--space-lg);
}

/* Dates */
.dates-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.date-item { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm) var(--space-md); background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--border-radius-md); }
.date-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot--application { background: var(--color-primary); }
.dot--orientation { background: #6a1b9a; }
.dot--semester { background: var(--color-success); }
.date-title { display: block; font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-primary); }
.date-value { display: block; font-size: var(--font-size-xs); color: var(--color-text-light); }

/* FAQ */
.faq-item {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md); margin-bottom: var(--space-sm);
}

.faq-item summary {
  padding: var(--space-md); font-size: var(--font-size-sm); font-weight: 500;
  color: var(--color-text-primary); cursor: pointer; list-style: none;
}
.faq-item summary::-webkit-details-marker { display: none; }

.faq-item[open] summary { border-bottom: 1px solid var(--color-border); }

.faq-item p {
  padding: var(--space-md); font-size: var(--font-size-sm);
  color: var(--color-text-secondary); line-height: 1.6;
}

/* CTA */
.cta-section { text-align: center; padding: var(--space-2xl); background: rgba(20,15,80,0.03); border-radius: var(--border-radius-lg); }
.cta-section h2 { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-lg); }
.cta-buttons { display: flex; gap: var(--space-md); justify-content: center; }

.cta-btn {
  display: inline-flex; padding: var(--space-md) var(--space-xl);
  border-radius: var(--border-radius-md); font-size: var(--font-size-sm); font-weight: 600;
  transition: all var(--transition-fast);
}
.cta-btn--primary { background: var(--color-primary); color: var(--color-white); }
.cta-btn--primary:hover { background: var(--color-primary-light); }
.cta-btn--secondary { background: var(--color-white); color: var(--color-primary); border: 1px solid var(--color-primary); }
.cta-btn--secondary:hover { background: rgba(20,15,80,0.04); }

@media (max-width: 768px) {
  .bottom-grid { grid-template-columns: 1fr; }
}
</style>
