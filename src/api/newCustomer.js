
/**
 *Created by Henryr on 2018/12/8.
 */
import request from '@/utils/request'
import constant from '@/api/constant'
import qs from 'qs'

// 查询详情中的跟踪信息
export function addFollowUpInfo(params) {
  return request({
    url: constant.newCustomerFollowUp,
    // url: 'http://10.1.1.216:18069/oauth/customer-follow-up',
    data: params,
    method: 'post'
  })
}
// 查询客户状态
export function queryCustomerStatus(typecode) {
  return request({
    url: constant.queryCustomerStatus + '?typeCode=' + typecode,
    method: 'get'
  })
}
// 添加客户信息
export function addCustomerInfo(params) {
  return request({
    url: constant.addCustomerInfo,
    // url: 'http://10.1.1.216:18069/oauth/customer',
    data: params,
    method: 'post'
  })
}

// 添加客户信息
export function queryCustomerDetail(id) {
  return request({
    url: constant.queryCustomerDetail + id,
    // url: 'http://10.1.1.216:18069/oauth/customer-detail/' + id,
    method: 'get'
  })
}

// 删除客户信息
export function deleteCustomersData(params) {
  return request({
    url: constant.deleteCustomers,
    data: params,
    method: 'delete'
  })
}
// 分配客户信息
export function updateCustomerInfo(params) {
  return request({
    url: constant.updateCustomer,
    data: params,
    method: 'patch'
  })
}
// 客户管理分页查询
export function queryCustomerData(params) {
  return request({
    url: constant.queryCustomerPage,
    data: params,
    method: 'post'
  })
}
// 查询客户业务员
export function queryCustomerSaleman(params) {
  return request({
    url: constant.queryCustomerSaleman,
    data: params,
    method: 'post'
  })
}
// 查询未分配的客户id
export function queryNoDistriCustomers(params) {
  return request({
    url: constant.queryNoDistriCustomer,
    data: params,
    method: 'post'
  })
}
// 根据客户id查询机构树
export function getCustomerOrgan() {
  return request({
    url: constant.queryCustomerOrgan,
    method: 'get'
  })
}

// 根据orderId查询客户记录
export function getQuoteRecord(orderId) {
  return request({
    url: constant.getCustomerQuoteRecord + orderId,
    method: 'get'
  })
}
// 分配管理员
export function distributeCustomers(params) {
  return request({
    url: constant.distributeCustomers,
    data: params,
    method: 'PATCH'
  })
}
// 刷新续保
export function refreshCustomerRenew(params) {
  return request({
    url: constant.refreshCustomerRenew,
    data: qs.stringify(params),
    method: 'post'
  })
}

// 获取分享报价的数据
export function queryQuoteShareData(params) {
  return request({
    url: constant.getQuoteShareData,
    data: qs.stringify(params),
    method: 'post'
  })
}

//  查询往年投保
export function getPreviInsureData(params) {
  return request({
    url: constant.getPreviInsure,
    data: qs.stringify(params),
    method: 'post'
  })
}

//  查询往年投保险种详情
export function getPreviInsureRiskData(id) {
  return request({
    url: constant.getPreviInsureRisk + id,
    // headers: {
    //   Authorization: 'none'
    // },
    method: 'get'
  })
}
// 客户模拟登录获取token
export function getCustomerTokenByUserId(id) {
  return request({
    url: constant.getCustomerTokenByUserId + id,
    method: 'get'
  })
}
