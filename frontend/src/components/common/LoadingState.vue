<!--
  复用组件：LoadingState
  用途：统一页面和模块的加载状态，包含居中 spinner。
  当前使用/计划使用页面：
  - DashboardPage.vue
  - CommunityHubPage.vue
  - TimetablePage.vue
  - ProgramPreviewPage.vue
  - ExplorePage.vue
  - CareerOutcomesPage.vue
  - ResourcesPage.vue
  - IndustryPage.vue
  - RoadmapPage.vue
  - Admin 管理页面
  维护说明：
  - 修改 spinner 尺寸、颜色、默认 padding 会影响所有使用该组件的页面。
  - 如果某个页面只需要局部 loading，请用 padding prop 调整，不要直接改默认样式。
-->
<script setup>
defineProps({
  padding: {
    type: String,
    default: 'var(--space-3xl)',
  },
});
</script>

<template>
  <div class="loading-state" :style="{ padding }">
    <div class="loading-spinner"></div>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
