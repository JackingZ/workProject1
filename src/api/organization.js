import request from '@/utils/request'
import constant from '@/api/constant'
import querystring from '@/utils/querystring'
// 获取组织机构列表
export function getOrgList() {
  return request({
    url: constant.getOrgList,
    method: 'get'
  })
}

// 获取组织机构列表
export function enableOrg(id) {
  return request({
    url: `${constant.enableOrg}${id}`,
    method: 'post'
  })
}

// 获取组织机构列表
export function disableOrg(id) {
  return request({
    url: `${constant.disableOrg}${id}`,
    method: 'post'
  })
}

// 获取机构信息
export function queryOrgInfo(id) {
  return request({
    url: `${constant.queryOrgInfo}${id}`,
    method: 'get'
  })
}

// 获取机构配置
export function queryOrgConfig(id) {
  return request({
    url: `${constant.queryOrgConfig}${id}`,
    method: 'get'
  })
}

// 字典查询
export function queryByType(type) {
  return request({
    url: `${constant.queryByType}${type}`,
    method: 'get'
  })
}

// 省份城市级联列表
export function queryAreaList() {
  return request({
    url: `${constant.queryAreaList}`,
    method: 'get'
  })
}

// 省份代码
export function queryProvinceList() {
  return request({
    url: `${constant.queryProvinceList}`,
    method: 'get'
  })
}

// 检查机构代码是否存在
export function checkOrg(data) {
  return request({
    url: `${constant.checkOrg}`,
    method: 'post',
    data
  })
}

// 更新机构信息
export function updateOrg(data) {
  return request({
    url: `${constant.updateOrg}`,
    method: 'post',
    data
  })
}

// 新增机构
export function addOrg(data) {
  return request({
    url: `${constant.addOrg}`,
    method: 'post',
    data
  })
}

// 检查该机构是否存在用户
export function checkOrgUser(id) {
  return request({
    url: `${constant.checkOrgUser}${id}`,
    method: 'get'
  })
}

// 删除机构
export function deleteOrg(id) {
  return request({
    url: `${constant.deleteOrg}${id}`,
    method: 'delete'
  })
}

// 查询个人业务员信息
export function queryPersonSales(data) {
  return request({
    url: `${constant.queryPersonSales}`,
    method: 'post',
    data
  })
}

// 查询渠道下是否存在指定用户名
export function checkOrgExistUser(params) {
  return request({
    url: `${constant.checkOrgExistUser}`,
    method: 'post',
    data: querystring(params)
  })
}

// 添加业务员
export function insertSalesUser(data) {
  return request({
    url: `${constant.insertSalesUser}`,
    method: 'post',
    data
  })
}

// 检查业务员编码是否存在
export function checkExistAgentCode(params) {
  return request({
    url: `${constant.checkExistAgentCode}`,
    method: 'post',
    data: querystring(params)
  })
}

// 根据用户id查询用户和机构相关信息
export function userCompanyLinked(id) {
  return request({
    url: `${constant.userCompanyLinked}/${id}`,
    method: 'get'
  })
}

// 更新业务员信息
export function updateUserInfo(data) {
  return request({
    url: `${constant.updateUserInfo}`,
    method: 'post',
    data
  })
}

// 删除业务员信息
export function deleteUserInfo(id) {
  return request({
    url: `${constant.deleteUserInfo}${id}`,
    method: 'delete'
  })
}

// 删除业务员信息
export function resetUserPwd(params) {
  return request({
    url: `${constant.resetUserPwd}`,
    method: 'post',
    data: querystring(params)
  })
}

// 查询渠道业务员信息
export function queryChannelSales(data) {
  return request({
    url: `${constant.queryChannelSales}`,
    method: 'post',
    data
  })
}

// 添加渠道业务员
export function insertChannelSalesUser(data) {
  return request({
    url: `${constant.insertChannelSalesUser}`,
    method: 'post',
    data
  })
}

// 禁用业务员
export function userLoginDisable(id) {
  return request({
    url: `${constant.userLoginDisable}/${id}`,
    method: 'delete'
  })
}

// 启用业务员
export function userLoginRecovery(id) {
  return request({
    url: `${constant.userLoginRecovery}/${id}`,
    method: 'delete'
  })
}

// 根据渠道渠道code查询关联的分销渠道
export function queryChannelByCode(id) {
  return request({
    url: `${constant.queryChannelByCode}${id}`,
    method: 'get'
  })
}

// 查询某类权限点
export function queryPermissionDict(id) {
  return request({
    url: `${constant.queryPermissionDict}${id}`,
    method: 'get'
  })
}

// 查询用户权限
export function queryPermissionByUserId(id) {
  return request({
    url: `${constant.queryPermissionByUserId}${id}`,
    method: 'get'
  })
}

// 查询用户权限
export function sortOrg(params) {
  return request({
    url: `${constant.sortOrg}`,
    method: 'post',
    data: querystring(params)
  })
}

// 查询业务员列表
export function querySalesList(data) {
  return request({
    url: `${constant.querySalesList}`,
    method: 'post',
    data
  })
}

// 根据业务员id获取业务员登录token
export function getTokenByUserId(id) {
  return request({
    url: `${constant.getTokenByUserId}${id}`,
    method: 'get',
    stopIntercept: true
  })
}

// 根据业务员id获取业务员登录token（非管理员也可用）
export function getTokenBySalesId(id) {
  return request({
    url: `${constant.getTokenBySalesId}${id}`,
    method: 'get',
    stopIntercept: true
  })
}

// 通过渠道号查询渠道信息
export function getChannelInfo(channelCode) {
  return request({
    url: `${constant.getChannelInfo}${channelCode}`,
    method: 'get'
  })
}

// 通过机构id查询深保通账号信息
export function querySbtById(id) {
  return request({
    url: `${constant.querySbtById}${id}`,
    method: 'get'
  })
}

export function salesRoleCount(data) {
  return request({
    url: `${constant.salesRoleCount}`,
    method: 'post',
    data
  })
}

// 获取机构业务员
export function queryParentOrgUser(id) {
  return request({
    url: `${constant.queryOrgUser}/${id}`,
    method: 'get'
  })
}
