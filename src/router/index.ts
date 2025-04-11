import { createRouter, createWebHistory } from 'vue-router'

import MainView from '@/views/MainView.vue'
import TestingView from '@/views/TestingView.vue'
import TrainingView from '@/views/TrainingView.vue'
import ExamView from '@/views/ExamView.vue'
import Marathon from '@/views/MarathonView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AuthorizationView from '@/views/AuthorizationView.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import TicketView from '@/views/TicketView.vue'
import SettingsProfile from '@/views/SettingsProfile.vue'
import ResultPage from '@/views/ResultPage.vue'
import AdminPage from '@/views/AdminPanel.vue'

const routes = [
  { path: '/', name: 'home', component: MainView },
  { path: '/testing', name: 'testing', component: TestingView },
  { path: '/training', name: 'training', component: TrainingView },
  { path: '/exam', name: 'exam', component: ExamView },
  { path: '/marathon', name: 'marathon', component: Marathon },
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/sign-in', name: 'authorization', component: AuthorizationView },
  { path: '/sign-up', name: 'registration', component: RegistrationView },
  { path: '/ticket/:id', name: 'ticket', component: TicketView, props: true },
  { path: '/settings-profile', name: 'settings-profile', component: SettingsProfile },
  { path: '/resultPage', name: 'resultPage', component: ResultPage },
  { path: '/admin', name: 'adminPage', component: AdminPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
