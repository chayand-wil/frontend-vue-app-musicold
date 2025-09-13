<template>
  <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
      Publicaciones 📰
    </h1>

    <div v-if="publications.length">
      <table class="min-w-full bg-white border rounded-lg shadow overflow-hidden">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Imagen</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Audio</th>
            <th class="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publication in publications" :key="publication.id" class="border-t hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-700">{{ publication.id }}</td>

            <td class="px-6 py-4">
              <img :src="publication.image" alt="Imagen" class="w-20 h-20 object-cover rounded">
            </td>

            <td class="px-6 py-4 text-sm text-gray-700">{{ publication?.publication_type?.description }}</td>

            <td class="px-6 py-4">
              <audio controls class="w-48" :src="publication.audio">
                Tu navegador no soporta el audio.
              </audio>
            </td>

            <td class="px-6 py-4 text-center space-x-2">
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              @click="goToComments(publication.id)" >
                Ver comentarios
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center p-8 text-gray-500 bg-white rounded-lg shadow-inner">
      <p>No hay publicaciones para mostrar.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchPublications } from './../../services/publication';
import { useRouter } from 'vue-router';

const publications = ref([]);
const router = useRouter();

const loadPublications = async () => {
  try {
    const response = await fetchPublications();
    publications.value = response; 
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    publications.value = [];
  }
};

// Función para redirigir a los comentarios de una publicación
const goToComments = (id) => {
  router.push({ name: 'publication-comment', params: { idPublication: id } });
};

onMounted(() => {
  loadPublications();
});
</script>

