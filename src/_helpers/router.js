import Vue from 'vue'
import Router from 'vue-router'

import HomePage from '../home/HomePage'
import LoginPage from '../login/LoginPage'
import RegisterPage from '../register/RegisterPage'
import ChatPage from '../chat/ChatPage'
import RoomListPage from '../management/RoomListPage'
import ProfilePage from '../user/ProfilePage'

import {userService} from '../_services'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/chat', component: ChatPage },
    { path: '/mng/rooms', component: RoomListPage },
    { path: '/user/profile', component: ProfilePage },

    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  let loggedIn = localStorage.getItem(commonConstants.STORE_USER)


  if(authRequired) {
    // no logged in data
    if(!loggedIn) {
      return next('/login');
    }
    // check access token
    try {
      loggedIn = JSON.parse(loggedIn);
      let currentDate = new Date();
      let accessExpireTime = new Date(loggedIn.token.accessTokenExpireTime);

      if(currentDate > accessExpireTime) {
        let refreshExpireTime = new Date(loggedIn.token.refreshToken);
        if(currentDate > refreshExpireTime) {
          // if access token is expire then login again
          return next('/login');
        } else {
          // else refresh token
          userService.refreshToken(next);
        }
      } else {
        next();
      }
    } catch (ex) {
      console.log(ex);
      return next('/login');
    }
  } else {
    next();
  }
})
