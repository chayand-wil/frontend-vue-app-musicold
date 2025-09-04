<template>
  <!-- <div class="min-h-screen flex items-center justify-center bg-gray-500"> -->
  <div
    class="min-h-screen flex items-center justify-center bg-gray-500 bg-opacity-20 backdrop-blur-sm"
  >
    <!-- <div
      class="bg-white p-14 rounded-[3rem] hover:shadow-[0_15px_70px_rgba(0,0,0,0.8)] w-full max-w-2xl space-y-4"
    > -->
    <h1>Bienvenido, invitado!</h1>
    <div class="mb-4">
      <button @click="router.push('/login')">Iniciar sesión</button>
    </div>
    <div>
      <button @click="router.push('/register')">Registrarse</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import api from '../../axios'

import { useRouter } from 'vue-router'

const focus_name = ref(false)
const focus_lastname = ref(false)
const focus_mail = ref(false)
const focus_password = ref(false)

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const SubmitEvent = ref(false)

const login = async () => {
  SubmitEvent.value = true
  if (!email.value || !password.value) {
    error.value = 'Todos los campos son obligatorios'
  } else {
    try {
      // const response = await api.post('/login', {
      //   email: email.value,
      //   password: password.value,
      // })

      // const token = response.data.access_token
      // const role = response.data.user.rol.slug
      // const id = response.data.user.id

      // localStorage.setItem('token', token)
      // localStorage.setItem('role', role)
      // localStorage.setItem('id', id)
      const role = 'admin'
      switch (role) {
        case 'admin':
          router.push('/admin')
          break
        case 'comun_user':
          router.push('/comun_user')
          break

        default:
          router.push('/')
      }
    } catch (err) {
      error.value = 'Credenciales incorrectas'
    }
  }
}
</script>
