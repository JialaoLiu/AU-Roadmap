<script setup>
const props = defineProps({
  course: { type: Object, default: null },
  allCourses: { type: Array, default: () => [] },
});

const emit = defineEmits(['close', 'navigate']);

function findCourseById(id) {
  return props.allCourses.find(c => c.id === id);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="course" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content">
          <div class="modal-header">
            <div>
              <span class="modal-code">{{ course.code }}</span>
              <h2 class="modal-title">{{ course.name }}</h2>
            </div>
            <button class="modal-close" @click="emit('close')">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="modal-body">
            <!-- Info chips -->
            <div class="info-chips">
              <div class="chip">
                <span class="material-symbols-outlined">school</span>
                {{ course.units }} units
              </div>
              <div class="chip" :class="course.is_core ? 'chip--primary' : 'chip--accent'">
                {{ course.is_core ? 'Core' : 'Elective' }}
              </div>
              <div v-if="course.course_group" class="chip">
                <span class="material-symbols-outlined">folder</span>
                {{ course.course_group }}
              </div>
            </div>

            <!-- Prerequisites -->
            <div v-if="course.prerequisites && course.prerequisites.length" class="section">
              <h3>
                <span class="material-symbols-outlined">arrow_back</span>
                Prerequisites
              </h3>
              <div class="related-courses">
                <button
                  v-for="prereq in course.prerequisites"
                  :key="prereq.course_id"
                  class="related-course related-course--prereq"
                  @click="emit('navigate', prereq.course_id)"
                >
                  <span class="related-indicator"></span>
                  <div>
                    <span class="related-code">{{ findCourseById(prereq.course_id)?.code || `ID ${prereq.course_id}` }}</span>
                    <span class="related-name">{{ findCourseById(prereq.course_id)?.name || 'Unknown' }}</span>
                  </div>
                  <span v-if="prereq.is_corequisite" class="coreq-tag">Corequisite</span>
                </button>
              </div>
            </div>

            <!-- Required For -->
            <div v-if="course.prerequisite_for && course.prerequisite_for.length" class="section">
              <h3>
                <span class="material-symbols-outlined">arrow_forward</span>
                Required For
              </h3>
              <div class="related-courses">
                <button
                  v-for="depId in course.prerequisite_for"
                  :key="depId"
                  class="related-course related-course--dependent"
                  @click="emit('navigate', depId)"
                >
                  <span class="related-indicator"></span>
                  <div>
                    <span class="related-code">{{ findCourseById(depId)?.code || `ID ${depId}` }}</span>
                    <span class="related-name">{{ findCourseById(depId)?.name || 'Unknown' }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- No connections -->
            <div v-if="(!course.prerequisites || !course.prerequisites.length) && (!course.prerequisite_for || !course.prerequisite_for.length)" class="section">
              <p class="no-connections">
                <span class="material-symbols-outlined">info</span>
                This course has no prerequisite connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: var(--space-lg);
}

.modal-content {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  max-width: 520px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}

.modal-code {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.5px;
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-top: 2px;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  padding: var(--space-xs);
  border-radius: var(--border-radius-sm);
  flex-shrink: 0;
}

.modal-close:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--space-lg) var(--space-xl);
}

.info-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.chip .material-symbols-outlined {
  font-size: 16px;
}

.chip--primary {
  background: rgba(20, 15, 80, 0.1);
  color: var(--color-primary);
}

.chip--accent {
  background: rgba(240, 171, 0, 0.15);
  color: #b38600;
}

.section {
  margin-bottom: var(--space-lg);
}

.section:last-child {
  margin-bottom: 0;
}

.section h3 {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.section h3 .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-primary);
}

.related-courses {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.related-course {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
  font-family: inherit;
  width: 100%;
}

.related-course:hover {
  border-color: var(--color-primary);
  background: var(--color-white);
}

.related-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.related-course--prereq .related-indicator {
  background: var(--color-secondary);
}

.related-course--dependent .related-indicator {
  background: var(--color-success);
}

.related-code {
  display: block;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.related-name {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.coreq-tag {
  font-size: 10px;
  font-weight: 600;
  background: rgba(25, 118, 210, 0.1);
  color: var(--color-info);
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  margin-left: auto;
}

.no-connections {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

.no-connections .material-symbols-outlined {
  font-size: 18px;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}
</style>
