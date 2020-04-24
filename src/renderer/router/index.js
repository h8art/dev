import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/video/:id',
      name: 'video',
      component: require('@/components/Video').default
    },
    {
      path: '/notification',
      name: 'notification',
      component: require('@/components/Notification').default
    },
    {
      path: '*',
      redirect: '/dashboard'
    }
  ]
})
