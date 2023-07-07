<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import Home from "./components/Home.vue";
</script>

<template>
  <Home />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
#app {
    width: 100%;
    height: 100%;
}
</style>
