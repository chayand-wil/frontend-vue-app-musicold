<template>

  <div class="min-h-screen flex items-center justify-center bg-opacity-20">
    <div class="w-full max-w-2xl dark:bg-gray-800/70 rounded-lg p-6 shadow-md text-black">
      <h2 class="text-2xl font-semibold mb-4">Actualizar configuración</h2>

      <form @submit.prevent="saveConfig" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label class="block text-sm font-medium mb-1">cantidadReosActual</label>
        <input v-model.number="config.cantidadReosActual" type="number" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
        <label class="block text-sm font-medium mb-1">variacionReosMin</label>
        <input v-model.number="config.variacionReosMin" type="number" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
        <label class="block text-sm font-medium mb-1">variacionReosMax</label>
        <input v-model.number="config.variacionReosMax" type="number" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
        <label class="block text-sm font-medium mb-1">leadTimeProveedorDias</label>
        <input v-model.number="config.leadTimeProveedorDias" type="number" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
        <label class="block text-sm font-medium mb-1">factorStockSeguridad</label>
        <input v-model.number="config.factorStockSeguridad" type="number" step="0.01" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
        <label class="block text-sm font-medium mb-1">costoAlmacenamientoDiario</label>
        <input v-model.number="config.costoAlmacenamientoDiario" type="number" step="0.01" class="w-full border rounded px-3 py-2" />
        </div>
      </div>

        <div class="flex items-center justify-end gap-3">
        <button type="button" @click="loadConfig" class="px-4 py-2 bg-gray-200 rounded">Cargar</button>
        <button :disabled="isSaving" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          <span v-if="isSaving">Guardando...</span>
          <span v-else>Guardar</span>
        </button>
      </div>
      </form>

      <p v-if="statusMessage" class="mt-4 text-sm">{{ statusMessage }}</p>
    </div>
  </div>




</template>


<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

// Estado que representa el DTO ActualizarConfiguracionDto
const config = ref({
  cantidadReosActual: null,
  variacionReosMin: null,
  variacionReosMax: null,
  leadTimeProveedorDias: null,
  factorStockSeguridad: null,
  costoAlmacenamientoDiario: null,
})

const configId = ref(null)

const statusMessage = ref('')
const isSaving = ref(false)

// Intento de cargar la configuración desde la API.
// Asumo el endpoint GET /configuracion (ajusta si es diferente).
async function loadConfig() {
  statusMessage.value = 'Cargando...'
  try {
    const resp = await api.get('/configuracion')
    console.log('GET /configuracion response:', resp)
    // Si la API devuelve el objeto directamente
    if (resp && resp.data) {
      // Si la respuesta incluye un id, guárdalo y no lo copies en el objeto config
      const { id, ...rest } = resp.data
      if (id !== undefined) configId.value = id
      Object.assign(config.value, rest)
      statusMessage.value = 'Configuración cargada'
    } else {
      statusMessage.value = 'Respuesta inesperada del servidor'
    }
  } catch (err) {
    console.error(err)
    statusMessage.value = 'Error al cargar la configuración'
  } finally {
    setTimeout(() => { statusMessage.value = '' }, 3000)
  }
}

// Guardar (PUT) la configuración. Asumo PUT /configuracion.
async function saveConfig() {
  statusMessage.value = 'Guardando...'
  isSaving.value = true
  try {
    if (!configId.value) {
      statusMessage.value = 'No se encontró id de configuración. No se puede actualizar.'
      return
    }

    // Eliminar campos null/undefined para enviar sólo los que realmente se quieren actualizar
    const payload = Object.fromEntries(
      Object.entries(config.value).filter(([, v]) => v !== null && v !== undefined)
    )

    const url = `/configuracion/${configId.value}`
    console.log('PUT', url, payload)
    const resp = await api.put(url, payload)
    console.log('PUT response:', resp)
    if (resp && (resp.status === 200 || resp.status === 204)) {
      statusMessage.value = 'Configuración guardada'
    } else {
      statusMessage.value = `Guardar: respuesta inesperada (status ${resp && resp.status})`
    }
  } catch (err) {
    console.error('Error en PUT /configuracion:', err)
    // Mostrar mensaje de error más detallado cuando esté disponible
    const serverMsg = err?.response?.data?.message || err?.response?.data || err.message
    statusMessage.value = `Error al guardar: ${serverMsg}`
  } finally {
    isSaving.value = false
    setTimeout(() => { statusMessage.value = '' }, 5000)
  }
}

onMounted(() => {
  loadConfig()
})

</script>
