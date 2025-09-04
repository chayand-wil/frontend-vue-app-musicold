import Admin from '@/view/admin.vue'
import Login from '@/view/login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Invitado from '@/view/invitado.vue'
import Recuperar_contrasena from '@/view/recuperar_contrasena.vue'
import Register from '@/view/register.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: Invitado,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
  },
  {
    path: '/recover_password',
    name: 'recover_password',
    component: Recuperar_contrasena,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
