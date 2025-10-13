import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "@/layout/admin/AdminLayout.vue";
import Otro from "@/view/otro.vue";

const routes = [
  // {
  //   path: '/',
  //   component: homeLayout,
  //   children: [{ path: '', name: 'invited', component: HomeView }],
  // },

  {
    path: "/simulation",
    name: "simulacion",
    component: AdminLayout,
    children: [
      {
        path: "",
        component: Otro,
      },
    ],
  },

  // {
  //   path: "/reportes",
  //   name: "reportes",
  //   component: Reportes,
  // },

  // {
  //   path: "/inventario",
  //   name: "inventario",
  //   component: Inventario,
  // },
  // {
  //   path: "/Reos",
  //   name: "Reos",
  //   component: Reos,
  // },

  // nada -  captura de rutas no encontradas
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    redirect: { name: "simulacion" },
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

  // Si la ruta requiere autenticación y no hay token → redirige a login
  if (to.meta.requiresAuth && !token) {
    return next({ name: "login" });
  }

  // Si la ruta tiene un rol específico y el usuario no coincide → login
  if (to.meta.role && to.meta.role !== role) {
    return next({ name: "login" });
  }

  //Si esta autenticado y quiere entrar a rutas publicas
  const publicRoutes = [
    "login",
    "register",
    "invited",
    "recover_password",
    "activate",
  ];

  if (token && publicRoutes.includes(to.name)) {
    if (role === "ADMIN") return next({ name: "admin" });
    if (role === "CLIENT") return next({ name: "user" });
  }

  next();
});
export default router;
