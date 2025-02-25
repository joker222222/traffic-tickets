<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
import { ref } from 'vue'

import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const newsArray = ref([
  {
    img: '',
    text: `Глава АвтоВАЗа Максим Соколов назвал условие возвращения Renault в Россию⚡️
    Для этого нужно компенсировать АвтоВАЗу 112,5 млрд руб. (€1.2 млрд.), инвестированных в годы отсутствия французов. Сам же Renault оценивал свои российские активы всего в €2,195 млрд. (включая бывший АЗЛК).
    Собянин о возможном возвращении Renault высказался так:
    Ну, он, может, и не исключает, но вряд ли ему что-то тут светит.
    Не ждут у нас обратно иностранцев по ходу. Так мы останемся без возвращения Mcdonald’s со Вкусно и точкой.`,
    likes: 2,
    dislikes: 0,
    userReaction: null,
  },
  {
    img: 'https://images.wallpaperscraft.com/image/single/lake_mountain_tree_36589_2650x1600.jpg',
    text: 'новость2',
    likes: 3,
    dislikes: 0,
    userReaction: null,
  },
  {
    img: 'https://i.pinimg.com/originals/36/76/99/36769945f37cb48d1cc24ba4dc724d94.jpg',
    text: 'новость3',
    likes: 3,
    dislikes: 0,
    userReaction: null,
  },
])

const toggleLike = (index) => {
  if (!authStore.isAuthenticated) {
    console.log('Вы должны быть зарегистрированы чтобы поставить лайк')
    return
  }
  const news = newsArray.value[index]
  if (news.userReaction === 'like') {
    // Если уже стоит лайк, убираем его
    news.likes--
    news.userReaction = null
  } else {
    // Если был дизлайк, убираем его
    if (news.userReaction === 'dislike') {
      news.dislikes--
    }
    news.likes++
    news.userReaction = 'like'
  }
}

const toggleDislike = (index) => {
  if (!authStore.isAuthenticated) {
    console.log('Вы должны быть зарегистрированы чтобы поставить дизлайк')
    return
  }
  const news = newsArray.value[index]
  if (news.userReaction === 'dislike') {
    // Если уже стоит дизлайк, убираем его
    news.dislikes--
    news.userReaction = null
  } else {
    // Если был лайк, убираем его
    if (news.userReaction === 'like') {
      news.likes--
    }
    news.dislikes++
    news.userReaction = 'dislike'
  }
}
</script>

<template>
  <div class="news-container">
    <ul>
      <li v-for="(news, index) in newsArray" :key="index" class="news-item">
        <img v-if="news.img" :src="news.img" class="news-img" />
        <h2 class="text-news">{{ news.text }}</h2>
        <div class="number-of-likes">
          <label class="likes" v-on:click="toggleLike(index)"
            >{{ news.userReaction === 'like' ? '❤️' : '🤍' }}{{ news.likes }}</label
          >
          <label class="dislikes" v-on:click="toggleDislike(index)"
            >{{ news.userReaction === 'dislike' ? '👎🏿' : '👎🏻' }}{{ news.dislikes }}</label
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.news-container {
  display: flex;
  justify-content: center; /* Центрируем новости по горизонтали */
  align-items: center; /* Центрируем новости по вертикали */
  max-width: auto;
  margin-top: 50px;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 40px; /* расстояние между новостями */
  padding: 0;
  list-style: none;
}

.news-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* Центрируем содержимое по горизонтали */
  text-align: center; /* Центрируем текст */
  background-color: #f9f9f9; /* Легкий фон */
  padding: 35px;
  border-radius: 10px; /* Скругленные углы */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Тень */
  max-width: 1000px; /* Фиксированная ширина для карточек */
  width: auto;
  position: relative;
}

.news-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px; /* Скругление изображения */
  margin-bottom: 15px; /* Отступ между изображением и текстом */
}

.text-news {
  font-size: 18px;
  font-weight: bold;
  color: #333; /* Цвет текста */
  margin: 0; /* Убираем отступы у заголовка */
  word-wrap: break-word; /* Переносит длинные слова на новую строку */
  overflow-wrap: break-word; /* Переносит длинные слова на новую строку */
  width: 100%; /* Ограничение ширины */
}

.number-of-likes {
  position: absolute;
  bottom: 15px;
  left: 45px;
  display: flex;
  gap: 10px;
}

.likes,
.dislikes {
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}
</style>
