<template>
  <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
      Gestión de Usuarios 🧑‍💻
    </h1>
    <div class="flex justify-end mb-4">
      <button
        @click="openModal('create')"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center space-x-2"
      >
        <span class="text-xl">➕</span>
        <span>Agregar Usuario</span>
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-lg shadow-inner">
      <div v-if="isLoading" class="text-center p-8 text-gray-500">
        <p>Cargando usuarios...</p>
      </div>
      <table v-else-if="users.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
            <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.id }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ user.name }} {{ user.lastname }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
               <span :class="getStatusClass(user.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ user.status === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="py-4 px-6 whitespace-nowrap text-center text-sm font-medium">
              <div class="flex items-center justify-center space-x-2">
                <button @click="openModal('edit', user)" class="text-blue-500 hover:text-blue-700 transform hover:scale-110" title="Editar">
                  ✏️
                </button>
                <button @click="openDeleteConfirm(user)" class="text-red-500 hover:text-red-700 transform hover:scale-110" title="Eliminar">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center p-8 text-gray-500">
        <p>No hay usuarios para mostrar. ¡Agrega uno!</p>
      </div>
    </div>

    <!-- Modal Principal: Crear/Editar Usuario -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-lg relative">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
          ×
        </button>
        <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>
        <form @submit.prevent="saveUser">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Usuario:</label>
              <input type="text" id="username" v-model="currentUser.username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
            </div>
            <div class="mb-4">
              <label for="user_name" class="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
              <input type="text" id="user_name" v-model="currentUser.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
            </div>
            <div class="mb-4">
              <label for="user_lastname" class="block text-gray-700 text-sm font-bold mb-2">Apellido:</label>
              <input type="text" id="user_lastname" v-model="currentUser.lastname" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
            </div>
            <div class="mb-4">
              <label for="user_email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input type="email" id="user_email" v-model="currentUser.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
            </div>
             <div class="mb-4">
              <label for="user_password" class="block text-gray-700 text-sm font-bold mb-2">
                {{ modalMode === 'create' ? 'Contraseña:' : 'Nueva Contraseña:'}}
              </label>
              <input type="password" id="password" v-model="currentUser.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" :required="modalMode === 'create'" />
              <p v-if="modalMode === 'edit'" class="text-xs text-gray-500 mt-1">Dejar en blanco para no cambiar.</p>
            </div>
            <div class="mb-4">
              <label for="user_status" class="block text-gray-700 text-sm font-bold mb-2">Estatus:</label>
              <select id="user_status" v-model="currentUser.status" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="BAN">Baneado</option>
              </select>
            </div>
            <div class="mb-4 md:col-span-2">
              <label for="user_role" class="block text-gray-700 text-sm font-bold mb-2">Rol:</label>
              <select id="user_role" v-model="currentUser.role" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
                <option value="ADMIN">Administrador</option>
                <option value="CLIENT">Cliente</option>
              </select>
            </div>
          </div>
           <div v-if="formError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong class="font-bold">Error: </strong>
            <span class="block sm:inline">{{ formError }}</span>
          </div>
          <div class="flex justify-end space-x-4">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">💾 Guardar</button>
            <button type="button" @click="closeModal" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm text-center">
        <h2 class="text-xl font-bold mb-4">Confirmar Eliminación</h2>
        <p class="text-gray-600 mb-6">¿Estás seguro de que quieres eliminar al usuario <strong class="text-gray-800">{{ userToDelete.name }}</strong>? Esta acción no se puede deshacer.</p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmRemoveUser" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">Sí, Eliminar</button>
          <button @click="closeDeleteConfirm" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchUsers, createUser, updateUser, deleteUser } from './../../services/user';

const users = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const modalMode = ref('create');
const currentUser = ref({});
const formError = ref(null);

const showDeleteConfirm = ref(false);
const userToDelete = ref(null);

const modalTitle = computed(() => modalMode.value === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario');

const getStatusClass = (status) => {
  return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
};

const saveUser = async () => {
  formError.value = null;
  try {
    const payload = { ...currentUser.value };
    // Solo enviar la contraseña si se está creando o si se ha modificado en edición
    if (modalMode.value === 'edit' && !payload.password) {
      delete payload.password;
    }

    if (modalMode.value === 'create') {
      await createUser(payload);
    } else {
      console.log(payload)
      await updateUser(payload.id, payload);
    }
    await loadUsers();
    closeModal();
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    formError.value = error.response?.data?.message || 'Ocurrió un error inesperado.';
  }
};

const openDeleteConfirm = (user) => {
  userToDelete.value = user;
  showDeleteConfirm.value = true;
};

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  userToDelete.value = null;
};

const confirmRemoveUser = async () => {
  if (!userToDelete.value) return;
  try {
    await deleteUser(userToDelete.value.id);
    await loadUsers();
    closeDeleteConfirm();
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    // Opcional: Mostrar un error al usuario
    closeDeleteConfirm();
  }
};

const loadUsers = async () => {
  isLoading.value = true;
  try {
    users.value = await fetchUsers();
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    users.value = []; // Limpiar en caso de error
  } finally {
    isLoading.value = false;
  }
};

const openModal = (mode, user = {}) => {
  modalMode.value = mode;
  formError.value = null;
  currentUser.value = mode === 'create'
    ? { name: '', lastname: '', username: '', email: '', status: 'ACTIVE', role: 'CLIENT', password: '' }
    : { ...user, password: '' }; // Limpiar campo de contraseña al abrir para editar
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  loadUsers();
});
</script>
