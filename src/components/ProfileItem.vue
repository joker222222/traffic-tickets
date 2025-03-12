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
      <img
        class="avatar-img"
        src="https://yastatic.net/naydex/yandex-search/K1WV6j029/yfbc79wZvj/ifOU9qfBb6ZipA_cyxE395WYTQkxTsEPK2C_J_a2ybTpEmIpragpYvHqSf1juxTrIQA3YHDgmU_KdIZkUNiEsofHv6Wt7R6KR5V-6vg2FNujwVQbaxjHBDsoomfwquKS"
      />
      <h1>Билл Гейтс</h1>
    </div>
    <div class="statistics">тут статистика</div>
    <div class="settings">
      <img
        class="img-settings"
        src="https://static-00.iconduck.com/assets.00/settings-icon-2048x2046-cw28eevx.png"
        @click="handleClickSettings"
      />
    </div>
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

.avatar-img {
  width: 124px;
  height: 124px;
  border-radius: 50%;
}

.settings {
  width: 40px;
  height: 40px;
  position: relative;
}

.settings img {
  font-size: 2rem;
  max-width: 35px;
  max-height: 35px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: default;
  transition: all 1.5s ease;
}
.img-settings:hover {
  transform: rotate(720deg);
}
</style>
