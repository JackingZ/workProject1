import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, getTokenType } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 2 * 60 * 1000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token && !config.headers.Authorization) {
      config.headers['Authorization'] = `${getTokenType()} ${getToken()}`// 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (response.config && response.config.stopIntercept) return response.data
    if (res.status && res.status !== 200) {
      Message({
        message: res.e || res.msg || res.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res.msg)
    }
    //
    //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     MessageBox.confirm(
    //       '你已被登出，可以取消继续留在该页面，或者重新登录',
    //       '确定登出',
    //       {
    //         confirmButtonText: '重新登录',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }
    //     ).then(() => {
    //       store.dispatch('FedLogOut').then(() => {
    //         location.reload() // 为了重新实例化vue-router对象 避免bug
    //       })
    //     })
    //   }
    //   return Promise.reject('error')
    // } else {
    //   return response.data
    // }
    return response.data
  },
  error => {
    if (error.config && error.config.stopIntercept) return Promise.reject(error)
    if (error.response.status === 401) {
      console.dir(error)
      if (error.config.url.indexOf('/oauth/token') > 0) {
        Message({
          message: '账号密码错误，请重试',
          type: 'error',
          duration: 5 * 1000
        })
        return
      } else {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      }
    }
    Message({
      message: '网络请求失败,请稍后',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
