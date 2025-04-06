<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/authStore'
import { useAnswerStore } from '@/stores/answerStore'
import { useAnswerStoreExam } from '@/stores/answerStoreExam'

const authStore = useAuthStore()
const answerStore = useAnswerStore()
const answerStoreExam = useAnswerStoreExam()
const router = useRouter()
const seeTicket = ref(false)
const seeExam = ref(false)

const tickets = ref([])
const ticketsExam = ref([])

const toggleTicket = async (id: number) => {
  answerStore.clearAnswers()
  answerStore.updateTicket(0)

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
        answerStore.addAnswer(index + 1, item.ans_correct, item.ans_choice)
      },
    )
    answerStore.updateTicket(id)
    router.push('/results')
  } catch {}
}

const toggleTicketExam = async (id: number) => {
  answerStoreExam.clearAnswers()
  answerStoreExam.updateTicket(0)

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
        answerStoreExam.addAnswer(index + 1, item.ans_correct, item.ans_choice)
      },
    )
    answerStoreExam.updateTicket(2)
    router.push('/resultsExam')
  } catch {}
}

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
      <img class="avatar-img" src="@/assets/empty.jpg" />
      <h1>{{ userName }}</h1>
    </div>

    <ul
      class="flex pt-2 flex-wrap justify-center text-sm gap-1 font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
    >
      <li class="me-2">
        <button
          class="flex justify-center text-center gap-1 h-6 pt-1 p-4 rounded-t-lg"
          @click="changeShowTicket(1)"
          :class="
            seeTicket
              ? 'text-green-800 bg-gray-400'
              : 'hover:text-gray-600 hover:bg-gray-600 dark:hover:text-gray-300'
          "
        >
          <svg
            class="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path
              d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"
            />
          </svg>
          Билеты
        </button>
      </li>
      <li class="me-2">
        <button
          class="flex justify-center text-center gap-1 h-6 pt-1 p-4 rounded-t-lg"
          @click="changeShowTicket(2)"
          :class="
            seeExam
              ? 'text-green-800 bg-gray-400'
              : 'hover:text-gray-600 hover:bg-gray-600 dark:hover:text-gray-300'
          "
        >
          <svg
            class="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z"
            />
          </svg>
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
        @click="logout"
        src="https://static-00.iconduck.com/assets.00/settings-icon-2048x2046-cw28eevx.png"
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
</style>
