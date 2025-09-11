<template>
  <div class="container mx-auto p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
      Gestión de Artículos 💿
    </h1>
    <hr class="my-12 border-gray-300" />
    <ArtistCrud />
    <NewArticle />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '../../services/article';
import ArtistCrud from './NewArtist.vue'; // <-- ¡Importa el nuevo componente aquí!
import NewArticle from './NewArticle.vue';

// ... Resto de la lógica de tu CRUD de artículos ...

const articles = ref([]);
const showModal = ref(false);
const modalMode = ref('create');
const currentArticle = ref({});
const error = ref(null);

// ... Métodos CRUD y lógica ...

onMounted(() => {
  loadArticles();
});
</script>