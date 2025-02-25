<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
onMounted(() => {
  const authStore = useAuthStore()
  // Проверяем авторизацию и если пользователь авторизован, перенаправляем его
  if (authStore.isAuthenticated) {
    router.push('/') // Перенаправляем на страницу, если пользователь авторизован
  }
})

const login = ref('')
const password = ref('')

const error = ref([false, ''])

const handleSubmit = (event) => {
  event.preventDefault()
  if (login.value == '' || password.value == '') {
    error.value[0] = true
    error.value[1] = 'Логин или пароль содержит пустую строку'

    console.log(error.value[0])
    return
  }
  console.log('Отправка формы')
  error.value[0] = false
  error.value[1] = ''
  login.value = ''
  password.value = ''
}
</script>

<template>
  <div class="wrapper">
    <div class="form-container">
      <form @submit="handleSubmit">
        <div>
          <label>Логин/Почта:</label>
          <input v-model="login" />
        </div>
        <div>
          <label>Пароль:</label>
          <input type="password" v-model="password" />
        </div>
        <div class="error">{{ error[0] === false ? '' : error[1] }}</div>
        <button type="submit">Войти</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  background-color: #f0f0f0; /* Фон для всей страницы */
}

.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

form div {
  margin-bottom: 15px;
}

form input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

form button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

form button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-bottom: 10px;
}
</style>
