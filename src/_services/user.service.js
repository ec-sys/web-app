import { authHeader } from '../_helpers';
import axios from 'axios';

export const userService = {
  login,
  logout,
  refreshToken,
  register,
  getAll,
  getById,
  update,
  delete: _delete
}

function login(username, password) {
  const params = {
    loginId: username,
    password: password,
    loginUserType: 'CUSTOMER'
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }

  return fetch(`${config.api.uaa}/auth/login`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        user.fullName = user.firstName + " " + user.lastName;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(commonConstants.STORE_USER, JSON.stringify(user))
      }
      return user
    })
}

function refreshToken() {
  const storeUser = commonUtils.getStoreUser();
  if(commonUtils.isObjectNull(storeUser) || commonUtils.isObjectNull(storeUser.token)) {
    logout();
    location.reload(true);
  }

  const params = {
    accessToken: storeUser.token.accessToken,
    refreshToken: storeUser.token.refreshToken
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }

  return fetch(`${config.api.uaa}/auth/refresh-token`, requestOptions)
    .then(handleResponse)
    .then(response => {
      if (stringUtils.isEmpty(response.errorCode)) {
        storeUser.token.accessToken = response.accessToken;
        storeUser.token.refreshToken = response.refreshToken;
        localStorage.setItem(commonConstants.STORE_USER, JSON.stringify(storeUser));
      }
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem(commonConstants.STORE_USER)
}

function update(params, handleResponse) {
  const headers = {
    headers: commonUtils.getApiHeaderJson()
  };

  axios.post(`${config.api.uaa}/user/update-profile`, params, headers)
    .then(handleResponse) // handle ok
    .catch(handleResponse) // handle error
    .then(function () {}); // always executed
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout()
        location.reload(true)
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}

function register(user) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }

  return fetch(`${config.api.uaa}/users/register`, requestOptions).then(handleResponse)
}

function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.api.uaa}/users`, requestOptions).then(handleResponse)
}


function getById(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch(`${config.api.uaa}/users/${id}`, requestOptions).then(handleResponse)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${config.api.uaa}/users/${id}`, requestOptions).then(handleResponse)
}
