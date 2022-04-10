import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'
import VueCookies from "vue3-cookies";
import axios from "axios";
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.rtl.min.css'

const eventBus = mitt()
const app = createApp(App)

app.config.globalProperties.eventBus = eventBus;
app.config.globalProperties.axios = axios;

app.use(router)
app.use(VueCookies)

app.mount('#app')
