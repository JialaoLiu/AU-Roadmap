<!--
  复用组件：SummaryGrid
  用途：统一 summary card 外层 grid 布局，避免各页面重复写 summary-grid。
  当前使用/计划使用页面：
  - DashboardPage.vue
  - ProgramPreviewPage.vue
  - CampusLifePage.vue
  - CareerOutcomesPage.vue
  维护说明：
  - 修改 columns、gap、响应式规则会影响所有通过该组件包裹的统计卡区域。
  - 页面如需单列 hero summary，请传 variant="stacked"。
-->
<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
  },
});
</script>

<template>
  <div class="summary-grid" :class="`summary-grid--${variant}`">
    <slot />
  </div>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-grid--stacked {
  grid-template-columns: 1fr;
}

.summary-grid--auto {
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: var(--space-md);
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
