import { createRouter, createWebHistory } from 'vue-router'

import MainView from '../views/MainView.vue'
import TestingView from '@/views/TestingView.vue'
import TrainingView from '@/views/TrainingView.vue'
import ExamView from '@/views/ExamView.vue'
import Marathon from '@/views/MarathonView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AuthorizationView from '@/views/AuthorizationView.vue'
import RegistrationView from '@/views/RegistrationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/testing',
      name: 'testing',
      component: TestingView,
    },
    {
      path: '/training',
      name: 'training',
      component: TrainingView,
    },
    {
      path: '/exam',
      name: 'exam',
      component: ExamView,
    },
    {
      path: '/marathon',
      name: 'marathon',
      component: Marathon,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/authorization',
      name: 'authorization',
      component: AuthorizationView,
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationView,
    },
  ],
})

export default router
