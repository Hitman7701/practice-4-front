<script setup>
import axios from 'axios'
import { RouterLink } from 'vue-router'
import { onMounted, ref, inject } from 'vue'

const imagesList = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:1337/api/images?populate[0]=url`)
    // On "populate" le champ `url` pour obtenir l'image

    imagesList.value = data.data
  } catch (error) {
    console.log('catch >>>', error)
  }
})

// Injection du fournisseur de dépendance
const GlobalStore = inject('GlobalStore')
</script>

<template>
  <main>
    <h1>Liste d'images</h1>

    <div>
      <!-- Affichage de toutes les images de la liste -->
      <div v-for="image in imagesList" :key="image.id">
        <img :src="image.attributes.url.data[0].attributes.url" alt="" />

        <p>{{ image.attributes.title }}</p>
      </div>
    </div>

    <RouterLink :to="{ name: 'create' }"><button>Ajouter une image</button></RouterLink>

    <button @click="GlobalStore.updateUserToken('je-suis-un-token')">Ajouter un token</button>
    <button @click="GlobalStore.updateUserToken('')">Retirer le token</button>
  </main>
</template>

<style scoped>
main > div {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 50px;
}
img {
  height: 300px;
  width: 300px;
  object-fit: cover;
  margin-bottom: 10px;
}
button {
  margin-left: 20px;
}
a button {
  margin-right: 160px;
  margin-left: 0;
}
</style>
