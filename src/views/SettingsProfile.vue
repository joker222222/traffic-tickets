<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import Cookies from 'js-cookie'

const authStore = useAuthStore()

const userName = ref('')
const userEmail = ref('')
const userAvatar = ref('')
const userPassword = ref('')

const tempUserName = ref('')
const tempUserEmail = ref('')
const tempUserAvatar = ref('')
const tempUserPassword = ref('')

const getProfile = async () => {
  const token = Cookies.get('authToken')
  if (!token) {
    router.push('/sign-in')
    return
  }

  try {
    const response = await fetch(`http://localhost:5000/user/profile`, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) throw new Error('Ошибка при запросе на сервер')

    const data = await response.json()
    userName.value = data.data.name
    userEmail.value = data.data.email
    userAvatar.value = data.data.avatar
    userPassword.value = data.data.password

    tempUserName.value = userName.value
    tempUserEmail.value = userEmail.value
    tempUserAvatar.value = userAvatar.value
    tempUserPassword.value = userPassword.value
  } catch (error) {
    console.error('Ошибка:', error)
    authStore.removeAuthToken()
    router.push('/sign-in')
  }
}

const saveSettings = (id: number) => {
  switch (id) {
    case 0:
      userAvatar.value = tempUserAvatar.value
      break
    case 1:
      userName.value = tempUserName.value
      break
    case 2:
      userEmail.value = tempUserEmail.value
      break
    case 3:
      userPassword.value = tempUserPassword.value
      break
  }
}

const cancelUpdateProfile = () => {
  router.push('/profile')
}

const updateProfile = async () => {
  await fetch(`http://localhost:5000/user/profile-change`, {
    method: 'PUT',
    headers: {
      Authorization: Cookies.get('authToken'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: userName.value,
      email: userEmail.value,
      avatar: userAvatar.value,
      password: userPassword.value,
    }),
  })
  router.push('/profile')
}

const uploadAvatar = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      tempUserAvatar.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

onMounted(getProfile)
</script>

<template>
  <div class="form-container form-container-changer">
    <div class="avatar-block">
      <input type="file" @change="uploadAvatar" accept="image/*" class="file-input" />
      <img class="avatar-img" :src="tempUserAvatar" alt="avatar" />
      <button
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        @click="saveSettings(0)"
      >
        Сохранить аватар
      </button>
    </div>

    <div class="field">
      <label>Имя: {{ userName }}</label>
      <input v-model="tempUserName" class="input" placeholder="Новое имя" />
      <button
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        @click="saveSettings(1)"
      >
        Сохранить имя
      </button>
    </div>

    <div class="field">
      <label>Почта: {{ userEmail }}</label>
      <input v-model="tempUserEmail" class="input" placeholder="Новая почта" />
      <button
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        @click="saveSettings(2)"
      >
        Сохранить почту
      </button>
    </div>

    <div class="field">
      <label>Пароль: ••••••</label>
      <input type="password" v-model="tempUserPassword" class="input" placeholder="Новый пароль" />
      <button
        class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        @click="saveSettings(3)"
      >
        Сохранить пароль
      </button>
    </div>

    <div class="action-buttons flex justify-center gap-1">
      <button
        class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
        @click="updateProfile"
      >
        Сохранить изменения
      </button>
      <button
        class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
        @click="cancelUpdateProfile"
      >
        Отменить
      </button>
    </div>
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
