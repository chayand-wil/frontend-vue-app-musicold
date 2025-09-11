<template>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../axios'
import { useRouter } from 'vue-router'

import { useRegistroUsuario } from '@/composables/useRegistroUsuario'

const {
  nuevo,
  mensaje,
  error,
  municipios,
  focus_name,
  focus_lastname,
  focus_mail,
  focus_password,
  focus_dpi,
  focus_direccion,
  focus_contacto,
  crearUsuario,
} = useRegistroUsuario()

const router = useRouter()

const showModal = ref(false)
const idUser = ref('')
const contador = ref({
  id: '1',
  cantidad: 0,
})

const usuarios = ref([])
// const mensaje = ref('')
// const error = ref('')

// Verifica el rol
onMounted(async () => {
  try {
    // const res = await api.get('/users/profile')
    // if (res.data.rol.slug !== 'ADMIN') {
    //   router.push('/')
    // } else {
    // //   // await cargarUsuarios()
    // //   // await cargarContador()
    // }
  } catch (e) {
    router.push('/')
  }
})

// update usuario
const updateUser = async () => {
  mensaje.value = ''
  error.value = ''
  try {
    const res = await api.post('/updateUser', userSelected.value)
    mensaje.value = res.data.message

    await cargarUsuarios()
    showModal.value = false
  } catch (e) {
    error.value = e.response.data.message
    console.error()
  }
}

// Cargar usuario
const cargarUser = async (id) => {
  try {
    const res = await api.get(`/uniqueuser/${id}`)
    userSelected.value = res.data
    showModal.value = true
  } catch (e) {
    error.value = 'Error al cargar el usuario'
  }
}

// eliminar un usuario
const deleteUser = async (id) => {
  idUser.value = id
  try {
    const res = await api.get(`/deleteUser/${id}`)
    mensaje.value = 'Usuario eliminado correctamente'
    await cargarUsuarios()
  } catch (e) {
    error.value = 'Error al cargar el usuario'
  }
}

// Crear usuario
const crearUsuariot = async () => {
  mensaje.value = ''
  error.value = ''
  try {
    const res = await api.post('/users', nuevo.value)
    // mensaje.value = 'Usuario creado correctamente'
    mensaje.value = res.data.message
    const idd = res.data.user_id
    console.log('ultimo user insertado id: ' + idd)

    await cargarUsuarios()
  } catch (e) {
    // error.value = 'Error al crear usuario'
    error.value = e.response.data.message
    console.error(e)
  }
}

// Obtener lista de usuarios
const cargarUsuarios = async () => {
  try {
    const res = await api.get('/users')
    usuarios.value = res.data
  } catch (e) {
    error.value = 'Error al cargar usuarios'
  }
}

// Logout
const logout = async () => {
  try {
    await api.post('/logout')
  } catch (e) {}
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.router-link-exact-active {
  color: #3cffa7;
}
</style>
