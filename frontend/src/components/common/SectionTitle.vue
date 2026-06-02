<!--
  复用组件：SectionTitle
  用途：统一带 Material icon 的区块标题。
  当前使用/计划使用页面：
  - DashboardPage.vue
  - CommunityHubPage.vue
  - AdminDashboard.vue
  - ProfilePage.vue
  维护说明：
  - 修改字号、icon 间距、颜色会影响以上页面的 section heading。
  - 如果页面需要更小标题，请通过 class 或后续 variant 扩展，不要直接改默认样式。
-->
<script setup>
defineProps({
  icon: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h2 class="section-title">
    <span v-if="icon" class="material-symbols-outlined">{{ icon }}</span>
    {{ title }}
  </h2>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-lg);
}

.section-title .material-symbols-outlined {
  font-size: 22px;
  color: var(--color-primary);
}
</style>
