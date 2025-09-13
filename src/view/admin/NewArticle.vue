<template>
  <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
      Gestión de Artículos 💿
    </h1>
    <div class="flex justify-between items-center mb-4">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ error }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" @click="error = null">
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.849l-2.651 2.999a1.2 1.2 0 1 1-1.697-1.697L8.303 10l-2.651-2.999a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.999a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 2.999a1.2 1.2 0 0 1 0 1.849z"/></svg>
        </span>
      </div>
      <button
        @click="openModal('create')"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
      >
        ➕ Agregar Artículo
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table v-if="articles.length" class="w-full table-auto">
        <thead class="bg-gray-200">
          <tr class="text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">ID</th>
            <th class="py-3 px-6 text-left">Tipo</th>
            <th class="py-3 px-6 text-left">Cantidad</th>
            <th class="py-3 px-6 text-left">Precio</th>
            <th class="py-3 px-6 text-left">Artista</th>
            <th class="py-3 px-6 text-left">Género</th>
            <th class="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="article in articles" :key="article.id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-left whitespace-nowrap">{{ article.id }}</td>
            <td class="py-3 px-6 text-left">{{ article.type }}</td>
            <td class="py-3 px-6 text-left">{{ article.quantity }}</td>
            <td class="py-3 px-6 text-left">${{ article.price }}</td>
            <td class="py-3 px-6 text-left">{{ article?.artist?.name }}</td>
            <td class="py-3 px-6 text-left">{{ article?.music_genre?.description }}</td>
            <td class="py-3 px-6 text-center">
              <div class="flex items-center justify-center space-x-2">
                <button @click="openModal('view', article)" class="text-gray-500 hover:text-green-500 transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
                </button>
                <button @click="openModal('edit', article)" class="text-gray-500 hover:text-blue-500 transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"/></svg>
                </button>
                <button @click="handleDelete(article.id)" class="text-gray-500 hover:text-red-500 transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1v-1zm4 1a1 1 0 011 1v1h-4V4a1 1 0 011-1zM6 6a1 1 0 011-1h6a1 1 0 011 1v10a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" clip-rule="evenodd"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center p-8 text-gray-500">
        <p>No hay artículos para mostrar.</p>
      </div>
    </div>

<div v-if="showModal && (modalMode === 'create' || modalMode === 'edit')" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
  <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
    <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold">
      ×
    </button>
    <h2 class="text-2xl font-bold mb-6 text-center">{{ modalTitle }}</h2>
    <form @submit.prevent="handleSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Precio:</label>
          <input type="number" step="0.01" id="price" v-model="currentArticle.price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label for="quantity" class="block text-gray-700 text-sm font-bold mb-2">Cantidad:</label>
          <input type="number" id="quantity" v-model="currentArticle.quantity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label for="publication_year" class="block text-gray-700 text-sm font-bold mb-2">Año de Publicación:</label>
          <input type="number" id="publication_year" v-model="currentArticle.publication_year" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label for="type" class="block text-gray-700 text-sm font-bold mb-2">Tipo:</label>
          <select id="type" v-model="currentArticle.type" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="" disabled>Selecciona un tipo</option>
            <option value="vinyl">Vinyl</option>
            <option value="cds">CDs</option>
            <option value="cassettes">Cassettes</option>
          </select>
        </div>
        <div>
          <label for="condition" class="block text-gray-700 text-sm font-bold mb-2">Estado:</label>
          <select id="condition" v-model="currentArticle.category" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="" disabled>Selecciona un estado</option>
            <option value="NUEVO">Nuevo</option>
            <option value="SEMI_USADO">Semi Usado</option>
            <option value="USADO">Usado</option>
            <option value="SIETE_PLG">7"</option>
            <option value="OCHO_PLG">8"</option>
            <option value="NUEVE_PLG">9"</option>
            <option value="SPECIAL_EDITION">Edición Especial</option>
          </select>
        </div>
        <div>
          <label for="color" class="block text-gray-700 text-sm font-bold mb-2">Color:</label>
          <input type="text" id="color" v-model="currentArticle.color" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="flex items-center space-x-4">
          <div class="w-1/2">
            <label for="dimension_x" class="block text-gray-700 text-sm font-bold mb-2">Dim. X:</label>
            <input type="number" step="0.01" id="dimension_x" v-model="currentArticle.dimension_x" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="w-1/2">
            <label for="dimension_y" class="block text-gray-700 text-sm font-bold mb-2">Dim. Y:</label>
            <input type="number" step="0.01" id="dimension_y" v-model="currentArticle.dimension_y" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label for="publication_id" class="block text-gray-700 text-sm font-bold mb-2">Publicación:</label>
          <select id="publication_id" v-model="currentArticle.publication.id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="" disabled>Selecciona una publicación</option>
                <option v-for="artist in publications" :key="artist.id" :value="artist.id">
                    {{ artist.id }} {{ artist.publication_type.id }} {{ artist.status }}
                </option>
            </select>
        </div>
        <div>
          <label for="music_genre_id" class="block text-gray-700 text-sm font-bold mb-2">Género Musical:</label>
          <select id="music_genre_id" v-model="currentArticle.music_genre.id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="" disabled>Selecciona un género</option>
                <option v-for="artist in musicGenre" :key="artist.id" :value="artist.id">
                    {{ artist.description }}
                </option>
            </select>
        </div>
        <div>
            <label for="artist_id" class="block text-gray-700 text-sm font-bold mb-2">Artista:</label>
            <select id="artist_id" v-model="currentArticle.artist.id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="" disabled>Selecciona un artista</option>
                <option v-for="artist in artists" :key="artist.id" :value="artist.id">
                    {{ artist.name }}
                </option>
            </select>
        </div>
      </div>
      
      <div class="flex justify-end space-x-4 mt-6">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
          💾 Guardar
        </button>
        <button type="button" @click="closeModal" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</div>

    <div v-if="showModal && modalMode === 'view'" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-lg relative">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
          ×
        </button>
        <h2 class="text-2xl font-bold mb-4">Detalles del Artículo</h2>
        <div v-if="currentArticle">
          <div class="mb-4">
            <img :src="`${currentArticle.publication.image}`" alt="Imagen del Artículo" class="w-full h-auto rounded-md object-cover" />
          </div>
          <p class="mb-2"><strong>ID:</strong> {{ currentArticle.id }}</p>
          <p class="mb-2"><strong>Tipo:</strong> {{ currentArticle.type }}</p>
          <p class="mb-2"><strong>Cantidad:</strong> {{ currentArticle.quantity }}</p>
          <p class="mb-2"><strong>Precio:</strong> ${{ currentArticle.price }}</p>
          <p class="mb-2"><strong>Artista:</strong> {{ currentArticle?.artist?.name }}</p>
          <p class="mb-2"><strong>Género:</strong> {{ currentArticle.music_genre.description }}</p>
          <p class="mb-2"><strong>Año de Publicación:</strong> {{ currentArticle.publication_year }}</p>
          
          <h3 class="text-lg font-semibold mt-4 mb-2">Canciones:</h3>
          <ul class="list-disc list-inside">
            <li v-for="song in currentArticle.songs" :key="song.id">{{ song.song_name }} ({{ song.side }})</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from './../../services/article';
import { fetchArtists } from './../../services/artist';
import { fetchMusicGenre } from './../../services/GenreMusic'
import { fetchPublications } from './../../services/publication'

// Datos reactivos
const articles = ref([]);
const artists = ref([]);
const musicGenre = ref([]);
const publications = ref([]);
const showModal = ref(false);
const modalMode = ref('create');
const currentArticle = ref({});
const error = ref(null);

// Título dinámico del modal
const modalTitle = computed(() =>
  modalMode.value === 'create' ? 'Crear Nuevo Artículo' : 'Editar Artículo'
);

// --- Métodos CRUD y Lógica ---

const loadArticles = async () => {
  try {
    const data = await fetchArticles();
    console.log(data)
    articles.value = data;
    error.value = null;
  } catch (err) {
    error.value = 'No se pudieron cargar los artículos. Por favor, inténtalo de nuevo más tarde.';
  }
};

const loadArtist = async () => {
  try {
    const data = await fetchArtists();
    console.log(data)
    artists.value = data;
    error.value = null;
  } catch (err) {
    error.value = 'No se pudieron cargar los artículos. Por favor, inténtalo de nuevo más tarde.';
  }
};

const loadGenreMusic = async () => {
  try {
    const data = await fetchMusicGenre();
    console.log(data)
    musicGenre.value = data;
    error.value = null;
  } catch (err) {
    error.value = 'No se pudieron cargar los artículos. Por favor, inténtalo de nuevo más tarde.';
  }
};

const loadPublications = async () => {
  try {
    const data = await fetchPublications();
    console.log(data)
    publications.value = data;
    error.value = null;
  } catch (err) {
    error.value = 'No se pudieron cargar los artículos. Por favor, inténtalo de nuevo más tarde.';
  }
};


const handleSave = async () => {
  try {
    if (modalMode.value === 'create') {
      console.log(currentArticle.value)
      await createArticle(currentArticle.value);
    } else {
      delete currentArticle.value.music_genre;
      delete currentArticle.value.publication;
      delete currentArticle.value.songs;
      delete currentArticle.value.artist;
      delete currentArticle.value.created_at;
      delete currentArticle.value.updated_at;
      console.log(currentArticle.value)
      await updateArticle(currentArticle.value.id, currentArticle.value);
    }
    await loadArticles();
    closeModal();
    error.value = null;
  } catch (err) {
    error.value = 'Ocurrió un error al guardar el artículo. Verifica los datos.';
  }
};

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
    try {
      await deleteArticle(id);
      await loadArticles();
      error.value = null;
    } catch (err) {
      error.value = 'No se pudo eliminar el artículo. Es posible que ya no exista.';
    }
  }
};

const openModal = (mode, article = null) => {
  modalMode.value = mode;
  if (mode === 'create') {
    currentArticle.value = {};
  } else {
    currentArticle.value = { ...article };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Cargar los datos al montar el componente
onMounted(() => {
  loadArticles();
  loadArtist();
  loadGenreMusic();
  loadPublications();
});
</script>