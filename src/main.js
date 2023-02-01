import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import VueMeta from 'vue-meta'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import dateFilter from '../filters/date.filter'
import localizeFilter from '../filters/localize.filter'
import currencyFilter from '../filters/currency.filter'
import messagePlugin from './utils/message.plugin'
import titlePlugin from './utils/title.plugin'
import LoaderApp from '@/components/app/LoaderApp'
import 'materialize-css/dist/js/materialize.min'
import tooltipDirectives from '../directives/tooltip.directives'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

Vue.config.productionTip = false

Vue.use(messagePlugin)
Vue.use(titlePlugin)
Vue.use(Vuelidate)
Vue.use(VueMeta)
Vue.component('PaginateApp', Paginate)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.filter('localize', localizeFilter)
Vue.directive('tooltip', tooltipDirectives)
Vue.component('LoaderApp', LoaderApp)

firebase.initializeApp({
  apiKey: 'AIzaSyDSwI9qbayHgabtEIJb91GNBwt_j9jVaH0',
  authDomain: 'crmach-b0afc.firebaseapp.com',
  projectId: 'crmach-b0afc',
  storageBucket: 'crmach-b0afc.appspot.com',
  messagingSenderId: '322408606040',
  appId: '1:322408606040:web:0a5b0b9aa17acf5cd85d2d',
  measurementId: 'G-CBQ8YQ2XGK'
})

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
