import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.openai.com/v1/completions',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer YOUR_API_KEY`  
  }
});

export default api;

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
