<template>
  <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
        Gestión de Eventos 📅
    </h1>
    <div class="flex justify-end mb-4">
      <button
        @click="openModal('create')"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
      >
        ➕ Agregar Evento
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-lg shadow-inner">
      <table v-if="events.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artista</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Inicio</th>
            <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="event in events" :key="event.id">
            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ event.id }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-600 font-semibold">{{ event.title }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ event.Artist.name }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ formatDate(event.start_date) }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-center">
              <span :class="statusBadgeClass(event.publication.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ event.publication.status }}
              </span>
            </td>
            <td class="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-center space-x-2">
                <button @click="openModal('edit', event)" class="text-blue-500 hover:text-blue-700 transform hover:scale-110">
                  ✏️
                </button>
                <button @click="removeEvent(event.id)" class="text-red-500 hover:text-red-700 transform hover:scale-110">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center p-8 text-gray-500">
        <p>No hay eventos para mostrar. ¡Agrega uno!</p>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-lg relative">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
          ×
        </button>
        <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>
        <form @submit.prevent="saveEvent">
          <div class="mb-4">
            <label for="event_title" class="block text-gray-700 text-sm font-bold mb-2">Título del Evento:</label>
            <input
              type="text"
              id="event_title"
              v-model="currentEvent.title"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div class="mb-4">
            <label for="event_date" class="block text-gray-700 text-sm font-bold mb-2">Fecha y Hora de Inicio:</label>
            <input
              type="datetime-local"
              id="event_date"
              v-model="currentEvent.start_date"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div class="mb-4">
            <label for="artist_id" class="block text-gray-700 text-sm font-bold mb-2">Artista:</label>
            <select 
              id="artist_id" 
              v-model="currentEvent.artist_id"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required>
              <option :value="null" disabled>-- Selecciona un artista --</option>
              <option v-for="artist in artists" :key="artist.id" :value="artist.id">
                {{ artist.name }}
              </option>
            </select>
          </div>
          <div class="mb-6">
            <label for="publication_id" class="block text-gray-700 text-sm font-bold mb-2">Publicación (ID):</label>
            <select 
              id="publication_id" 
              v-model="currentEvent.publication_id"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required>
              <option :value="null" disabled>-- Selecciona una publicación --</option>
              <option v-for="pub in publications" :key="pub.id" :value="pub.id">
                ID: {{ pub.id }} (Estado: {{ pub.status }})
              </option>
            </select>
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
import { 
  fetchAllEvents, createEvents, updateEvents, deleteEvents
} from './../../services/event'; // Asegúrate que la ruta sea correcta
  //fetchArtists, fetchPublications
import { fetchArtists } from './../../services/artist';
import { fetchPublications } from './../../services/publication';

// --- Estado Reactivo ---
const events = ref([]);
const artists = ref([]);
const publications = ref([]);
const showModal = ref(false);
const modalMode = ref('create'); // 'create' o 'edit'
const currentEvent = ref({});

// --- Propiedades Computadas ---
const modalTitle = computed(() =>
  modalMode.value === 'create' ? 'Crear Nuevo Evento' : 'Editar Evento'
);

// --- Funciones de Lógica ---
const loadEvents = async () => {
  try {
    events.value = await fetchAllEvents();
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    // Aquí podrías mostrar una notificación al usuario
  }
};

const loadDropdownData = async () => {
  try {
    artists.value = await fetchArtists();
    publications.value = await fetchPublications();
  } catch (error) {
    console.error('Error al cargar datos para los selectores:', error);
  }
};

const saveEvent = async () => {
  try {
    if (modalMode.value === 'create') {
      await createEvents(currentEvent.value);
    } else {
      await updateEvents(currentEvent.value.id, currentEvent.value);
    }
    await loadEvents(); // Recargar la lista de eventos
    closeModal();
  } catch (error) {
    console.error('Error al guardar el evento:', error);
  }
};

const removeEvent = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
    try {
      await deleteEvents(id);
      await loadEvents(); // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  }
};

// --- Funciones del Modal y formato ---
const openModal = (mode, event = {}) => {
  modalMode.value = mode;
  if (mode === 'create') {
    currentEvent.value = {
      title: '',
      start_date: '',
      artist_id: null,
      publication_id: null
    };
  } else {
    // El input datetime-local necesita el formato YYYY-MM-DDTHH:mm
    const dateForInput = event.start_date ? event.start_date.slice(0, 16) : '';
    currentEvent.value = { ...event, start_date: dateForInput };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const statusBadgeClass = (status) => {
  const classes = {
    available: 'bg-green-100 text-green-800',
    upcoming: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};


// --- Hook del Ciclo de Vida ---
onMounted(() => {
  loadEvents();
  loadDropdownData();
});
</script>