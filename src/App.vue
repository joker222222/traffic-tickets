<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()
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
        <RouterLink to="/statistics" v-if="authStore.isAuthenticated"
          ><h1>Статистика</h1></RouterLink
        >
        <RouterLink to="/profile" v-if="authStore.isAuthenticated"><h1>Профиль</h1></RouterLink>
        <RouterLink to="/authorization" v-if="!authStore.isAuthenticated"
          ><h1>Авторизация</h1></RouterLink
        >
        <RouterLink to="/registration" v-if="!authStore.isAuthenticated"
          ><h1>Регистрация</h1></RouterLink
        >
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
