<script setup>
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
    <!-- Hero -->
    <div class="campus-hero">
      <div class="hero-inner">
        <h1>Life at Adelaide University</h1>
        <p>Experience a vibrant campus community in one of the world's most liveable cities.</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-bar">
      <div v-for="s in stats" :key="s.label" class="stat-item">
        <span class="material-symbols-outlined">{{ s.icon }}</span>
        <div>
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <!-- Highlights Grid -->
    <div class="campus-content">
      <div class="highlights-grid">
        <div v-for="h in highlights" :key="h.title" class="highlight-card">
          <div class="highlight-icon" :style="{ background: getCategoryColor(h.category) + '12', color: getCategoryColor(h.category) }">
            <span class="material-symbols-outlined">{{ h.icon }}</span>
          </div>
          <h3>{{ h.title }}</h3>
          <p>{{ h.description }}</p>
        </div>
      </div>

      <!-- CTA -->
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
.campus-page { min-height: 100vh; }

.campus-hero { background: var(--color-primary); color: var(--color-white); padding: var(--space-3xl) var(--space-lg); }
.hero-inner { max-width: 720px; margin: 0 auto; text-align: center; }
.hero-inner h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-sm); }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.8; }

/* Stats */
.stats-bar {
  display: flex; justify-content: center; gap: var(--space-2xl);
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-white); border-bottom: 1px solid var(--color-border);
}

.stat-item { display: flex; align-items: center; gap: var(--space-sm); }
.stat-item .material-symbols-outlined { font-size: 28px; color: var(--color-primary); }
.stat-value { display: block; font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary); line-height: 1; }
.stat-label { display: block; font-size: var(--font-size-xs); color: var(--color-text-light); }

/* Content */
.campus-content { max-width: 1200px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }

.highlights-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg); margin-bottom: var(--space-3xl);
}

.highlight-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-xl);
  transition: all var(--transition-fast);
}

.highlight-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.highlight-icon {
  width: 56px; height: 56px; border-radius: var(--border-radius-md);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-md);
}
.highlight-icon .material-symbols-outlined { font-size: 28px; }

.highlight-card h3 { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.highlight-card p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; }

/* CTA */
.cta-section {
  text-align: center; padding: var(--space-3xl);
  background: rgba(20,15,80,0.03); border-radius: var(--border-radius-lg);
}
.cta-section h2 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.cta-section p { font-size: var(--font-size-md); color: var(--color-text-secondary); margin-bottom: var(--space-xl); }

.cta-buttons { display: flex; gap: var(--space-md); justify-content: center; }

.cta-btn {
  display: inline-flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl); border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 600; transition: all var(--transition-fast);
}
.cta-btn--primary { background: var(--color-primary); color: var(--color-white); }
.cta-btn--primary:hover { background: var(--color-primary-light); box-shadow: var(--shadow-md); }
.cta-btn--secondary { background: var(--color-white); color: var(--color-primary); border: 1px solid var(--color-primary); }
.cta-btn--secondary:hover { background: rgba(20,15,80,0.04); }

@media (max-width: 768px) {
  .stats-bar { flex-wrap: wrap; gap: var(--space-lg); }
  .highlights-grid { grid-template-columns: 1fr; }
}
</style>
