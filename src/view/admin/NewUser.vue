<template>
  <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
    <h1 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
      Gestión de Usuarios 🧑‍💻
    </h1>
    <div class="flex justify-end mb-4">
      <button
        @click="openModal('create')"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
      >
        ➕ Agregar Usuario
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-lg shadow-inner">
      <table v-if="users.length" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
            <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.id }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ user.name }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ user.lastname }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{{ user.status }}</td>
            <td class="py-4 px-6 whitespace-nowrap text-center text-sm font-medium">
              <div class="flex items-center justify-center space-x-2">
                <button @click="openModal('edit', user)" class="text-blue-500 hover:text-blue-700 transform hover:scale-110">
                  ✏️
                </button>
                <button @click="removeUser(user.id)" class="text-red-500 hover:text-red-700 transform hover:scale-110">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center p-8 text-gray-500">
        <p>No hay usuarios para mostrar.</p>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm relative">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
          ×
        </button>
        <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>
        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label for="user_name" class="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
            <input
              type="text"
              id="user_name"
              v-model="currentUser.name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div class="mb-4">
            <label for="user_lastname" class="block text-gray-700 text-sm font-bold mb-2">Apellido:</label>
            <input
              type="text"
              id="user_lastname"
              v-model="currentUser.lastname"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div class="mb-4">
            <label for="user_email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="user_email"
              v-model="currentUser.email"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div class="mb-4">
            <label for="user_status" class="block text-gray-700 text-sm font-bold mb-2">Estatus:</label>
            <select
              id="user_status"
              v-model="currentUser.status"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="user_role" class="block text-gray-700 text-sm font-bold mb-2">Rol:</label>
            <select
              id="user_role"
              v-model="currentUser.role"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="admin">Admin</option>
              <option value="user">Usuario</option>
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
import { fetchUsers, createUser, updateUser, deleteUser } from './../../services/user';

const users = ref([]);
const showModal = ref(false);
const modalMode = ref('create');
const currentUser = ref({});

const modalTitle = computed(() =>
  modalMode.value === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'
);

const saveUser = async () => {
  try {
    if (modalMode.value === 'create') {
      await createUser(currentUser.value);
    } else {
      await updateUser(currentUser.value.id, currentUser.value);
    }
    await loadUsers();
    closeModal();
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
  }
};

const removeUser = async (id) => {
  try {
    // Nota: No se usa `confirm()` porque no es compatible con el entorno. 
    // Se elimina directamente y se espera a que la API lo confirme.
    await deleteUser(id);
    await loadUsers();
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
  }
};

const loadUsers = async () => {
  try {
    const response = await fetchUsers();
    users.value = response;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
  }
};

const openModal = (mode, user = {}) => {
  modalMode.value = mode;
  currentUser.value = mode === 'create'
    ? { name: '', lastname: '', email: '', status: 'active', role: 'user' }
    : { ...user };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  loadUsers();
});
</script>

<style>
/* Se asume que Tailwind CSS está disponible */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>
