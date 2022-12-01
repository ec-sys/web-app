// config.js
const env = process.env.NODE_ENV // 'dev' or 'test'

const local = {
  api: {
    uaa: 'http://localhost:8080/api/uaa',
    rtm: 'http://localhost:8080/api/rtm'
  },
  ws: {
    rtm: 'ws://localhost:8080/ws/rtm'
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
