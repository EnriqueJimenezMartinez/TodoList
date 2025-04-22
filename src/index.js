import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
