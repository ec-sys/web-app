import { userService } from '../_services'
import { router } from '../_helpers'

const user = JSON.parse(localStorage.getItem(commonConstants.STORE_USER))
const state = user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: null }

const actions = {
  login({ dispatch, commit }, { username, password }) {
    commit('loginRequest', { username })
    userService.login(username, password)
      .then(
        user => {
          commit('loginSuccess', user)
          router.push(commonConstants.URL_HOME_PAGE)
        },
        error => {
          commit('loginFailure', error)
          dispatch('alert/error', error, { root: true })
        }
      )
  },
  logout({ commit }) {
    userService.logout()
    commit('logout')
  },
  register({ dispatch, commit }, user) {
    commit('registerRequest', user)

    userService.register(user)
      .then(
        user => {
          commit('registerSuccess', user)
          router.push(commonConstants.URL_LOGIN_PAGE)
          setTimeout(() => {
            // display success message after route change completes
            dispatch('alert/success', 'Registration successful', { root: true })
          })
        },
        error => {
          commit('registerFailure', error)
          dispatch('alert/error', error, { root: true })
        }
      )
  },
  updateProfile({ dispatch, commit }, payload) {
    commit('updateProfile', payload);
  }
}

const mutations = {
  loginRequest(state, user) {
    state.status = { loggingIn: true }
    state.user = user
  },
  loginSuccess(state, user) {
    state.status = { loggedIn: true }
    state.user = user
  },
  updateProfile(state, payload) {
    state.user.firstName = payload.firstName;
    state.user.lastName = payload.lastName;
    state.user.fullName = payload.firstName + " " +payload.lastName;
    state.user.avatar = payload.avatar;
    localStorage.setItem(commonConstants.STORE_USER, JSON.stringify(state.user));
  },
  loginFailure(state) {
    state.status = {}
    state.user = null
  },
  logout(state) {
    state.status = {}
    state.user = null
  },
  registerRequest(state, user) {
    state.status = { registering: true }
  },
  registerSuccess(state, user) {
    state.status = {}
  },
  registerFailure(state, error) {
    state.status = {}
  }
}

export const account = {
  namespaced: true,
  state,
  actions,
  mutations
}
