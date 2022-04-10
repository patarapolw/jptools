import './global.scss'

import App from './App.vue'
import { createApp } from 'vue'
import { router } from './plugins/router'

createApp(App).use(router).mount('#app')
