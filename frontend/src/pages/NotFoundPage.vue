<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="not-found-page">
    <span class="material-symbols-outlined error-icon">error</span>
    <h1>404</h1>
    <p>The page you're looking for doesn't exist.</p>
    <RouterLink to="/" class="btn btn-primary">
      <span class="material-symbols-outlined">home</span>
      Back to Home
    </RouterLink>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: var(--space-xl);
}

.error-icon {
  font-size: 64px;
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
}

h1 {
  font-size: 4rem;
  color: var(--color-primary);
  margin-bottom: var(--space-sm);
}

p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
}
</style>
