<script setup lang="ts">
import router from '@/router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { checkAnswerQuestion } from '@/api/ticketsTest'

interface Question {
  img: string
  questionId: number
  id: number
  question: string
  answers: { answerText: string; isCorrect: boolean; isChoice: boolean }[]
  correctAnswer: string
  helpAnswer: string
}

interface Ticket {
  questions: Question[]
}

const timeStart = 0
const timeLeft = ref(timeStart)
const intervalId = ref<number | null>(null)
const timeExpired = computed(() => timeLeft.value <= 0)

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const startTimer = () => {
  intervalId.value = setInterval(() => {
    if (timeLeft.value >= 0) {
      timeLeft.value++
    } else {
      clearInterval(intervalId.value!)
    }
  }, 1000)
}

interface ResultItem {
  ans_id: number
  ans_correct: boolean
  ans_choice: string
}

const ticket = ref<Ticket | null>(null)
const currentQuestionIndex = ref(0)
const showHelpMessage = ref(false)
const spammStop = ref(false)
const loadedImages = ref<Record<string, HTMLImageElement>>({})
const accessNextQuest = ref(false)
const buttonNextQuest = ref('Следующий вопрос')
const resultData = ref<ResultItem[]>([])

const fetchTickets = async () => {
  const response = await fetch(`http://localhost:5000/get_marathon`)
  if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`)
  const data = await response.json()
  ticket.value = data

  ticket.value?.questions.forEach((question) => {
    question.answers = question.answers.map((answer) => ({
      answerText: answer,
    }))
  })
  // await preloadImages(ticket.value?.questions)
}

const preloadImages = async (questions: Question[]) => {
  const imageCache: Record<string, HTMLImageElement> = {}
  await Promise.all(
    questions.map(
      (q) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.src = q.img
          img.onload = () => {
            imageCache[q.img] = img
            resolve()
          }
        }),
    ),
  )
  loadedImages.value = imageCache
}

const handleCheckAnswer = async (
  answer: { answerText: string },
  Cur_question: {
    id: number
    explanation: string
    answers: {
      answerText: string
      isCorrect: bool
      isChoice: bool
    }
  },
) => {
  spammStop.value = true
  accessNextQuest.value = true
  if (!(await checkAnswerQuestion(answer, Cur_question))) {
    resultData.value.push({
      ans_id: Cur_question.id,
      ans_correct: false,
      ans_choice: answer.answerText,
    })
    showHelpMessage.value = true
  } else {
    resultData.value.push({
      ans_id: Cur_question.id,
      ans_correct: true,
      ans_choice: answer.answerText,
    })
  }
}

const currentQuestion = computed(() =>
  ticket.value ? ticket.value.questions[currentQuestionIndex.value] : null,
)

const nextQuestion = () => {
  if (spammStop.value == false) return
  spammStop.value = false
  if (buttonNextQuest.value === 'Закончить тест') {
    router.push({
      name: 'resultPage',
      query: {
        answers: JSON.stringify(resultData.value),
        name: `Марафон`,
        page: '/marathon',
      },
    })
    // timeLeft.value времени прошло
    return
  }
  if (ticket.value && currentQuestionIndex.value < ticket.value.questions.length - 1) {
    showHelpMessage.value = false
    currentQuestionIndex.value++
    accessNextQuest.value = false
  }
  if (currentQuestionIndex.value == ticket.value.questions.length - 1) {
    buttonNextQuest.value = 'Закончить тест'
  }
}

onMounted(() => {
  fetchTickets()
  startTimer()
})

onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value)
})
</script>

<template>
  <div class="form-container" v-if="ticket && currentQuestion">
    <h1 class="tickets-number">Марафон из 800 вопросов</h1>
    <div class="timer" style="font-size: 18px; color: green">
      Времени прошло: {{ formattedTime }}
    </div>

    <div class="container">
      <h2>Вопрос №{{ currentQuestion.questionId }}</h2>
      <div>
        <img
          class="img-question"
          :src="loadedImages[currentQuestion.img]?.src || currentQuestion.img"
          alt="изображение"
        />
        <p class="questions">{{ currentQuestion.question }}</p>
      </div>
      <ul>
        <li v-for="answer in currentQuestion.answers" :key="answer">
          <button
            class="answer"
            :class="{
              'answer-correct': answer.isCorrect, // Подсветка правильного ответа
              'answer-incorrect': answer.isChoice, // Подсветка неправильного ответа
            }"
            :disabled="spammStop || timeExpired"
            @click="handleCheckAnswer(answer, currentQuestion)"
          >
            {{ answer.answerText }}
          </button>
        </li>
        <div class="helpAnswer" v-if="showHelpMessage">{{ currentQuestion.explanation }}</div>
        <button class="next-questions" @click="nextQuestion">
          {{ buttonNextQuest }}
        </button>
      </ul>
    </div>
    <router-link to="/testing">Назад</router-link>
  </div>
</template>

<style scoped>
.form-container {
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin-top: 50px;
  width: 100%;
}

.tickets-number {
  font-size: 1.3rem;
  margin: 15px 0 15px 0;
  text-align: center;
}

ul,
li {
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
}

.container {
  display: block;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
  margin-top: 35px;
}

button {
  width: 100%;
  display: block;
  box-sizing: border-box;
}

.helpAnswer {
  max-width: 750px;
}

.questions {
  font-size: 1.3rem;
  max-width: 800px;
}

.img-question {
  max-width: 800px;
  width: 100%;
}

.answer {
  margin-top: 10px;
  max-width: 800px;
  padding: 10px;
  background-color: #aabacc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

ul {
  padding: 0;
}
.answer-correct {
  background-color: green;
}

.answer-incorrect {
  background-color: rgb(172, 0, 0);
}

.answer:hover:enabled {
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
