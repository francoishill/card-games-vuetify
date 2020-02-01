import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import serviceContainer from './serviceContainer'

import PromiseHeadless from './components/app/PromiseHeadless.vue'
import RealtimeMessageListener from './components/app/RealtimeMessageListener.vue'
import vuetify from './plugins/vuetify';
import './plugins/realtime';

Vue.config.productionTip = false

Vue.component('PromiseHeadless', PromiseHeadless)
Vue.component('RealtimeMessageListener', RealtimeMessageListener)

new Vue({
  provide: serviceContainer,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
