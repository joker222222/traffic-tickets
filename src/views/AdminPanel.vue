<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import Cookies from 'js-cookie'

const authStore = useAuthStore()

const users = ref([])
const noAdmin = ref(false)

const news = ref([])

const activeTab = ref('') // текущий активный таб

const tabs = [
  { name: 'users', label: 'Пользователи' },
  { name: 'news', label: 'Новости' },
  { name: 'addNew', label: 'Добавление новости' },
]
const newsText = ref('')
const selectedImage = ref<File | null>(null)

const uploadAvatar = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const submitNews = async () => {
  if (!newsText.value || !selectedImage.value) {
    console.log('Пожалуйста, выберите изображение и введите текст.')
    return
  }

  const formData = new FormData()
  formData.append('image', selectedImage.value)
  formData.append('text', newsText.value)

  try {
    const response = await fetch('http://localhost:5000/new/add_new', {
      method: 'POST',
      headers: {
        Authorization: Cookies.get('authToken'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: selectedImage.value,
        text: newsText.value,
      }),
    })

    if (!response.ok) throw new Error('Ошибка при добавлении новости')
    //alert('Новость успешно добавлена!')
    newsText.value = ''
    selectedImage.value = null
  } catch (error) {
    // alert('Произошла ошибка. Попробуйте ещё раз.')
    console.error(error)
  }
}

const getProfile = async () => {
  const token = Cookies.get('authToken')
  if (!token) {
    router.push('/sign-in')
    return
  }

  try {
    const response = await fetch(`http://localhost:5000/admin`, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) throw new Error('Ошибка при запросе на сервер')

    const data = await response.json()
    users.value = data.data
  } catch (error) {
    if (!Cookies.get('authToken')) {
      console.error('Ошибка:', error)
      authStore.removeAuthToken()
      router.push('/profile')
    }
    noAdmin.value = true
  }
}

const changeRole = async (userId: number) => {
  const response = await fetch(`http://localhost:5000/admin-change-role/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: Cookies.get('authToken'),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    noAdmin.value = true
    users.value = []
  }
  getProfile()
}

const getAllNews = async () => {
  const response = await fetch(`http://localhost:5000/get_all_news_unauth`, {
    method: 'GET',
    headers: {
      Authorization: Cookies.get('authToken'),
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  news.value = data.message
}

const getNewsText = (text: string) => {
  return text.slice(0, 200)
}

const deletePost = async (postId: number) => {
  await fetch(`http://localhost:5000/new/remove_new/${postId}`, {
    method: 'POST',
    headers: {
      Authorization: Cookies.get('authToken'),
      'Content-Type': 'application/json',
    },
  })
  getAllNews()
}

onMounted(() => {
  getProfile()
  getAllNews()
})
</script>

<template>
  <div class="form-container form-container-changer">
    <h1>Админ панель</h1>

    <div v-if="!noAdmin" class="noAdminB">
      <ul
        class="flex flex-wrap justify-center text-sm gap-1 font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
      >
        <li v-for="tab in tabs" :key="tab.name" class="me-2">
          <button
            class="flex justify-center text-center gap-1 h-10 rounded-t-lg"
            @click="activeTab = tab.name"
            :class="
              activeTab === tab.name
                ? 'text-green-800 bg-gray-400'
                : 'hover:text-gray-600 hover:bg-gray-600 dark:hover:text-gray-300'
            "
          >
            {{ tab.label }}
          </button>
        </li>
      </ul>

      <div v-if="activeTab === 'users'">
        <ul>
          <li
            v-for="(user, index) in users"
            :key="index"
            class="bg-white tabs-admin dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden p-4 flex gap-4 items-center justify-between"
          >
            <img
              :src="user.avatar"
              alt="avatar"
              class="w-20 h-20 object-cover rounded-full border border-gray-300"
            />
            <div class="flex flex-col gap-1 text-sm text-gray-800 dark:text-gray-200 text-start">
              <p><span class="font-medium">Имя:</span> {{ user.name }}</p>
              <p><span class="font-medium">Почта:</span> {{ user.email }}</p>
              <p><span class="font-medium">Пароль:</span> {{ user.password }}</p>
              <p><span class="font-medium">Роль:</span> {{ user.role }}</p>
            </div>
            <button
              @click="changeRole(user.id)"
              class="mt-2 px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Изменить роль
            </button>
          </li>
        </ul>
      </div>

      <div v-if="activeTab === 'news'">
        <ul>
          <li
            v-for="newItem in news"
            :key="newItem.postId"
            class="bg-white tabs-admin dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden p-4 flex flex-col sm:flex-row gap-4"
          >
            <img
              :src="newItem.img"
              alt="news image"
              class="w-full sm:w-40 h-40 object-cover rounded-xl"
            />
            <div class="flex flex-col justify-between flex-grow">
              <div>
                <p class="text-gray-800 dark:text-white text-sm mb-2">
                  {{ getNewsText(newItem.text) }}...
                </p>
              </div>
              <div class="flex self-end gap-6 mt-2 text-sm text-gray-600 dark:text-gray-300">
                <p class="content-end">👍 {{ newItem.likes }}</p>
                <p class="content-end">👎 {{ newItem.dislikes }}</p>
                <div class="self-end-safe">
                  <button
                    @click="deletePost(newItem.postId)"
                    class="self-end mt-2 px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div
        v-if="activeTab === 'addNew'"
        class="mt-4 max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
      >
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Добавление новости
        </h2>

        <form @submit.prevent="submitNews" class="flex flex-col gap-4">
          <!-- Выбор изображения -->
          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-300"
              >Изображение</label
            >
            <input
              type="file"
              accept="image/*"
              @change="uploadAvatar"
              class="block w-full text-sm text-gray-600 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2"
            />
          </div>

          <!-- Поле для текста -->
          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-300"
              >Текст новости</label
            >
            <textarea
              v-model="newsText"
              rows="4"
              placeholder="Введите текст новости..."
              class="w-full text-sm p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
            ></textarea>
          </div>

          <!-- Кнопка отправки -->
          <button
            type="submit"
            class="self-end px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Добавить новость
          </button>
        </form>
      </div>
    </div>

    <div v-else>
      <h1>Данный пользователь не обладает правами администратора</h1>
    </div>
  </div>
</template>

<style scoped>
.form-container-changer {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
}

.noAdminB {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px;
}

.tabs-admin {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 10px;
  padding: 10px;
}

.change-role {
  padding: 3px;
  margin-left: 10px;
}

.avatar-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.item-end {
  align-self: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.file-input {
  padding: 5px;
  font-size: 0.9rem;
}
</style>
