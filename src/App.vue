<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore'
// import router from '@/router'
import { onMounted } from 'vue'
import Cookies from 'js-cookie'

const authStore = useAuthStore()
// const router = useRoute()
// Удаление куки
// Cookies.remove('authToken')

// Установка куки
// Cookies.set('authToken', 'newGeneratedToken', { expires: 7 })  // expires — это срок действия куки в днях

// Проверяем наличие токена в куках
// const token = Cookies.get('authToken')

const getCookies = async () => {
  // Проверяем наличие токена в куках
  const token = Cookies.get('authToken')

  if (!token) {
    console.log('Нет токена, авторизация невозможна')
    return
  }

  try {
    const response = await fetch(`http://localhost:5000/user/token_check`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('Ошибка при запросе на сервер')
    }

    // const data = await response.json()
    authStore.setAuthToken(token)
    // console.log('Ответ от сервера:', data)
  } catch (error) {
    console.error('Ошибка:', error)
    authStore.removeAuthToken()
  }
}
onMounted(getCookies)
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/"><h1>Главная</h1></RouterLink>
        <!-- На главной будут новости -->
        <RouterLink to="/testing"><h1>Тестирование</h1></RouterLink>
        <RouterLink to="/training"><h1>Обучение</h1></RouterLink>
        <RouterLink to="/exam"><h1>Экзамен</h1></RouterLink>
        <RouterLink to="/marathon"><h1>Марафон</h1></RouterLink>
        <!-- <RouterLink to="/statistics" v-if="authStore.isAuthenticated"
          ><h1>Статистика</h1></RouterLink >-->
        <RouterLink to="/profile" v-if="authStore.isAuthenticated"><h1>Профиль</h1></RouterLink>
        <RouterLink to="/sign-in" v-if="!authStore.isAuthenticated"
          ><h1>Авторизация</h1></RouterLink
        >
        <!-- <RouterLink to="/sign-up" v-if="!authStore.isAuthenticated"
          ><h1>Регистрация</h1></RouterLink>   Возможно будет под авторизационной формой-->
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
