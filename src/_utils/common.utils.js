export function sayHello() {
  console.log('hello')
}
export function isObjectNull(obj) {
  return obj === undefined || obj === null;
}
export function isObjectNotNull(obj) {
  return !isObjectNull(obj);
}
export function getWSAuthHeader() {
  let user = getStoreUser();
  return {
    'Authorization' : user.token.accessToken
  };
}
export function getApiAuthHeader() {
  let user = getStoreUser();
  return {
    'Authorization' : 'Bearer ' + user.token.accessToken
  };
}
export function getApiHeaderJson() {
  let user = getStoreUser();
  return {
    'Authorization' : 'Bearer ' + user.token.accessToken,
    'Content-Type': 'application/json'
  };
}
export function isResponseOK(response) {
  if(isObjectNull(response)) return false;
  return response.statusText === "OK";
}
export function getStoreUser() {
  return JSON.parse(localStorage.getItem(commonConstants.STORE_USER));
}

