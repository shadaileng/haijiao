import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Vant from 'vant'
import 'vant/lib/index.css'
import '@vant/touch-emulator'
import App from './App.vue'
import router from './router'
import headicon from '@/plugins/headicon'
import content from '@/plugins/content'
import './styles/global.scss'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(Vant)
app.use(headicon)
app.use(content)

app.mount('#app')
