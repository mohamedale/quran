<script setup>
import {RouterView} from 'vue-router'
import Navbar from "./components/global/Navbar.vue";
import CustomFooter from "./components/global/Footer.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <navbar></navbar>
    </div>
  </header>
  <div class="container">
    <RouterView/>
  </div>
  <custom-footer></custom-footer>
</template>

<style>
@import './assets/css/main.css';
</style>
<style scoped>
.container {
  padding-top: 8rem;
  padding-bottom: 2rem;
  min-height: 100vh;
}
</style>