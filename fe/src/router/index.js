import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

import DashboardView from '../views/Dashboard.vue'

import MovimientosView from '../views/Movimientos.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView },
  { path: '/movimientos', component: MovimientosView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
