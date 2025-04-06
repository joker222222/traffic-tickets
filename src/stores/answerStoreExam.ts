import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Answer {
  ans_id: number
  ans_correct: boolean
  ans_choice: string
}

// Хранилище для ответов
export const useAnswerStoreExam = defineStore('answerStore', () => {
  const answers = ref<Answer[]>([])
  const ticket = ref(0)
  const timeLeft = ref(0)

  const addAnswer = (id: number, correct: boolean, choice: string) => {
    answers.value.push({ ans_id: id, ans_correct: correct, ans_choice: choice })
  }

  const updateTimeLeft = (time: number) => {
    timeLeft.value = time
  }

  const clearAnswers = () => {
    answers.value = []
  }

  const updateAnswer = (id: number, correct: boolean, choice: string) => {
    const index = answers.value.findIndex((answer) => answer.ans_id === id)
    if (index !== -1) {
      answers.value[index] = { ans_id: id, ans_correct: correct, ans_choice: choice }
    }
  }

  const updateTicket = (id: number) => {
    ticket.value = id
  }

  return {
    answers,
    addAnswer,
    clearAnswers,
    updateAnswer,
    ticket,
    updateTicket,
    updateTimeLeft,
    timeLeft,
  }
})
