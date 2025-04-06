<script setup lang="ts">
import router from '@/router'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAnswerStoreExam } from '@/stores/answerStoreExam'

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

const route = useRoute()
const ticket = ref<Ticket | null>(null)
const currentQuestionIndex = ref(0)
const showHelpMessage = ref(false)
const spammStop = ref(false)
const loadedImages = ref<Record<string, HTMLImageElement>>({})
let accessNextQuest = false
const buttonNextQuest = ref('Следующий вопрос')
const answerStore = useAnswerStoreExam()

const fetchTickets = async () => {
  answerStore.clearAnswers()
  answerStore.updateTicket(0)
  try {
    const response = await fetch(`http://localhost:5000/get_random_questions`)
    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`)
    const data = await response.json()
    ticket.value = data

    ticket.value?.questions.forEach((question) => {
      question.answers = question.answers.map((answer) => ({
        answerText: answer,
      }))
    })
    console.log(ticket.value?.questions)
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
  spammStop.value = true
  accessNextQuest = true
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
    } else {
      answerStore.addAnswer(Cur_question.id, false, answer.answerText)
      answer.isChoice = true
      showHelpMessage.value = true
    }
    await nextQuestion()
    spammStop.value = false
  } catch (err) {
    console.error('Ошибка запроса:', err)
  }
}

const currentQuestion = computed(() =>
  ticket.value ? ticket.value.questions[currentQuestionIndex.value] : null,
)

const nextQuestion = () => {
  if (buttonNextQuest.value === 'Закончить тест') {
    answerStore.updateTicket(1)
    console.log(answerStore.answers)
    router.push('/resultsExam')
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
    <h1 class="tickets-number">Экзаменационный билет</h1>
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
            :disabled="spammStop"
            @click="handleCheckAnswer(answer, currentQuestion)"
          >
            {{ answer.answerText }}
          </button>
        </li>
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
