'use strict'
let devEnv
let version = process.env.BUILD_VER
let test = {
  NODE_ENV: '"development"',
  API_ENV : '"/t"',
  SERVER_URL: '"/server"',
  BUILD_VER: `'${version}'`
}

let prod = {
  NODE_ENV: '"development"',
  API_ENV : '"/s"',
  SERVER_URL: '"/server"',
  BUILD_VER:`'${version}'`
}

let test2 = {
  NODE_ENV: '"development"',
  API_ENV : '"/t2"',
  SERVER_URL: '"/server"',
  BUILD_VER:`'${version}'`
}

function setEnv () {
  switch (version) {
    case 'test':
      devEnv = test
      break
    case 'test2':
      devEnv = test2
      break
    case 'prod':
      devEnv = prod
      break
  }
}
setEnv()
module.exports = devEnv
