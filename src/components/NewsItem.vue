<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useAuthStore } from '../stores/authStore'
import Cookies from 'js-cookie'

const authStore = useAuthStore()

const getNews = async () => {
  if (!authStore.isAuthenticated) {
    try {
      const response = await fetch(`http://localhost:5000/get_all_news_unauth`, {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('Ошибка при запросе на сервер')
      }
      const data = await response.json()
      newsArray.value = data.message
    } catch {}
  } else {
    const token = Cookies.get('authToken')
    if (!token) {
      return
    }
    const response = await fetch(`http://localhost:5000/get_all_news_authorized`, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('Ошибка при запросе на сервер')
    }
    const data = await response.json()
    newsArray.value = data.message
  }
}

interface NewsItem {
  img: string
  text: string
  likes: number
  dislikes: number
  userReaction: 'like' | 'dislike' | null
  showLoginMessage?: boolean
  postId: number
}

const newsArray = ref<NewsItem[]>([
  // {
  //   img: '',
  //   text: `Глава АвтоВАЗа Максим Соколов назвал условие возвращения Renault в Россию⚡️
  //   Для этого нужно компенсировать АвтоВАЗу 112,5 млрд руб. (€1.2 млрд.), инвестированных в годы отсутствия французов. Сам же Renault оценивал свои российские активы всего в €2,195 млрд. (включая бывший АЗЛК).
  //   Собянин о возможном возвращении Renault высказался так:
  //   Ну, он, может, и не исключает, но вряд ли ему что-то тут светит.
  //   Не ждут у нас обратно иностранцев по ходу. Так мы останемся без возвращения Mcdonald’s со Вкусно и точкой.`,
  //   likes: 2,
  //   dislikes: 0,
  //   userReaction: null,
  //   showLoginMessage: false,
  // },
  // {
  //   img: 'https://images.wallpaperscraft.com/image/single/lake_mountain_tree_36589_2650x1600.jpg',
  //   text: 'новость2',
  //   likes: 3,
  //   dislikes: 0,
  //   userReaction: null,
  //   showLoginMessage: false,
  // },
  // {
  //   img: 'https://i.pinimg.com/originals/36/76/99/36769945f37cb48d1cc24ba4dc724d94.jpg',
  //   text: 'новость3',
  //   likes: 3,
  //   dislikes: 0,
  //   userReaction: null,
  //   showLoginMessage: false,
  // },
])

const showLoginMessage = (index: number) => {
  newsArray.value[index].showLoginMessage = true
  setTimeout(() => {
    newsArray.value[index].showLoginMessage = false
  }, 3000)
}

const setStatusLike = async (token: string, postId: number, status: string) => {
  await fetch('http://localhost:5000/set_status_post', {
    method: 'POST',
    body: JSON.stringify({
      id: postId,
      reaction: status,
    }),
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

const toggleLike = async (index: number) => {
  if (!authStore.isAuthenticated) {
    showLoginMessage(index)
    return
  }
  const news = newsArray.value[index]
  const token = Cookies.get('authToken')
  if (news.userReaction === 'like') {
    // Если уже стоит лайк, убираем его
    setStatusLike(token, news.postId, null)
    news.likes--
    news.userReaction = null
  } else {
    // Если был дизлайк, убираем его
    setStatusLike(token, news.postId, 'like')
    if (news.userReaction === 'dislike') {
      news.dislikes--
    }
    news.likes++
    news.userReaction = 'like'
  }
}

const toggleDislike = (index: number) => {
  if (!authStore.isAuthenticated) {
    console.log('Вы должны быть зарегистрированы чтобы поставить дизлайк.')
    showLoginMessage(index)
    return
  }
  const news = newsArray.value[index]
  const token = Cookies.get('authToken')
  if (news.userReaction === 'dislike') {
    // Если уже стоит дизлайк, убираем его
    setStatusLike(token, news.postId, null)
    news.dislikes--
    news.userReaction = null
  } else {
    // Если был лайк, убираем его
    setStatusLike(token, news.postId, 'dislike')
    if (news.userReaction === 'like') {
      news.likes--
    }
    news.dislikes++
    news.userReaction = 'dislike'
  }
}
onMounted(getNews)
</script>

<template>
  <div class="news-container">
    <ul>
      <h1 v-if="newsArray.length == 0">Загрузка...</h1>
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
          <label class="dislikes" v-if="news.showLoginMessage"
            >Вы должны быть зарегистрированы.</label
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.news-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: auto;
  margin-top: 50px;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0;
  list-style: none;
}

.news-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #f9f9f9;
  padding: 35px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  width: auto;
  position: relative;
}

.news-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.text-news {
  font-size: 18px;
  font-weight: bold;
  text-align: justify;
  color: #333;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: 100%;
}

.number-of-likes {
  position: absolute;
  bottom: 10px;
  left: 35px;
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
