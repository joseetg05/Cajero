import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/Dashboard.vue'
import MovimientosView from '../views/Movimientos.vue'
import RetiroView from '../views/RetiroView.vue'
import DepositoView from '../views/DepositoView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/movimientos', component: MovimientosView, meta: { requiresAuth: true } },
  { path: '/retiro', component: RetiroView, meta: { requiresAuth: true } },
  { path: '/deposito', component: DepositoView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard: si la ruta requiere auth y no hay token, redirigir al login
router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.token) {
      return '/login'
    }
  }
})

export default router
