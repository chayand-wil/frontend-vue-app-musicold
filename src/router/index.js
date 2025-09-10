import Login from "@/view/login.vue";
import { createRouter, createWebHistory } from "vue-router";
import Register from "@/view/register.vue";
import ActivacionDeLaCuenta from "@/view/activacion_cuenta.vue";
import Forgot_password from "@/view/forgot_password.vue";
import homeLayout from "@/layout/homeLayout.vue";
import homeLayoutUser from "@/layout/user/UserLayout.vue";
import HomeView from "@/view/homeView.vue";
import UserHomeView from "@/view/user/UserHomeView.vue";
import Admin from "@/view/admin/admin.vue";
import DetailPublication from "@/view/user/DetailPublication.vue";
import PublicationView from "@/view/user/PublicationView.vue";
import DetallePublicationLayoutView from "@/layout/DetallePublicationLayoutView.vue";
import NewPublication from "@/view/admin/NewPublication.vue";
import AdminLayout from "@/layout/admin/AdminLayout.vue";
import InforUser from "@/view/InfoUser.vue";
import Prueba from "@/view/admin/prueba.vue";
import Management from "@/view/admin/Management .vue";
// import jwtDecode from jwtDecode;

const routes = [
  {
    path: '/',
    component: homeLayout,
    children: [{ path: '', name: 'invited', component: HomeView }],
  },
 
  {
    path: '/user/home',
    component: homeLayoutUser,
    meta: { requiresAuth: true, role: 'CLIENT' },
    children: [
      { path: '', name: 'user', component: UserHomeView },
      {
        path: 'pub/:id/',
        component: DetallePublicationLayoutView,
        children: [
          { path: '', name: 'pub', component: PublicationView, props: true },
          { path: 'detail_song', name: 'detail_song', component: DetailPublication, props: true },
        ],
      },
    ]
  },
    {
    path: '/admin/home',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'ADMIN' },
    children: [
      { path: '', name: 'new', component: Admin },
      { path: 'mana', name: 'mana', component: Management },
      // { path: '/mi_cuenta', name: 'mi_cuenta', component: InforUser },
      // {
      //   path: 'pub/:id/',
      //   component: DetallePublicationLayoutView,
      //   children: [
      //     { path: '', name: 'pub', component: PublicationView, props: true },
      //     { path: 'detail_song', name: 'detail_song', component: DetailPublication, props: true },
      //   ],
      // },
    ]
  },

{
  path: "/otro",
  name: "otro",
  component: Prueba,
},



  {
    path: "/login",
    name: "login",
    component: Login,
  },
  // {
  //   path: "/admin",
  //   name: "admin",
  //   meta: { requiresAuth: true, role: 'ADMIN' },
  //   component: Admin,
  // },










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



//  // Si la ruta requiere autenticación y no hay token → redirige a login
//   if (to.meta.requiresAuth && !token) {
//     return next({ name: "login" });
//   }

//   // Si la ruta tiene un rol específico y el usuario no coincide → login
//   if (to.meta.role && to.meta.role !== role) {
//     return next({ name: "login" });
//   }


// //Si esta autenticado y quiere entrar a rutas publicas
// const publicRoutes = ['login', 'register', 'invited', 'recover_password', 'activate']

//  if (token && publicRoutes.includes(to.name)) {
//     if (role === 'ADMIN') return next({ name: 'admin' })
//     if (role === 'CLIENT') return next({ name: 'user' })
//   }


  next();
});
export default router;
