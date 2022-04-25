const baseUrl = "https://ybinsure.com/"
// let baseUrl
// switch (process.env.BUILD_VER) {
//   case 'test2':
//     baseUrl = 'http://10.1.1.133/'
//     break
//   default:
//     // baseUrl = "https://ybinsure.com/"
//     baseUrl = 'http://10.1.1.133/'
//     break
// }

const proxyApi = {
  '/server': {
    // target: `${baseUrl}user/auth/`,
    target: `${baseUrl}`,
    secure: false,
    pathRewrite: {
      '^/server': ''
    },
    headers: {
      Referer: 'http://ybinsure.com/spa/newCar/carInfo',
      Host: 'ybinsure.com',
      Origin: 'http://ybinsure.com'
    }
  },
  '/test': {
    // target: `${baseUrl}user/auth/`,
    target: 'http://10.1.1.133:18059',
    secure: false,
    pathRewrite: {
      '^/test': ''
    },
    headers: {
      Referer: 'http://ybinsure.com/spa/newCar/carInfo',
      Host: 'ybinsure.com',
      Origin: 'http://ybinsure.com'
    }
  }
}
module.exports = proxyApi
