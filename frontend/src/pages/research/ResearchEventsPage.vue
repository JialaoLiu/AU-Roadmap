<script setup>
const upcomingEvents = [
  { title: 'Research Tuesdays: AI in Healthcare', date: '25 March 2026', time: '12:30 PM - 1:30 PM', location: 'Braggs Lecture Theatre', speaker: 'Prof. Simon Lucey, AIML', type: 'Research Tuesdays' },
  { title: 'Research Tuesdays: Climate Adaptation', date: '1 April 2026', time: '12:30 PM - 1:30 PM', location: 'Braggs Lecture Theatre', speaker: 'Prof. Corey Bradshaw, Environment Institute', type: 'Research Tuesdays' },
  { title: 'Graduate Research Showcase 2026', date: '8 April 2026', time: '10:00 AM - 4:00 PM', location: 'Hub Central', speaker: 'Multiple Presenters', type: 'Showcase' },
  { title: 'Research Tuesdays: Future of Food', date: '15 April 2026', time: '12:30 PM - 1:30 PM', location: 'Braggs Lecture Theatre', speaker: 'Dr. Matthew Gilliham, WRI', type: 'Research Tuesdays' },
  { title: 'Industry Research Partnership Forum', date: '22 April 2026', time: '9:00 AM - 5:00 PM', location: 'National Wine Centre', speaker: 'Various Industry & Academic Speakers', type: 'Forum' },
  { title: 'Research Tuesdays: Quantum Computing', date: '29 April 2026', time: '12:30 PM - 1:30 PM', location: 'Braggs Lecture Theatre', speaker: 'Prof. Andre Luiten, IPAS', type: 'Research Tuesdays' },
];

const pastHighlights = [
  { title: 'Nobel Laureate Lecture Series', description: 'A special evening with Australia\'s leading scientific minds, discussing the future of research and discovery.' },
  { title: '3 Minute Thesis (3MT) Competition', description: 'Graduate researchers presented their research in just three minutes to a non-specialist audience. A celebration of research communication skills.' },
  { title: 'Research Impact Awards 2025', description: 'Recognising researchers whose work has made a significant impact on industry, policy, or the community.' },
];
</script>

<template>
  <div class="events-page">
    <div class="events-hero">
      <div class="hero-inner">
        <h1>Research Events</h1>
        <p>Join our vibrant research community at lectures, seminars, showcases, and networking events throughout the year.</p>
      </div>
    </div>

    <div class="events-content">
      <!-- Research Tuesdays -->
      <section id="research-tuesdays" class="section">
        <div class="section-header">
          <span class="material-symbols-outlined section-icon">event</span>
          <div>
            <h2>Research Tuesdays</h2>
            <p class="section-sub">Free weekly lunchtime lectures showcasing Adelaide University research</p>
          </div>
        </div>
        <div class="rt-info">
          <div class="rt-detail">
            <span class="material-symbols-outlined">schedule</span>
            <span>Every Tuesday, 12:30 PM - 1:30 PM (during semester)</span>
          </div>
          <div class="rt-detail">
            <span class="material-symbols-outlined">location_on</span>
            <span>Braggs Lecture Theatre, North Terrace Campus</span>
          </div>
          <div class="rt-detail">
            <span class="material-symbols-outlined">sell</span>
            <span>Free and open to the public — no registration required</span>
          </div>
        </div>
      </section>

      <!-- Upcoming Events -->
      <section class="section">
        <h2>Upcoming Events</h2>
        <div class="events-list">
          <div v-for="ev in upcomingEvents" :key="ev.title" class="event-card">
            <div class="event-date-col">
              <span class="event-day">{{ ev.date.split(' ')[0] }}</span>
              <span class="event-month">{{ ev.date.split(' ')[1] }}</span>
            </div>
            <div class="event-info">
              <span class="event-type" :class="'type--' + ev.type.toLowerCase().replace(/\s/g, '-')">{{ ev.type }}</span>
              <h3>{{ ev.title }}</h3>
              <div class="event-meta">
                <span><span class="material-symbols-outlined">schedule</span> {{ ev.time }}</span>
                <span><span class="material-symbols-outlined">location_on</span> {{ ev.location }}</span>
                <span><span class="material-symbols-outlined">person</span> {{ ev.speaker }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Past Highlights -->
      <section class="section">
        <h2>Past Event Highlights</h2>
        <div class="highlights-grid">
          <div v-for="h in pastHighlights" :key="h.title" class="highlight-card">
            <span class="material-symbols-outlined highlight-icon">auto_awesome</span>
            <h3>{{ h.title }}</h3>
            <p>{{ h.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.events-page { min-height: 100vh; }

.events-hero { background: var(--color-primary); padding: var(--space-3xl) var(--space-lg); }
.hero-inner { max-width: 720px; margin: 0 auto; text-align: center; color: var(--color-white); }
.hero-inner h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--color-white); }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.85; }

.events-content { max-width: 1000px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }

.section { margin-bottom: var(--space-3xl); }
.section h2 { font-size: var(--font-size-2xl); font-weight: 700; margin-bottom: var(--space-lg); }
.section-header { display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); }
.section-icon { font-size: 36px; color: var(--color-primary); margin-top: 2px; }
.section-header h2 { margin-bottom: var(--space-xs); }
.section-sub { font-size: var(--font-size-md); color: var(--color-text-secondary); }

/* Research Tuesdays info */
.rt-info { display: flex; flex-direction: column; gap: var(--space-sm); margin-bottom: var(--space-lg); }
.rt-detail {
  display: flex; align-items: center; gap: var(--space-sm);
  font-size: var(--font-size-md); color: var(--color-text-secondary);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-gray-50); border-radius: var(--border-radius-md);
}
.rt-detail .material-symbols-outlined { font-size: 20px; color: var(--color-primary); }

/* Events List */
.events-list { display: flex; flex-direction: column; gap: var(--space-md); }
.event-card {
  display: flex; gap: var(--space-lg);
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  transition: all var(--transition-fast);
}
.event-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }

.event-date-col {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 56px; padding: var(--space-sm);
  background: rgba(20,15,80,0.04); border-radius: var(--border-radius-md);
}
.event-day { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary); line-height: 1; }
.event-month { font-size: var(--font-size-xs); color: var(--color-text-light); text-transform: uppercase; }

.event-info { flex: 1; }
.event-type {
  display: inline-block; padding: 2px 10px; border-radius: var(--border-radius-full);
  font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  background: rgba(20,15,80,0.08); color: var(--color-primary); margin-bottom: var(--space-xs);
}
.type--showcase { background: rgba(46,125,50,0.08); color: var(--color-success); }
.type--forum { background: rgba(245,124,0,0.08); color: var(--color-warning); }

.event-info h3 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-sm); }
.event-meta { display: flex; flex-wrap: wrap; gap: var(--space-md); }
.event-meta span {
  display: flex; align-items: center; gap: 4px;
  font-size: var(--font-size-sm); color: var(--color-text-light);
}
.event-meta .material-symbols-outlined { font-size: 16px; }

/* Past Highlights */
.highlights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); }
.highlight-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg); text-align: center;
}
.highlight-icon { font-size: 32px; color: var(--color-accent); margin-bottom: var(--space-sm); }
.highlight-card h3 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: var(--space-sm); }
.highlight-card p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.5; }

@media (max-width: 768px) {
  .event-card { flex-direction: column; }
  .highlights-grid { grid-template-columns: 1fr; }
}
</style>
