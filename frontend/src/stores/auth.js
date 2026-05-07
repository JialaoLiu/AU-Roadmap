import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as loginApi, register as registerApi, getMe } from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isStudent = computed(() => user.value?.role === 'student');
  const isProspective = computed(() => user.value?.role === 'prospective');
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isAlumni = computed(() => user.value?.role === 'alumni');
  const userRole = computed(() => user.value?.role || null);

  async function login(credentials) {
    loading.value = true;
    try {
      const response = await loginApi(credentials);
      token.value = response.data.data.token;
      user.value = response.data.data.user;
      localStorage.setItem('token', token.value);
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function register(data) {
    loading.value = true;
    try {
      const response = await registerApi(data);
      token.value = response.data.data.token;
      user.value = response.data.data.user;
      localStorage.setItem('token', token.value);
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await getMe();
      user.value = response.data.data;
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isStudent,
    isProspective,
    isAdmin,
    isAlumni,
    userRole,
    login,
    register,
    fetchUser,
    logout,
  };
});
