<template>
 


  <!-- Contenedor principal centrado -->
<div class="max-w-4xl mx-auto px-4">

  <!-- Título -->
  <div class="mt-36 flex items-center justify-center">
    <h2 class="text-lg font-semibold mb-4 text-white">Filtrar</h2>
  </div>

  <!-- Filtros -->
  <div class="mb-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        v-model="filtros.type"
        type="text"
        placeholder="Nombre Artista/ Discografía"
        class="p-2 rounded bg-white/20 placeholder-white text-white"
      />

      <select v-model="filtros.tipo" class="p-2 rounded bg-white/20 text-black">
        <option value="vinyl">Vinilo</option>
        <option value="cds">CD</option>
        <option value="cassettes">Cassette</option>
      </select>

      <select v-model="filtros.precio" class="p-2 rounded bg-white/20 text-black">
        <option value="menor">Menor precio</option>
        <option value="mayor">Mayor precio</option>
      </select>

      <select v-model="filtros.existencias" class="p-2 rounded bg-white/20 text-black">
        <option value="asc">Pocas unidades</option>
        <option value="desc">Muchas unidades</option>
      </select>

      <select v-model="filtros.mas_vendidos" class="p-2 rounded bg-white/20 text-black">
        <option value="asc">Más vendidos</option>
        <option value="desc">Mayor a Menor</option>
      </select>
      
    </div>
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



 





  </div>


 
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../axios";
import { reactive } from "vue";
import { computed } from "vue"; 
import PublicationCard from "@/components/PublicationCard.vue";

const router = useRouter();
 

const filtros = reactive({
  type: "",
  tipo: "",
  precio: "",
  existencias: "",
  mas_vendidos: ""
});


const allPublications = ref([]);



const publications = computed(() => {
  let result = [...allPublications.value];

  // Filtro por texto (nombre de artista o discográfica)
  if (filtros.type) {
    const texto = filtros.type.toLowerCase();
    result = result.filter(pub =>
      pub.artist.name.toLowerCase().includes(texto) ||
      pub.music_genre.description.toLowerCase().includes(texto)
    );
  }

  // Filtro por tipo de formato
  if (filtros.tipo) {
    result = result.filter(pub => pub.type === filtros.tipo);
  }

  // Orden por precio
  if (filtros.precio === "mayor") {
    result.sort((a, b) => b.price - a.price);
  } else if (filtros.precio === "menor") {
    result.sort((a, b) => a.price - b.price);
  }

  // Orden por existencias
  if (filtros.existencias === "asc") {
    result.sort((a, b) => a.quantity - b.quantity);
  } else if (filtros.existencias === "desc") {
    result.sort((a, b) => b.quantity - a.quantity);
  }

  // // Orden por más vendidos
  // if (filtros.mas_vendidos === "desc") {
  //   result.sort((a, b) => b.sales - a.sales);
  // }else if (filtros.mas_vendidos === "asc") {
  //   result.sort((a, b) => a.sales - b.sales);
  // }

  return result;
});








 
  const cargarPublications = async () => {
  try {
    const res = await api.get("/article");
    allPublications.value = res.data.data;
    // console.log(res.data.data);
    //filtrar
    filtrar()
  } catch (e) {
    console.log(e)
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
  router.push({ name: "pub", params: { id } });
};
</script>
