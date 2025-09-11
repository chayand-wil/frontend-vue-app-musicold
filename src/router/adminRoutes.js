import AdminLayout from "@/layout/admin/AdminLayout.vue";
import Admin from "@/view/admin/admin.vue";
import Management from "@/view/admin/Management .vue";
import NewPublication from "@/view/admin/NewPublication.vue"; // Asegúrate de importar cualquier componente necesario
import NewArticle from "@/view/admin/NewArticle.vue"; 
import NewArtist from "@/view/admin/NewArtist.vue"; 
import NewUser from "@/view/admin/NewUser.vue"; 
import Article from "@/view/admin/Article.vue"; 


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