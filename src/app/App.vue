<template>
  <div class='jumbotron'>
    <div v-if='showToast' class='cus-toast-wrapper'>
      <span :class="['text-white cus-toast-body', getToastClass]">{{toastMsg}}</span>
    </div>
    <div class='container'>
      <nav class="navbar navbar-expand-lg navbar-light" v-if="!isUnAuthPage">
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item mr-3">
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
                <router-link to='/mng/rooms' class="dropdown-item">Room</router-link>
                <a class="dropdown-item" href="#">User</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Room Member</a>
              </div>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <router-link to='/login' class="nav-link">Logout</router-link>
            <img :src="account.user.avatar" class='icon-avatar' width="30" height="30"
                 data-toggle="tooltip" :title="account.user.fullName" @click='gotoUserProfile'>
          </form>
        </div>
      </nav>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {userService} from '../_services'

import { Client, Message } from '@stomp/stompjs'

export default {
  data() {
    return {
      showToast: false,
      toastOK: false,
      toastMsg: "none",
      clientSockJs: undefined
    }
  },
  name: 'app',
  computed: {
    ...mapState({
      alert: state => state.alert,
      account: state => state.account
    }),
    isUnAuthPage() {
      return this.$route.path == "/login";
    },
    getToastClass () {
      return this.toastOK ? 'bg-success' : 'bg-danger';
    }
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.clearAlert();
      if(!this.isUnAuthPage && this.clientSockJs == undefined) {
        this.socketHeartbeat();
      }
      if(this.isUnAuthPage) {
        this.clientSockJs.deactivate();
        this.clientSockJs = undefined;
      }
    }
  },
  mounted() {
    setInterval(userService.refreshToken, 30 * 60 * 1000);
    this.$bus.$on(commonConstants.BUS_EVENT_SHOW_TOAST, this.handleToast);
    if(!this.isUnAuthPage && this.clientSockJs == undefined) {
      this.socketHeartbeat();
    }
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear'
    }),
    gotoUserProfile() {
      this.$router.push('/user/profile');
    },
    handleToast(payload) {
      this.toastOK = payload.isOK;
      this.toastMsg = payload.msg;
      this.showToast = true;
      setTimeout(() => {this.showToast = false;}, 1500);
    },
    socketHeartbeat() {
      let header = this.headerWSAuth();
      // configure client sock-js
      this.clientSockJs = new Client({
        brokerURL: config.ws.pnt + '/ws/notify/websocket',
        connectHeaders: header,
        debug: function(str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 0,
        heartbeatOutgoing: 15000
      })
      this.clientSockJs.configure();

      // connect to ws server
      this.clientSockJs.onConnect = this.sockJsConnectSuccess;
      this.clientSockJs.onStompError = this.sockJsConnectError;
      this.clientSockJs.activate();
    },
    headerWSAuth() {
      return commonUtils.getWSAuthHeader();
    },
    sockJsConnectSuccess(frame) {
      console.log(frame);
      console.log("connected, session id: " + this.clientSockJs.sessionId);
    },
    sockJsConnectError(frame) {
      console.error('Broker reported error: ' + frame.headers['message'])
      console.error('Additional details: ' + frame.body)
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
.icon-avatar  {
  border-radius: 15px;
}
.loader-all {
  position: absolute;
  height: 100vh;
  width: 100%;
  top: 0px;
  left: 0px;
  z-index: 999;
  background: rgba(255, 255, 255, .5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-wrapper {
  background-color: white !important;
  border: none;
}
.loader-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.cus-toast-wrapper {
  position: absolute;
  top: 65px;
  left: 0px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 10;
}
.cus-toast-body {
  padding: 3px 150px;
  border-radius: 3px;
}
.modal-backdrop {
  opacity: 0.5;
}
</style>
