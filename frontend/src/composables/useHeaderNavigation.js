import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';

export function useHeaderNavigation({
  authStore,
  route,
  router,
}) {
  const activeMenu = ref(null);
  const mobileMenuOpen = ref(false);
  const isStudentPortal = computed(() => route.path.startsWith('/student'));
  const showMainNav = computed(() => !isStudentPortal.value);
  let closeTimeout = null;

  function openMenu(menuId) {
    clearTimeout(closeTimeout);
    activeMenu.value = menuId;
  }

  function startCloseMenu() {
    closeTimeout = setTimeout(() => {
      activeMenu.value = null;
    }, 200);
  }

  function cancelCloseMenu() {
    clearTimeout(closeTimeout);
  }

  function closeMenu() {
    activeMenu.value = null;
  }

  function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value;
    if (!mobileMenuOpen.value) activeMenu.value = null;
  }

  function toggleMobileSubmenu(menuId) {
    activeMenu.value = activeMenu.value === menuId ? null : menuId;
  }

  function handleLogout() {
    authStore.logout();
    closeMenu();
    mobileMenuOpen.value = false;
    router.push({ name: 'Home' });
  }

  function handleNavClick() {
    closeMenu();
    mobileMenuOpen.value = false;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      mobileMenuOpen.value = false;
    }
  }

  onMounted(() => document.addEventListener('keydown', handleKeydown));
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    clearTimeout(closeTimeout);
  });

  return {
    activeMenu,
    mobileMenuOpen,
    isStudentPortal,
    showMainNav,
    openMenu,
    startCloseMenu,
    cancelCloseMenu,
    closeMenu,
    toggleMobileMenu,
    toggleMobileSubmenu,
    handleLogout,
    handleNavClick,
  };
}
