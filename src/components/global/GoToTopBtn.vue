<template>
  <button id="go-to-top" @click="goToTop">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
      <path fill-rule="evenodd" stroke="white" stroke-width="1"
            d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"></path>
    </svg>
    الصعود للأعلى
  </button>
</template>

<style scoped>
button {
  outline: none;
  line-height: 1rem;
  border: none;
  background-color: #41B883;
  color: #fff;
  font-size: .7rem;
  font-weight: bold;
  padding: 0.2rem 0.8rem;
  border-radius: 0.7rem;
}
</style>

<script>
export default {
  methods: {
    goToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>