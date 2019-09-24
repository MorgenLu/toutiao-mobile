import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import './styles/index.css'

import {
  ValidationProvider,
  extend,
  ValidationObserver
} from 'vee-validate'
import * as rules from 'vee-validate/dist/rules' // 加载所有的验证规则
import zhCN from 'vee-validate/dist/locale/zh_CN' //
import {
  relativeTime
} from '@/utils/date'
import {
  NavBar,
  Field,
  Button,
  Toast,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  List,
  Cell,
  Grid,
  GridItem,
  PullRefresh,
  Image,
  Icon,
  Popup,
  Search

} from 'vant'
Vue.config.productionTip = false

Vue.filter('relativeTime', relativeTime)

Vue.use(NavBar)
  .use(Field)
  .use(Button)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(Cell)
  .use(Grid)
  .use(GridItem)
  .use(PullRefresh)
  .use(Image)
  .use(Icon)
  .use(Popup)
  .use(Search)
// 验证
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}

// 一个原则：有内置的使用内置的，内置的满足不了再自定义
extend('phone', {
  validate (value) {
    return /^1\d{10}$/.test(value)
  },
  message: '必须是手机号'
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
