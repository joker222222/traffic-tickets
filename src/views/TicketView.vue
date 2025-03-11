<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Question {
  img: string
  questionId: number
  question: string
  answers: string[]
  correctAnswer: string
  helpAnswer: string
}

interface Ticket {
  id: number
  questions: Question[]
}

const route = useRoute()
const ticket = ref<Ticket | null>(null)
const currentQuestionIndex = ref(0)
const showHelpMessage = ref(false)

const fetchTicket = () => {
  ticket.value = {
    id: Number(route.params.id),
    questions: [
      {
        img: 'https://storage.yandexcloud.net/pddlife/abm/n14_2.jpg',
        questionId: 1,
        question: 'Какой знак запрещает движение?',
        answers: ['Стоп', 'Ограничение скорости', 'Обгон запрещен', 'Главная дорога'],
        correctAnswer: 'Стоп',
        helpAnswer:
          'Знак 1.25  «Дорожные работы» предупреждает Вас о том, что на дороге ведутся ремонтные работы, а табличка 8.12  «Опасная обочина» уточняет, что работы ведутся на обочине, в связи с чем съезд на нее опасен, хотя и возможен.',
      },
      {
        img: 'https://storage.yandexcloud.net/pddlife/abm/n15_3.jpg',
        questionId: 2,
        question: 'Какой знак разрешает поворот налево?',
        answers: ['Круговое движение', 'Главная дорога', 'Разрешённый поворот', 'Нет знака'],
        correctAnswer: 'Разрешённый поворот',
        helpAnswer:
          'Знак 3.1  «Въезд запрещен» (знак Б) запрещает въезд всех транспортных средств. Знак 5.3  «Дорога для автомобилей» (знак А) обозначает дороги, предназначенные для движения только автомобилей, в том числе любых грузовых, автобусов и мотоциклов. На знаке 3.4  «Движение грузовых автомобилей запрещено» (знак В) на кузове автомобиля не указана масса. В этом случае запрещается движение только грузовых автомобилей и составов транспортных средств с разрешенной максимальной массой более 3,5 т. Правильный ответ - только А и В.',
      },
    ],
  }
}

const handleCheckAnswer = (answer: string, correctAnswer: string) => {
  if (correctAnswer == answer) {
    showHelpMessage.value = false
    nextQuestion()
  } else {
    showHelpMessage.value = true
  }
}

const currentQuestion = computed(() =>
  ticket.value ? ticket.value.questions[currentQuestionIndex.value] : null,
)

const nextQuestion = () => {
  if (ticket.value && currentQuestionIndex.value < ticket.value.questions.length - 1) {
    showHelpMessage.value = false
    currentQuestionIndex.value++
  }
}

onMounted(fetchTicket)
</script>

<template>
  <div v-if="ticket && currentQuestion">
    <h1 class="tickets-number">Билет №{{ ticket?.id }}</h1>
    <div class="container">
      <h2>Вопрос №{{ currentQuestion.questionId }}</h2>
      <div>
        <img :src="currentQuestion.img" alt="" />
        <p class="questions">{{ currentQuestion.question }}</p>
      </div>
      <ul>
        <li v-for="answer in currentQuestion.answers" :key="answer">
          <button class="answer" @click="handleCheckAnswer(answer, currentQuestion.correctAnswer)">
            {{ answer }}
          </button>
        </li>
      </ul>
      <div class="helpAnswer" v-if="showHelpMessage">{{ currentQuestion.helpAnswer }}</div>
      <button
        class="next-questions"
        @click="nextQuestion"
        :disabled="currentQuestionIndex === ticket.questions.length - 1"
      >
        Следующий вопрос
      </button>
    </div>
  </div>
  <router-link to="/testing">Назад</router-link>
</template>

<style scoped>
.tickets-number {
  font-size: 1.3rem;
  margin: 15px 0 15px 0;
  text-align: center;
}
li {
  list-style: none;
}
.container {
  display: grid;
  justify-content: center;
  align-items: center;
  max-width: auto;
  margin-top: 35px;
}

.helpAnswer {
  max-width: 750px;
}

.questions {
  font-size: 1.3rem;
}
.answer {
  margin-top: 10px;
  padding: 10px;
  background-color: #aabacc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.answer:hover {
  background-color: #2764aa;
}

.next-questions {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.next-questions:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
