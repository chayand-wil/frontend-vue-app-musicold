<template>
 

  <!-- Contenedor principal centrado -->
  <div class="max-w-4xl mx-auto px-4">
    <!-- Título -->
    <div class="mt-10 mb-6 flex items-center justify-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white">
        Unete a un evento!
      </h1>
    </div>

    <!-- Carrusel horizontal -->

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
    <EventCard
      v-for="item in events"
      :key="item.publication.id"
      :publication="item"
      @cargar-Publication="cargarPublication"
      class="w-72"
    />
  </div>
  </div>




</template>

 <script setup>
 import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import EventCard from "@/components/EventCard.vue";
import { fetchAllEvents } from '../../services/event';


const router = useRouter();
const errorMessage = ref("");
const successMessage = ref("");

const showModal = ref(false);

const events = ref([]);


const loadEvent = async () => {
    try {
        const response = await fetchAllEvents();
        events.value = response;
        console.log(response);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
};


 onMounted(async () => {
    await loadEvent();
});

const cargarPublication = async (id) => {
  router.push({ name: "event", params: { id } });
};



</script>