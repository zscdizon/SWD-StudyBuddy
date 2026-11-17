import { createRouter, createWebHistory } from 'vue-router'

import WelcomeView from '@/views/WelcomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import AuthCallbackView from '@/views/AuthCallbackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
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
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallbackView,
    },
  ],
})

export default router