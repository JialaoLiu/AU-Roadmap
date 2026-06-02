<!--
  复用组件：SummaryCard
  用途：统一 icon + value + label 类型统计卡片，支持 CTA 和简洁信息卡变体。
  当前使用/计划使用页面：
  - DashboardPage.vue
  - TimetablePage.vue
  - ResourcesPage.vue
  - IndustryPage.vue
  - RoadmapPage.vue
  - CampusLifePage.vue
  - CareerOutcomesPage.vue
  - ProgramPreviewPage.vue
  维护说明：
  - 修改默认布局、字号、阴影会影响多个 Level 1/Level 2 页面。
  - 特殊页面优先通过 variant 或 class 扩展，不要复制新的 summary-card CSS。
-->
<script setup>
defineProps({
  icon: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'default',
  },
  as: {
    type: String,
    default: 'div',
  },
  showArrow: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['click']);
</script>

<template>
  <component
    :is="as"
    class="summary-card"
    :class="[`summary-card--${variant}`]"
    @click="$emit('click')"
  >
    <span v-if="icon" class="material-symbols-outlined summary-icon">{{ icon }}</span>
    <div class="summary-body">
      <span v-if="label && variant === 'plain'" class="summary-label">{{ label }}</span>
      <span class="summary-value">{{ value }}</span>
      <span v-if="label && variant !== 'plain'" class="summary-label">{{ label }}</span>
    </div>
    <span v-if="showArrow" class="material-symbols-outlined card-arrow">arrow_forward</span>
  </component>
</template>

<style scoped>
.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 10px 20px rgba(20, 15, 80, 0.05);
}

.summary-card--cta {
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: all var(--transition-fast);
  width: 100%;
  background: linear-gradient(135deg, #140f50, #221b68);
  border-color: rgba(20, 15, 80, 0.2);
}

.summary-card--cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(20, 15, 80, 0.16);
}

.summary-card--plain {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  border-radius: 20px;
  padding: 1.15rem 1.25rem;
  box-shadow: 0 18px 38px rgba(20, 15, 80, 0.1);
}

.summary-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--color-primary);
  background: rgba(20, 15, 80, 0.06);
  flex-shrink: 0;
}

.summary-card--cta .summary-icon {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.12);
}

.summary-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.15;
}

.summary-card--plain .summary-value {
  font-size: 1rem;
}

.summary-label {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.summary-card--plain .summary-label {
  margin-top: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #70779a;
}

.summary-card--cta .summary-value,
.summary-card--cta .summary-label,
.summary-card--cta .card-arrow {
  color: var(--color-white);
}

.summary-card--cta .summary-label {
  color: rgba(255, 255, 255, 0.74);
}

.card-arrow {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
}
</style>
