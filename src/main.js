import Vue from 'vue';
import VeeValidate from 'vee-validate';

import { store } from './store';
import { router } from './helpers';
import App from './App.vue';

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
