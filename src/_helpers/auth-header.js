export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem(commonConstants.STORE_USER))

  if (user && user.token) {
    return { 'Authorization': 'Bearer ' + user.token }
  } else {
    return {}
  }
}
