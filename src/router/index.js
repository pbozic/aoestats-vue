import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Admin from '@/components/Admin'
import Stats from '@/components/Stats'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/BNDUDkgzvU',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/stats',
      name: 'Stats',
      component: Stats
    }
  ]
})
