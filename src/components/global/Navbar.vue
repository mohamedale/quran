
<template>
  <nav id="main-nav" class="navbar navbar-expand-lg fixed-top main-bk navbar-light p-1">
    <div class="container-fluid">
      <router-link class="navbar-brand m-auto text-center" to="/">
        <img src="/src/assets/img/quran.png" alt="القرآن الكريم">
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
nav {
  background-color: #fff;
  border-bottom: 1px solid #eee;
}
a.navbar-brand img {
  max-width: 3.5rem;
}
.nav-item {
  margin-left: 0.7rem;
}
.nav-item a {
  font-size: 1rem;
  font-weight: 600;
}
.nav-item a.active {
  color: #34495e !important;
}
.nav-item a:not(.active) {
  color: #354a5fa1;
}
</style>