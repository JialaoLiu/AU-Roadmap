import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/pages/HomePage.vue'),
          meta: { title: 'Adelaide University Program Roadmap' },
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/pages/LoginPage.vue'),
          meta: { title: 'Login' },
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/pages/RegisterPage.vue'),
          meta: { title: 'Register' },
        },
      ],
    },

    // Level 2 - Prospective Students (public, SEO-optimized)
    {
      path: '/explore',
      component: () => import('@/layouts/Level2Layout.vue'),
      children: [
        {
          path: '',
          name: 'Explore',
          component: () => import('@/pages/level2/ExplorePage.vue'),
          meta: { title: 'Explore Programs' },
        },
        {
          path: 'programs/:id',
          name: 'ProgramPreview',
          component: () => import('@/pages/level2/ProgramPreviewPage.vue'),
          meta: { title: 'Program Details' },
        },
        {
          path: 'careers',
          name: 'CareerOutcomes',
          component: () => import('@/pages/level2/CareerOutcomesPage.vue'),
          meta: { title: 'Career Outcomes' },
        },
        {
          path: 'campus-life',
          name: 'CampusLife',
          component: () => import('@/pages/level2/CampusLifePage.vue'),
          meta: { title: 'Campus Life' },
        },
        {
          path: 'apply',
          name: 'ApplicationGuide',
          component: () => import('@/pages/level2/ApplicationGuidePage.vue'),
          meta: { title: 'How to Apply' },
        },
        {
          path: 'quiz',
          name: 'Quiz',
          component: () => import('@/pages/level2/QuizPage.vue'),
          meta: { title: 'Program Recommendation' },
        },
      ],
    },

    // Research & Innovation (public)
    {
      path: '/research',
      component: () => import('@/layouts/Level2Layout.vue'),
      children: [
        {
          path: '',
          name: 'ResearchHome',
          component: () => import('@/pages/research/ResearchHomePage.vue'),
          meta: { title: 'Research & Innovation' },
        },
        {
          path: 'impact',
          name: 'ResearchImpact',
          component: () => import('@/pages/research/ResearchImpactPage.vue'),
          meta: { title: 'Research Impact' },
        },
        {
          path: 'connect',
          name: 'ResearchConnect',
          component: () => import('@/pages/research/ResearchConnectPage.vue'),
          meta: { title: 'Connect With Us' },
        },
        {
          path: 'support',
          name: 'ResearchSupport',
          component: () => import('@/pages/research/ResearchSupportPage.vue'),
          meta: { title: 'Research Support' },
        },
        {
          path: 'institutes',
          name: 'ResearchInstitutes',
          component: () => import('@/pages/research/ResearchInstitutesPage.vue'),
          meta: { title: 'Research Institutes' },
        },
        {
          path: 'events',
          name: 'ResearchEvents',
          component: () => import('@/pages/research/ResearchEventsPage.vue'),
          meta: { title: 'Research Events' },
        },
      ],
    },

    // Level 1 - Current Students (auth required)
    {
      path: '/student',
      component: () => import('@/layouts/Level1Layout.vue'),
      meta: { requiresAuth: true, role: 'student' },
      children: [
        {
          path: '',
          name: 'StudentDashboard',
          component: () => import('@/pages/level1/DashboardPage.vue'),
          meta: { title: 'My Dashboard' },
        },
        {
          path: 'program/:id',
          name: 'ProgramDetail',
          component: () => import('@/pages/level1/ProgramDetailPage.vue'),
          meta: { title: 'My Program' },
        },
        {
          path: 'roadmap',
          name: 'Roadmap',
          component: () => import('@/pages/level1/RoadmapPage.vue'),
          meta: { title: 'My Roadmap' },
        },
        {
          path: 'timetable',
          name: 'Timetable',
          component: () => import('@/pages/level1/TimetablePage.vue'),
          meta: { title: 'My Timetable' },
        },
        {
          path: 'industry',
          name: 'Industry',
          component: () => import('@/pages/level1/IndustryPage.vue'),
          meta: { title: 'Industry Connections' },
        },
        {
          path: 'community',
          name: 'Community',
          component: () => import('@/pages/level1/CommunityHubPage.vue'),
          meta: { title: 'Community Hub' },
        },
        { path: 'alumni', redirect: { name: 'Community' } },
        { path: 'discussion', redirect: { name: 'Community' } },
        {
          path: 'resources',
          name: 'Resources',
          component: () => import('@/pages/level1/ResourcesPage.vue'),
          meta: { title: 'Student Resources' },
        },
        {
          path: 'profile',
          name: 'StudentProfile',
          component: () => import('@/pages/level1/ProfilePage.vue'),
          meta: { title: 'My Profile' },
        },
      ],
    },

    // Admin Panel (auth required, admin role)
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('@/pages/admin/AdminDashboard.vue'),
          meta: { title: 'Admin Dashboard' },
        },
        {
          path: 'programs',
          name: 'ManagePrograms',
          component: () => import('@/pages/admin/ManagePrograms.vue'),
          meta: { title: 'Manage Programs' },
        },
        {
          path: 'courses',
          name: 'ManageCourses',
          component: () => import('@/pages/admin/ManageCourses.vue'),
          meta: { title: 'Manage Courses' },
        },
        {
          path: 'alumni',
          name: 'ManageAlumni',
          component: () => import('@/pages/admin/ManageAlumni.vue'),
          meta: { title: 'Manage Alumni' },
        },
        {
          path: 'industry',
          name: 'ManageIndustry',
          component: () => import('@/pages/admin/ManageIndustry.vue'),
          meta: { title: 'Manage Industry Partners' },
        },
        {
          path: 'careers',
          name: 'ManageCareers',
          component: () => import('@/pages/admin/ManageCareers.vue'),
          meta: { title: 'Manage Career Data' },
        },
        {
          path: 'users',
          name: 'ManageUsers',
          component: () => import('@/pages/admin/ManageUsers.vue'),
          meta: { title: 'Manage Users' },
        },
      ],
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: { title: '404 - Page Not Found' },
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  },
});

// Navigation guards
router.beforeEach(async (to, from) => {
  const defaultTitle = 'AU Roadmap';
  document.title = to.meta.title
    ? `${to.meta.title} | ${defaultTitle}`
    : defaultTitle;

  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } };
  }

  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Allow alumni to access student pages (community hub)
    if (to.meta.role === 'student' && authStore.user?.role === 'alumni') {
      return true;
    }
    if (authStore.isAdmin) return { name: 'AdminDashboard' };
    if (authStore.isStudent) return { name: 'StudentDashboard' };
    return { name: 'Home' };
  }

  if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    if (authStore.isAdmin) return { name: 'AdminDashboard' };
    if (authStore.isStudent) return { name: 'StudentDashboard' };
    if (authStore.isAlumni) return { name: 'Community' };
    return { name: 'Home' };
  }
});

export default router;
