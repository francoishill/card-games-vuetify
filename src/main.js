import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import serviceContainer from './serviceContainer'

import PromiseHeadless from './components/app/PromiseHeadless.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.component('PromiseHeadless', PromiseHeadless)

new Vue({
  provide: serviceContainer,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
