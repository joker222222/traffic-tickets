<script setup lang="ts">

import router from '@/router'

const handleClickSettings = () => {
  console.log('Click Settings')
  router.push('/settings-profile')
}
// import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="about form-container">
    <div class="profile">
      <img class="avatar-img" src="https://avatars.mds.yandex.net/get-entity_search/118532/1132030522/S600xU_2x"/>
      <h1>Билл Гейтс</h1>
    </div>
    <div class="statistics">
      тут статистика
    </div>
    <div class="settings" @click="handleClickSettings">⚙️</div>
  </div>
</template>

<style setup>
.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin-top: 50px;
  width: 100%;
  position: relative;
}

.profile {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  gap: 20px;
}

.settings {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 1.7rem;
  cursor: default;
  user-select: none;
  text-align: center;
}

.avatar-img {
  width: 124px;
  height: 124px;
  border-radius: 50%;
}

</style>
