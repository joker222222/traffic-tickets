<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface answerStoreg {
  tiketName: string
  items: ResultItem[]
}

interface ResultItem {
  ans_id: number
  ans_correct: boolean
  ans_choice: string
}

const answerStore = ref<answerStoreg>([])

const router = useRouter()
const route = useRoute()
const backPage = ref('')

onMounted(() => {
  const resultData = JSON.parse(route.query.answers as string) as ResultItem[]
  const resultName = route.query.name as string
  const resultPage = route.query.page as string

  if (resultData) {
    answerStore.value.tiketName = resultName
    answerStore.value.items = resultData
    backPage.value = resultPage
  } else {
    router.push('/profile')
  }
})

const goBack = () => {
  router.push(backPage.value)
}
</script>

<template>
  <div class="about">
    <h1>{{ answerStore.tiketName }}</h1>
    <ul class="answer-list">
      <li v-for="(answer, index) in answerStore.items" :key="answer.ans_id" class="answer-item">
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
