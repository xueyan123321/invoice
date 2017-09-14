// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import iView from 'iview'
import globalVariable from './globalVariable'
import 'iview/dist/styles/iview.css'

Vue.use(iView)
axios.defaults.baseURL = 'https://invoice.ews.m.jaeapp.com/web/api/'
axios.interceptors.response.use((response) => {
  if (response.data.content.errorCode !== 200) {
    alert(response.data.content.errorMsg)
  } else {
    return response.data.content
  }
}, (error) => {
  alert('网络错误')
  return (Promise.reject(error))
})
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$mainUrl', {value: globalVariable.mainUrl})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
