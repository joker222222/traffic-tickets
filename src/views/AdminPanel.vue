<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import Cookies from 'js-cookie'

const authStore = useAuthStore()

const users = ref([])

const getProfile = async () => {
  const token = Cookies.get('authToken')
  if (!token) {
    router.push('/sign-in')
    return
  }

  try {
    const response = await fetch(`http://localhost:5000/admin`, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) throw new Error('Ошибка при запросе на сервер')

    const data = await response.json()
    users.value = data.data
  } catch (error) {
    console.error('Ошибка:', error)
    authStore.removeAuthToken()
    router.push('/profile')
  }
}

const changeRole = async (userId: number) => {
  try {
    const response = await fetch(`http://localhost:5000/admin-change-role/${userId}/${2}`, {
      method: 'PUT',
      headers: {
        Authorization: Cookies.get('authToken'),
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) throw new Error('Ошибка при запросе на сервер')
  } catch (error) {
    console.error('Ошибка:', error)
    authStore.removeAuthToken()
    router.push('/profile')
  }
  getProfile()
}
onMounted(getProfile)
</script>

<template>
  <div class="form-container form-container-changer">
    <h1 class="border-b-1">Админ панель</h1>
    <ul>
      <li v-for="(user, index) in users" v-bind:key="index" class="flex justify-center gap-x-4">
        <img class="avatar-img" :src="user.avatar" alt="avatar" />

        <div class="flex flex-col justify-center items-start">
          <label>Имя: {{ user.name }}</label>

          <label>Почта: {{ user.email }}</label>
          <label>Пароль: {{ user.password }}</label>

          <div>
            <label>Роль: {{ user.role }}</label>
            <button class="change-role" @click="changeRole(user.id)">Изменить роль</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.form-container-changer {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 60px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.change-role {
  padding: 3px;
  margin-left: 10px;
}

.avatar-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.file-input {
  padding: 5px;
  font-size: 0.9rem;
}
</style>
