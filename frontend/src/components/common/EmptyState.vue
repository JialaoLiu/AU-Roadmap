<!--
  复用组件：EmptyState
  用途：统一空状态、无数据状态、未登录提示等简单反馈模块。
  当前使用/计划使用页面：
  - CommunityHubPage.vue
  - ResourcesPage.vue
  - IndustryPage.vue
  - RoadmapPage.vue
  - ExplorePage.vue
  - CareerOutcomesPage.vue
  - ProgramPreviewPage.vue
  维护说明：
  - 修改默认对齐、padding、icon 尺寸会影响多个页面的空状态。
  - 页面如需更短的空状态，请使用 variant="small"，不要新增重复 CSS。
-->
<script setup>
defineProps({
  icon: {
    type: String,
    default: 'info',
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'default',
  },
});
</script>

<template>
  <div class="empty-state" :class="`empty-state--${variant}`">
    <span class="material-symbols-outlined empty-icon">{{ icon }}</span>
    <h2 v-if="title">{{ title }}</h2>
    <p v-if="message">{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-3xl);
  text-align: center;
}

.empty-state--small {
  padding: var(--space-xl);
}

.empty-icon {
  font-size: 48px;
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
}

.empty-state--small .empty-icon {
  font-size: 36px;
  margin-bottom: var(--space-sm);
}

h2 {
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

p {
  color: var(--color-text-secondary);
  max-width: 420px;
}
</style>
