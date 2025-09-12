<template>
<div class="max-w-7xl mx-auto px-4">

  <div class="flex items-center justify-center">
    <h2 class="text-lg font-semibold mb-4 text-white">Completar la compra</h2>
  </div>

  <div
    v-if="showInvoiceModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-80 p-6 relative">
      <h3 class="text-lg font-bold mb-4">Detalle de la factura</h3>

      <p><strong>Orden#:</strong> {{ selectedOrder.id }}</p>
      <p><strong>Cantidad:</strong> {{ selectedOrder.quantity }}</p>
      <p>
        <strong>Precio unitario:</strong> ${{ selectedOrder.price.toFixed(2) }}
      </p>
      <p class="mt-2 font-semibold">
        <strong>Total:</strong> ${{
          (selectedOrder.price * selectedOrder.quantity).toFixed(2)
        }}
      </p>

      <button
        @click="closeInvoiceModal"
        class="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cerrar
      </button>
    </div>
  </div>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 lg:grid-cols-4 justify-items-center"
  >
    <div
      v-for="order in orders"
      :key="order.id"
      class="flex flex-col items-center"
    >
      <PublicationCard
        :publication="order"
        @cargar-Publication="cargarPublication"
        class="w-72"
      />
      <div class="mb-2 font-semibold text-white text-center">
        Orden# {{ order.id }} - Cantidad: {{ order.quantity }}
      </div>
      <button
        @click="openInvoiceModal(order)"
        class="mb-12 px-3 py-1 bg-gray-500 text-white rounded hover:bg-blue-600"
      >
        Ver factura
      </button>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchOrdersUser } from "@/services/order";
import { fetchOneArticle } from "@/services/article";
import PublicationCard from "@/components/PublicationCard.vue";

const router = useRouter();
const errorMessage = ref("");
const successMessage = ref("");
const orders = ref([]);
const articlesWithPrice = ref([]); // <-- array final con price agregado
const showInvoiceModal = ref(false); // controla si el modal se muestra
const selectedOrder = ref(null); // almacena la orden que se va a mostrar

const user = ref(null);

const articles = ref([]);

//cargar ordees del user
const loadOrders = async () => {
  try {
    const response = await fetchOrdersUser(user.value);
    orders.value = response;

    // Obtener todos los artículos de manera concurrente
    const articlesData = await Promise.all(
      orders.value.map((order) => fetchOneArticle(order.publication_id))
    );

    // Guardar solo los datos de los artículos
    articles.value = articlesData.map((res) => res.data);

    // Agregar price directamente dentro de cada objeto de order
    orders.value = orders.value.map((order, index) => {
      return {
        ...order,
        price: articles.value[index].price,
      };
    });

    console.log(orders.value); // Ahora cada order tiene su price
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
  }
};

const cargarPublication = async (id) => {
  router.push({ name: "pub", params: { id } });
};

const openInvoiceModal = (order) => {
  selectedOrder.value = order;
  showInvoiceModal.value = true;
};

const closeInvoiceModal = () => {
  showInvoiceModal.value = false;
  selectedOrder.value = null;
};

onMounted(async () => {
  user.value = parseInt(localStorage.getItem("id"), 10);
  await loadOrders();
});
</script>
