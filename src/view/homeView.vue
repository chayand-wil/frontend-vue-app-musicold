<template>
  <!-- Mensaje de éxito -->
  <div
    v-if="successMessage"
    class="bg-white/20 backdrop-blur-sm rounded-2xl p-10 shadow-lg text-xl text-verdee"
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
    <!-- Modal -->
    <InviteModal 
      :show="showModal" 
      @close="showModal = false" 
      @action="handleAction"
    />
  
  <div class="ml-12 mt-20  flex items-center justify-left">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">Lo mas nuevo</h1>
  </div>
  <div class="mr-10 ml-10 overflow-x-auto whitespace-nowrap px-6">
    <div class="inline-flex gap-4">
      <PublicationCard
        v-for="item in publications"
        :key="item.id"
        :publication="item"
        @cargar-Publication="cargarPublication"
        class="w-72 flex-shrink-0"
      />
    </div>
  </div>

  <div class="ml-12 mt-8  flex items-center justify-left">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">Mas gustado</h1>
  </div>
  
  <!-- <div class="mr-10 ml-10 overflow-x-auto whitespace-nowrap px-6"> -->
    <div class="mr-10 ml-10 overflow-x-auto whitespace-nowrap px-6 custom-scroll">
    <div class="inline-flex gap-4">
      <PublicationCard
        v-for="item in publications"
        :key="item.id"
        :publication="item"
        @cargar-Publication="cargarPublication"
      />
    </div>
  </div>

  <div class="ml-12 mt-8  flex items-center justify-left">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">Mas comentado</h1>
  </div>
  


</template>

<script setup>

import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../axios";
import PublicationCard from "@/components/PublicationCard.vue";
import InviteModal from '../components/InviteModal.vue';


const router = useRouter();
const errorMessage = ref("");
const successMessage = ref("");


const showModal = ref(false);


// const publications = ref([]);

const publications = ref([
  { id: 1, nombre: "Ana López", titulo: "Reciclaje de botellas PET" },
  { id: 2, nombre: "Carlos Pérez", titulo: "Ideas para reutilizar cartón" },
  { id: 3, nombre: "María García", titulo: "Arte con materiales reciclados" },
  {
    id: 4,
    nombre: "Javier Martínez",
    titulo: "Cómo reducir el plástico en casa",
  },
  {
    id: 5,
    nombre: "Lucía Fernández",
    titulo: "Compostaje en espacios pequeños",
  }
  
]);

const cargarPublications = async () => {
  try {
    const res = await api.get('/article')
    // alert('alogla')
    publications.value = res.data.data
    // console.log(publications.value)
    //filtrar
    // filtrar()
  } catch (e) {
    errorMessage.value =
      e?.response?.data?.message || "Error al cargar publicaciones";
  }
};

onMounted(async () => {
  try {
    await cargarPublications();
  } catch (error) {
    console.log(error);
  }
});



const cargarPublication = async (id) => {
  openModal()

}


// MODAL
function openModal() {
  showModal.value = true;
}

function handleAction(action) {
  if (action === 'login') {
    console.log('Ir a la pantalla de inicio de sesión');
    router.push('/login')
  } else if (action === 'register') {
    console.log('Ir a la pantalla de registro');
    router.push('/register')
  } else if (action === 'guest') {
    console.log('Continuar como invitado');
  }
}


// const cargarPublication = async (id) => {
//   router.push({ name: 'pub', params: { id } })
// }
</script>
