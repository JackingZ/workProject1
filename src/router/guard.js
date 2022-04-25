import store from '@/store'
import PermissionList from '@/utils/permission'
/* eslint-disable */
export function checkPermissions (value) {
  const { user } = store.state
  const permissions =  user && user.permissions
  const permissionRoles = value
  const checkSpecial = (val) => {
    const func = specialPermissions[val]
    return func ? func() : true
  }
  // 权限扁平化
  const list = []
  const hasPermission = permissions.some(permission => {
    if (Object.prototype.toString.call(permissionRoles) === '[object Array]') {
      return permissionRoles.some((innerVal)=> {
        if (Object.prototype.toString.call(innerVal) === '[object Array]') {
          return innerVal.some(lastVal => {
            list.push(lastVal)
            return lastVal === permission
          })
        }
        list.push(innerVal)
        return innerVal === permission
      })
    }
    list.push(permissionRoles)
    return permissionRoles === permission
  })
  // 是否满足所有特殊权限
  const isSatisfySpecial = list.every(permission => checkSpecial(permission))
  return hasPermission && isSatisfySpecial
}

// 自定义权限
const specialPermissions = {
  [PermissionList.mustNotCarDealer] () {
    const carDealer = store.getters.userAll.data.carDealer
    // 是否车商渠道帐号
    const isCarDealer = carDealer === 0
    return isCarDealer
  }
}
