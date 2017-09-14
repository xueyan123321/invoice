import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from '../components/LoginPage'
import DisposePage from '../components/DisposePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', component: LoginPage
    },
    {
      path: '/dispose', component: DisposePage
    },
    {
      path: '*', redirect: '/'
    }
  ]
})
