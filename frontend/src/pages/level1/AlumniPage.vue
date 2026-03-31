<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const loading = ref(true);
const alumni = ref([]);
const selectedAlumni = ref(null);

async function fetchAlumni() {
  try {
    const res = await api.get('/programs/all-alumni');
    alumni.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function getInitials(a) {
  return (a.first_name?.[0] || '') + (a.last_name?.[0] || '');
}

onMounted(fetchAlumni);
</script>

<template>
  <div class="alumni-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">group</span>
        <div>
          <h1>Alumni Network</h1>
          <p class="page-subtitle">Discover where graduates from your program are now</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state"><div class="loading-spinner"></div></div>

    <template v-else-if="alumni.length">
      <!-- Featured Alumni -->
      <div v-if="alumni.filter(a => a.is_featured).length" class="featured-section">
        <h2 class="section-title">
          <span class="material-symbols-outlined">star</span>
          Featured Alumni
        </h2>
        <div class="featured-grid">
          <div
            v-for="a in alumni.filter(a => a.is_featured)"
            :key="a.id"
            class="featured-card"
            @click="selectedAlumni = a"
          >
            <div class="featured-avatar" v-if="a.photo_url">
              <img :src="a.photo_url" :alt="a.first_name" />
            </div>
            <div class="featured-avatar featured-avatar--initials" v-else>
              {{ getInitials(a) }}
            </div>
            <h3>{{ a.first_name }} {{ a.last_name }}</h3>
            <p class="featured-role">{{ a.current_role }}</p>
            <p class="featured-company">{{ a.current_company }}</p>
            <span class="featured-year">Class of {{ a.graduation_year }}</span>
          </div>
        </div>
      </div>

      <!-- All Alumni -->
      <h2 class="section-title">
        <span class="material-symbols-outlined">people</span>
        All Alumni ({{ alumni.length }})
      </h2>
      <div class="alumni-list">
        <div
          v-for="a in alumni"
          :key="a.id"
          class="alumni-card"
          @click="selectedAlumni = a"
        >
          <div class="alumni-avatar" v-if="a.photo_url">
            <img :src="a.photo_url" :alt="a.first_name" />
          </div>
          <div class="alumni-avatar alumni-avatar--initials" v-else>
            {{ getInitials(a) }}
          </div>
          <div class="alumni-info">
            <h3>{{ a.first_name }} {{ a.last_name }}</h3>
            <p v-if="a.current_role || a.current_company" class="alumni-position">
              {{ a.current_role }}<span v-if="a.current_role && a.current_company"> at </span>{{ a.current_company }}
            </p>
            <div class="alumni-meta">
              <span v-if="a.location">
                <span class="material-symbols-outlined">location_on</span>
                {{ a.location }}
              </span>
              <span>
                <span class="material-symbols-outlined">school</span>
                {{ a.graduation_year }}
              </span>
            </div>
          </div>
          <span class="material-symbols-outlined alumni-arrow">chevron_right</span>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">
      <span class="material-symbols-outlined empty-icon">group</span>
      <h2>No Alumni Data</h2>
      <p>Alumni information is not yet available for your program.</p>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedAlumni" class="modal-overlay" @click.self="selectedAlumni = null">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-header__profile">
                <div class="modal-avatar" v-if="selectedAlumni.photo_url">
                  <img :src="selectedAlumni.photo_url" :alt="selectedAlumni.first_name" />
                </div>
                <div class="modal-avatar modal-avatar--initials" v-else>
                  {{ getInitials(selectedAlumni) }}
                </div>
                <div>
                  <h2>{{ selectedAlumni.first_name }} {{ selectedAlumni.last_name }}</h2>
                  <p v-if="selectedAlumni.current_role" class="modal-role">{{ selectedAlumni.current_role }}</p>
                </div>
              </div>
              <button class="modal-close" @click="selectedAlumni = null">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="modal-body">
              <div class="modal-info-grid">
                <div v-if="selectedAlumni.current_company" class="modal-info-item">
                  <span class="material-symbols-outlined">business</span>
                  <div><span class="info-label">Company</span><span class="info-value">{{ selectedAlumni.current_company }}</span></div>
                </div>
                <div v-if="selectedAlumni.location" class="modal-info-item">
                  <span class="material-symbols-outlined">location_on</span>
                  <div><span class="info-label">Location</span><span class="info-value">{{ selectedAlumni.location }}</span></div>
                </div>
                <div class="modal-info-item">
                  <span class="material-symbols-outlined">school</span>
                  <div><span class="info-label">Graduated</span><span class="info-value">{{ selectedAlumni.graduation_year }}</span></div>
                </div>
              </div>

              <div v-if="selectedAlumni.bio" class="modal-section">
                <h3>About</h3>
                <p>{{ selectedAlumni.bio }}</p>
              </div>

              <div v-if="selectedAlumni.success_story" class="modal-section">
                <h3>My Story</h3>
                <p class="success-story">{{ selectedAlumni.success_story }}</p>
              </div>

              <a v-if="selectedAlumni.linkedin_url" :href="selectedAlumni.linkedin_url" target="_blank" rel="noopener" class="linkedin-btn">
                <span class="material-symbols-outlined">open_in_new</span>
                View LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.alumni-page { padding: var(--space-lg); }

.page-header { margin-bottom: var(--space-xl); }
.page-header__left { display: flex; align-items: center; gap: var(--space-md); }
.page-icon { font-size: 32px; color: var(--color-primary); }
.page-header h1 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text-primary); }
.page-subtitle { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 2px; }

.section-title {
  display: flex; align-items: center; gap: var(--space-sm);
  font-size: var(--font-size-md); font-weight: 600;
  color: var(--color-text-primary); margin-bottom: var(--space-lg);
}
.section-title .material-symbols-outlined { font-size: 22px; color: var(--color-primary); }

.featured-section { margin-bottom: var(--space-2xl); }
.featured-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
.featured-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-xl);
  text-align: center; cursor: pointer; transition: all var(--transition-fast);
}
.featured-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.featured-avatar { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto var(--space-md); overflow: hidden; }
.featured-avatar img { width: 100%; height: 100%; object-fit: cover; }
.featured-avatar--initials {
  display: flex; align-items: center; justify-content: center;
  background: rgba(20, 15, 80, 0.08); color: var(--color-primary);
  font-size: var(--font-size-xl); font-weight: 700;
}
.featured-card h3 { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text-primary); }
.featured-role { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.featured-company { font-size: var(--font-size-sm); font-weight: 500; color: var(--color-primary); margin-bottom: var(--space-sm); }
.featured-year { font-size: var(--font-size-xs); color: var(--color-text-light); }

.alumni-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.alumni-card {
  display: flex; align-items: center; gap: var(--space-md);
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md); padding: var(--space-md) var(--space-lg);
  cursor: pointer; transition: all var(--transition-fast);
}
.alumni-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-sm); }
.alumni-avatar { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; overflow: hidden; }
.alumni-avatar img { width: 100%; height: 100%; object-fit: cover; }
.alumni-avatar--initials {
  display: flex; align-items: center; justify-content: center;
  background: rgba(20, 15, 80, 0.08); color: var(--color-primary);
  font-size: var(--font-size-sm); font-weight: 700;
}
.alumni-info { flex: 1; }
.alumni-info h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.alumni-position { font-size: var(--font-size-xs); color: var(--color-text-secondary); }
.alumni-meta { display: flex; gap: var(--space-md); margin-top: 2px; font-size: var(--font-size-xs); color: var(--color-text-light); }
.alumni-meta span { display: flex; align-items: center; gap: 2px; }
.alumni-meta .material-symbols-outlined { font-size: 14px; }
.alumni-arrow { color: var(--color-text-light); font-size: 20px; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 300; padding: var(--space-lg);
}
.modal-content {
  background: var(--color-white); border-radius: var(--border-radius-lg);
  max-width: 520px; width: 100%; max-height: 80vh;
  overflow-y: auto; box-shadow: var(--shadow-xl);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: var(--space-lg) var(--space-xl); border-bottom: 1px solid var(--color-border);
}
.modal-header__profile { display: flex; align-items: center; gap: var(--space-md); }
.modal-avatar { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
.modal-avatar img { width: 100%; height: 100%; object-fit: cover; }
.modal-avatar--initials {
  display: flex; align-items: center; justify-content: center;
  background: rgba(20, 15, 80, 0.08); color: var(--color-primary);
  font-size: var(--font-size-lg); font-weight: 700;
}
.modal-header h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary); }
.modal-role { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.modal-close {
  background: none; border: none; cursor: pointer;
  color: var(--color-text-light); padding: var(--space-xs);
  border-radius: var(--border-radius-sm);
}
.modal-close:hover { background: var(--color-bg-tertiary); color: var(--color-text-primary); }
.modal-body { padding: var(--space-lg) var(--space-xl); }
.modal-info-grid { display: flex; flex-wrap: wrap; gap: var(--space-lg); margin-bottom: var(--space-xl); }
.modal-info-item { display: flex; align-items: center; gap: var(--space-sm); }
.modal-info-item .material-symbols-outlined { font-size: 20px; color: var(--color-primary); }
.info-label { display: block; font-size: var(--font-size-xs); color: var(--color-text-light); }
.info-value { display: block; font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-primary); }
.modal-section { margin-bottom: var(--space-lg); }
.modal-section h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.modal-section p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; }
.success-story {
  background: var(--color-bg-secondary); padding: var(--space-md);
  border-radius: var(--border-radius-md); border-left: 3px solid var(--color-primary);
}
.linkedin-btn {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary); color: var(--color-white);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 500;
  transition: background var(--transition-fast);
}
.linkedin-btn:hover { background: var(--color-primary-light); }
.linkedin-btn .material-symbols-outlined { font-size: 18px; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal-content, .modal-leave-active .modal-content { transition: transform 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.95); }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: var(--space-3xl); text-align: center; }
.empty-icon { font-size: 48px; color: var(--color-text-light); margin-bottom: var(--space-md); }
.empty-state h2 { color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.empty-state p { color: var(--color-text-secondary); }

.loading-state { display: flex; justify-content: center; padding: var(--space-3xl); }
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid var(--color-border);
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) { .featured-grid { grid-template-columns: 1fr; } }
</style>
