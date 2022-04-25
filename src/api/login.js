import request from '@/utils/request'
import qs from 'qs'
import MD5 from 'md5.js'
import constant from '@/api/constant'

export function login(username, password, client_id, client_secret, grant_type) {
  const pwd = new MD5().update(password).digest('hex')
  return request({
    url: constant.userLogin,
    method: 'post',
    data: qs.stringify({
      username,
      password: pwd,
      client_id,
      client_secret,
      grant_type
    })
  })
}

export function getInfo(token) {
  return request({
    url: `${constant.userInfo}?token=${token}`,
    method: 'post'
  })
}
export function getAll() {
  return request({
    url: constant.userToken,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function updatePassword(oldPassword, newPassword) {
  return request({
    url: `${constant.updatePassword}?sourcePassWord=${oldPassword}&newPassword=${newPassword}`,
    method: 'post'
  })
}

export function queryInnerCode(code) {
  return request({
    url: `${constant.queryInnerCode}${code}`,
    method: 'get',
    stopIntercept: true
  })
}
