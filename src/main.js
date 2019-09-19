import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import './styles/index.css'

import {
  NavBar,
  Field,
  Button
} from 'vant'
Vue.config.productionTip = false

Vue.use(NavBar)
  .use(Field)
  .use(Button)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
