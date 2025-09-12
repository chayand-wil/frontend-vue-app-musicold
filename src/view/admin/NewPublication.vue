<template>
  <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
      Gestión de Publicaciones 📰
    </h1>
    <div class="flex justify-end mb-4">
      <button
        @click="openModal('create')"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
      >
        ➕ Agregar Publicación
      </button>
    </div>

    <div v-if="publications.length">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        <div v-for="publication in publications" :key="publication.id" class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          
          <img :src="publication.image" alt="Imagen de la publicación" class="w-full h-48 object-cover">

          <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              {{ publication.publicationType.description }}
            </h3>
            <p v-if="publication.articles.length" class="text-gray-600 text-sm mb-4">
              Formato: <span class="font-semibold capitalize">{{ publication.articles[0].type }}</span> | 
              Precio: <span class="font-semibold">${{ publication.articles[0].price }}</span>
            </p>

            <audio controls class="w-full my-4" :src="publication.audio">
              Tu navegador no soporta el elemento de audio.
            </audio>

            <div class="flex-grow"></div>

            <div class="flex justify-end items-center space-x-3 mt-4">
              <button @click="openModal('edit', publication)" class="text-blue-500 hover:text-blue-700 transform hover:scale-110 text-2xl">
                ✏️
              </button>
              <button @click="removePublication(publication.id)" class="text-red-500 hover:text-red-700 transform hover:scale-110 text-2xl">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center p-8 text-gray-500 bg-white rounded-lg shadow-inner">
      <p>No hay publicaciones para mostrar.</p>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md relative">
            <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
            ×
            </button>
            <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>
            <form @submit.prevent="savePublication">
            <div class="mb-4">
                <label for="pub_title" class="block text-gray-700 text-sm font-bold mb-2">Título:</label>
                <input type="text" id="pub_title" v-model="currentPublication.title" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
            </div>

            <div class="mb-4">
                <label for="pub_type" class="block text-gray-700 text-sm font-bold mb-2">Tipo de Publicación (ID):</label>
                <select id="pub_type" v-model="currentPublication.publication_type_id" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                <option value="1">Tipo 1</option>
                <option value="2">Tipo 2</option>
                <option value="3">Tipo 3</option>
                </select>
            </div>

            <div class="mb-4 flex items-center">
                <input type="checkbox" id="pub_status" v-model="currentPublication.status" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label for="pub_status" class="ml-2 block text-gray-700 text-sm font-bold">Activo</label>
            </div>

            <div class="mb-4">
                <label for="pub_image" class="block text-gray-700 text-sm font-bold mb-2">Imagen:</label>
                <input type="file" id="pub_image" @change="handleImageUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>

            <div class="mb-6">
                <label for="pub_audio" class="block text-gray-700 text-sm font-bold mb-2">Audio:</label>
                <input type="file" id="pub_audio" @change="handleAudioUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
            </div>

            <div class="flex justify-end space-x-4">
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                💾 Guardar
                </button>
                <button type="button" @click="closeModal" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">
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
import { fetchPublications, createPublication, updatePublication, deletePublication } from './../../services/publication';

const publications = ref([]);
const showModal = ref(false);
const modalMode = ref('create');

// Objeto para mantener los datos del formulario
const currentPublication = ref({});
// Refs separadas para manejar los archivos
const fileImage = ref(null);
const fileAudio = ref(null);


const modalTitle = computed(() =>
  modalMode.value === 'create' ? 'Crear Nueva Publicación' : 'Editar Publicación'
);

const loadPublications = async () => {
  try {
    // Asumimos que el servicio devuelve un objeto con una clave "data" que contiene el array
    const response = await fetchPublications();
    //console.log(response)
    publications.value = response; 
  } catch (error)
  {
    console.error('Error al obtener las publicaciones:', error);
    publications.value = []; // Asegurarse de que sea un array vacío en caso de error
  }
};

// Funciones para capturar los archivos seleccionados por el usuario
const handleImageUpload = (event) => {
  fileImage.value = event.target.files[0];
};
const handleAudioUpload = (event) => {
  fileAudio.value = event.target.files[0];
};

const savePublication = async () => {
  // Usamos FormData para poder enviar archivos y datos juntos
  const formData = new FormData();
  formData.append('title', currentPublication.value.title);
  formData.append('publication_type_id', currentPublication.value.publication_type_id);
  formData.append('status', currentPublication.value.status ? 1 : 0); // Convertir boolean a 1/0
    console.log(currentPublication.value.publication_type_id)
  // Adjuntar archivos solo si fueron seleccionados
  if (fileImage.value) {
    formData.append('file_image', fileImage.value);
  }
  if (fileAudio.value) {
    formData.append('file_audio', fileAudio.value);
  }

  try {
    if (modalMode.value === 'create') {
        formData.append('_method', 'POST'); // Truco común en APIs REST
        await createPublication(formData);
    } else {
      // Para 'update', el backend a menudo requiere un método POST con un campo '_method'
      // Esto depende de tu API. Aquí lo enviamos como FormData también.
      formData.append('_method', 'PUT'); // Truco común en APIs REST
      await updatePublication(currentPublication.value.id, formData);
    }
    loadPublications();
    closeModal();
  } catch (error) {
    console.error('Error al guardar la publicación:', error);
  }
};

const removePublication = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
    try {
      await deletePublication(id);
      loadPublications(); // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
    }
  }
};

// La lógica para abrir el modal y eliminar sigue siendo válida.
// La función savePublication() necesitaría ser adaptada al nuevo JSON para crear/editar.
const openModal = (mode, publication = null) => {
  modalMode.value = mode;
  if (mode === 'create') {
    currentPublication.value = {
      // Definir la estructura inicial para una nueva publicación
      publicationType: {},
      articles: [{ songsLadoA: [], songsLadoB: [] }],
    };
  } else {
    // Usamos structuredClone para una copia profunda del objeto complejo
    currentPublication.value = structuredClone(publication);
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  loadPublications();
});

// La función savePublication necesitaría ser rediseñada para construir el objeto JSON complejo
// antes de enviarlo a la API. Esta parte no se incluye para mantener el enfoque en la VISTA.
</script>