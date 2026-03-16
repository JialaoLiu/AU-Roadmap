<script setup>
const institutes = [
  {
    name: 'Australian Institute for Machine Learning (AIML)',
    description: 'Artificial Intelligence is driving a fourth industrial revolution. AIML is at the forefront of AI research, developing breakthrough algorithms in computer vision, deep learning, and autonomous systems that are transforming industries from healthcare to defence.',
    icon: 'smart_toy',
    focus: ['Computer Vision', 'Deep Learning', 'Autonomous Systems', 'Medical AI'],
    color: '#1976d2',
  },
  {
    name: 'Environment Institute',
    description: 'Outstanding research across environmental sciences combining water, climate, biodiversity, marine, and landscape work. The Institute brings together researchers to address the critical environmental challenges facing Australia and the world.',
    icon: 'eco',
    focus: ['Climate Science', 'Marine Biology', 'Biodiversity', 'Water Resources'],
    color: '#2e7d32',
  },
  {
    name: 'Institute for Sustainability, Energy and Resources (ISER)',
    description: 'Researching Earth Sciences, Energy Technology, and Resource Engineering to address the scientific and social challenges of transitioning to a sustainable future. ISER drives innovation in renewable energy, green hydrogen, and critical minerals.',
    icon: 'bolt',
    focus: ['Renewable Energy', 'Green Hydrogen', 'Critical Minerals', 'Earth Sciences'],
    color: '#f57c00',
  },
  {
    name: 'Institute for Photonics and Advanced Sensing (IPAS)',
    description: 'A multidisciplinary team creating new sensing and measurement technologies using light. IPAS develops revolutionary optical fibre sensors with applications in defence, mining, environmental monitoring, and healthcare.',
    icon: 'sensors',
    focus: ['Optical Fibres', 'Laser Science', 'Sensing Technology', 'Defence Applications'],
    color: '#7b1fa2',
  },
  {
    name: 'Robinson Research Institute',
    description: 'Internationally renowned researchers in human reproduction, pregnancy, and child health. Robinson researchers are making critical advances in fertility science, pregnancy complications, and early childhood development.',
    icon: 'favorite',
    focus: ['Reproductive Health', 'Pregnancy Science', 'Child Health', 'Fertility'],
    color: '#c62828',
  },
  {
    name: 'South Australian Immunogenomics Cancer Institute (SAiGENCI)',
    description: 'A cancer-focused institute emphasising immunotherapies and genomics to develop personalised treatments. SAiGENCI brings together clinicians and researchers to accelerate the translation of discoveries into better patient outcomes.',
    icon: 'biotech',
    focus: ['Immunotherapy', 'Cancer Genomics', 'Personalised Medicine', 'Clinical Trials'],
    color: '#ad1457',
  },
  {
    name: 'Waite Research Institute (WRI)',
    description: 'Supporting collaboration for Australia\'s agriculture, food and wine industries. Located on the Waite Campus, the Institute houses world-leading research in plant genomics, viticulture, food science, and agricultural sustainability.',
    icon: 'agriculture',
    focus: ['Agriculture', 'Wine Science', 'Food Technology', 'Plant Genomics'],
    color: '#558b2f',
  },
  {
    name: 'Defence and Security Institute (DSI)',
    description: 'Playing a key role in Australian capabilities essential to our nation\'s defence, security, and prosperity. DSI connects researchers with defence and intelligence agencies to deliver innovative solutions for national security challenges.',
    icon: 'shield',
    focus: ['Cybersecurity', 'Defence Technology', 'Intelligence', 'National Security'],
    color: '#37474f',
  },
];
</script>

<template>
  <div class="institutes-page">
    <div class="institutes-hero">
      <div class="hero-inner">
        <h1>Research Institutes</h1>
        <p>A research community of approximately 1,200 staff and students working across eight institutes to address significant global challenges through interdisciplinary research.</p>
      </div>
    </div>

    <div class="institutes-content">
      <div class="institutes-grid">
        <div v-for="inst in institutes" :key="inst.name" class="institute-card">
          <div class="institute-icon" :style="{ background: inst.color + '12', color: inst.color }">
            <span class="material-symbols-outlined">{{ inst.icon }}</span>
          </div>
          <h2>{{ inst.name }}</h2>
          <p class="institute-desc">{{ inst.description }}</p>
          <div class="focus-areas">
            <span v-for="f in inst.focus" :key="f" class="focus-tag" :style="{ background: inst.color + '10', color: inst.color }">{{ f }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.institutes-page { min-height: 100vh; }

.institutes-hero { background: var(--color-primary); padding: var(--space-3xl) var(--space-lg); }
.hero-inner { max-width: 720px; margin: 0 auto; text-align: center; color: var(--color-white); }
.hero-inner h1 { font-size: 2rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--color-white); }
.hero-inner p { font-size: var(--font-size-md); opacity: 0.85; line-height: 1.7; }

.institutes-content { max-width: 1100px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); }

.institutes-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg); }

.institute-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-xl);
  transition: all var(--transition-fast);
}
.institute-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-lg); transform: translateY(-2px); }

.institute-icon {
  width: 52px; height: 52px; border-radius: var(--border-radius-md);
  display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);
}
.institute-icon .material-symbols-outlined { font-size: 28px; }

.institute-card h2 { font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--space-sm); line-height: 1.3; }
.institute-desc { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-md); }

.focus-areas { display: flex; flex-wrap: wrap; gap: var(--space-xs); }
.focus-tag {
  padding: 3px 10px; border-radius: var(--border-radius-full);
  font-size: 11px; font-weight: 600;
}

@media (max-width: 768px) { .institutes-grid { grid-template-columns: 1fr; } }
</style>
