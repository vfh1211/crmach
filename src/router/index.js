import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      meta: { layout: 'empty' },
      name: 'login',
      component: () => import('../views/LoginEnterView.vue')
    },
    {
      path: '/register',
      meta: { layout: 'empty' },
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/',
      meta: { layout: 'main', auth: true },
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/contract',
      meta: { layout: 'main', auth: true },
      name: 'contract',
      component: () => import('../views/ContractView.vue')
    }, {
      path: '/students',
      meta: { layout: 'main', auth: true },
      name: 'students',
      component: () => import('../views/StudentsView.vue')
    },
    {
      path: '/detail/:id',
      meta: { layout: 'main', auth: true },
      name: 'detail',
      component: () => import('../views/DetailView.vue')
    },
    {
      path: '/updateStudent/:id',
      meta: { layout: 'main', auth: true },
      name: 'updateStudent',
      component: () => import('../views/UpdateStudentView.vue')
    },
    {
      path: '/balanceSheet',
      meta: { layout: 'main', auth: true },
      name: 'balanceSheet',
      component: () => import('../views/BalanceSheet.vue')
    },
    {
      path: '/profile',
      meta: { layout: 'main', auth: true },
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/record',
      meta: { layout: 'main', auth: true },
      name: 'record',
      component: () => import('../views/RecordView.vue')
    },
    {
      path: '/master/:id',
      meta: { layout: 'main', auth: true },
      name: 'master',
      component: () => import('../views/MasterView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requireAuth = to.matched.some(record => record.meta.auth)

  if (requireAuth && !currentUser) {
    next('/login?message=login')
  } else {
    next()
  }
})
export default router
