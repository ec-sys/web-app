export function sayHello() {
  console.log('hello')
}

export function isObjectNull(obj) {
  return obj === undefined || obj === null;
}

export function isObjectNotNull(obj) {
  return !isObjectNull(obj);
}
