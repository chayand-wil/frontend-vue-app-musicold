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
    class="mt-40 bg-white/10 backdrop-blur-sm rounded-2xl p-10 shadow-lg text-xl text-red-600"
  >
    {{ errorMessage }}
  </div>
  <!-- Modal -->
  <InviteModal
    :show="showModal"
    @close="showModal = false"
    @action="handleAction"
  />

  <!-- Contenedor principal -->
  <div class="max-w-5xl mx-auto px-4">
    <!-- Título centrado -->
    <div class="mt-10 mb-6 flex items-center justify-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white">
        Últimos Ingresos
      </h1>
    </div>

    <!-- Carrusel con botones -->
    <div class="relative">
      <!-- Botón Izquierda -->
      <button
        @click="scrollLeft"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur"
      >
        <svg
          class="w-9 h-9 fill-white"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 162.755 162.755"
          style="enable-background: new 0 0 162.755 162.755"
          xml:space="preserve"
        >
          <path
            style="fill: #010002"
            d="M117.875,162.755L40.54,83.883c-1.452-1.478-1.452-3.846,0.004-5.324L117.878,0l5.42,5.331
	L48.586,81.232l74.717,76.206L117.875,162.755z"
          />
        </svg>
      </button>

      <!-- Contenedor con scroll -->
      <div
        ref="carousel"
        class="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide scroll-smooth"
      >
        <PublicationCard
          v-for="item in publications"
          :key="item.id"
          :publication="item"
          @cargar-Publication="cargarPublication"
          @agregar_wish="agregar_wish"
          class="w-72 flex-shrink-0"
        />
      </div>

      <!-- Botón Derecha -->
      <button
        @click="scrollRight"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur"
      >
        <svg
          class="w-9 h-9 fill-white"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 162.933 162.933"
          style="enable-background: new 0 0 162.933 162.933"
          xml:space="preserve"
        >
          <path
            style="fill: #010002"
            d="M44.925,162.933l-5.428-5.316l74.806-76.295L39.5,5.331L44.921,0l77.423,78.648
	c1.455,1.478,1.455,3.846,0.004,5.324L44.925,162.933z"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Contenedor principal centrado -->
  <div class="max-w-4xl mx-auto px-4">
    <!-- Título -->
    <div class="mt-10 mb-6 flex items-center justify-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white">
        Últimos Ingresos
      </h1>
    </div>

    <!-- Carrusel horizontal -->
    <div class="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
      <PublicationCard
        v-for="item in publications"
        :key="item.id"
        :publication="item"
        @cargar-Publication="cargarPublication"
        @agregar_wish="agregar_wish"
        class="w-72 flex-shrink-0"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../axios";
import PublicationCard from "@/components/PublicationCard.vue";

const router = useRouter();
const errorMessage = ref("");
const successMessage = ref("");
const user = ref(null);
const loggued = ref(false);
const showModal = ref(false);

// const publications = ref([]);

const publications = ref([]);
const carousel = ref(null);

const cargarPublications = async () => {
  try {
    const res = await api.get("/article");
    publications.value = res.data.data;
    // console.log(res);
  } catch (e) {
    errorMessage.value =
      e?.response?.data?.message || "Error al cargar publicaciones";
  }
};

onMounted(async () => {
  try {
    if(localStorage.getItem("token")){
      user.value = parseInt(localStorage.getItem("id"), 10);
      loggued.value = true
    }
    await cargarPublications();
  } catch (error) {
    console.log(error);
  }
});

const cargarPublication = async (id) => {
  router.push({ name: "pub", params: { id } });
};

const agregar_wish = async (id) => {
  if(!loggued.value){
      window.location.href = '/user/home'
  }
  const dataWhisList = {
    app_user_id: user.value,
    publication_id: id,
  };

  try {
    const res = await api.post("/wishlist", dataWhisList);
    successMessage.value = res.data.message || "Agregado a la lista de deseos";
    console.log(res);
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    errorMessage.value = error.res?.data.message || "Nooo wish";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  }

  // router.push({ name: "pub", params: { id } });
};

// function algo() {
//   emit('cargar-Denuncia', seleccionada.value.id)
// }

const scrollLeft = () => {
  carousel.value.scrollBy({ left: -300, behavior: "smooth" });
};

const scrollRight = () => {
  carousel.value.scrollBy({ left: 300, behavior: "smooth" });
};

function openModal() {
  showModal.value = true;
}

function handleAction(action) {
  if (action === "login") {
    console.log("Ir a la pantalla de inicio de sesión");
    router.push("/login");
  } else if (action === "register") {
    console.log("Ir a la pantalla de registro");
    router.push("/register");
  } else if (action === "guest") {
    console.log("Continuar como invitado");
  }
}
</script>

<style>
/* Oculta el scrollbar (todos los navegadores) */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
