import { createRouter, createWebHistory } from 'vue-router'
import { inject } from 'vue'

import HomeView from '../views/HomeView.vue'
import CreateView from '@/views/CreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      // Ajout des Meta Fields
      meta: { requireAuth: true },
    },
  ],
})

// Définition du 'Global Before Guards'
router.beforeEach((to, from) => {
  // Injection du fournisseur de dépendance
  const GlobalStore = inject('GlobalStore')

  if (to.meta.requireAuth && !GlobalStore.userToken.value) {
    //   👆 La route requière une authentification et 👆 l'utilisateur n'est pas connecté => donc on le redirige

    alert('Vous devez avoir un token')

    return { name: 'home' }
  }
})

export default router
