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
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="sale in reports.totalSales" :key="sale.period">
                <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ sale.period }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-right text-sm text-gray-500">{{ formatCurrency(sale.total) }}</td>
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
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artículo</th>
                <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad Vendida</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in reports.topItems" :key="item.id">
                <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ index + 1 }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ item.name }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-right text-sm text-gray-500">{{ item.quantity }}</td>
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
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Gastado</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="customer in reports.topCustomers" :key="customer.id">
                <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.name }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-right text-sm text-gray-500">{{ formatCurrency(customer.amount) }}</td>
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
                <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artículo</th>
                <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Puntuación Promedio</th>
                <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nº de Reseñas</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in reports.topRatedItems" :key="item.id">
                <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                <td class="py-4 px-6 whitespace-nowrap text-center text-sm text-yellow-500 font-bold">{{ item.rating.toFixed(1) }} ★</td>
                <td class="py-4 px-6 whitespace-nowrap text-right text-sm text-gray-500">{{ item.reviews }}</td>
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
import { fetchTotalSales, fetchTopClients, fetchArticlesSales, fetchArticlesRating } from './../../services/report'

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
  reports.totalSales = [
    { period: 'Enero 2024', total: 15230.50 },
    { period: 'Febrero 2024', total: 18450.75 },
    { period: 'Marzo 2024', total: 22100.00 },
  ];

  reports.topItems = [
    { id: 1, name: 'Laptop Pro X1', quantity: 152 },
    { id: 2, name: 'Mouse Inalámbrico Ergo', quantity: 340 },
    { id: 3, name: 'Teclado Mecánico RGB', quantity: 210 },
    { id: 4, name: 'Monitor 4K 27"', quantity: 95 },
    { id: 5, name: 'Webcam HD 1080p', quantity: 450 },
  ].sort((a, b) => b.quantity - a.quantity); // Ordenamos por cantidad

  reports.topCustomers = [
    { id: 1, name: 'Ana Torres', amount: 2350.00 },
    { id: 2, name: 'Carlos Gomez', amount: 1980.50 },
    { id: 3, name: 'Luisa Fernandez', amount: 1540.25 },
    { id: 4, name: 'Tech Solutions S.A.', amount: 4800.00 },
  ].sort((a, b) => b.amount - a.amount); // Ordenamos por monto

  reports.topRatedItems = [
    { id: 1, name: 'Mouse Inalámbrico Ergo', rating: 4.9, reviews: 312 },
    { id: 2, name: 'Auriculares con Cancelación de Ruido', rating: 4.8, reviews: 502 },
    { id: 3, name: 'Silla de Oficina Ergonómica', rating: 4.8, reviews: 189 },
    { id: 4, name: 'Laptop Pro X1', rating: 4.7, reviews: 250 },
  ].sort((a, b) => b.rating - a.rating); // Ordenamos por puntuación
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
