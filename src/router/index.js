import Login from "@/view/login.vue";
import { createRouter, createWebHistory } from "vue-router";
import Register from "@/view/register.vue";
import ActivacionDeLaCuenta from "@/view/activacion_cuenta.vue";
import Forgot_password from "@/view/forgot_password.vue";
import homeLayout from "@/layout/homeLayout.vue";
import homeLayoutUser from "@/layout/user/homeLayoutUser.vue";
import HomeView from "@/view/homeView.vue";
import UserHomeView from "@/view/user/UserHomeView.vue";
import Admin from "@/view/admin/admin.vue";
import DetailPublication from "@/view/user/DetailPublication.vue";
import PublicationView from "@/view/user/PublicationView.vue";
import DetallePublicationLayoutView from "@/layout/DetallePublicationLayoutView.vue";


const routes = [
  {
    path: '/',
    component: homeLayout,
    children: [{ path: '', name: 'invited', component: HomeView }],
  },
 
  {
    path: '/user/home',
    component: homeLayoutUser,
    children: [
      { path: '', name: 'CLIENT', component: UserHomeView },
      {
        path: 'pub/:id/',
        component: DetallePublicationLayoutView,
        children: [
          { path: '', name: 'pub', component: PublicationView, props: true },
          { path: 'datail_song', name: 'datail_song', component: DetailPublication, props: true },
        ],
      },
    ]
  },





  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
  },
  {
    path: "/recover_password",
    name: "recover_password",
    component: Forgot_password,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },

  {
    path: "/activate_acount/:email/",
    name: "activate",
    component: ActivacionDeLaCuenta,
    props: true,
  },

  //  {
  //   path: '/user/home',
  //   component: homeLayout,
  //   children: [
  //     { path: '', name: 'reutilizador', component: HomeView },
  //     { path: 'nosotros', name: 'nosotros', component: NosotrosView },
  //     { path: 'ranking5', name: 'ranking', component: RankingView },
  //     { path: 'ecoemp', name: 'ecoemp', component: EcoempView },
  //     { path: 'publicar', name: 'publicar', component: NewPublicationView },
  //     { path: 'otro', name: 'otro', component: Otro },

  //     ]
  //   },
  // nada -  captura de rutas no encontradas
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'invited' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // // Si el usuario ya esta logueado y trata de ir al login, redirigir según su rol

  if (
    (token && to.name === 'login') ||
    (token && to.name === 'register') ||
    (token && to.name === 'invited')
  ) {
    if (role === 'ADMIN') return next({ name: 'ADMIN' })
    if (role === 'CLIENT') return next({ name: 'CLIENT' })
   }

  // Control por roles
  if (to.name?.startsWith('ADMIN') && role !== 'ADMIN') return next({ name: 'login' })
  if (to.name === 'ACTIVE' && role !== 'ACTIVE') return next({ name: 'login' })

  next();
});
export default router;
