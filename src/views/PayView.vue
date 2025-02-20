<script setup>
import { RouterLink } from 'vue-router'
import { onBeforeMount, onMounted, ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

const props = defineProps({
  id: { required: true }
})

const imageInfos = ref(null)
const confirmedPayment = ref(false)

// Création d'une instance de Stripe (👇 Pensez à remplacer par votre clé publique)
const stripePromise = loadStripe(
  'pk_test_51JwR3iDsgZzpCktrB9Ra8xSMO5EkQlsoj6RupDA6knzBLxcwelix67XsVhV8SddUt7Ame9LouJVmsgHM9KfVZNvt00RSkstDFG'
)

// Valeur réactive qui stockera l'élément 'Card'
const cardElement = ref(null)

onBeforeMount(async () => {
  // Utilisation de l'instance de Stripe
  const stripe = await stripePromise

  // Obtention du gestionnaire d'élément Stripe
  const elements = stripe.elements()

  // Création d'un élément 'Card' qui sera stocké dans la 'ref' nommée 'cardElement'
  cardElement.value = elements.create('card')

  // Montage de l'élément 'Card' dans la 'div' ayant l'id 'card-element'
  cardElement.value.mount('#card-element')
})

onMounted(async () => {
  try {
    // Requête pour récupérer les informations de l'article correspondant à l'id
    const { data } = await axios.get(`http://localhost:1337/api/images/${props.id}?populate[0]=url`)

    // Vérification des informations reçues en les affichant dans la console du navigateur
    console.log('PayView - data >>>', data.data)

    // Une fois la vérification faite, transmission des informations à la ref 'postInfos'
    imageInfos.value = data.data
  } catch (error) {
    // Affichage du message d'erreur dans la console du navigateur si un problème survient lors de la requête
    console.log('PayView - catch>>', error)
  }
})

const handlePayment = async () => {
  try {
    // Utilisation de l'instance de Stripe
    const stripe = await stripePromise

    // Création du TOKEN de Stripe
    const { token } = await stripe.createToken(cardElement.value)

    // Stocke le TOKEN de Stripe dans une variable
    const stripeToken = token.id

    // Requête au backend Strapi
    const { data } = await axios.post('http://localhost:1337/api/images/buy', {
      token: stripeToken,
      amount: imageInfos.value.attributes.price,
      title: imageInfos.value.attributes.title
    })

    // Si la transaction a été éffectué avec succès
    if (data.status === 'succeeded') {
      confirmedPayment.value = true
    }
  } catch (error) {
    console.log('PayView - error payment>>', error)
  }
}
</script>

<template>
  <main>
    <h1>Achat d'une photo</h1>

    <p v-if="imageInfos">
      Vous acheter la photo <span>"{{ imageInfos.attributes.title }}"</span> à
      <span>{{ imageInfos.attributes.price }}</span> €
    </p>

    <!-- 👇 Cette balise apparait si la ref 'confirmedPayment' est 'true' -->
    <p v-if="confirmedPayment">Commande effectuée</p>

    <!-- 👇 Cette balise apparait si la ref 'confirmedPayment' est 'false' -->
    <div v-else>
      <div id="card-element"></div>
      <button @click="handlePayment">Payer</button>
    </div>

    <RouterLink :to="{ name: 'home' }"><button>Retour à l'accueil</button></RouterLink>
  </main>
</template>

<style scoped>
#card-element {
  width: 500px;
}
button {
  margin-top: 40px;
}
span {
  font-weight: bold;
}
p {
  margin: 20px 0;
}
</style>
