import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true);
  const globalLoading = ref(false);

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function setGlobalLoading(value) {
    globalLoading.value = value;
  }

  return {
    sidebarOpen,
    globalLoading,
    toggleSidebar,
    setGlobalLoading,
  };
});
