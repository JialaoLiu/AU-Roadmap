<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({
  email: '',
  password: '',
});
const showPassword = ref(false);

async function handleLogin() {
  try {
    await authStore.login(form.value);
    toast.success('Login successful');

    const redirect = route.query.redirect;
    if (redirect) {
      router.push(redirect);
    } else if (authStore.isAdmin) {
      router.push({ name: 'AdminDashboard' });
    } else if (authStore.isStudent) {
      router.push({ name: 'StudentDashboard' });
    } else {
      router.push({ name: 'Home' });
    }
  } catch (error) {
    toast.error(error.response?.data?.error?.message || 'Login failed');
  }
}
</script>

<template>
  <div class="login-page">
    <div class="auth-card">
      <h2>Welcome Back</h2>
      <p class="auth-subtitle">Sign in to access your program roadmap</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <div class="input-wrapper">
            <span class="material-symbols-outlined input-icon">mail</span>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input with-icon"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <div class="input-wrapper">
            <span class="material-symbols-outlined input-icon">lock</span>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input with-icon"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <span class="material-symbols-outlined">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="authStore.loading">
          {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="auth-footer">
        Don't have an account?
        <RouterLink to="/register">Create one here</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height) - 200px);
  padding: var(--space-xl);
}

.auth-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-xl);
  padding: var(--space-2xl);
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-lg);
}

.auth-card h2 {
  text-align: center;
  margin-bottom: var(--space-xs);
}

.auth-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
  font-size: var(--font-size-sm);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light);
  font-size: 20px;
}

.form-input.with-icon {
  padding-left: 40px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light);
  padding: 4px;
}

.password-toggle .material-symbols-outlined {
  font-size: 20px;
}

.btn-full {
  width: 100%;
  justify-content: center;
  padding: 12px;
  font-size: var(--font-size-md);
  margin-top: var(--space-sm);
}

.auth-footer {
  text-align: center;
  margin-top: var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 500;
}
</style>
