import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vant, { Toast } from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'
import './styles/global.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)

app.config.globalProperties.$toast = (message: string, type: string = 'fail') => {
  Toast(type === 'success' ? { message, type: 'success' } : { message, type })
}

app.mount('#app')
