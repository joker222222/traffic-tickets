<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
import NewsItem from '../components/NewsItem.vue'
</script>

<template>
  <div class="about">
    <!-- <h1>Тут будут новости</h1> -->
    <NewsItem />
  </div>
</template>

<style setup>
/* @media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
.about {
  display: block;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
