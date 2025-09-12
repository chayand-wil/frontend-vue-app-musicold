<template>

  <div class=" flex items-center justify-center">
    <h2 class="text-lg font-semibold mb-4 text-white">Mis compras</h2>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
    <PublicationCard
      v-for="item in publications"
      :key="item.id"
      :publication="item"
      @cargar-Publication="cargarPublication"
      class="w-72"
    />
  </div>



</template>



<script setup>
 import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchOrdersUser } from '../../../services/order';


const router = useRouter();
const errorMessage = ref("");
const successMessage = ref(""); 
const orders = ref([]);

const user = ref(null);

const publications = ref([]);

//cargar ordees del user
const loadOrders = async () => {
    try {
      const response = await fetchOrdersUser(user.value);
      orders.value = response.data;
      console.log(response);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
    }   
};


onMounted(async () => {
    user.value = parseInt(localStorage.getItem("id"), 10);
    await loadOrders();
});






</script>