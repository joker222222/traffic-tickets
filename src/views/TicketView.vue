<script setup lang="ts">
import router from '@/router'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOneTicket, checkAnswerQuestion, updateAnswersTicket } from '@/api/ticketsTest'

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
  id: number
  questions: Question[]
}

interface Name {
  name: string
  id: number
}

interface ResultItem {
  ans_id: number
  ans_correct: boolean
  ans_choice: string
}

const route = useRoute()
const ticket = ref<Ticket | null>(null)
const currentQuestionIndex = ref(0)
const showHelpMessage = ref(false)
const loadedImages = ref<Record<string, HTMLImageElement>>({})
const accessNextQuest = ref(false)
const buttonNextQuest = ref('Следующий вопрос')
const spammStop = ref(false)
const resultData = ref<ResultItem[]>([])
const name = ref<Name>([])

const getTicket = async () => {
  ticket.value = await getOneTicket(Number(route.params.id))
  name.value.name = `Результаты билета № ${Number(route.params.id)}`
  name.value.id = Number(route.params.id)
  await preloadImages(ticket.value?.questions)
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
  accessNextQuest.value = true
  spammStop.value = true
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

const nextQuestion = async () => {
  if (spammStop.value == false) return
  spammStop.value = false
  if (buttonNextQuest.value === 'Закончить тест') {
    await updateAnswersTicket(name.value.id, resultData.value)
    router.push({
      name: 'resultPage',
      query: {
        answers: JSON.stringify(resultData.value),
        name: name.value.name,
        page: '/testing',
      },
    })
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

onMounted(getTicket)
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
