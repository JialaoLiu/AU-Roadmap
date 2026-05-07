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
    <div class="apply-hero">
      <div class="hero-inner">
        <span class="hero-eyebrow">Admissions</span>
        <h1>How to Apply</h1>
        <p>Your formal guide to program selection, application requirements, deadlines, and enrolment preparation at Adelaide University.</p>
      </div>
    </div>

    <div class="apply-content">
      <section class="section-shell steps-section">
        <div class="section-heading">
          <span class="section-eyebrow">Application Process</span>
          <h2>Application Steps</h2>
          <p>Follow each step in sequence to move from program selection to enrolment.</p>
        </div>
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

      <div class="bottom-grid">
        <section class="section-shell dates-section">
          <div class="section-heading section-heading--compact">
            <span class="section-eyebrow">Important Dates</span>
            <h2>Key Dates 2026</h2>
          </div>
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

        <section class="section-shell faq-section">
          <div class="section-heading section-heading--compact">
            <span class="section-eyebrow">Support</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <details v-for="f in faqs" :key="f.q" class="faq-item">
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        </section>
      </div>

      <div class="cta-section">
        <h2>Ready to Apply?</h2>
        <p>Start by reviewing available programs, then continue with the formal admissions process.</p>
        <div class="cta-buttons">
          <RouterLink to="/explore" class="cta-btn cta-btn--primary">Find Your Program</RouterLink>
          <RouterLink to="/explore/careers" class="cta-btn cta-btn--secondary">View Career Outcomes</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.apply-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(20, 15, 80, 0.06), transparent 34%),
    linear-gradient(180deg, #f7f8fc 0%, #f3f5fb 100%);
}

.apply-hero {
  background: linear-gradient(135deg, #140f50 0%, #1e1870 55%, #314191 100%);
  color: var(--color-white);
  padding: 5.5rem var(--space-lg) 5rem;
}

.hero-inner {
  max-width: 50rem;
  margin: 0 auto;
  text-align: center;
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

.hero-inner h1 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.hero-inner p {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.84);
}

.apply-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.25rem 1rem var(--space-3xl);
}

.section-shell {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(20, 15, 80, 0.08);
  padding: 1.5rem;
}

.steps-section { margin-bottom: var(--space-3xl); }

.section-heading {
  margin-bottom: var(--space-xl);
}

.section-heading--compact {
  margin-bottom: var(--space-lg);
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

.section-heading h2 {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.55rem;
}

.section-heading p {
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.steps { display: flex; flex-direction: column; gap: var(--space-md); }

.step { display: flex; gap: var(--space-lg); }

.step-marker { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.step-number {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--color-primary); color: var(--color-white);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-sm); font-weight: 700;
}
.step-line { width: 2px; flex: 1; background: rgba(20, 15, 80, 0.12); margin-top: var(--space-sm); }
.step:last-child .step-line { display: none; }

.step-content {
  background: var(--color-white); border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 20px; padding: var(--space-lg);
  box-shadow: 0 12px 28px rgba(20, 15, 80, 0.06);
  flex: 1; margin-bottom: var(--space-sm);
}

.step-icon-wrap { margin-bottom: var(--space-sm); }
.step-icon-wrap .material-symbols-outlined {
  font-size: 28px;
  color: var(--color-primary);
  background: rgba(20, 15, 80, 0.07);
  border-radius: 16px;
  padding: 0.6rem;
}

.step-content h3 { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-xs); }
.step-content p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; }

.step-link {
  display: inline-flex; align-items: center; gap: 4px;
  margin-top: var(--space-sm); font-size: var(--font-size-sm);
  font-weight: 500; color: var(--color-primary);
}
.step-link:hover { text-decoration: underline; }
.step-link .material-symbols-outlined { font-size: 16px; }

.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2xl); margin-bottom: var(--space-3xl); }

.dates-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.date-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
}
.date-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot--application { background: var(--color-primary); }
.dot--orientation { background: #314191; }
.dot--semester { background: #0f766e; }
.date-title { display: block; font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-primary); }
.date-value { display: block; font-size: var(--font-size-xs); color: var(--color-text-light); }

.faq-item {
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  margin-bottom: var(--space-sm);
}

.faq-item summary {
  padding: var(--space-md); font-size: var(--font-size-sm); font-weight: 600;
  color: var(--color-text-primary); cursor: pointer; list-style: none;
}
.faq-item summary::-webkit-details-marker { display: none; }

.faq-item[open] summary { border-bottom: 1px solid rgba(20, 15, 80, 0.08); }

.faq-item p {
  padding: var(--space-md); font-size: var(--font-size-sm);
  color: var(--color-text-secondary); line-height: 1.6;
}

.cta-section {
  text-align: center;
  padding: var(--space-2xl);
  background: linear-gradient(180deg, rgba(20, 15, 80, 0.05), rgba(49, 65, 145, 0.08));
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
}
.cta-section h2 { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.cta-section p { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-lg); }
.cta-buttons { display: flex; gap: var(--space-md); justify-content: center; }

.cta-btn {
  display: inline-flex; padding: var(--space-md) var(--space-xl);
  border-radius: 999px; font-size: var(--font-size-sm); font-weight: 600;
  transition: all var(--transition-fast);
}
.cta-btn--primary { background: var(--color-primary); color: var(--color-white); }
.cta-btn--primary:hover { background: var(--color-primary-light); }
.cta-btn--secondary { background: var(--color-white); color: var(--color-primary); border: 1px solid var(--color-primary); }
.cta-btn--secondary:hover { background: rgba(20,15,80,0.04); }

@media (max-width: 768px) {
  .bottom-grid { grid-template-columns: 1fr; }
  .cta-buttons { flex-direction: column; }
}
</style>
