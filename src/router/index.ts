import type {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHashHistory} from 'vue-router'

// import {createRouterGuards} from './router-guards'
// import 'nprogress/nprogress.css' // 进度条样式
import type {App} from 'vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/weicome',
    component: () => import('../views/weicome.vue'),
    meta: {
      title: '欢迎',
      hidden: true
    },
    children: []
  },{
    path: '/weicome',
    name: 'weicome',
    component: () => import('../views/weicome.vue'),
    meta: {
      title: '欢迎'
    },
    children: []
  },{
    path: '/shouhuan',
    name: 'shouhuan',
    component: () => import('../views/shouhuan.vue'),
    meta: {
      title: '收环计算器'
    },
    children: []
  },{
    path: '/shoushoujue',
    name: 'shoushoujue',
    component: () => import('../views/shoushoujue.vue'),
    meta: {
      title: '收兽决计算器'
    },
    children: []
  },{
    path: '/baobaohuan',
    name: 'baobaohuan',
    component: () => import('../views/baobaohuan.vue'),
    meta: {
      title: '宝宝环记录器'
    },
    children: []
  }
]

const router = createRouter({
  // process.env.BASE_URL
  history: createWebHashHistory(''),
  routes
})

export async function setupRouter(app: App) {
  // const configStore = useConfigStore()
  // await configStore.getCommonConfig()
  app.use(router)
  // 创建路由守卫
  // createRouterGuards(router)
  router.isReady().then(() => app.mount('#app'))
}
export default router
