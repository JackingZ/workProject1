import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const TokenType = 'Token-Type'

export function getTokenType() {
  return Cookies.get(TokenType)
}

export function setTokenType(type) {
  return Cookies.set(TokenType, type)
}

export function removeTokenType() {
  return Cookies.remove(TokenType)
}

export function setUserInfo(info) {
  // 出单员
  if (info.authorities && info.authorities.includes('1000001022') && info.authorities.includes('ROLE_0000000003')) {
    info.authorities.push('zj0000010223')
  }
  // 续保专员
  if (info.authorities && info.authorities.includes('1000001022') && info.authorities.includes('ROLE_0000000002')) {
    info.authorities.push('zj0000010222')
  }
  return localStorage.setItem('userInfo', JSON.stringify(info))
}

export function getUserInfo() {
  if (localStorage.getItem('userInfo') && typeof localStorage.getItem('userInfo') === 'string') {
    return JSON.parse(localStorage.getItem('userInfo'))
  } else {
    return null
  }
}
export function setUserAll(all) {
  return localStorage.setItem('userAll', JSON.stringify(all))
}

export function getUserAll() {
  if (localStorage.getItem('userAll') && typeof localStorage.getItem('userAll') === 'string') {
    return JSON.parse(localStorage.getItem('userAll'))
  } else {
    return null
  }
}

export function getPermission() {
  const userInfo = getUserInfo() || {}
  return userInfo.authorities || {}
}
