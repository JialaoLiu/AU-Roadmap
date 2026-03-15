<script setup>
const props = defineProps({
  course: { type: Object, required: true },
  highlighted: { type: Boolean, default: false },
});

const emit = defineEmits(['select', 'hover', 'leave']);
</script>

<template>
  <div
    class="course-card"
    :class="{
      'course-card--core': course.is_core,
      'course-card--elective': !course.is_core,
      'course-card--highlighted': highlighted,
    }"
    @click="emit('select', course)"
    @mouseenter="emit('hover', course)"
    @mouseleave="emit('leave', course)"
    :data-course-id="course.id"
  >
    <div class="course-card__header">
      <span class="course-card__code">{{ course.code }}</span>
      <span class="course-card__badge" :class="course.is_core ? 'badge--core' : 'badge--elective'">
        {{ course.is_core ? 'Core' : 'Elective' }}
      </span>
    </div>
    <h4 class="course-card__name">{{ course.name }}</h4>
    <div class="course-card__meta">
      <span class="course-card__units">
        <span class="material-symbols-outlined">school</span>
        {{ course.units }} units
      </span>
      <span v-if="course.prerequisites && course.prerequisites.length" class="course-card__prereq-count">
        <span class="material-symbols-outlined">link</span>
        {{ course.prerequisites.length }} prereq{{ course.prerequisites.length > 1 ? 's' : '' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.course-card {
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  min-width: 200px;
}

.course-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.course-card--highlighted {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(20, 15, 80, 0.15);
}

.course-card--core {
  border-left: 4px solid var(--color-primary);
}

.course-card--elective {
  border-left: 4px solid var(--color-accent);
}

.course-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.course-card__code {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.5px;
}

.course-card__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge--core {
  background: rgba(20, 15, 80, 0.1);
  color: var(--color-primary);
}

.badge--elective {
  background: rgba(240, 171, 0, 0.15);
  color: #b38600;
}

.course-card__name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
  margin-bottom: var(--space-sm);
}

.course-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.course-card__meta .material-symbols-outlined {
  font-size: 14px;
}

.course-card__units,
.course-card__prereq-count {
  display: flex;
  align-items: center;
  gap: 2px;
}
</style>
