<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Проверяем авторизацию и если пользователь авторизован, перенаправляем его
  if (authStore.isAuthenticated) {
    router.push('/') // Перенаправляем на страницу, если пользователь авторизован
  }
})

const login = ref('')
const password = ref('')

const error = ref({ hasError: false, message: '' })

const handleSubmit = async (event: Event) => {
  event.preventDefault()

  // Проверка на пустые поля
  if (login.value == '' || password.value == '') {
    error.value.hasError = true
    error.value.message = 'Логин или пароль содержит пустую строку'
    console.log(error.value.hasError)
    return
  }

  try {
    const response = await fetch(`http://localhost:5000/user/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: login.value,
        password: password.value,
      }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Ошибка: ${errorData.message || 'Неизвестная ошибка'}`)
    }
    const data = await response.json()

    if (data.message) {
      authStore.setAuthToken(data.token)
      console.log('Авторизация прошла успешно')
      router.push('/profile')
    } else {
      error.value.hasError = true
      error.value.message = 'Не верный логин или пароль'
      return
    }
  } catch (error: any) {
    error.value.hasError = true
    error.value.message = error.message || 'Произошла неизвестная ошибка'
    console.error('Ошибка при отправке формы:', error)
    return
  }

  // Очистка формы и сброс ошибок
  error.value.hasError = false
  error.value.message = ''
  login.value = ''
  password.value = ''
}
</script>

<template>
  <div class="wrapper">
    <div class="form-container">
      <form @submit="handleSubmit">
        <div>
          <label>Почта:</label>
          <input v-model="login" />
        </div>
        <div>
          <label>Пароль:</label>
          <input type="password" v-model="password" />
        </div>
        <div class="error">{{ error.hasError === false ? '' : error.message }}</div>
        <button type="submit">Войти</button>
      </form>
      <div class="no-account">
        Еще нет аккаунта?
        <router-link class="link" to="/sign-up">Зарегистрируйтесь!</router-link>
      </div>
    </div>
  </div>
</template>

<style setup>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  background-color: #f0f0f0;
  font-size: 1.2rem;
}

.form-container {
  background-color: white;
  text-align: center;
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
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

form button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.no-account {
  margin-top: 12px;
}

.link {
  color: blue;
  text-decoration: underline;
}
</style>
