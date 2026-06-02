<!--
  复用组件：TabBar
  用途：统一 tab 按钮组，支持 pill 和 sticky 两种页面差异。
  当前使用/计划使用页面：
  - CommunityHubPage.vue
  - ProgramPreviewPage.vue
  - ManageCareers.vue
  维护说明：
  - 修改默认按钮间距、激活态、sticky 行为会影响多个 tab 页面。
  - Community 和 ProgramPreview 的 tab 风格不同，必须通过 variant 区分，不要强行统一成一种样式。
-->
<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'pill',
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="tabs-container" :class="`tabs-container--${variant}`">
    <div class="tabs" :class="`tabs--${variant}`">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: modelValue === tab.key }"
        @click="emit('update:modelValue', tab.key)"
      >
        <span v-if="tab.icon" class="material-symbols-outlined">{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tabs-container--sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 1.25rem 1rem 0;
  display: flex;
  justify-content: center;
}

.tabs-container--pill {
  display: inline-flex;
}

.tabs {
  display: flex;
  gap: 0.45rem;
}

.tabs--sticky {
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  padding: 0.45rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(20, 15, 80, 0.08);
  backdrop-filter: blur(10px);
}

.tabs--pill {
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  background: #f2f4fa;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tabs--sticky .tab-btn {
  padding: 0.85rem 1.15rem;
  background: none;
  font-size: var(--font-size-sm);
  color: #666d90;
  border-radius: 14px;
}

.tabs--sticky .tab-btn:hover {
  color: var(--color-text-primary);
}

.tabs--sticky .tab-btn.active {
  color: var(--color-primary);
  background: rgba(20, 15, 80, 0.08);
}

.tabs--pill .tab-btn {
  padding: 10px 16px;
  background: transparent;
  border-radius: 14px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.tabs--pill .tab-btn:hover {
  background: rgba(20, 15, 80, 0.06);
  color: var(--color-primary);
}

.tabs--pill .tab-btn.active {
  background: var(--color-white);
  color: var(--color-primary);
  box-shadow: 0 8px 16px rgba(20, 15, 80, 0.08);
}

.tab-btn .material-symbols-outlined {
  font-size: 19px;
}

.tab-badge {
  background: var(--color-secondary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 999px;
  padding: 1px 6px;
  min-width: 18px;
  text-align: center;
}

@media (max-width: 768px) {
  .tabs-container--sticky {
    padding-inline: 0.75rem;
    overflow-x: auto;
  }

  .tabs--sticky {
    min-width: max-content;
  }
}
</style>
