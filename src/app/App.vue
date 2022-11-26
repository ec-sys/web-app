<template>
  <div class='jumbotron'>
    <div class='container'>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapState({
      alert: state => state.alert
    })
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear'
    })
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.clearAlert()
    }
  }
}
</script>
<style>
.jumbotron {
  margin: 0px;
  background-color: white;
  height: 100%;
  padding-bottom: 0px;
}
</style>
