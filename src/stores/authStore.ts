import { defineStore } from 'pinia'
import { ref } from 'vue'
// import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

  async function checkAuth() {
    try {
      // const response = await axios.get('/api/auth/check') // Запрос на сервер
      // isAuthenticated.value = response.data.authenticated // true/false от сервера
      isAuthenticated.value = false // true/false от сервера
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error)
      isAuthenticated.value = false
    }
  }

  return { isAuthenticated, checkAuth }
})
