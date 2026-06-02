<script setup>
import SummaryCard from '@/components/common/SummaryCard.vue';
import SummaryGrid from '@/components/common/SummaryGrid.vue';

const highlights = [
  {
    title: 'North Terrace Campus',
    description: 'Our historic main campus sits in the heart of Adelaide\'s cultural precinct, surrounded by museums, galleries, and the Adelaide Botanic Garden. State-of-the-art laboratories, lecture theatres, and collaborative spaces provide an inspiring learning environment.',
    icon: 'location_city',
    category: 'facilities',
  },
  {
    title: 'Innovation & Collaboration Centre',
    description: 'A modern hub for interdisciplinary research, industry partnerships, and student entrepreneurship. The ICC connects students with real-world projects and startup mentorship programs.',
    icon: 'lightbulb',
    category: 'facilities',
  },
  {
    title: 'Student Clubs & Societies',
    description: 'With over 100 student-run clubs covering academic interests, sports, culture, and social activities, there\'s something for everyone. From coding clubs to cultural societies, get involved and make lasting connections.',
    icon: 'groups',
    category: 'clubs',
  },
  {
    title: 'Sports & Recreation',
    description: 'Access world-class sporting facilities including a fitness centre, swimming pool, and sports fields. Join competitive or social sport teams, or take part in group fitness classes.',
    icon: 'fitness_center',
    category: 'facilities',
  },
  {
    title: 'Adelaide City Living',
    description: 'Adelaide is consistently ranked among the world\'s most liveable cities. Enjoy an affordable lifestyle with beautiful beaches, world-renowned food and wine regions, and a thriving arts scene — all within easy reach.',
    icon: 'location_on',
    category: 'city',
  },
  {
    title: 'Student Accommodation',
    description: 'A range of on-campus and nearby accommodation options for domestic and international students. Our residential colleges offer a supportive community with academic and social programs.',
    icon: 'apartment',
    category: 'accommodation',
  },
];

const stats = [
  { value: '30,000+', label: 'Students', icon: 'people' },
  { value: '100+', label: 'Clubs & Societies', icon: 'groups' },
  { value: '#1', label: 'Most Liveable City', icon: 'emoji_events' },
  { value: '140+', label: 'Years of Excellence', icon: 'history_edu' },
];

function getCategoryColor(cat) {
  const colors = {
    facilities: '#1976d2', clubs: '#6a1b9a', city: '#2e7d32', accommodation: '#e65100',
  };
  return colors[cat] || '#140f50';
}
</script>

<template>
  <div class="campus-page">
    <div class="campus-hero">
      <div class="hero-inner">
        <span class="hero-eyebrow">Student Experience</span>
        <h1>Life at Adelaide University</h1>
        <p>Experience campus facilities, student communities, and city life that support study, connection, and personal development.</p>
      </div>
    </div>

    <SummaryGrid class="summary-grid" variant="auto">
      <SummaryCard
        v-for="s in stats"
        :key="s.label"
        :icon="s.icon"
        :value="s.value"
        :label="s.label"
      />
    </SummaryGrid>

    <div class="campus-content">
      <section class="section-shell">
        <div class="section-heading">
          <span class="section-eyebrow">Campus Highlights</span>
          <h2>Explore Student Life</h2>
          <p>Review the spaces, services, communities, and city experiences that shape everyday life at Adelaide University.</p>
        </div>

        <div class="highlights-grid">
          <div v-for="h in highlights" :key="h.title" class="highlight-card">
            <div class="highlight-icon" :style="{ background: getCategoryColor(h.category) + '12', color: getCategoryColor(h.category) }">
              <span class="material-symbols-outlined">{{ h.icon }}</span>
            </div>
            <span class="highlight-category">{{ h.category }}</span>
            <h3>{{ h.title }}</h3>
            <p>{{ h.description }}</p>
          </div>
        </div>
      </section>

      <div class="cta-section">
        <h2>Ready to Join Us?</h2>
        <p>Start your journey at Adelaide University today.</p>
        <div class="cta-buttons">
          <RouterLink to="/explore" class="cta-btn cta-btn--primary">Explore Programs</RouterLink>
          <RouterLink to="/explore/apply" class="cta-btn cta-btn--secondary">How to Apply</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.campus-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(20, 15, 80, 0.06), transparent 34%),
    linear-gradient(180deg, #f7f8fc 0%, #f3f5fb 100%);
}

.campus-hero {
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

.summary-grid {
  max-width: 1100px;
  margin: 1rem auto 0;
}

.campus-content {
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
  margin-bottom: var(--space-3xl);
}

.section-heading {
  margin-bottom: var(--space-xl);
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

.highlights-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg); margin-bottom: var(--space-3xl);
}

.highlight-card {
  background: var(--color-white); border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 22px; padding: var(--space-xl);
  box-shadow: 0 12px 28px rgba(20, 15, 80, 0.06);
  transition: all var(--transition-fast);
}

.highlight-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.highlight-icon {
  width: 56px; height: 56px; border-radius: var(--border-radius-md);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-md);
}
.highlight-icon .material-symbols-outlined { font-size: 28px; }

.highlight-category {
  display: inline-flex;
  margin-bottom: var(--space-sm);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7394;
}

.highlight-card h3 { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.highlight-card p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; }

.cta-section {
  text-align: center; padding: var(--space-3xl);
  background: linear-gradient(180deg, rgba(20, 15, 80, 0.05), rgba(49, 65, 145, 0.08));
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
}
.cta-section h2 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.cta-section p { font-size: var(--font-size-md); color: var(--color-text-secondary); margin-bottom: var(--space-xl); }

.cta-buttons { display: flex; gap: var(--space-md); justify-content: center; }

.cta-btn {
  display: inline-flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl); border-radius: 999px;
  font-size: var(--font-size-sm); font-weight: 600; transition: all var(--transition-fast);
}
.cta-btn--primary { background: var(--color-primary); color: var(--color-white); }
.cta-btn--primary:hover { background: var(--color-primary-light); box-shadow: var(--shadow-md); }
.cta-btn--secondary { background: var(--color-white); color: var(--color-primary); border: 1px solid var(--color-primary); }
.cta-btn--secondary:hover { background: rgba(20,15,80,0.04); }

@media (max-width: 768px) {
  .summary-grid {
    width: calc(100% - 1.5rem);
  }
  .highlights-grid { grid-template-columns: 1fr; }
  .cta-buttons { flex-direction: column; }
}
</style>
