import { createRouter, createWebHistory } from 'vue-router'

import WelcomeView from '@/views/WelcomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import AuthCallbackView from '@/views/AuthCallbackView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { getCurrentStudent } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
  {
  path: '/',
  name: 'welcome',
  component: WelcomeView,
  },
 {
  path: '/dashboard',
  name: 'dashboard',
  component: DashboardView,
  meta: {
    requiresAuth: true,
  },
},
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
  path: '/onboarding',
  name: 'onboarding',
  component: OnboardingView,
  meta: {
    requiresAuth: true,
  },
},
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallbackView,
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    try {
      await getCurrentStudent()
    } catch {
      return { name: 'welcome' }
    }
  }
})

export default router