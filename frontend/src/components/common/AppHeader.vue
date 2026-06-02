<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SearchBar from '@/components/common/SearchBar.vue';
import { useHeaderNavigation } from '@/composables/useHeaderNavigation';
import { megaMenuItems } from '@/utils/headerNavigation';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const {
  activeMenu,
  mobileMenuOpen,
  isStudentPortal,
  showMainNav,
  openMenu,
  startCloseMenu,
  cancelCloseMenu,
  toggleMobileMenu,
  toggleMobileSubmenu,
  handleLogout,
  handleNavClick,
} = useHeaderNavigation({
  authStore,
  route,
  router,
});
</script>

<template>
  <header class="app-header">
    <!-- Top utility bar (matches official Adelaide University style) -->
    <div class="utility-bar">
      <div class="utility-container">
        <div class="utility-left">
          <RouterLink to="/student" class="utility-link" @click="handleNavClick">Current Students</RouterLink>
          <a href="https://www.adelaide.edu.au/staff" target="_blank" rel="noopener" class="utility-link">Staff</a>
          <RouterLink to="/student/alumni" class="utility-link" @click="handleNavClick">Alumni</RouterLink>
        </div>
        <div class="utility-right">
          <RouterLink
            v-if="isStudentPortal"
            to="/"
            class="utility-home-link"
            @click="handleNavClick"
            aria-label="Return to Adelaide University home"
            title="University Home"
          >
            <span class="material-symbols-outlined utility-home-logo" aria-hidden="true">home</span>
            <span class="utility-home-label">University Home</span>
          </RouterLink>
          <template v-if="authStore.isAuthenticated">
            <RouterLink v-if="authStore.isStudent" to="/student" class="utility-link" @click="handleNavClick">
              <span class="material-symbols-outlined utility-icon">person</span>
              {{ authStore.user?.first_name || 'My Account' }}
            </RouterLink>
            <RouterLink v-if="authStore.isAdmin" to="/admin" class="utility-link" @click="handleNavClick">
              <span class="material-symbols-outlined utility-icon">admin_panel_settings</span>
              Admin
            </RouterLink>
            <button class="utility-link utility-btn" @click="handleLogout">
              <span class="material-symbols-outlined utility-icon">logout</span>
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="utility-link" @click="handleNavClick">
              <span class="material-symbols-outlined utility-icon">login</span>
              Login
            </RouterLink>
            <RouterLink to="/register" class="utility-link" @click="handleNavClick">
              <span class="material-symbols-outlined utility-icon">person_add</span>
              Register
            </RouterLink>
          </template>
        </div>
      </div>
    </div>

    <!-- Main navigation bar -->
    <div v-if="showMainNav" class="main-nav-bar">
      <div class="nav-container">
        <RouterLink to="/" class="header-logo" @click="handleNavClick">
          <img src="@/assets/images/adelaide-university-logo.png" alt="Adelaide University" class="logo-img" />
        </RouterLink>

        <!-- Search Bar -->
        <SearchBar class="header-search" />

        <!-- Desktop Mega Menu Navigation -->
        <nav class="main-nav desktop-nav" aria-label="Main navigation">
          <ul class="nav-list">
            <li
              v-for="item in megaMenuItems"
              :key="item.id"
              class="nav-item has-mega-menu"
              @mouseenter="openMenu(item.id)"
              @mouseleave="startCloseMenu"
            >
              <button
                class="nav-trigger"
                :class="{ active: activeMenu === item.id }"
                :aria-expanded="activeMenu === item.id"
                @click="activeMenu = activeMenu === item.id ? null : item.id"
              >
                {{ item.label }}
                <span class="material-symbols-outlined nav-arrow">
                  {{ activeMenu === item.id ? 'expand_less' : 'expand_more' }}
                </span>
              </button>

              <!-- Mega Menu Panel -->
              <div
                v-show="activeMenu === item.id"
                class="mega-menu"
                @mouseenter="cancelCloseMenu"
                @mouseleave="startCloseMenu"
              >
                <div class="mega-menu-inner">
                  <div
                    v-for="(col, colIdx) in item.columns"
                    :key="colIdx"
                    class="mega-column"
                    :class="{ 'mega-column-featured': col.type === 'featured' }"
                  >
                    <template v-if="col.type === 'featured'">
                      <h3 class="mega-featured-title">{{ col.title }}</h3>
                      <p class="mega-featured-desc">{{ col.description }}</p>
                      <a
                        v-if="col.cta.external"
                        :href="col.cta.href"
                        target="_blank"
                        rel="noopener"
                        class="mega-cta"
                        @click="handleNavClick"
                      >
                        {{ col.cta.text }}
                        <span class="material-symbols-outlined">arrow_forward</span>
                      </a>
                      <RouterLink v-else :to="col.cta.to" class="mega-cta" @click="handleNavClick">
                        {{ col.cta.text }}
                        <span class="material-symbols-outlined">arrow_forward</span>
                      </RouterLink>
                    </template>
                    <template v-else>
                      <h4 class="mega-column-title">{{ col.title }}</h4>
                      <ul class="mega-links">
                        <li v-for="(link, linkIdx) in col.links" :key="linkIdx">
                          <a
                            v-if="link.external"
                            :href="link.href"
                            target="_blank"
                            rel="noopener"
                            class="mega-link"
                            @click="handleNavClick"
                          >
                            {{ link.label }}
                            <span class="material-symbols-outlined external-icon">open_in_new</span>
                          </a>
                          <RouterLink
                            v-else
                            :to="link.to"
                            class="mega-link"
                            @click="handleNavClick"
                          >
                            {{ link.label }}
                          </RouterLink>
                        </li>
                      </ul>
                    </template>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>

        <!-- Mobile hamburger -->
        <button class="mobile-toggle" @click="toggleMobileMenu" :aria-expanded="mobileMenuOpen" aria-label="Toggle menu">
          <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile overlay -->
    <div v-if="showMainNav && mobileMenuOpen" class="mobile-overlay" @click="toggleMobileMenu"></div>

    <!-- Mobile navigation panel -->
    <nav v-if="showMainNav && mobileMenuOpen" class="mobile-nav" aria-label="Mobile navigation">
      <div v-for="item in megaMenuItems" :key="item.id" class="mobile-section">
        <button class="mobile-section-trigger" @click="toggleMobileSubmenu(item.id)" :aria-expanded="activeMenu === item.id">
          {{ item.label }}
          <span class="material-symbols-outlined">{{ activeMenu === item.id ? 'expand_less' : 'expand_more' }}</span>
        </button>
        <div v-show="activeMenu === item.id" class="mobile-submenu">
          <template v-for="(col, colIdx) in item.columns" :key="colIdx">
            <template v-if="col.type === 'links'">
              <h5 class="mobile-group-title">{{ col.title }}</h5>
              <RouterLink
                v-for="(link, linkIdx) in col.links"
                :key="linkIdx"
                :to="link.to || '/'"
                class="mobile-link"
                @click="handleNavClick"
              >
                {{ link.label }}
              </RouterLink>
            </template>
            <template v-else>
              <RouterLink :to="col.cta.to" class="mobile-cta" @click="handleNavClick">
                {{ col.cta.text }}
                <span class="material-symbols-outlined">arrow_forward</span>
              </RouterLink>
            </template>
          </template>
        </div>
      </div>
      <div class="mobile-auth">
        <template v-if="authStore.isAuthenticated">
          <RouterLink v-if="authStore.isStudent" to="/student" class="mobile-link" @click="handleNavClick">
            <span class="material-symbols-outlined">person</span> My Dashboard
          </RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin" class="mobile-link" @click="handleNavClick">
            <span class="material-symbols-outlined">admin_panel_settings</span> Admin
          </RouterLink>
          <button class="mobile-link mobile-logout" @click="handleLogout">
            <span class="material-symbols-outlined">logout</span> Logout
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-secondary mobile-auth-btn" @click="handleNavClick">Login</RouterLink>
          <RouterLink to="/register" class="btn btn-primary mobile-auth-btn" @click="handleNavClick">Register</RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* ==========================================
   UTILITY BAR - top thin bar with #140f50 bg
   ========================================== */
.utility-bar {
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  height: 36px;
}

.utility-container {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 var(--space-md);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.utility-left, .utility-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.utility-home-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 4px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.84);
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.utility-home-link:hover {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.1);
}

.utility-home-logo {
  font-size: 18px;
  line-height: 1;
  opacity: 0.96;
  flex-shrink: 0;
}

.utility-home-label {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: var(--font-size-xs);
  font-weight: 600;
  transition: max-width var(--transition-fast), opacity var(--transition-fast);
}

.utility-home-link:hover .utility-home-label,
.utility-home-link:focus-visible .utility-home-label {
  max-width: 120px;
  opacity: 1;
}

.utility-link {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-xs);
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color var(--transition-fast);
}

.utility-link:hover { color: var(--color-white); }

.utility-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.utility-icon { font-size: 16px; }

/* ==========================================
   MAIN NAV BAR - white bg, #140f50 bottom border
   ========================================== */
.main-nav-bar {
  background: var(--color-white);
  /* border-bottom: 3px solid var(--color-primary); */
  box-shadow: var(--shadow-md);
  height: 64px;
}

.nav-container {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 var(--space-md);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
}

.header-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 56px;
  width: auto;
}

/* ==========================================
   DESKTOP MEGA MENU
   ========================================== */
.nav-list {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 var(--space-lg);
  height: 100%;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition-fast);
  /* border-bottom: 3px solid transparent; */
  margin-bottom: -3px;
}

.nav-trigger:hover, .nav-trigger.active {
  position: relative;
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* line below the button whe trigger */
.nav-trigger:hover::after, .nav-trigger.active::after {
  background-color: var(--color-primary);
  width:70%;
  transition: all var(--transition-slow);
  
}

.nav-trigger::after {
  position: absolute;
  content: "";
  height: 2px ;
  background-color: transparent;
  width:0%;
  left:50%;
  transform: translateX(-50%);
  bottom : -4px;
}

.nav-arrow { font-size: 20px; }

/* Mega Menu Panel - #140f50 background */
.mega-menu {
  position: fixed;
  top: var(--header-height);
  right: 10%;
  width: 950px;
  background: var(--color-primary);
  color: var(--color-white);
  box-shadow: var(--shadow-xl);
  z-index: 200;
  animation: megaSlideIn 0.35s ease;
}

@keyframes megaSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.mega-menu-inner {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2xl);
  padding: var(--space-xl) var(--space-2xl);
}

.mega-column {
  min-width: 150px;
  flex: none;
}

/* Featured column (left, with CTA) */
.mega-column-featured {
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  padding-right: var(--space-xl);
  flex: 1.1;
}

.mega-featured-title {
  color: var(--color-white);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.mega-featured-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  margin-bottom: var(--space-lg);
}

.mega-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-white);
  color: var(--color-primary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.mega-cta:hover {
  background: var(--color-gray-100);
  transform: translateX(4px);
}

.mega-cta .material-symbols-outlined { font-size: 18px; }

/* Link columns */
.mega-column-title {
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--space-md);
}

.mega-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.mega-link {
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--font-size-sm);
  padding: 5px 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all var(--transition-fast);
}

.mega-link:hover {
  color: var(--color-white);
  transform: translateX(6px);
}

.external-icon { font-size: 14px; opacity: 0.5; }

/* ==========================================
   MOBILE
   ========================================== */
.mobile-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-primary);
}

.mobile-toggle .material-symbols-outlined { font-size: 28px; }

.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 150;
}

.mobile-nav {
  display: none;
  position: fixed;
  top: 100px;
  right: 0;
  width: 320px;
  max-height: calc(100vh - 100px);
  background: var(--color-white);
  border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  overflow-y: auto;
  z-index: 200;
  padding: var(--space-md);
}

.mobile-section { border-bottom: 1px solid var(--color-border); }

.mobile-section-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-md);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.mobile-submenu { padding: 0 var(--space-md) var(--space-md); }

.mobile-group-title {
  color: var(--color-text-light);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: var(--space-md) 0 var(--space-sm);
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.mobile-link .material-symbols-outlined { font-size: 18px; }

.mobile-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-primary);
  font-weight: 600;
  font-size: var(--font-size-sm);
  padding: var(--space-sm) 0;
  margin-bottom: var(--space-sm);
}

.mobile-auth {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.mobile-auth-btn {
  width: 100%;
  justify-content: center;
  padding: 10px;
}

.mobile-logout {
  color: var(--color-error);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-size-sm);
}

/* ==========================================
   RESPONSIVE
   ========================================== */
.header-search {
  margin: 0 var(--space-md);
}

@media (max-width: 900px) {
  .desktop-nav { display: none; }
  .header-search { display: none; }
  .mobile-toggle { display: flex; }
  .mobile-overlay, .mobile-nav { display: block; }
  .utility-left { display: none; }
}
</style>
