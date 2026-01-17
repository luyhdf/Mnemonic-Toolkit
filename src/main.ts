import { createApp } from 'vue'
import App from './App.vue'

import '~/styles/index.scss'
import 'uno.css'

// Element Plus message components
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/overlay.scss'

const app = createApp(App)
app.mount('#app')
