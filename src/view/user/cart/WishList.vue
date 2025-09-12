<template>
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex items-center justify-center">
      <h2 class="text-lg font-semibold mb-4 text-white">Lista de deseos</h2>
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
 


      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from '../../../axios'
import PublicationCard from "@/components/PublicationCard.vue";
import { fetchOneArticle } from "@/services/article";
const router = useRouter();
const orders = ref([]);
const showInvoiceModal = ref(false);
const user = ref(null);
const articles = ref([]);


const loadOrders = async () => {
  try {

    user.value = parseInt(localStorage.getItem("id"), 10);
    const response = await api.get(`/owned-wishlist/${user.value}`);

    orders.value = response.data;
    console.log(response)
    // const articlesData = await Promise.all(
    //   orders.value.map((order) => fetchOneArticle(order.publication_id))
    // );

    // articles.value = articlesData.map((res) => res.data);

    // orders.value = orders.value.map((order, index) => {
    //   return {
    //     ...order,
    //     price: articles.value[index].price,
    //   };
    // });

    console.log(orders.value);  
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
  }
};

const cargarPublication = async (id) => {
  router.push({ name: "pub", params: { id } });
};

 

onMounted(async () => {
  user.value = parseInt(localStorage.getItem("id"), 10);
  await loadOrders();
});
</script>
