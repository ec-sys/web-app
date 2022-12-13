<template>
  <div class='jumbotron'>
    <div class='container'>
      <nav class="navbar navbar-expand-lg navbar-light" v-if="!isLoginPage">
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active mr-3">
              <router-link to='/' class="nav-link">Home</router-link>
            </li>
            <li class="nav-item dropdown mr-3">
              <a class="nav-link dropdown-toggle" href="#" id="chatDropdown" role="button"
                 data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Chat</a>
              <div class="dropdown-menu" aria-labelledby="chatDropdown">
                <router-link to='/chat' class="dropdown-item">Chat Room</router-link>
                <router-link to='/chat' class="dropdown-item">Chat Individual</router-link>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="mngDropdown" role="button"
                 data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Management</a>
              <div class="dropdown-menu" aria-labelledby="mngDropdown">
                <router-link to='/rooms' class="dropdown-item">Room</router-link>
                <a class="dropdown-item" href="#">User</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Room Member</a>
              </div>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <router-link to='/login' class="nav-link">Logout</router-link>
            <img :src="account.user.avatar" class='icon-avatar' width="30" height="30"
                 data-toggle="tooltip" :title="account.user.fullName">
          </form>
        </div>
      </nav>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {userService} from '../_services'

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
  },
  mounted() {
    setInterval(userService.refreshToken, 30 * 60 * 1000);
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
.icon-avatar  {
  border-radius: 15px;
}
</style>
