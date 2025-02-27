<script setup lang="ts">
// import { ref } from 'vue'

// import { useAuthStore } from '../stores/authStore'

// const authStore = useAuthStore()

// interface NewsItem {
//   id: number
//   userReaction: 'like' | 'dislike' | null
// }

// const dataTickets = ref<NewsItem[]>([
//   {
//     id: 1,
//     userReaction: null,
//   },
//   {
//     id: 2,
//     userReaction: null,
//   },
//   {
//     id: 3,
//     userReaction: null,
//   },
// ])

// const toggleDislike = (index: number) => {}
</script>

<template>
  <div class="ticket-container">
    <div class="tickets-number">Номера билетов</div>
    <ul>
      <li v-for="index in 20" :key="index" class="ticket-item">
        <button>Билет {{ index }}</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tickets-number {
  font-size: 1.3rem;
  margin: 50px 0 15px 0;
}

ul {
  display: flex;
  gap: 10px;
  padding: 0;
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  width: 90px;
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #0056b3;
}
</style>
