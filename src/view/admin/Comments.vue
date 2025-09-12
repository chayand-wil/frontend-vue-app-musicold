<template>
    <div class="container mx-auto my-20 p-4 sm:p-8 font-sans">
        <h1 class="text-3xl sm:text-4xl font-bold text-center text-white-800 mb-6">
            Publicacion No. 1
        </h1>

        <div v-if="comments.length">
            <table class="min-w-full bg-white border rounded-lg shadow overflow-hidden">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Comentario</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado del comentario</th>
                        <th class="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="comment in comments" :key="comment.id" class="border-t hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm text-gray-700">
                            {{ comment.app_user?.username }}
                        </td>

                        <td class="px-6 py-4 text-sm text-gray-700">
                            {{ comment.comment }}
                        </td>

                        <td class="px-6 py-4 text-sm font-semibold" :class="{
                            'text-green-600': comment.comment_status === 'visible',
                            'text-red-600': comment.comment_status === 'ban',
                            'text-gray-500': comment.comment_status === 'hidden'
                        }">
                            {{ comment.comment_status }}
                        </td>


                        <td class="px-6 py-4 text-center space-x-2">
                            <button class="bg-blue-100 hover:bg-blue-200 text-white px-3 py-1 rounded text-sm"
                                @click="openUserModal(comment.app_user)">
                                👤
                            </button>
                            <button v-if="comment.comment_status !== 'ban'"
                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                @click="clickBanComment(comment.id)">
                                BAN
                            </button>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="text-center p-8 text-gray-500 bg-white rounded-lg shadow-inner">
            <p>No hay comentarios para mostrar.</p>
        </div>
    </div>

    <!-- Modal de usuario -->
    <div v-if="showUserModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md relative text-black">
            <!-- Botón para cerrar -->
            <button @click="closeUserModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
                ×
            </button>

            <h2 class="text-2xl font-bold mb-4">Información del Usuario</h2>

            <div v-if="selectedUser">
                <p><strong>Username:</strong> {{ selectedUser.username }}</p>
                <p><strong>Nombre:</strong> {{ selectedUser.name }}</p>
                <p><strong>Apellido:</strong> {{ selectedUser.name }}</p>
                <p><strong>Email:</strong> {{ selectedUser.email }}</p>
                <p><strong>Rol:</strong> {{ selectedUser.role }}</p>
                <p><strong>Estado:</strong> {{ selectedUser.status }}</p>
            </div>

            <div v-else class="text-gray-500">
                <p>No hay información disponible.</p>
            </div>
        </div>
    </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchComments, banComment } from './../../services/comment';
import { useRoute } from 'vue-router'; 

const comments = ref([]);
const showUserModal = ref(false);      // Controla si el modal está visible
const selectedUser = ref(null);        // Guarda la instancia del usuario seleccionado

// Obtenemos el idPublication de la ruta
const route = useRoute();
const idPublication = route.params.idPublication;

const loadComments = async () => {
    try {
        const response = await fetchComments(idPublication);
        comments.value = response;
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
        publications.value = [];
    }
};

const clickBanComment = async (id) => {
  try {
    const response = await banComment(id);
    loadComments(); // Recarga la tabla
  } catch (error) {
    alert("Ocurrió un error al banear el comentario");
    console.error(error);
  }
};

const openUserModal = (user) => {
    selectedUser.value = user;           // Guardamos el usuario seleccionado
    showUserModal.value = true;          // Mostramos el modal
};

const closeUserModal = () => {
    showUserModal.value = false;         // Ocultamos el modal
    selectedUser.value = null;           // Limpiamos la variable
};

onMounted(() => {
    loadComments();
});

</script>