/**
 *Created by Jhonor on 2018/9/8.
 */
import request from '@/utils/request'
import constant from '@/api/constant'
import qs from 'qs'

const headers = {
  // 'Authorization': 'bearer e220c58e-ac10-4adf-bc5e-e95d3e110838'
}
// 获取保单页面所属渠道
export function getPolicyChannel() {
  return request({
    url: constant.getPolicyChannel,
    method: 'get',
    headers
  })
}
// 获取投单投保地区
export function getPolicyArea(sourceCode) {
  return request({
    url: constant.getPolicyAreaUrl + sourceCode,
    method: 'get',
    headers
  })
}
// 判断是机构网点还是代理
export function judgeNetWork(sourceCode) {
  return request({
    url: constant.judgeNetWorkUrl + sourceCode,
    method: 'get',
    headers
  })
}
// 获取机构网点
export function getPolicyNetWork(params) {
  return request({
    url: constant.policyNetWorkUrl,
    method: 'post',
    headers,
    data: qs.stringify(params)
  })
}
// 获取抓单所属机构
export function getPolicyOrgan(sourceCode) {
  return request({
    url: constant.policyOrganUrl + sourceCode + '/null',
    method: 'get',
    headers
  })
}
// 获取保险公司
export function getPolicyCompany(params) {
  return request({
    url: constant.getPolicyCompany,
    method: 'post',
    data: qs.stringify(params),
    headers
  })
}
// 获取出单工号
export function getPolicyAcount(params) {
  return request({
    url: constant.policyAccountUrl,
    method: 'post',
    data: qs.stringify(params),
    headers
  })
}
// 获取出单员
export function getPolicyOperator(params) {
  return request({
    url: constant.policyOperatorUrl,
    method: 'post',
    data: qs.stringify(params),
    headers
  })
}
// 获取业务员
export function getPolicySalesman(params) {
  return request({
    url: constant.policySalesmanUrl,
    method: 'post',
    data: qs.stringify(params),
    headers
  })
}
// 获取保单 提交
export function getPolicySubmit(params) {
  return request({
    url: constant.getPolicyListUrl,
    method: 'post',
    data: params,
    headers
  })
}
// 获取保单返回结果
export function getPolicyDetail(id) {
  return request({
    url: constant.getPolicyDetailUrl + id,
    method: 'get'
  })
}
// 抓单记录页面
export function getPolicyRecord(params) {
  return request({
    url: constant.policyRecordUrl,
    method: 'post',
    data: params
  })
}
// // 抓单记录详情页面
// export function getRecordDetail(id) {
//   return request({
//     url: constant.recordDetailUrl + id,
//     method: 'get'
//   })
// }

