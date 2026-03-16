import { createRouter, createWebHistory } from 'vue-router'

// Podemos usar una vista por defecto o de prueba
const Home = { template: '<div>Home / Componente por Configurar</div>' }

const routes = [
  { path: '/', component: Home }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
