// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import iView from 'iview'
import globalConfig from './globalConfig'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false
Vue.use(iView)
axios.defaults.headers.post['Content-Type'] = 'form-data'
Vue.use(VueAxios, axios)
Object.defineProperty(Vue.prototype, '$mainUrl', {value: globalConfig.mainUrl})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
