<template>
  <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
        Gestión de Artistas 🎤
    </h1>
    <div class="flex justify-end mb-4">
      <button
        @click="openModal('create')"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
      >
        ➕ Agregar Género Musical
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-lg shadow-inner">
      <table v-if="artists.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="artist in artists" :key="artist.id">
            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ artist.id }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ artist.name }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-center space-x-2">
                <button @click="openModal('edit', artist)" class="text-blue-500 hover:text-blue-700 transform hover:scale-110">
                  ✏️
                </button>
                <button @click="removeArtist(artist.id)" class="text-red-500 hover:text-red-700 transform hover:scale-110">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center p-8 text-gray-500">
        <p>No hay artistas para mostrar.</p>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm relative">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
          ×
        </button>
        <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>
        <form @submit.prevent="saveArtist">
          <div class="mb-4">
            <label for="artist_name" class="block text-gray-700 text-sm font-bold mb-2">Nombre del Artista:</label>
            <input
              type="text"
              id="artist_name"
              v-model="currentArtist.description"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
            >
              💾 Guardar
            </button>
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchMusicGenre, createMusicGenre, updateMusicGenre, deleteMusicGenre } from './../../services/GenreMusic'

const artists = ref([]);
const showModal = ref(false);
const modalMode = ref('create');
const currentArtist = ref({});

const modalTitle = computed(() =>
  modalMode.value === 'create' ? 'Crear Nuevo Artista' : 'Editar Artista'
);

const loadArtists = async () => {
  try {
    artists.value = await fetchMusicGenre();
  } catch (error) {
    console.error('Error al obtener los artistas:', error);
  }
};

const saveArtist = async () => {
  try {
    if (modalMode.value === 'create') {
      await createMusicGenre(currentArtist.value);
    } else {
      await updateMusicGenre(currentArtist.value.id, currentArtist.value);
    }
    loadArtists();
    closeModal();
  } catch (error) {
    console.error('Error al guardar el artista:', error);
  }
};

const removeArtist = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este artista?')) {
    try {
      await deleteMusicGenre(id);
      loadArtists();
    } catch (error) {
      console.error('Error al eliminar el artista:', error);
    }
  }
};

const openModal = (mode, artist = {}) => {
  modalMode.value = mode;
  currentArtist.value = mode === 'create' ? { name: '' } : { ...artist };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  loadArtists();
});
</script>