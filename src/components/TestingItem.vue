<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToTicket = (id: number) => {
  router.push(`/ticket/${id}`)
}
</script>

<template>
  <div class="ticket-container form-container">
    <div class="tickets-number">Номера билетов</div>
    <ul>
      <li v-for="index in 40" :key="index" class="ticket-item">
        <button @click="goToTicket(index)">Билет {{ index }}</button>
      </li>
    </ul>
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
