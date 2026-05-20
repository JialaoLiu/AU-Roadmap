<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const TURNSTILE_SITE_KEY = '0x4AAAAAABdkinnD2a45uxc0';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({
  email: '',
  password: '',
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

async function handleLogin() {
  if (!captchaToken.value) {
    toast.error('Please complete the CAPTCHA');
    return;
  }
  try {
    await authStore.login({ ...form.value, captcha: captchaToken.value });
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
    captchaToken.value = '';
    if (widgetId !== null && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  }
}
</script>

<template>
  <div class="login-page">
    <section class="auth-shell">
      <aside class="auth-panel">
        <span class="auth-eyebrow">AU Roadmap</span>
        <h1>Continue your program planning journey.</h1>
        <p>Access your study roadmap, timetable, resources, and community tools from one student portal.</p>
      </aside>

      <div class="auth-card">
        <div class="auth-card-header">
          <span class="material-symbols-outlined auth-card-icon">login</span>
          <div>
            <h2>Sign In</h2>
            <p class="auth-subtitle">Use your account details to access AU Roadmap.</p>
          </div>
        </div>

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

          <div ref="turnstileContainer" class="turnstile-widget"></div>

          <button type="submit" class="btn btn-primary btn-full" :disabled="authStore.loading || !captchaToken">
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account?
          <RouterLink to="/register">Create one here</RouterLink>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - var(--header-height));
  background: rgba(20, 15, 80, 0.025);
  padding: 2rem var(--space-lg) 1.5rem;
  display: flex;
  align-items: center;
}

.auth-shell {
  width: min(1120px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) 500px;
  gap: 1.5rem;
  align-items: stretch;
}

.auth-panel {
  min-height: 31rem;
  border-radius: 8px;
  padding: var(--space-2xl);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: var(--color-white);
  background:
    linear-gradient(135deg, rgba(20, 15, 80, 0.95), rgba(34, 28, 104, 0.86)),
    url('@/assets/images/hero-background.jpg') center / cover;
  box-shadow: 0 20px 44px rgba(20, 15, 80, 0.14);
}

.auth-eyebrow {
  margin-bottom: var(--space-md);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.auth-panel h1 {
  max-width: 34rem;
  margin: 0;
  color: var(--color-white);
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.05;
}

.auth-panel p {
  max-width: 31rem;
  margin: var(--space-md) 0 0;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.7;
}

.auth-card {
  background: var(--color-white);
  border: 1px solid rgba(20, 15, 80, 0.1);
  border-radius: 8px;
  padding: 1.75rem;
  width: 100%;
  min-height: 31rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 14px 30px rgba(20, 15, 80, 0.08);
}

.auth-card-header {
  display: flex;
  gap: var(--space-md);
  align-items: center;
  margin-bottom: 1.25rem;
}

.auth-card-icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(20, 15, 80, 0.08);
  color: var(--color-primary);
}

.auth-card h2 {
  margin-bottom: 4px;
  color: var(--color-text-primary);
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.input-wrapper {
  position: relative;
}

.form-input {
  border-radius: 8px;
  border-color: rgba(20, 15, 80, 0.14);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(20, 15, 80, 0.08);
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
  border-radius: 8px;
}

.password-toggle .material-symbols-outlined {
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
  border-radius: 8px;
}

.auth-footer {
  text-align: center;
  margin-top: 1rem;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 700;
}

@media (max-width: 560px) {
  .login-page {
    padding: var(--space-lg) var(--space-md);
  }

  .auth-shell {
    grid-template-columns: 1fr;
  }

  .auth-panel {
    min-height: 18rem;
  }

  .auth-card {
    min-height: auto;
    padding: var(--space-xl);
  }

  .auth-card-header {
    align-items: flex-start;
  }
}
</style>
