<template>
  <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-6">
      Gestión de Promociones
    </h1>

    <div class="flex justify-between items-center mb-4">
      <div>
        <button
            @click="openModal('create')"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          Crear Promoción
        </button>
      </div>
    </div>

    <div
        v-if="error"
        class="bg-white/10 backdrop-blur-sm rounded-2xl p-10 shadow-lg text-xl text-red-600"
    >
      {{ error }}
    </div>
    <div class="overflow-x-auto bg-white rounded-lg shadow-inner mb-6">
      <table v-if="promotions.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
        <tr>
          <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Promo</th>
          <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
          <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
          <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ver detalles</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="p in promotions" :key="p.id">
          <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ p.id }}</td>
          <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ getPromotionTypeDescription(p.promotion_type_id) }}</td>
          <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ formatDate(p.start_date) }}</td>
          <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ formatDate(p.end_date) }}</td>
          <td class="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex items-center justify-center space-x-2">
              <button @click="openDetails(p.id)" class="text-indigo-600 hover:text-indigo-800">Detalles</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else class="text-center p-8 text-gray-500">
        <p>No hay promociones para mostrar.</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-start z-50 overflow-auto">
      <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-3xl mt-12 relative">
        <button @click="closeModal" class="absolute top-3 right-3 hover:text-gray-800 text-2xl">
          ×
        </button>

        <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>

        <form @submit.prevent="submitPromotion">
          <!-- Promotion type -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-900">Tipo de promoción</label>
              <select v-model="form.promotionTypeId" required class="mt-1 block w-full border rounded p-2 text-gray-900">
                <option value="" disabled>Seleccione un tipo</option>
                <option v-for="t in promotionTypes" :key="t.id" :value="t.id">
                  {{ t.description }} ({{ t.discount }}%)
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900">Modalidad</label>
              <select v-model="form.mode" class="mt-1 block w-full border rounded p-2 text-gray-900">
                <option value="genre">Por Género (max 4, discount por defecto 10%)</option>
                <option value="random">Aleatorio (max 7, discount por defecto 30%)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900">Fecha inicio</label>
              <input v-model="form.startDateLocal" type="datetime-local" class="mt-1 block w-full border rounded p-2 text-gray-800" required/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900">Fecha fin</label>
              <input v-model="form.endDateLocal" type="datetime-local" class="mt-1 block w-full border rounded p-2 text-gray-800" required/>
            </div>
          </div>

          <!-- Genre selector (visible cuando mode == 'genre') -->
          <div v-if="form.mode === 'genre'" class="mt-4">
            <label class="block text-sm font-medium text-gray-900">Género musical</label>
            <select v-model="selectedGenreId" @change="onGenreChange" class="mt-1 block w-full border rounded p-2 text-gray-900">
              <option value="">Seleccione un género</option>
              <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.description }}</option>
            </select>
          </div>

          <!-- Articles list (by genre or selected random) -->
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold mb-2">Artículos disponibles</h3>
              <div v-if="availableArticles.length" class="space-y-2 max-h-72 overflow-auto">
                <div v-for="a in availableArticles" :key="a.id" class="p-2 border rounded flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-gray-700">Artista: {{ a.artist.name }}</div>
                    <div class="text-sm font-medium text-gray-700">ID: {{ a.id }} — {{ a.type }}</div>
                    <div class="text-xs text-gray-800">Precio: {{ formatMoney(a.price) }}</div>
                  </div>
                  <div>
                    <button
                        :disabled="isSelected(a.id) ? false : (selectedArticles.length >= maxSelectable)"
                        @click="toggleArticle(a)"
                        :class="isSelected(a.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'"
                        class="text-white px-3 py-1 rounded"
                    >
                      {{ isSelected(a.id) ? 'Quitar' : 'Agregar' }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-700">
                <p>No hay artículos disponibles.</p>
              </div>
            </div>

            <div>
              <h3 class="font-semibold mb-2">Artículos seleccionados ({{ selectedArticles.length }}/{{ maxSelectable }})</h3>
              <div v-if="selectedArticles.length" class="space-y-2 max-h-72 overflow-auto">
                <div v-for="a in selectedArticles" :key="a.id" class="p-2 border rounded flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-gray-700">ID: {{ a.id }} — {{ a.type }}</div>
                    <div class="text-xs text-gray-500">Precio: {{ formatMoney(a.price) }}</div>
                  </div>
                  <div>
                    <button @click="removeSelectedArticle(a.id)" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Quitar</button>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-800">
                <p>No ha seleccionado artículos.</p>
              </div>

              <div class="mt-4 p-3 border rounded bg-gray-50">
                <div class="flex justify-between">
                  <div class="text-sm text-gray-800">Precio total</div>
                  <div class="font-medium">{{ formatMoney(totalPrice) }}</div>
                </div>
                <div class="flex justify-between mt-2">
                  <div class="text-sm text-gray-800">Descuento aplicado</div>
                  <div class="font-medium">{{ (appliedDiscount * 100).toFixed(0) }}%</div>
                </div>
                <div class="flex justify-between mt-2">
                  <div class="text-sm text-gray-800">Precio con descuento</div>
                  <div class="font-semibold">{{ formatMoney(discountedPrice) }}</div>
                </div>

                <div class="mt-3 text-xs text-gray-700">
                  <p>Nota: Modalidad <strong>Por Género</strong> aplica descuento por defecto 10%. Modalidad <strong>Aleatorio</strong> aplica descuento por defecto 30%. Los tipos de promoción pueden definir su propio descuento.</p>
                </div>
              </div>

              <div v-if="form.mode === 'random'" class="mt-3">
                <button @click.prevent="generateRandomSelection" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Generar selección aleatoria</button>
              </div>

            </div>
          </div>

          <div class="flex justify-end space-x-4 mt-6">
            <button type="submit" :disabled="saving" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
              {{ saving ? 'Guardando...' : 'Guardar Promoción' }}
            </button>
            <button type="button" @click="closeModal" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detalles -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-start z-50 overflow-auto">
      <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-3xl mt-12 relative">
        <button @click="closeDetailsModal" class="absolute top-3 right-3 text-gray-700 hover:text-gray-800 text-2xl">×</button>
        <h3 class="text-xl font-bold mb-3 text-gray-900">Detalles de Promoción #{{ detailsPromotion?.id }}</h3>

        <div v-if="loadingDetails">Cargando...</div>
        <div v-else>
          <div class="mb-4">
            <div class="text-gray-700"><strong>Tipo:</strong> {{ detailsPromotion?.promotion_type_id ?? '-' }}</div>
            <div class="text-gray-700"><strong>Inicio:</strong> {{ formatDate(detailsPromotion?.start_date) }}</div>
            <div class="text-gray-700"><strong>Fin:</strong> {{ formatDate(detailsPromotion?.end_date) }}</div>
          </div>

          <h4 class="font-semibold mb-2 text-gray-900">Artículos asociados</h4>
          <div v-if="detailsPromotion?.promotion_articles?.length">
            <div v-for="pa in detailsPromotion.promotion_articles" :key="pa.id" class="p-2 border rounded mb-2">
              <div class="flex justify-between">
                <div>
                  <div class="text-sm text-gray-900 font-medium">ID: {{ pa.article?.id }} — {{ pa.article?.type }} }}</div>
                  <div class="text-xs text-gray-700">Artista: {{ pa.article?.artist?.name }}</div>
                  <div class="text-xs text-gray-700">Género: {{ pa.article?.music_genre?.description }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-700 font-medium">{{ formatMoney(pa.article?.price) }}</div>
                  <div class="text-xs text-gray-700">Cantidad: {{ pa.article?.quantity }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-700">No hay artículos asociados.</div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  fetchPromotionTypes,
  fetchPromotions,
  createPromotion,
  addPromotionArticle,
  fetchMusicGenres,
  fetchPromotionById
} from '@/services/promotion';

// State
let error = null;
const promotions = ref([]);
const promotionTypes = ref([]);
const genres = ref([]);

const showModal = ref(false);
const modalMode = ref('create'); // only 'create' for now
const modalTitle = computed(() => (modalMode.value === 'create' ? 'Crear Nueva Promoción' : 'Editar Promoción'));

const showDetailsModal = ref(false);
const detailsPromotion = ref(null);
const loadingDetails = ref(false);

// Form
const form = ref({
  promotionTypeId: '',
  mode: 'genre', // 'genre' | 'random'
  startDateLocal: '',
  endDateLocal: '',
});

const selectedGenreId = ref('');
const availableArticles = ref([]); // articles displayed in left column (depends on genre or random)
const selectedArticles = ref([]); // array of article objects {id, price, ...}
const saving = ref(false);

const maxSelectable = computed(() => (form.value.mode === 'genre' ? 4 : 7));
const appliedDiscount = computed(() => (form.value.mode === 'genre' ? 0.10 : 0.30));

const totalPrice = computed(() =>
    selectedArticles.value.reduce((acc, a) => acc + Number(a.price || 0), 0)
);

const discountedPrice = computed(() => totalPrice.value * (1 - appliedDiscount.value));

// Utils
function formatMoney(value) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
}
function formatDate(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

// Load data
async function loadAll() {
  try {
    promotionTypes.value = await fetchPromotionTypes();
    promotions.value = await fetchPromotions();
    genres.value = await fetchMusicGenres();
  } catch (err) {
    console.error('Error cargando datos:', err);
    error = 'Error cargando datos. Revisa consola.';
  }
}

onMounted(() => {
  loadAll();
});

// helpers
function getPromotionTypeDescription(id) {
  const t = promotionTypes.value.find(x => x.id === id);
  return t ? `${t.description}` : String(id);
}

function openModal(mode = 'create') {
  modalMode.value = mode;
  form.value = {
    promotionTypeId: '',
    mode: 'genre',
    startDateLocal: '',
    endDateLocal: '',
  };
  selectedGenreId.value = '';
  availableArticles.value = [];
  selectedArticles.value = [];
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

// when genre changes, populate availableArticles
function onGenreChange() {
  selectedArticles.value = []; // clear selection when change genre
  const g = genres.value.find(x => x.id === selectedGenreId.value);
  availableArticles.value = g?.articles?.map(a => ({ ...a })) || [];
}

// selection helpers
function isSelected(articleId) {
  return selectedArticles.value.some(a => a.id === articleId);
}

function toggleArticle(article) {
  if (isSelected(article.id)) {
    selectedArticles.value = selectedArticles.value.filter(a => a.id !== article.id);
  } else {
    if (selectedArticles.value.length >= maxSelectable.value) {
      alert(`Máximo ${maxSelectable.value} artículos permitidos para esta modalidad.`);
      return;
    }
    selectedArticles.value.push({ ...article });
  }
}

function removeSelectedArticle(articleId) {
  selectedArticles.value = selectedArticles.value.filter(a => a.id !== articleId);
}

// generate random selection from all genres
function generateRandomSelection() {
  const allArticles = [];
  genres.value.forEach(g => {
    if (Array.isArray(g.articles)) {
      g.articles.forEach(a => allArticles.push(a));
    }
  });
  if (!allArticles.length) {
    alert('No hay artículos disponibles para selección aleatoria.');
    return;
  }
  // shuffle
  for (let i = allArticles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allArticles[i], allArticles[j]] = [allArticles[j], allArticles[i]];
  }
  const count = Math.min(maxSelectable.value, allArticles.length);
  selectedArticles.value = allArticles.slice(0, count).map(a => ({ ...a }));
  availableArticles.value = allArticles; // show list (optional)
}

// submit create promotion
async function submitPromotion() {
  // validations (breves)
  if (!form.value.promotionTypeId) {
    showError('Seleccione un tipo de promoción.');
    return;
  }
  if (!form.value.startDateLocal || !form.value.endDateLocal) {
    showError('Seleccione fecha de inicio y fecha fin.');
    return;
  }
  const startISO = new Date(form.value.startDateLocal).toISOString();
  const endISO = new Date(form.value.endDateLocal).toISOString();
  if (new Date(startISO) >= new Date(endISO)) {
    showError('La fecha de inicio debe ser anterior a la fecha fin.');
    return;
  }
  if (!selectedArticles.value.length) {
    showError('Seleccione al menos un artículo para la promoción.');
    return;
  }

  saving.value = true;
  try {
    const payload = {
      promotion_type_id: form.value.promotionTypeId,
      start_date: startISO,
      end_date: endISO,
    };
    const createRes = await createPromotion(payload);
    // Obtener id (depende del backend)
    const createdId = createRes?.data?.id ?? createRes?.id ?? createRes?.promotion_id;
    if (!createdId) {
      throw new Error('No se pudo obtener el id de la promoción creada.');
    }

    // Asociar artículos
    await Promise.all(selectedArticles.value.map(a => addPromotionArticle(a.id, createdId)));

    // notificar éxito (toast o banner)
    showSuccess('Promoción creada y artículos asociados correctamente.');
    closeModal();
    await loadAll();
  } catch (err) {
    console.error('Error creando promoción:', err);
    showError('Error creando promoción: ' + (err.message || 'ver consola'));
  } finally {
    saving.value = false;
  }
}

async function openDetails(id) {
  showDetailsModal.value = true;
  loadingDetails.value = true;
  try {
    detailsPromotion.value = await fetchPromotionById(id);
  } catch (err) {
    console.error('Error cargando detalles:', err);
    // showError('No se pudieron cargar los detalles');
    showError('Error cargando detalles. Revisa la consola.');
    showDetailsModal.value = false;
  } finally {
    loadingDetails.value = false;
  }
}

function closeDetailsModal() {
  showDetailsModal.value = false;
  detailsPromotion.value = null;
}

</script>

<style scoped>

</style>
