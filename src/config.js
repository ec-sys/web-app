// config.js
const env = process.env.NODE_ENV // 'dev' or 'test'

const localHostIp = process.env.LOCAL_HOST_IP || 'localhost'
const local = {
  api: {
    uaa: 'http://' + localHostIp + ':8080/api/uaa',
    chat: 'http://' + localHostIp + ':8080/api/chat'
  },
  ws: {
    rtm: 'ws://' + localHostIp + ':8080/ws/rtm'
  }
}

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: parseInt(process.env.DEV_DB_PORT) || 27017,
    name: process.env.DEV_DB_NAME || 'db'
  }
}
const test = {
  app: {
    port: parseInt(process.env.TEST_APP_PORT) || 3000
  },
  db: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT) || 27017,
    name: process.env.TEST_DB_NAME || 'test'
  }
}

const config = {
  local,
  dev,
  test
}

module.exports = config[env]
