import Cookies from 'js-cookie'
const url = 'http://localhost:5000'

export const getOneTicket = async () => {
  const response = await fetch(`${url}/get_random_questions`)
  if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`)
  const data = await response.json()
  const ticket = data

  ticket?.questions.forEach((question) => {
    question.answers = question.answers.map((answer) => ({
      answerText: answer,
    }))
  })
  return ticket
}

export const saveAnswersExam = async (timeLeft, answers) => {
  const token = Cookies.get('authToken')
  if (!token) return

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
      ans: answers,
      timeLeft: timeLeft,
    }),
  })
}
