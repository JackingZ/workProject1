'use strict'
let prodEnv
let version = process.env.BUILD_VER
let test = {
  NODE_ENV: '"production"',
  API_ENV : '"/t"',
  SERVER_URL: '""',
  BUILD_VER: `'${version}'`
}

let prod = {
  NODE_ENV: '"production"',
  API_ENV : '"/s"',
  SERVER_URL: '""',
  BUILD_VER: `'${version}'`
}

let test2 = {
  NODE_ENV: '"production"',
  API_ENV : '"/t2"',
  SERVER_URL: '""',
  BUILD_VER: `'${version}'`
}

function setEnv () {
  switch (version) {
    case 'test':
      prodEnv = test
      break
    case 'test2':
      prodEnv = test2
      break
    case 'prod':
      prodEnv = prod
      break
  }
}
setEnv()

module.exports = prodEnv
