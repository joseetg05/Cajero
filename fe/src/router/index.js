import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: { template: '<div>Dashboard Placeholder (En Construcción)</div>' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
