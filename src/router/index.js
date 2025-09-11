import Login from '@/view/login.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Register from '@/view/register.vue';
import ActivacionDeLaCuenta from '@/view/activacion_cuenta.vue';
import Forgot_password from '@/view/forgot_password.vue';
import homeLayout from '@/layout/homeLayout.vue';
import homeLayoutUser from '@/layout/user/UserLayout.vue';
import HomeView from '@/view/homeView.vue';
import UserHomeView from '@/view/user/UserHomeView.vue';
import DetailPublication from '@/view/user/DetailPublication.vue';
import PublicationView from '@/view/user/PublicationView.vue';
import DetallePublicationLayoutView from '@/layout/DetallePublicationLayoutView.vue';
import AdminLayout from '@/layout/admin/AdminLayout.vue';
import InforUser from '@/view/InfoUser.vue';
import CatotegorysLayout from '@/layout/user/CatotegorysLayout.vue';
import EventsView from '@/view/EventsView.vue';
import PromotionsViewVue from '@/view/PromotionsView.vue.vue';
import FiltrarCatalogoView from '@/view/FiltrarCatalogoView.vue';
import Cart from '@/view/user/Cart.vue';
import SendCodePassword from '@/view/SendCodePassword.vue';
import Admin from "@/view/admin/admin.vue";
import Management from "@/view/admin/Management .vue";
import NewPublication from "@/view/admin/NewPublication.vue"; // Asegúrate de importar cualquier componente necesario
import NewArticle from "@/view/admin/NewArticle.vue"; 
import NewArtist from "@/view/admin/NewArtist.vue"; 
import NewUser from "@/view/admin/NewUser.vue"; 
import Report from "@/view/admin/Report.vue";  




const routes = [
  // {
  //   path: '/',
  //   component: homeLayout,
  //   children: [{ path: '', name: 'invited', component: HomeView }],
  // },

  {
    path: '/user',
    component: homeLayoutUser,
    meta: { requiresAuth: true, role: 'CLIENT' },
    children: [
      {
        path: 'home',
        component: CatotegorysLayout,
        children: [
          { path: '', name: 'articles', component: UserHomeView },
          {
            path: 'promotions',
            name: 'promotions',
            component: PromotionsViewVue,
          },
          { path: 'events', name: 'events', component: EventsView },
        ],
      },
      {
        path: 'pub/:id/',
        component: DetallePublicationLayoutView,
        children: [
          { path: '', name: 'pub', component: PublicationView, props: true },
          {
            path: 'detail_song',
            name: 'detail_song',
            component: DetailPublication,
            props: true,
          },
        ],
      },
      {
        path: 'search',
        name: 'search',
        component: FiltrarCatalogoView,
      },
      {
        path: 'cart',
        name: 'cart',
        component: Cart,
      },
    ],
  },
 

{
    path: '/admin', // La ruta base para la sección de admin
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'ADMIN' },
    children: [
      { 
        path: 'home', // Ruta completa: '/admin/home'
        name: 'admin_home', 
        component: Admin 
      },
    { 
        path: 'articles', // Ruta completa: '/admin/management'
        name: 'admin_article', 
        component: NewArticle
      },
        { 
        path: 'artist', // Ruta completa: '/admin/management'
        name: 'admin_artist', 
        component: NewArtist 
      },
    { 
        path: 'promotions', // Ruta completa: '/admin/management'
        name: 'admin_promotions', 
        component: NewArtist 
      },
        { 
        path: 'events', // Ruta completa: '/admin/management'
        name: 'admin_events', 
        component: Management 
      },
        { 
        path: 'users', // Ruta completa: '/admin/management'
        name: 'admin_users', 
        component: NewUser
      },
        { 
        path: 'reports', // Ruta completa: '/admin/management'
        name: 'admin_reports', 
        component: Report 
      },
      { 
        path: 'new-publication', // Ejemplo de una ruta adicional
        name: 'admin_new_publication', 
        component: NewPublication 
      },
      // Puedes agregar más rutas de admin aquí
    ]
  },









 
  {
    path: '/login',
    name: 'login',
    component: Login,
  },

  {
    path: '/recover_password/:email/',
    name: 'recover_password',
    component: Forgot_password,
    props: true,
  },
  {
    path: '/send_code',
    name: 'send_code',
    component: SendCodePassword,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },

  {
    path: '/activate_acount/:email/',
    name: 'activate',
    component: ActivacionDeLaCuenta,
    props: true,
  },

  // nada -  captura de rutas no encontradas
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'articles' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware de autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  //  // Si la ruta requiere autenticación y no hay token → redirige a login
  //   if (to.meta.requiresAuth && !token) {
  //     return next({ name: 'login' });
  //   }

  //   // Si la ruta tiene un rol específico y el usuario no coincide → login
  //   if (to.meta.role && to.meta.role !== role) {
  //     return next({ name: 'login' });
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
