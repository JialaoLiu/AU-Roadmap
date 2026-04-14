<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { searchAll } from '@/api/search';

const router = useRouter();
const query = ref('');
const results = ref(null);
const showDropdown = ref(false);
const loading = ref(false);
const searchRef = ref(null);
const dropdownPos = reactive({ top: '0px', left: '0px', width: '480px' });
let debounceTimer = null;

const categoryConfig = {
  programs: { label: 'Programs', icon: 'school', color: '#140f50' },
  courses: { label: 'Courses', icon: 'menu_book', color: '#1976d2' },
  alumni: { label: 'Alumni', icon: 'groups', color: '#2e7d32' },
  industry: { label: 'Industry Partners', icon: 'business', color: '#f57c00' },
  careers: { label: 'Career Paths', icon: 'trending_up', color: '#d32f2f' },
};

function updateDropdownPos() {
  if (!searchRef.value) return;
  const rect = searchRef.value.getBoundingClientRect();
  dropdownPos.top = `${rect.bottom + 4}px`;
  dropdownPos.left = `${rect.left}px`;
  dropdownPos.width = `${Math.max(rect.width, 480)}px`;
}

watch(query, (val) => {
  clearTimeout(debounceTimer);
  if (!val || val.trim().length < 2) {
    results.value = null;
    showDropdown.value = false;
    return;
  }
  debounceTimer = setTimeout(async () => {
    loading.value = true;
    try {
      const res = await searchAll(val.trim());
      results.value = res.data.data;
      updateDropdownPos();
      showDropdown.value = true;
    } catch {
      results.value = null;
    } finally {
      loading.value = false;
    }
  }, 300);
});

function getResultTitle(category, item) {
  if (category === 'programs') return `${item.code} - ${item.name}`;
  if (category === 'courses') return `${item.code} - ${item.name}`;
  if (category === 'alumni') return `${item.first_name} ${item.last_name}`;
  if (category === 'industry') return item.name;
  if (category === 'careers') return item.job_title;
  return '';
}

function getResultSub(category, item) {
  if (category === 'programs') return `${item.level} · ${item.faculty}`;
  if (category === 'courses') return `Level ${item.level} · ${item.units} units`;
  if (category === 'alumni') return `${item.current_role || ''} ${item.current_company ? '@ ' + item.current_company : ''}`.trim();
  if (category === 'industry') return `${item.partnership_type} · ${item.industry_sector || ''}`;
  if (category === 'careers') return `${item.program_name || ''} · ${item.demand_level} demand`;
  return '';
}

function navigateToResult(category, item) {
  showDropdown.value = false;
  query.value = '';
  if (category === 'programs') router.push(`/explore/programs/${item.id}`);
  else if (category === 'courses') router.push(item.program_id ? `/explore/programs/${item.program_id}` : '/explore');
  else if (category === 'alumni') router.push('/research/connect');
  else if (category === 'industry') router.push('/research/connect#partner');
  else if (category === 'careers') router.push('/explore/careers');
}

function handleFocus() {
  if (query.value.trim().length >= 2 && results.value) {
    updateDropdownPos();
    showDropdown.value = true;
  }
}

function handleClickOutside(e) {
  if (searchRef.value && !searchRef.value.contains(e.target)) {
    showDropdown.value = false;
  }
}

function handleEscape(e) {
  if (e.key === 'Escape') showDropdown.value = false;
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscape);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscape);
  clearTimeout(debounceTimer);
});
</script>

<template>
  <div class="search-bar" ref="searchRef">
    <div class="search-input-wrapper">
      <span class="material-symbols-outlined search-icon">search</span>
      <input
        v-model="query"
        type="text"
        placeholder="Search programs, courses, alumni..."
        class="search-input"
        @focus="handleFocus"
      />
      <span v-if="loading" class="material-symbols-outlined search-spinner">progress_activity</span>
    </div>

    <Teleport to="body">
      <div
        v-if="showDropdown && results"
        class="search-dropdown"
        :style="{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 9999 }"
      >
        <template v-if="results.total === 0">
          <div class="search-empty">
            <span class="material-symbols-outlined">search_off</span>
            <p>No results found for "{{ query }}"</p>
          </div>
        </template>
        <template v-else>
          <template v-for="(config, category) in categoryConfig" :key="category">
            <div v-if="results[category] && results[category].length > 0" class="search-category">
              <div class="search-category-header">
                <span class="material-symbols-outlined category-icon" :style="{ color: config.color }">{{ config.icon }}</span>
                <span class="category-label">{{ config.label }}</span>
                <span class="category-count">{{ results[category].length }}</span>
              </div>
              <button
                v-for="item in results[category]"
                :key="item.id"
                class="search-result-item"
                @click="navigateToResult(category, item)"
              >
                <div class="result-info">
                  <span class="result-title">{{ getResultTitle(category, item) }}</span>
                  <span class="result-sub">{{ getResultSub(category, item) }}</span>
                </div>
                <span class="material-symbols-outlined result-arrow">arrow_forward</span>
              </button>
            </div>
          </template>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  flex: 0 1 320px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: var(--color-gray-100);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  padding: 0 var(--space-md);
  height: 38px;
  transition: all var(--transition-fast);
}

.search-input-wrapper:focus-within {
  background: var(--color-white);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(20, 15, 80, 0.1);
}

.search-icon {
  font-size: 20px;
  color: var(--color-text-light);
  margin-right: var(--space-sm);
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  outline: none;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--color-text-light);
}

.search-spinner {
  font-size: 18px;
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

<style>
/* Dropdown styles - not scoped so Teleport works */
.search-dropdown {
  background: var(--color-white, #fff);
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: var(--border-radius-lg, 12px);
  box-shadow: var(--shadow-xl, 0 20px 25px rgba(0,0,0,0.1));
  max-height: 480px;
  overflow-y: auto;
  padding: var(--space-sm, 8px);
}

.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xl, 32px);
  color: var(--color-text-light, #adb5bd);
}

.search-empty .material-symbols-outlined {
  font-size: 40px;
  margin-bottom: var(--space-sm, 8px);
}

.search-empty p {
  font-size: var(--font-size-sm, 0.875rem);
}

.search-category {
  margin-bottom: var(--space-xs, 4px);
}

.search-category + .search-category {
  border-top: 1px solid var(--color-border, #e9ecef);
  padding-top: var(--space-xs, 4px);
}

.search-category-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm, 8px);
  padding: var(--space-sm, 8px) var(--space-md, 16px);
}

.category-icon { font-size: 20px; }

.category-label {
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary, #868e96);
}

.category-count {
  font-size: var(--font-size-xs, 0.75rem);
  background: var(--color-gray-200, #e9ecef);
  color: var(--color-text-secondary, #868e96);
  padding: 1px 8px;
  border-radius: var(--border-radius-full, 9999px);
}

.search-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-sm, 8px) var(--space-md, 16px);
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--border-radius-md, 8px);
  transition: background 150ms ease;
  text-align: left;
  font-family: inherit;
}

.search-result-item:hover {
  background: var(--color-gray-50, #f8f9fa);
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.result-title {
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 500;
  color: var(--color-text-primary, #212529);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-sub {
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-text-light, #adb5bd);
}

.result-arrow {
  font-size: 18px;
  color: var(--color-text-light, #adb5bd);
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 150ms ease;
}

.search-result-item:hover .result-arrow { opacity: 1; }
</style>
