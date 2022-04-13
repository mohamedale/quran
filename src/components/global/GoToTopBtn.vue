<template>
  <button id="go-to-top" @click="goToTop" v-show="showScrollingBtn">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fill-rule="evenodd" stroke="white" stroke-width="1"
            d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"></path>
    </svg>
  </button>
</template>

<style scoped>
button {
  outline: none;
  width: 2.5rem;
  height: 2.5rem;
  line-height: 1rem;
  border-radius: 50%;
  border: none;
  background-color: #41B883;
  color: #fff;
  position: fixed;
  bottom: 2rem;
  right: 1rem;
  transition: .2s all ease-in-out;
}
</style>

<script>
export default {
  data() {
    return {
      showScrollingBtn: false
    }
  },
  methods: {
    goToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.showScrollingBtn = scrollY > 500;
    })
  }
}
</script>