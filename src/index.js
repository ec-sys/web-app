import Vue from 'vue'
// import VeeValidate from 'vee-validate'

import { store } from './_store'
import { router } from './_helpers'
import App from './app/App'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Vue.use(VeeValidate, {
//   inject: true,
//   fieldsBagName: 'veeFields'
// });

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// setup fake backend
// import { configureFakeBackend } from './_helpers'
// configureFakeBackend()

import { EventBus } from './event-bus'
Vue.prototype.$bus = EventBus

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
