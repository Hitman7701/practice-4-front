<script setup>
import axios from 'axios'
import { RouterLink, useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()

const title = ref('')
const picture = ref(null)
const price = ref(0)

const handleSubmit = async () => {
  // Création du nouvel objet 'FormData'
  const formData = new FormData()

  // Ajout du fichier image au 'FormData'
  formData.append('files.url', picture.value)

  // "Stringification" de l'objet contenant les autres informations
  const stringifiedInfos = JSON.stringify({
    title: title.value,
    // 👇 Ajout information du prix
    price: price.value
  })
  // Ajout des autres informations au 'FormData'
  formData.append('data', stringifiedInfos)

  try {
    const { data } = await axios.post('http://localhost:1337/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('response>>', data)

    router.push({ name: 'home' })
  } catch (error) {
    console.log('Create - catch >>', error.response)
  }
}

// BONUS - 👇 La propriété computed qui transforme l'image chargée en url interprétable par une balise 'img'
const imagePreview = computed(() => {
  return URL.createObjectURL(picture.value)
})
</script>

<template>
  <main>
    <h1>Ajoute ton image</h1>

    <form @submit.prevent="handleSubmit">
      <label for="title">Titre :</label>
      <input type="title" id="title" placeholder="Mon chat" v-model="title" />

      <!-- 👇 Ajout champs de saisie du prix -->
      <label for="price">Prix :</label>
      <input type="number" id="price" placeholder="32" v-model="price" />

      <input
        type="file"
        name="picture"
        id="picture"
        @input="(event) => (picture = event.target.files[0])"
      />

      <button>Valider</button>
    </form>

    <!-- BONUS - Ce bloc apparait seulement si 'picture' à une valeur truthy -->
    <div v-if="picture">
      <img :src="imagePreview" alt="" />
      <!-- 👆 La source de l'image est la valeur retournée par la propriété computed -->
    </div>

    <RouterLink :to="{ name: 'home' }"><button>Retour à l'accueil</button></RouterLink>
  </main>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 350px;
  margin-bottom: 130px;
}
img {
  height: 200px;
  width: 200px;
  object-fit: cover;
  margin-bottom: 20px;
}
</style>
