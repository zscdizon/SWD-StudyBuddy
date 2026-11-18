import { createRouter, createWebHistory } from 'vue-router'

import WelcomeView from '@/views/WelcomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import AuthCallbackView from '@/views/AuthCallbackView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { getCurrentStudent } from '@/services/auth'
import SubjectsView from '@/views/SubjectsView.vue'
import SubjectDetailView from '@/views/SubjectDetailView.vue'
import ProgressView from '@/views/ProgressView.vue'
import StudySessionView from '@/views/StudySessionView.vue'
import PersonalJournalView from '@/views/PersonalJournalView.vue'
import StudyPlannerView from '@/views/StudyPlannerView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AboutView from '@/views/AboutView.vue'

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
  path: '/about',
  name: 'about',
  component: AboutView,
  meta: { requiresAuth: true },
},
{
  path: '/journal',
  name: 'journal',
  component: PersonalJournalView,
  meta: {
    requiresAuth: true,
  },
},
{
  path: '/planner',
  name: 'planner',
  component: StudyPlannerView,
  meta: { requiresAuth: true },
},
{
  path: '/profile',
  name: 'profile',
  component: ProfileView,
  meta: { requiresAuth: true },
},
{
  path: '/subjects',
  name: 'subjects',
  component: SubjectsView,
  meta: {
    requiresAuth: true,
  },
},
{
  path: '/subjects/:id',
  name: 'subject-detail',
  component: SubjectDetailView,
  meta: {
    requiresAuth: true,
  },
},
{
  path: '/progress',
  name: 'progress',
  component: ProgressView,
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
  path: '/forgot-password',
  name: 'forgot-password',
  component: ForgotPasswordView,
},
{
  path: '/reset-password',
  name: 'reset-password',
  component: ResetPasswordView,
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
  path: '/study-session',
  name: 'study-session',
  component: StudySessionView,
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