import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const token = ref('')

  // Функция для изменения состояния аутентификации
  function changeIsAuthenticated(status: boolean) {
    isAuthenticated.value = status
  }

  // Функция для проверки аутентификации, можно проверить токен в куках
  const checkAuth = () => {
    const storedToken = Cookies.get('authToken')
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
    }
  }

  // Функция для установки токена в store и куки
  const setAuthToken = (newToken: string) => {
    token.value = newToken
    Cookies.set('authToken', newToken, { expires: 7 }) // Сохраняем токен в куки на 7 дней
    isAuthenticated.value = true
  }

  const removeAuthToken = () => {
    token.value = ''
    Cookies.remove('authToken')
    isAuthenticated.value = false
  }

  return { isAuthenticated, checkAuth, changeIsAuthenticated, setAuthToken, removeAuthToken }
})
