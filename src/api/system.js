/**
 * Create ZackJack by 2018-9-19
 */
import request from '@/utils/request'
import constant from '@/api/constant'

// 获取账户表格内容
export function userLinked(params) {
  return request({
    url: constant.userLinked,
    method: 'post',
    data: params
  })
}

// 获取渠道
export function channelEffective() {
  return request({
    url: `${constant.channelEffective}?cacheKey=channelQueryAllOfEffective`,
    method: 'get'
  })
}

// 所属机构下拉选择
export function getOrgData(params) {
  return request({
    url: constant.getAllOrg,
    method: 'post',
    data: params
  })
}

// 获取所有角色
export function roleChannelCode(role) {
  return request({
    url: `${constant.roleChannelCode}?code=${role}`,
    method: 'get'
  })
}

// 重置密码
export function userResetPassword(params) {
  return request({
    url: constant.userResetPassword,
    method: 'post',
    data: params
  })
}

// 禁用用户状态
export function userLoginDisable(id) {
  return request({
    url: `${constant.userLoginDisable}/${id}`,
    method: 'DELETE'
  })
}

// 启用用户状态
export function userLoginRecovery(id) {
  return request({
    url: `${constant.userLoginRecovery}/${id}`,
    method: 'DELETE'
  })
}

// 删除用户
export function userDelete(id) {
  return request({
    url: `${constant.userDelete}/${id}`,
    method: 'DELETE'
  })
}

// 新增用户
export function userInsertLinked(params) {
  return request({
    url: constant.userInsertLinked,
    method: 'post',
    data: params
  })
}

// 编辑用户
export function userUpdateLinked(params) {
  return request({
    url: constant.userUpdateLinked,
    method: 'post',
    data: params
  })
}
// 角色数量
export function userRoleCount(params) {
  return request({
    url: constant.userRoleCount,
    method: 'post',
    data: params
  })
}

// 获取角色表格内容
export function roleLinked(params) {
  return request({
    url: constant.roleLinked,
    method: 'post',
    data: params
  })
}

// 更改角色状态
export function roleStatus(params) {
  return request({
    url: constant.roleStatus,
    method: 'post',
    data: params
  })
}

// 删除角色
export function roleDelete(id) {
  return request({
    url: `${constant.roleDelete}/${id}`,
    method: 'DELETE'
  })
}

// 新增角色
export function roleinsertLinked(params) {
  return request({
    url: constant.roleinsertLinked,
    method: 'post',
    data: params
  })
}

// 编辑角色
export function roleUpdatedLinked(params) {
  return request({
    url: constant.roleUpdatedLinked,
    method: 'post',
    data: params
  })
}
// 获取机构
export function getCompanyEffective() {
  return request({
    url: constant.companyEffective,
    method: 'get'
  })
}

// 管辖机构
export function getLimitCompanyEffective() {
  return request({
    url: constant.limitCompanyEffective,
    method: 'get'
  })
}

// 编辑获取账户信息
export function getUserAccount(id) {
  return request({
    url: `${constant.userCompanyLinked}/${id}`,
    method: 'get'
  })
}
// 账号校验唯一性
export function checkUserName(name) {
  return request({
    url: `${constant.financeUserNameCheck}/${name}`,
    method: 'get'
  })
}

// 编辑获取角色信息
export function getRoleSelectId(id) {
  return request({
    url: `${constant.userRoleIDLinked}/${id}`,
    method: 'get'
  })
}

// // 获取角色
// export function getRoleAllCodes(code) {
//   return request({
//     url: `${constant.roleChannelAllCodes}`,
//     method: 'post',
//     data: code
//   })
// }
// 获取角色
export function getRoleCodes(code) {
  return request({
    url: `${constant.roleChannelCodes}?code=${code}`,
    method: 'get'
  })
}

// 获取所有机构
export function getChannelEffective() {
  return request({
    url: `${constant.channelEffective}?cacheKey=channelQueryAllOfEffective`,
    method: 'get'
  })
}

// 编辑状态的初始化角色
export function getRoleIdData(id) {
  return request({
    url: `${constant.roleQueryLinked}/${id}`,
    method: 'get'
  })
}

// 编辑状态的角色树
export function getRolePermissionTree() {
  return request({
    url: `${constant.rolePermissionTree}/1`,
    method: 'get'
  })
}

// 获取机构
export function getCompanyTreeEffective() {
  return request({
    url: constant.companyEffective,
    method: 'get'
  })
}
