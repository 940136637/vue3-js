import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import { logger } from '@/utils/logger'
import '@/styles/index.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (error, _instance, info) => {
  logger.error('[app error]', info, error)
}

app.mount('#app')
