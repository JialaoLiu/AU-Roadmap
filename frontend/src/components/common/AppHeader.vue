cd ..<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SearchBar from '@/components/common/SearchBar.vue';

const authStore = useAuthStore();
const router = useRouter();
const activeMenu = ref(null);
const mobileMenuOpen = ref(false);

// Mega Menu data structure - 4 main categories (based on official Adelaide University website)
const megaMenuItems = [
  {
    id: 'study',
    label: 'Study',
    columns: [
      {
        type: 'featured',
        title: 'Find Your Degree',
        description: 'Explore our range of undergraduate and postgraduate programs at Adelaide University.',
        cta: { text: 'Explore Programs', to: '/explore' },
      },
      {
        type: 'links',
        title: 'Course Types',
        links: [
          { label: 'Undegraduate Degree', to: '/explore?level=undergraduate' },
          {label: 'Postgraduate Coursework', to: '/explore?level=postgraduate' },
          { label: 'Postgraduate Research', to: '/explore?level=research' },
        ],
      },
      {
        type: 'links',
        title: 'International Students',
        links: [
          { label: 'How To Apply', to: '/explore/apply' },
          { label: 'Life In Adelaide', to: '/explore/campus-life' },
        ],
      },
      {
        type: 'links',
        title: 'Careers',
        links: [
          { label: 'Career Outcomes', to: '/explore/careers' }
        ],
      }
    ],
  },
  {
    id: 'research',
    label: 'Research',
    columns: [
      {
        type: 'featured',
        title: 'Our Research & Innovation',
        description: 'Discover world-leading research and connect with industry partners across disciplines.',
        cta: { text: 'Explore Research', to: '/research' },
      },
      {
        type: 'links',
        title: 'Our Research',
        links: [
          { label: 'Our Performance', to: '/research#performance' },
          { label: 'Research Institutes', to: '/research/institutes' },
          { label: 'Research Impact', to: '/research/impact' },
        ],
      },
      {
        type: 'links',
        title: 'Connect',
        links: [
          { label: 'Partner With Us', to: '/research/connect' },
          { label: 'Research Events', to: '/research/events' },
        ],
      },
      {
        type: 'links',
        title: 'Research Support',
        links: [
          { label: 'Graduate Research School', to: '/research/support#graduate-school' }
        ],
      },
    ],
  },
  {
    id: 'engage',
    label: 'Engage',
    columns: [
      {
        type: 'featured',
        title: 'Connect & Engage',
        description: 'Join our alumni network, explore partnership opportunities, and connect with the Adelaide community.',
        cta: { text: 'Meet Our Alumni', to: '/student/alumni' },
      },
      {
        type: 'links',
        title: 'Alumni',
        links: [
          { label: 'Reconnect', to: '/student/alumni' },
          { label: 'Alumni Networks', to: '/student/alumni#networks' },
          { label: 'Alumni News & Events', to: '/student/alumni#events' },
          { label: 'Awards & Recognition', to: '/student/alumni#awards' },
          { label: 'Become A Volunteer', to: '/student/alumni#volunteer' },
        ],
      },
      {
        type: 'links',
        title: 'Give to Adelaide',
        links: [
          { label: 'Give Now', href: 'https://www.adelaide.edu.au/giving', external: true },
          { label: 'Impact Of Giving', href: 'https://www.adelaide.edu.au/giving/impact', external: true },
        ],
      },
      {
        type: 'links',
        title: 'More Information',
        links: [
          { label: 'Industry & Government', to: '/student/industry' },
          { label: 'Partnerships', to: '/student/industry#partners' },
          { label: 'Global Engagement', href: 'https://www.adelaide.edu.au/global', external: true },
          { label: 'Community', to: '/explore/campus-life' },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'About the Uni',
    columns: [
      {
        type: 'featured',
        title: 'Adelaide University',
        description: 'Learn about our history, mission, and vision for the future of education and research.',
        cta: { text: 'Learn More', href: 'https://www.adelaide.edu.au/about', external: true },
      },
      {
        type: 'links',
        title: 'University Profile',
        links: [
          { label: 'History', href: 'https://www.adelaide.edu.au/about/history', external: true },
          { label: 'Mission & Focus', href: 'https://www.adelaide.edu.au/about/mission', external: true },
          { label: 'The City Of Adelaide', to: '/explore/campus-life' },
          { label: 'Awards & Achievements', href: 'https://www.adelaide.edu.au/about/awards', external: true },
          { label: 'World Rankings', href: 'https://www.adelaide.edu.au/about/rankings', external: true },
        ],
      },
      {
        type: 'links',
        title: 'Leadership & Structure',
        links: [
          { label: 'Faculties & Divisions', href: 'https://www.adelaide.edu.au/faculties', external: true },
          { label: 'Governance', href: 'https://www.adelaide.edu.au/about/governance', external: true },
          { label: 'Vice-Chancellor & President', href: 'https://www.adelaide.edu.au/vice-chancellor', external: true },
        ],
      },
      {
        type: 'links',
        title: 'More Information',
        links: [
          { label: 'News & Events', href: 'https://www.adelaide.edu.au/newsroom', external: true },
          { label: 'University Contacts', href: 'https://www.adelaide.edu.au/directory', external: true },
          { label: 'Safer Campus Community', href: 'https://www.adelaide.edu.au/safer-campus', external: true },
          { label: 'Job Opportunities', href: 'https://www.adelaide.edu.au/jobs', external: true },
        ],
      },
    ],
  },
];

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
    <div class="main-nav-bar">
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
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="toggleMobileMenu"></div>

    <!-- Mobile navigation panel -->
    <nav v-if="mobileMenuOpen" class="mobile-nav" aria-label="Mobile navigation">
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
  position: absolute;
  content: "";
  height: 2px ;
  background-color: var(--color-primary);
  width:70%;
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
  animation: megaSlideIn 0.2s ease;
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
  padding-left: 6px;
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
