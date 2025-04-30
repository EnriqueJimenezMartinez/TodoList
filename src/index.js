import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './assets/main.css'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'flag-icon-css/css/flag-icons.min.css'
import esLang from './langs/es.js'
import enLang from './langs/en.js'
import deLang from './langs/de.js'
import glLang from './langs/gl.js'
import frLang from './langs/fr.js'

const availableLocales = ['es', 'en', 'de', 'gl', 'fr'];

const savedLocale = localStorage.getItem('locale');

const locale = availableLocales.includes(savedLocale) ? savedLocale : 'es';

localStorage.setItem('locale', locale);


const i18n = createI18n({
  locale,
  fallbackLocale: 'es',
  messages: {
    en: enLang,
    es: esLang,
    de: deLang,
    gl: glLang,
    fr: frLang,
  },
})
const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.mount('#app')
