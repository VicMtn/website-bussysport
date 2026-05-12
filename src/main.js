import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import router from './router'
import revealDirective from './directives/reveal'
import './style.css'

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
app.directive('reveal', revealDirective)

app.mount('#app')
