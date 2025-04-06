<script setup lang="ts">
import { useAnswerStoreExam } from '@/stores/answerStoreExam'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const answerStore = useAnswerStoreExam()
const router = useRouter()

const check_corr_address = async () => {
  if (answerStore.ticket === 0 || answerStore.answers.length == 0) {
    router.push('/')
    return
  }
  if (answerStore.ticket == 1) {
    const token = Cookies.get('authToken')
    const examId_req = await fetch(`http://localhost:5000/examId`, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
    const examId = await examId_req.json()
    const exam = examId.message + 1
    await fetch(`http://localhost:5000/add_exam/${exam}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ans: answerStore.answers,
      }),
    })
    answerStore.updateTicket(0)
  }
}

onMounted(check_corr_address)

const goBack = () => {
  router.push('/exam')
}
</script>

<template>
  <div class="about">
    <h1>Экзаменационный билет</h1>
    <ul class="answer-list">
      <li v-for="(answer, index) in answerStore.answers" :key="answer.ans_id" class="answer-item">
        <div class="answer-header">
          <span class="answer-id">Вопрос {{ index + 1 }}:</span>
          <span
            class="answer-correct"
            :class="{ correct: answer.ans_correct, incorrect: !answer.ans_correct }"
          >
            {{ answer.ans_correct ? 'Правильный' : 'Неправильный' }}
          </span>
        </div>
        <div class="answer-choice">{{ answer.ans_choice }}</div>
      </li>
    </ul>
    <button @click="goBack" class="go-back-button">Назад</button>
  </div>
</template>

<style scoped>
.about {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.answer-list {
  list-style-type: none;
  padding: 0;
}

.answer-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.answer-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.answer-id {
  color: #555;
}

.answer-correct {
  font-size: 0.9rem;
  padding: 2px 8px;
  border-radius: 4px;
}

.answer-correct.correct {
  background-color: #4caf50;
  color: white;
}

.answer-correct.incorrect {
  background-color: #f44336;
  color: white;
}

.answer-choice {
  margin-top: 10px;
  font-size: 1rem;
  color: #555;
}

.go-back-button {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.go-back-button:hover {
  background-color: #1976d2;
}
</style>
