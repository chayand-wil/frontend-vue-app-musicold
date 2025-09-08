<template>
  <!-- <div class="min-h-screen flex items-center justify-center bg-gray-500"> -->
  <div
    class="min-h-screen flex items-center justify-center bg-gray-500 bg-opacity-10 backdrop-blur-xs"
  >
  
    <h1>Bienvenido</h1>
    <div class="mb-4">
      <button @click="router.push('/login')">Iniciar sesión</button>
    </div>
 
     <div
      class="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-2xl p-10 shadow-lg text-green-400"
    >
    <h1>{{ textoo }}</h1>
  </div>
    

  </div>
</template>

<script setup>
import api from '../axios'
import {   ref, onMounted } from 'vue'
// import { inject, ref, onMounted } from 'vue'



import { useRouter } from 'vue-router'

const focus_name = ref(false)
const focus_lastname = ref(false)
const focus_mail = ref(false)
const focus_password = ref(false)

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const textoo = ref('aun no')


const SubmitEvent = ref(false)


onMounted(async () => {
  try {
    // textoo.value = res.data.mensaje



  } catch (e) {
    alert('Error: ' + e.response.data.mensaje)

  }
})




  




</script>
