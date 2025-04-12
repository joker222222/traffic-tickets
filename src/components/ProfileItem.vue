<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/authStore'

interface ResultItem {
  ans_id: number
  ans_correct: boolean
  ans_choice: string
}

const authStore = useAuthStore()
const resultData = ref<ResultItem[]>([])
const router = useRouter()
const seeTicket = ref(false)
const seeExam = ref(false)

const tickets = ref([])
const ticketsExam = ref([])

const toggleTicket = async (id: number) => {
  const token = Cookies.get('authToken')

  if (!token) {
    console.log('Нет токена, авторизация невозможна')
    router.push('/sign-in')
    return
  }
  try {
    const response = await fetch(`http://localhost:5000/get_one_ticket_user_ans/${id}`, {
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
    data.message.map(
      (item: { ans_id: number; ans_correct: boolean; ans_choice: string }, index: number) => {
        resultData.value.push({
          ans_id: index + 1,
          ans_correct: item.ans_correct,
          ans_choice: item.ans_choice,
        })
      },
    )
    router.push({
      name: 'resultPage',
      query: {
        answers: JSON.stringify(resultData.value),
        name: `Результаты билета № ${id}`,
        page: '/profile',
      },
    })
  } catch {}
}

const toggleTicketExam = async (id: number) => {
  const token = Cookies.get('authToken')

  if (!token) {
    console.log('Нет токена, авторизация невозможна')
    router.push('/sign-in')
    return
  }
  try {
    const response = await fetch(`http://localhost:5000/get_exam_one_ticket_user_ans/${id}`, {
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
    data.message.map(
      (item: { ans_id: number; ans_correct: boolean; ans_choice: string }, index: number) => {
        resultData.value.push({
          ans_id: index + 1,
          ans_correct: item.ans_correct,
          ans_choice: item.ans_choice,
        })
      },
    )
    router.push({
      name: 'resultPage',
      query: {
        answers: JSON.stringify(resultData.value),
        name: `Экзаменационный билет`,
        page: '/profile',
      },
    })
  } catch {}
}

const logout = () => {
  authStore.removeAuthToken()
  router.push('/sign-in')
}

const changeSettings = () => {
  router.push('/settings-profile')
}

const userName = ref('')
const userAvatar = ref('')

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
    userName.value = data.data.name
    userAvatar.value = data.data.avatar
  } catch (error) {
    console.error('Ошибка:', error)
    authStore.removeAuthToken()
    router.push('/sign-in')
  }

  try {
    const response = await fetch(`http://localhost:5000/get_ticket_user_ans`, {
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
    tickets.value = data.ans
  } catch {}

  try {
    const response = await fetch(`http://localhost:5000/get_all_exam`, {
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
    ticketsExam.value = data.ans
  } catch {}
}

const changeShowTicket = (id: number) => {
  if (id == 1) {
    seeExam.value = false
    if (seeTicket.value) {
      seeTicket.value = false
    } else {
      seeTicket.value = true
    }
  } else if (id == 2) {
    seeTicket.value = false
    if (seeExam.value) {
      seeExam.value = false
    } else {
      seeExam.value = true
    }
  }
}

const formattedTime = (timeLeft: number) => {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

onMounted(getProfile)
</script>

<template>
  <div class="about form-container">
    <div class="profile">
      <img class="avatar-img" :src="userAvatar" />
      <h1>{{ userName }}</h1>
    </div>

    <ul
      class="flex pt-2 flex-wrap justify-center text-sm gap-1 font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
    >
      <li class="me-2">
        <button
          class="flex justify-center text-center gap-1 h-10 pt-1 p-4 rounded-t-lg"
          @click="changeShowTicket(1)"
          :class="
            seeTicket
              ? 'text-green-800 bg-gray-400'
              : 'hover:text-gray-600 hover:bg-gray-600 dark:hover:text-gray-300'
          "
        >
          Билеты
        </button>
      </li>
      <li class="me-2">
        <button
          class="flex justify-center text-center gap-1 h-10 pt-1 p-4 rounded-t-lg"
          @click="changeShowTicket(2)"
          :class="
            seeExam
              ? 'text-green-800 bg-gray-400'
              : 'hover:text-gray-600 hover:bg-gray-600 dark:hover:text-gray-300'
          "
        >
          Экзамен
        </button>
      </li>
    </ul>

    <div class="statistics" v-if="seeTicket">
      <h2>Статистика по билетам</h2>
      <div v-if="tickets.length === 0">Загрузка...</div>
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="ticket"
        :class="ticket.percentages == 100 ? 'correct' : ticket.percentages > 0 ? 'incorrect' : ''"
        @click="toggleTicket(ticket.id)"
      >
        <div class="ticket-header">
          <div class="ticket-header">Билет №{{ ticket.id }}</div>
          <div class="ticket-header">Пройден на {{ ticket.percentages }}%</div>
        </div>
      </div>
    </div>

    <div class="statistics" v-if="seeExam">
      <h2>Статистика по экзамену</h2>
      <div v-if="ticketsExam.length === 0">Загрузка...</div>
      <div
        v-for="ticket in ticketsExam"
        :key="ticket.id"
        class="ticket"
        :class="ticket.percentages == 100 ? 'correct' : ticket.percentages > 0 ? 'incorrect' : ''"
        @click="toggleTicketExam(ticket.tickId)"
      >
        <div class="ticket-header">
          <div class="ticket-header">Экзамен №{{ ticket.id }}</div>
          <div class="ticket-header">Пройден на {{ ticket.percentages }}%</div>
        </div>
        <div class="ticket-footer">
          <div class="ticket-header">
            Время прохождения {{ formattedTime(ticket.timeLeft) }} минут
          </div>
          <div class="ticket-header">Дата прохождения {{ ticket.dateLeft }}</div>
        </div>
      </div>
    </div>

    <div class="settings">
      <img
        class="img-settings"
        @click="changeSettings"
        src="https://static-00.iconduck.com/assets.00/settings-icon-2048x2046-cw28eevx.png"
      />
      <img
        class="img-exit"
        @click="logout"
        src="https://img.icons8.com/?size=256w&id=2445&format=png"
      />
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
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.settings {
  width: 40px;
  height: 40px;
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

.img-exit {
  left: 20px;
  right: 20px;
}

.ticket {
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 5px;
  background-color: #aabacc;
}

.ticket:hover {
  color: white;
  background-color: #2764aa;
}

.ticket-header {
  font-weight: bold;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.ticket-footer {
  font-weight: bold;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.ticket-details {
  padding: 5px;
  border-top: 1px solid #ccc;
}

.correct {
  color: white;
  background-color: green;
}

.incorrect {
  color: white;
  background-color: rgb(172, 0, 0);
}
ul,
li {
  padding: 0;
  margin: 0;
}
</style>
