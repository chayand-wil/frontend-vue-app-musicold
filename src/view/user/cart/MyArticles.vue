<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex items-center justify-center">
      <h2 class="text-lg font-semibold mb-4 text-white">Completar la compra</h2>
    </div>

    <!-- Mensajes de error -->
    <div class="fixed top-20 right-40 z-50 space-y-4 w-[300px]">
      <!-- Mensaje de éxito -->
      <div
        v-if="successMessage"
        class="bg-white backdrop-blur-xs rounded-2xl p-10 shadow-lg text-xl text-verdee"
      >
        {{ successMessage }}
      </div>

      <!-- Mensaje de error de validación -->
      <div
        v-if="errorMessage"
        class="bg-white/10 backdrop-blur-sm rounded-2xl p-10 shadow-lg text-xl text-red-600"
      >
        {{ errorMessage }}
      </div>
    </div>

    <!-- Modal de pago -->
    <div
      v-if="showInvoiceModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-gray-800 rounded-lg shadow-lg w-80 p-6 relative">
        <h3 class="text-lg font-bold mb-4">Detalle de la factura</h3>

        <p><strong>Orden#:</strong> {{ selectedOrder.id }}</p>
        <p><strong>Cantidad:</strong> {{ selectedOrder.quantity }}</p>
        <p>
          <strong>Precio unitario:</strong> ${{
            selectedOrder.price.toFixed(2)
          }}
        </p>
        <p class="mt-2 font-semibold">
          <strong>Total:</strong> ${{
            (selectedOrder.price * selectedOrder.quantity).toFixed(2)
          }}
        </p>

        <button
          @click="closeInvoiceModal"
          class="mt-4 mr-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar
        </button>
        <button
          @click="pagar_ahora(selectedOrder)"
          class="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Pagar
        </button>
      </div>
    </div>

    <div class="mt-4 mb-10 flex items-center justify-center">
      <!-- Filtros -->
      <div class="flex space-x-4 mb-2 text-white">
        <button
          @click="seleccionarEstado('ready_to_shipped')"
          :class="filter === 'ready_to_shipped' ? 'font-bold underline' : ''"
        >
          Listos para envio
        </button>
        <button
          @click="seleccionarEstado('shipped')"
          :class="filter === 'shipped' ? 'font-bold underline' : ''"
        >
          En Camino
        </button>
        <button
          @click="seleccionarEstado('completed')"
          :class="filter === 'completed' ? 'font-bold underline' : ''"
        >
          Completado
        </button>
      </div>
    </div>

    <!-- Tarjetas filtradas -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:grid-cols-4 justify-items-center"
    >
      <div
        v-for="order in pendingOrders"
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
        <!-- <button
          @click="openInvoiceModal(order)"
          class="mb-12 px-3 py-1 bg-gray-500 text-white rounded hover:bg-blue-600"
        >
          Pagar ahora!
        </button> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchOrdersUser, fetchUpdateOrder } from "@/services/order";
import { fetchOneArticle } from "@/services/article";
import PublicationCard from "@/components/PublicationCard.vue";

const router = useRouter();
const errorMessage = ref("");
const successMessage = ref("");
const orders = ref([]);
const showInvoiceModal = ref(false);
const selectedOrder = ref(null);
const filter = ref("ready_to_shipped");
const user = ref(null);
const articles = ref([]);

const pendingOrders = computed(() =>
  orders.value.filter((order) => order.state === filter.value)
);
// Cambiar filtro de estado
function seleccionarEstado(estado) {
  filter.value = estado;
}

const pagar_ahora = async (order) => {
  try {
    const orderData = {
      id: order.id,
      quantity: order.quantity,
      state: "completed",
    };
    console.log(orderData);
    const res = await fetchUpdateOrder(order.id, orderData);
    successMessage.value = res.data.message || "Pago realizado con exito!";
    setTimeout(() => {
      successMessage.value = "";
      router.push("/user/cart/my_articles");
    }, 3000);
  } catch (error) {
    errorMessage.value = error.res?.data || "Error al realizar el pago";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
    console.error("Error al actualizar la orden:", error);
    alert("Error al procesar el pago. Inténtalo de nuevo.");
  }
};

const loadOrders = async () => {
  try {
    const response = await fetchOrdersUser(user.value);
    orders.value = response;

    const articlesData = await Promise.all(
      orders.value.map((order) => fetchOneArticle(order.publication_id))
    );

    articles.value = articlesData.map((res) => res.data);

    orders.value = orders.value.map((order, index) => {
      return {
        ...order,
        price: articles.value[index].price,
      };
    });

    console.log(orders.value);
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
