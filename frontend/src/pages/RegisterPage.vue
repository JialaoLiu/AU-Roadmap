<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const TURNSTILE_SITE_KEY = '0x4AAAAAABdkinnD2a45uxc0';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  role: 'prospective',
});
const showPassword = ref(false);
const captchaToken = ref('');
const turnstileContainer = ref(null);
let widgetId = null;

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    widgetId = window.turnstile.render(turnstileContainer.value, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token) => { captchaToken.value = token; },
      'expired-callback': () => { captchaToken.value = ''; },
    });
  };
  document.head.appendChild(script);
});

onUnmounted(() => {
  if (widgetId !== null && window.turnstile) {
    window.turnstile.remove(widgetId);
  }
});

async function handleRegister() {
  if (form.value.password !== form.value.confirm_password) {
    toast.error('Passwords do not match');
    return;
  }

  if (!captchaToken.value) {
    toast.error('Please complete the CAPTCHA');
    return;
  }

  try {
    await authStore.register({
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role,
      captcha: captchaToken.value,
    });
    toast.success('Registration successful');

    if (authStore.isStudent) {
      router.push({ name: 'StudentDashboard' });
    } else {
      router.push({ name: 'Home' });
    }
  } catch (error) {
    toast.error(error.response?.data?.error?.message || 'Registration failed');
    captchaToken.value = '';
    if (widgetId !== null && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  }
}
</script>

<template>
  <div class="register-page">
    <div class="auth-card">
      <h2>Create Account</h2>
      <p class="auth-subtitle">Join AU Roadmap to explore your academic journey</p>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="first_name">First Name</label>
            <input
              id="first_name"
              v-model="form.first_name"
              type="text"
              class="form-input"
              placeholder="First name"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="last_name">Last Name</label>
            <input
              id="last_name"
              v-model="form.last_name"
              type="text"
              class="form-input"
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-email">Email</label>
          <div class="input-wrapper">
            <span class="material-symbols-outlined input-icon">mail</span>
            <input
              id="reg-email"
              v-model="form.email"
              type="email"
              class="form-input with-icon"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">I am a...</label>
          <div class="role-selector">
            <label class="role-option">
              <input type="radio" v-model="form.role" value="prospective" />
              <span class="role-label">
                <span class="material-symbols-outlined">person_search</span>
                Prospective Student
              </span>
            </label>
            <label class="role-option">
              <input type="radio" v-model="form.role" value="student" />
              <span class="role-label">
                <span class="material-symbols-outlined">school</span>
                Current Student
              </span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password">Password</label>
          <div class="input-wrapper">
            <span class="material-symbols-outlined input-icon">lock</span>
            <input
              id="reg-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input with-icon"
              placeholder="Create a password"
              required
              minlength="8"
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

        <div class="form-group">
          <label class="form-label" for="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            v-model="form.confirm_password"
            type="password"
            class="form-input"
            placeholder="Confirm your password"
            required
          />
        </div>

        <div ref="turnstileContainer" class="turnstile-widget"></div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="authStore.loading || !captchaToken">
          {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="auth-footer">
        Already have an account?
        <RouterLink to="/login">Sign in here</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-page {
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
  max-width: 480px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
}

.role-option {
  cursor: pointer;
}

.role-option input {
  display: none;
}

.role-label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.role-option input:checked + .role-label {
  border-color: var(--color-primary);
  background: rgba(0, 40, 85, 0.05);
  color: var(--color-primary);
}

.role-label .material-symbols-outlined {
  font-size: 20px;
}

.turnstile-widget {
  display: flex;
  justify-content: center;
  margin-top: var(--space-xs);
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
