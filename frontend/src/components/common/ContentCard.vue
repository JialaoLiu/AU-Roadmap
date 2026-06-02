<!--
  复用组件：ContentCard
  用途：统一白底内容卡片容器，包括 border、radius、shadow、padding。
  当前使用/计划使用页面：
  - ProgramPreviewPage.vue
  - CareerOutcomesPage.vue
  - ApplicationGuidePage.vue
  - CampusLifePage.vue
  维护说明：
  - 修改默认 padding、圆角、阴影会影响内容型页面的主要卡片。
  - 如果某个卡片需要强调样式，请使用 variant="highlight" 或额外 class，不要复制 content-card CSS。
-->
<script setup>
defineProps({
  as: {
    type: String,
    default: 'div',
  },
  variant: {
    type: String,
    default: 'default',
  },
});
</script>

<template>
  <component :is="as" class="content-card" :class="`content-card--${variant}`">
    <slot />
  </component>
</template>

<style scoped>
.content-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(20, 15, 80, 0.08);
  padding: 1.5rem;
}

.content-card--highlight {
  background: linear-gradient(180deg, rgba(20, 15, 80, 0.05), rgba(49, 65, 145, 0.08));
  border-color: rgba(20, 15, 80, 0.16);
}

.content-card--empty {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}
</style>
