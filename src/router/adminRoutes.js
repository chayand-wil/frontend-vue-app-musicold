import AdminLayout from "@/layout/admin/AdminLayout.vue";
import Admin from "@/view/admin/admin.vue";
import Management from "@/view/admin/Management .vue";
import NewPublication from "@/view/admin/NewPublication.vue"; // Asegúrate de importar cualquier componente necesario

const adminRoutes = [
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
        path: 'management', // Ruta completa: '/admin/management'
        name: 'admin_management', 
        component: Management 
      },
      { 
        path: 'new-publication', // Ejemplo de una ruta adicional
        name: 'admin_new_publication', 
        component: NewPublication 
      },
      // Puedes agregar más rutas de admin aquí
    ]
  }
];

export default adminRoutes;