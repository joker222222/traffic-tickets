<script setup lang="ts">
import router from '@/router'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAnswerStore } from '@/stores/answerStore'

interface Question {
  img: string
  questionId: number
  id: number
  question: string
  answers: { answerText: string; isCorrect: boolean; isChoice: boolean }[]
  correctAnswer: string
  helpAnswer: string
}

/* https://github.com/etspring/pdd_russia/blob/master/questions/A_B/tickets/%D0%91%D0%B8%D0%BB%D0%B5%D1%82%2040.json */

interface Ticket {
  id: number
  questions: Question[]
}

const route = useRoute()
const ticket = ref<Ticket | null>(null)
const currentQuestionIndex = ref(0)
const showHelpMessage = ref(false)
const loadedImages = ref<Record<string, HTMLImageElement>>({})
let accessNextQuest = false
const buttonNextQuest = ref('Следующий вопрос')
const answerStore = useAnswerStore()
const spammStop = ref(false)

const fetchTickets = async () => {
  answerStore.clearAnswers()
  try {
    const response = await fetch(`http://localhost:5000/ticket/${Number(route.params.id)}`)
    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`)
    answerStore.updateTicket(Number(route.params.id))
    console.log(answerStore.ticket)
    const data = await response.json()
    ticket.value = data.answer

    // Обработка правильных ответов
    ticket.value?.questions.forEach((question) => {
      question.answers = question.answers.map((answer) => ({
        answerText: answer,
        isCorrect: false, // Изначально все ответы неправильные
        isChoice: false, // Изначально выбора нет
      }))
    })

    await preloadImages(ticket.value?.questions)
  } catch (err) {
    console.error(err)
  } finally {
  }
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
  accessNextQuest = true
  spammStop.value = true
  try {
    const response = await fetch(`http://localhost:5000/ticket/check_answer/${Cur_question.id}`)
    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`)

    const data = await response.json()
    const correctAnswer = data.correct_ans
    Cur_question.explanation = data.explanation

    Cur_question.answers.forEach((ans) => {
      if (ans.answerText === correctAnswer) {
        ans.isCorrect = true
      }
    })

    // Проверяем, правильный ли выбранный ответ
    if (answer.answerText === correctAnswer) {
      answerStore.addAnswer(Cur_question.id, true, answer.answerText)
      showHelpMessage.value = false
      // nextQuestion()
    } else {
      answerStore.addAnswer(Cur_question.id, false, answer.answerText)
      answer.isChoice = true
      showHelpMessage.value = true
    }
  } catch (err) {
    console.error('Ошибка запроса:', err)
  }
}

const currentQuestion = computed(() =>
  ticket.value ? ticket.value.questions[currentQuestionIndex.value] : null,
)

const nextQuestion = () => {
  if (spammStop.value == false) return
  spammStop.value = false
  if (buttonNextQuest.value === 'Закончить тест') {
    router.push('/results')
    return
  }
  if (ticket.value && currentQuestionIndex.value < ticket.value.questions.length - 1) {
    showHelpMessage.value = false
    currentQuestionIndex.value++
    accessNextQuest = false
  }
  if (currentQuestionIndex.value == ticket.value.questions.length - 1) {
    buttonNextQuest.value = 'Закончить тест'
  }
}

onMounted(fetchTickets)
</script>

<template>
  <div class="form-container" v-if="ticket && currentQuestion">
    <h1 class="tickets-number">Билет №{{ ticket?.id }}</h1>
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
            :disabled="showHelpMessage || spammStop"
            :class="{
              'answer-correct': answer.isCorrect, // Подсветка правильного ответа
              'answer-incorrect': answer.isChoice, // Подсветка неправильного ответа
            }"
            @click="handleCheckAnswer(answer, currentQuestion)"
          >
            {{ answer.answerText }}
          </button>
        </li>
      </ul>
      <div class="helpAnswer" v-if="showHelpMessage">{{ currentQuestion.explanation }}</div>
      <button class="next-questions" @click="nextQuestion">
        {{ buttonNextQuest }}
      </button>
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
