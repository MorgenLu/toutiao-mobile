import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '@/views/home'
import Tabbar from '@/views/tabbar'
import Search from '@/views/search'
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    name: 'search',
    path: '/search',
    component: Search
  },
  {
    // name: 'home',
    path: '/',
    component: Tabbar,
    children: [{
      name: 'home',
      path: '',
      component: Home
    }]
  }
  ]
})

export default router
