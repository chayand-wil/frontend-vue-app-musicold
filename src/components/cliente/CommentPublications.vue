<template>
  <div
    class=" text-gray-200 mb-4 border border-gray-500 rounded-2xl p-4 w-fit"
  >
    <!-- Header con estrellas y username -->
    <div class="flex items-center space-x-2">
      <!-- Estrellas -->
      <div class="flex">
        <template v-for="i in 3" :key="i">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.785.57-1.84-.196-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.977 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
            />
          </svg>
        </template>
      </div>
      <!-- Nombre de usuario -->
      <span class="text-sm">{{username}}</span>
    </div>

    <!-- Texto del comentario -->
    <p class="mt-2 text-lg">{{comment_detail}}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
const { commentation } = defineProps(["commentation"]);
const username = ref(null)
const comment_detail = ref(null)
const rating = ref(3)



onMounted(async () =>{
    username.value = commentation.nombre  
    comment_detail.value = commentation.comment
 } );



</script>
