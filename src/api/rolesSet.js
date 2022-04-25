/**
 * Create ZackJack by 2018-9-19
 */
import request from '@/utils/request'
import constant from '@/api/constant'

// 权限树
export function getPermissionTree(code) {
  return request({
    url: `${constant.channelPermissionTree}/${code}`,
    method: 'get'
  })
}
// 获取渠道
export function channelEffective() {
  return request({
    url: `${constant.channelEffective}?cacheKey=channelQueryAllOfEffective`,
    method: 'get'
  })
}
// 获取渠道信息
export function channelDetail(code) {
  return request({
    url: `${constant.channelDetail}/${code}`,
    method: 'get'
  })
}
// 添加角色以及角色关联的权限信息
export function roleinsertLinked(params) {
  return request({
    url: constant.roleinsertLinked,
    method: 'post',
    data: params
  })
}

// 分页查询角色以及角色关联权限数据
export function roleQueryLinked(id) {
  return request({
    url: `${constant.roleQueryLinked}/${id}`,
    method: 'get'
  })
}

// 更新角色以及角色关联的权限信息
export function roleUpdatedLinked(params) {
  return request({
    url: constant.roleUpdatedLinked,
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

// 查询渠道下的角色列表
export function roleChannelCode(role) {
  return request({
    url: `${constant.roleChannelCode}?code=${role}`,
    method: 'get'
  })
}
// 查询渠道下的角色权限
export function roleChannelpermissionCodes(role) {
  return request({
    url: `${constant.roleChannelpermissionCodes}/${role}`,
    method: 'get'
  })
}

// 查询模板角色
export function roleTemplate() {
  return request({
    url: constant.roleTemplate,
    method: 'get'
  })
}

// 分页查询角色数据
export function roleLinked(params) {
  return request({
    url: constant.roleLinked,
    method: 'post',
    data: params
  })
}

// 更新角色
export function roleUpdate(params) {
  return request({
    url: constant.roleStatus,
    method: 'post',
    data: params
  })
}
