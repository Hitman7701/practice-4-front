import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

// Création des variables pour le 'provider'
const userToken = ref('')
const updateUserToken = (value) => {
  userToken.value = value
  alert('Changement effectué')
}

// Création du 'provider'
app.provide('GlobalStore', { userToken: userToken, updateUserToken: updateUserToken })

app.mount('#app')
