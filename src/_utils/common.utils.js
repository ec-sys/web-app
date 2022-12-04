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

export function changeTimezone(targetDate, newTimeZone) {
  let newDate = new Date(targetDate.toLocaleString('en-US', { timeZone: newTimeZone }));
  let diff = targetDate.getTime() - newDate.getTime();
  return new Date(targetDate.getTime() - diff);
}
export function getDateNowHaiNoi() {
  return changeTimezone(new Date(), "Asia/Ho_Chi_Minh");
}

export function getFullMonthName(targetDate) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[targetDate.getMonth()];
}

/**
 * format example: 1 December; 13 January
 */
export function getDateAndFullMonthName(targetDate) {
  return targetDate.getDate() + " " + getFullMonthName(targetDate);
}
