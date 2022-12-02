<template>
  <div class='jumbotron'>
    <div class='container'>
      <nav class="navbar navbar-expand-lg navbar-light" v-if="!isLoginPage">
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <router-link to='/' class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to='/chat' class="nav-link">Chat</router-link>
            </li>
            <li class="nav-item">
              <router-link to='/chat-room' class="nav-link">Chat Room</router-link>
            </li>
            <li class="nav-item">
              <router-link to='/chat-person' class="nav-link">Chat Person</router-link>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <router-link to='/login' class="nav-link">Logout</router-link>
            <img :src="account.user.avatar" width="30" height="30" data-toggle="tooltip" :title="account.user.fullName">
          </form>
        </div>
      </nav>
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
      alert: state => state.alert,
      account: state => state.account
    }),
    isLoginPage() {
      return this.$route.path == "/login";
    }
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
  padding-top: 10px;
}
.navbar {
  margin-bottom: 10px;
  background-color: #c4cede;
}
</style>
