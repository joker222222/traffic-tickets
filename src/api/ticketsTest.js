import Cookies from 'js-cookie'
const url = 'http://localhost:5000'

export const getOneTicket = async (id) => {
  const response = await fetch(`${url}/ticket/${Number(id)}`)
  if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`)
  const data = await response.json()
  const ticket = data.answer

  ticket?.questions.forEach((question) => {
    question.answers = question.answers.map((answer) => ({
      answerText: answer,
      isCorrect: false,
      isChoice: false,
    }))
  })

  return ticket
}

export const checkAnswerQuestion = async (answer, Cur_question) => {
  const response = await fetch(`${url}/ticket/check_answer/${Cur_question.id}`)
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
    return true
  } else {
    answer.isChoice = true
    return false
  }
}

export const updateAnswersTicket = async (ticketId, answers) => {
  const token = Cookies.get('authToken')
  if (!token) return
  const response = await fetch(`${url}/update_ticket_user_ans/${ticketId}`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ans: answers,
    }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Ошибка: ${errorData.message || 'Неизвестная ошибка'}`)
  }
}
