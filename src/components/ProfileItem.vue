<script setup lang="ts">
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.removeAuthToken()
  router.push('/sign-in')
}

const userName = ref('')

const getProfile = async () => {
  const token = Cookies.get('authToken')

  if (!token) {
    console.log('Нет токена, авторизация невозможна')
    router.push('/sign-in')
    return
  }
  try {
    const response = await fetch(`http://localhost:5000/profile`, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('Ошибка при запросе на сервер')
    }
    const data = await response.json()
    userName.value = data.name
  } catch (error) {
    console.error('Ошибка:', error)
    authStore.removeAuthToken()
    router.push('/sign-in')
  }
}

onMounted(getProfile)
</script>

<template>
  <div class="about form-container">
    <div class="profile">
      <img class="avatar-img" src="@/assets/empty.jpg" />
      <h1>{{ userName }}</h1>
    </div>
    <div class="statistics">тут статистика</div>
    <div class="settings">
      <img
        class="img-settings"
        @click="logout"
        src="https://static-00.iconduck.com/assets.00/settings-icon-2048x2046-cw28eevx.png"
      />
      <!-- <button>Выход</button> -->
    </div>
  </div>
</template>

<style setup>
.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin-top: 50px;
  width: 100%;
  position: relative;
}

.profile {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  gap: 20px;
}

.avatar-img {
  width: 124px;
  height: 124px;
  border-radius: 50%;
}

.settings {
  width: 40px;
  height: 40px;
  position: relative;
}

.settings img {
  font-size: 2rem;
  max-width: 35px;
  max-height: 35px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: default;
  transition: all 1.5s ease;
}
.img-settings:hover {
  transform: rotate(720deg);
}
</style>
