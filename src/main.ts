import {createApp} from 'vue'
import './style.css'
// @ts-ignore
import {setupRouter} from './router/index.ts'
// import db from './datastore.ts'
//全局挂载db
import App from './App.vue'

const app = createApp(App)

// app.config.globalProperties.$db = db
setupRouter(app);

