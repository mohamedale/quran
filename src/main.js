import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from "vue3-cookies";
import axios from "axios";
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.rtl.min.css'

const app = createApp(App)

app.config.globalProperties.axios = axios;

app.use(router)
app.use(VueCookies)

app.mount('#app')
