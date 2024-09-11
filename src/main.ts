import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import shortkey from 'vue3-shortkey'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(shortkey)

app.mount('#app')
