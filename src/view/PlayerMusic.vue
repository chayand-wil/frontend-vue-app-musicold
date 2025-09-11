<template>

    <div class="music-player">
        <!-- Imagen del álbum -->
        <img :src="event.publication?.image" alt="Portada" class="cover" />

        <!-- Reproductor de audio -->
        <audio :src="event.publication?.audio" controls></audio>

        <!-- Botón para ver más información -->
        <button @click="toggleInfo">
            {{ showInfo ? "Ocultar info" : "Ver info" }}
        </button>

        <!-- Información adicional -->
        <div v-if="showInfo" class="info">
            <h3>{{ event.title }}</h3>
            <p>Artista: {{ event.artist.name }}</p>
            <p>Fecha de inicio: {{ event.start_date }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchOneEvent } from '../services/event';

const event = ref({});

const loadEvent = async () => {
    try {
        const response = await fetchOneEvent(1);
        event.value = response;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
};

const showInfo = ref(false);

const toggleInfo = () => {
    showInfo.value = !showInfo.value;
};

onMounted(() => {
    loadEvent();
});

</script>

<style scoped>
.music-player {
  max-width: 350px;
  margin: 20px auto;
  padding: 15px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1f1f1f, #2c2c2c);
  color: #fff;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  font-family: 'Arial', sans-serif;
}

.cover {
  width: 100%;
  height: 250px; /* Fijo */
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
  object-fit: cover; /* Recorta y llena el espacio */
}

audio {
    width: 100%;
    margin: 10px 0;
}

.info-btn {
    margin: 10px 0;
    padding: 8px 16px;
    background: #007bff;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}

.info-btn:hover {
    background: #0056b3;
}

.info {
    margin-top: 12px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    text-align: left;
}

.info h3 {
    margin: 0 0 8px;
    font-size: 1.2rem;
    color: #4da6ff;
}
</style>