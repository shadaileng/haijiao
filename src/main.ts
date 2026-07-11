import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vant from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'
import headicon from '@/plugins/headicon'
import content from '@/plugins/content'
import './styles/global.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)
app.use(headicon)
app.use(content)

app.mount('#app')
