<script setup>
const stories = [
  {
    title: 'Revolutionising Cancer Treatment with Immunotherapy',
    institute: 'South Australian Immunogenomics Cancer Institute',
    description: 'Adelaide researchers are pioneering new immunotherapy approaches that harness the body\'s own immune system to fight cancer. Their work in genomics and personalised medicine is transforming treatment outcomes for patients worldwide.',
    icon: 'biotech',
    tags: ['Health', 'Genomics', 'Immunotherapy'],
  },
  {
    title: 'AI-Powered Solutions for Agriculture',
    institute: 'Australian Institute for Machine Learning',
    description: 'Using advanced computer vision and machine learning, Adelaide researchers are developing autonomous systems for precision agriculture — detecting crop diseases early, optimising irrigation, and reducing environmental impact.',
    icon: 'smart_toy',
    tags: ['AI', 'Agriculture', 'Technology'],
  },
  {
    title: 'Protecting Australia\'s Marine Biodiversity',
    institute: 'Environment Institute',
    description: 'Our marine biologists are leading landmark studies on the Great Australian Bight and Southern Ocean ecosystems. Their research informs national policy on marine protected areas and sustainable fisheries management.',
    icon: 'water',
    tags: ['Environment', 'Marine Science', 'Conservation'],
  },
  {
    title: 'Next-Generation Sensing Technologies',
    institute: 'Institute for Photonics and Advanced Sensing',
    description: 'Adelaide\'s photonics researchers are creating revolutionary optical fibre sensors that can detect everything from groundwater contamination to structural damage in bridges — with applications in defence, mining, and healthcare.',
    icon: 'sensors',
    tags: ['Photonics', 'Defence', 'Innovation'],
  },
  {
    title: 'Advancing Renewable Energy Solutions',
    institute: 'Institute for Sustainability, Energy and Resources',
    description: 'Research teams are developing breakthrough technologies in solar thermal energy, green hydrogen production, and critical minerals processing to support Australia\'s transition to a clean energy future.',
    icon: 'bolt',
    tags: ['Energy', 'Sustainability', 'Climate'],
  },
  {
    title: 'Improving Maternal and Child Health',
    institute: 'Robinson Research Institute',
    description: 'World-renowned researchers are making critical advances in fertility science, pregnancy health, and early childhood development. Their discoveries are improving outcomes for mothers and babies globally.',
    icon: 'favorite',
    tags: ['Health', 'Reproductive Science', 'Paediatrics'],
  },
];

const podcasts = [
  { title: 'The Future of Artificial Intelligence', guest: 'Prof. Simon Lucey, Director of AIML', duration: '32 min' },
  { title: 'Climate Change and Biodiversity', guest: 'Prof. Corey Bradshaw, Environment Institute', duration: '28 min' },
  { title: 'Wine Science Innovation', guest: 'Dr. Kerry Wilkinson, Waite Research Institute', duration: '25 min' },
  { title: 'Defence Technology and National Security', guest: 'Prof. Rachel Cardell-Oliver, DSI', duration: '30 min' },
  { title: 'Personalised Medicine and Genomics', guest: 'Prof. David Lynn, SAiGENCI', duration: '27 min' },
  { title: 'The Science of Food Security', guest: 'Dr. Matthew Gilliham, Waite Campus', duration: '24 min' },
];
</script>

<template>
  <div class="impact-page">
    <div class="impact-hero">
      <div class="hero-inner">
        <h1>Research Impact</h1>
        <p>Discover how Adelaide University research is making a real difference — solving global challenges, driving innovation, and transforming lives.</p>
      </div>
    </div>

    <div class="impact-content">
      <!-- Impact Stories -->
      <section id="stories" class="section">
        <h2>Research Impact Stories</h2>
        <p class="section-intro">Our researchers are tackling some of the world's most pressing challenges. Here are some of the ways Adelaide research is creating impact.</p>
        <div class="stories-grid">
          <div v-for="story in stories" :key="story.title" class="story-card">
            <div class="story-icon-wrap">
              <span class="material-symbols-outlined">{{ story.icon }}</span>
            </div>
            <div class="story-body">
              <span class="story-institute">{{ story.institute }}</span>
              <h3>{{ story.title }}</h3>
              <p>{{ story.description }}</p>
              <div class="story-tags">
                <span v-for="tag in story.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Discovery Podcast -->
      <section id="podcast" class="section">
        <h2>Discovery Podcast Series</h2>
        <p class="section-intro">Listen to Adelaide University researchers discuss their work, breakthroughs, and the future of their fields in our Discovery podcast series.</p>
        <div class="podcast-list">
          <div v-for="ep in podcasts" :key="ep.title" class="podcast-item">
            <div class="podcast-play">
              <span class="material-symbols-outlined">play_circle</span>
            </div>
            <div class="podcast-info">
              <h3>{{ ep.title }}</h3>
              <span class="podcast-guest">{{ ep.guest }}</span>
            </div>
            <span class="podcast-duration">
              <span class="material-symbols-outlined">schedule</span>
              {{ ep.duration }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.impact-page { min-height: 100vh; }

.impact-hero { background: var(--color-primary); padding: var(--space-3xl) var(--space-lg); }
.hero-inner { max-width: 720px; margin: 0 auto; text-align: center; color: var(--color-white); }
.hero-inner h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--color-white); }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.85; }

.impact-content { max-width: 1000px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }

.section { margin-bottom: var(--space-3xl); }
.section h2 { font-size: var(--font-size-2xl); font-weight: 700; margin-bottom: var(--space-sm); }
.section-intro { font-size: var(--font-size-md); color: var(--color-text-secondary); line-height: 1.7; margin-bottom: var(--space-xl); }

/* Stories */
.stories-grid { display: flex; flex-direction: column; gap: var(--space-lg); }
.story-card {
  display: flex; gap: var(--space-lg);
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  transition: all var(--transition-fast);
}
.story-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }

.story-icon-wrap {
  flex-shrink: 0; width: 56px; height: 56px;
  background: rgba(20,15,80,0.06); border-radius: var(--border-radius-md);
  display: flex; align-items: center; justify-content: center;
}
.story-icon-wrap .material-symbols-outlined { font-size: 28px; color: var(--color-primary); }

.story-body { flex: 1; }
.story-institute { font-size: var(--font-size-xs); font-weight: 600; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.5px; }
.story-body h3 { font-size: var(--font-size-lg); font-weight: 600; margin: var(--space-xs) 0 var(--space-sm); }
.story-body p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-md); }

.story-tags { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
.tag {
  padding: 2px 10px; background: var(--color-gray-100);
  border-radius: var(--border-radius-full); font-size: 11px; font-weight: 500; color: var(--color-text-secondary);
}

/* Podcast */
.podcast-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.podcast-item {
  display: flex; align-items: center; gap: var(--space-md);
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md); padding: var(--space-md) var(--space-lg);
  transition: all var(--transition-fast); cursor: pointer;
}
.podcast-item:hover { border-color: var(--color-primary); background: var(--color-gray-50); }

.podcast-play .material-symbols-outlined { font-size: 36px; color: var(--color-primary); }
.podcast-info { flex: 1; }
.podcast-info h3 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: 2px; }
.podcast-guest { font-size: var(--font-size-sm); color: var(--color-text-light); }
.podcast-duration {
  display: flex; align-items: center; gap: 4px;
  font-size: var(--font-size-sm); color: var(--color-text-light); flex-shrink: 0;
}
.podcast-duration .material-symbols-outlined { font-size: 16px; }

@media (max-width: 640px) {
  .story-card { flex-direction: column; }
}
</style>
