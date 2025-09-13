<template>
  <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
      📊 Panel de Reportes
    </h1>

    <!-- Pestañas de Navegación -->
    <div class="mb-8">
      <div class="flex justify-center border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-3 px-6 font-medium text-sm sm:text-base cursor-pointer focus:outline-none transition-colors duration-300',
            activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Contenido de los Reportes -->
    <div class="bg-white rounded-lg shadow-inner p-6 sm:p-8">
      <!-- Reporte: Ventas totales por período -->
      <div v-if="activeTab === 'totalSales'">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Ventas Totales por Período</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
<thead class="bg-gray-50">
  <tr>
    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Orden</th>
    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Articulo</th>
    <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
    <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Publicación</th>
    <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
  </tr>
</thead>
<tbody class="bg-white divide-y divide-gray-200">
  <tr v-for="order in reports.totalSales" :key="order.order_id">
    <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.order_id }}</td>
    <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ new Date(order.order_date).toLocaleDateString('es-ES') }}</td>
    <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-900 font-medium">{{ order.cliente }}</td>
    <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ order.article_id }}</td>
    <td class="py-4 px-6 whitespace-nowrap text-right text-sm text-gray-500">{{ order.quantity }}</td>
    <td class="py-4 px-6 whitespace-nowrap text-right text-sm text-green-600 font-medium">${{ order.price }}</td>
    <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ order.publication_status }}</td>
    <td class="py-4 px-6 whitespace-nowrap text-sm font-medium" :class="order.state === 'completed' ? 'text-green-500' : 'text-yellow-500'">
      {{ order.state }}
    </td>
  </tr>
</tbody>
          </table>
        </div>
      </div>

      <!-- Reporte: Top 10 artículos más vendidos -->
      <div v-if="activeTab === 'topItems'">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Top 10 Artículos Más Vendidos</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Publicación</th>
                <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Puntuación Promedio</th>
                <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nº de Reseñas</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in reports.topItems" :key="item.publication_id">
                <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.publication_id }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-center text-sm text-yellow-500 font-bold">{{ item.promedio_rating }} </td>
                <td class="py-4 px-6 whitespace-nowrap text-right text-sm text-gray-500">{{ item.total_ratings }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reporte: Clientes top por monto gastado -->
      <div v-if="activeTab === 'topCustomers'">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Clientes Top por Monto Gastado</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Gastado</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="customer in reports.topCustomers" :key="customer.id">
                <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.id }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.cliente }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-right text-sm text-gray-500">{{ formatCurrency(customer.total_gastado) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reporte: Artículos mejor puntuados -->
      <div v-if="activeTab === 'topRatedItems'">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Artículos Mejor Puntuados</h2>
        <div class="overflow-x-auto">
           <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Publicación</th>
                <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status Publicación</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Articulo</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Articulo</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Artista</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artista</th>
                <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Vendido</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in reports.topRatedItems" :key="item.article_id">
                <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.publication_id }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-center text-sm text-yellow-500 font-bold">{{ item.publication_status }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ item.article_id }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ item.article_type }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ item.article_category }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ item.artist_id }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ item.artist_name }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-right text-sm text-gray-900 font-bold">{{ item.total_sold }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { fetchTotal ,fetchTotalSales, fetchTopClients, fetchArticlesSales, fetchArticlesRating } from './../../services/report'

// En una aplicación real, estos servicios vendrían de un archivo similar a './../../services/reports'
// import { fetchTotalSales, fetchTopItems, fetchTopCustomers, fetchTopRatedItems } from './../../services/reports';

const activeTab = ref('totalSales'); // Pestaña activa por defecto

const tabs = [
  { id: 'totalSales', name: 'Ventas Totales' },
  { id: 'topItems', name: 'Artículos Más Vendidos' },
  { id: 'topCustomers', name: 'Top Clientes' },
  { id: 'topRatedItems', name: 'Mejor Puntuados' }
];

// Usamos 'reactive' para agrupar todos los datos de los reportes en un solo objeto
const reports = reactive({
  totalSales: [],
  topItems: [],
  topCustomers: [],
  topRatedItems: []
});

// --- SIMULACIÓN DE DATOS (Mock Data) ---
// Reemplaza esto con las llamadas a tu API real
const loadReportsData = async () => {
  // Simulación de carga
  console.log("Cargando datos de los reportes...");
  
  // Datos de ejemplo
  reports.totalSales = await fetchTotalSales('2000-12-12','2025-12-12');
  console.log( 'reports  ', reports.totalSales )

  reports.topItems = await fetchArticlesRating(10); // Ordenamos por cantidad

  reports.topCustomers = await fetchTopClients(10); // Ordenamos por monto


  reports.topRatedItems = await fetchArticlesSales();
};

// Función para formatear moneda (puedes ajustarla a tu localidad)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Cargar los datos cuando el componente se monte
onMounted(() => {
  loadReportsData();
});
</script>
