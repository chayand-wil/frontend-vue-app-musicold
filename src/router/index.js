import Admin from '@/view/admin.vue'
import Login from '@/view/login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Invitado from '@/view/invitado.vue'
import Register from '@/view/register.vue'
import Comun_user from '@/view/comun_user.vue'
import ActivacionDeLaCuenta from '@/view/activacion_cuenta.vue'
import Forgot_password from '@/view/forgot_password.vue'
import homeLayout from '@/layout/homeLayout.vue'
import HomeView from '@/view/homeView.vue'

const routes = [

     {
    path: '/',
    name: 'index',
    component: homeLayout,
    children: [
      { path: '', name: 'invited', component:HomeView  },
      ]
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
    path: '/comun_user',
    name: 'comun_user',
    component: Comun_user,
  },
  {
    path: '/recover_password',
    name: 'recover_password',
    component: Forgot_password,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },

  {
    path: '/activate_acount/:email/',
    name: "activate",
    component: ActivacionDeLaCuenta, props: true,
  },



  //  {
  //   path: '/user/home',
  //   component: homeLayout,
  //   children: [
  //     { path: '', name: 'reutilizador', component: HomeView },
  //     { path: 'nosotros', name: 'nosotros', component: NosotrosView },
  //     { path: 'ranking', name: 'ranking', component: RankingView },
  //     { path: 'ecoemp', name: 'ecoemp', component: EcoempView },
  //     { path: 'publicar', name: 'publicar', component: NewPublicationView },
  //     { path: 'otro', name: 'otro', component: Otro },
      
  //     ]
  //   },
  //nada -  captura de rutas no encontradas
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found',
  //   redirect: { name: 'visitor' },
  // },
 
]




const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Middleware de autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // // Si el usuario ya esta logueado y trata de ir al login, redirigir según su rol

  // if (
  //   (token && to.name === 'login') ||
  //   (token && to.name === 'register') ||
  //   (token && to.name === 'visitor')
  // ) {
  //   if (role === 'ADMIN') return next({ name: 'ADMIN' })
  //   if (role === 'ACTIVE') return next({ name: 'ACTIVE' })
  //  }

  // // Control por roles
  // if (to.name?.startsWith('ADMIN') && role !== 'ADMIN') return next({ name: 'login' })
  // if (to.name === 'ACTIVE' && role !== 'ACTIVE') return next({ name: 'login' })

  next()
})
export default router


