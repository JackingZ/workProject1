import request from '@/utils/request'
import constant from '@/api/constant'
import querystring from '@/utils/querystring'
import qs from 'qs'

// 获取保单数据
export function getPolicyByPage(params) {
  return request({
    url: constant.getPolicyByPage,
    method: 'post',
    data: params
  })
}

// 获取订单数据
export function getOrderByPage(params) {
  return request({
    url: constant.getOrderByPage,
    method: 'post',
    data: params
  })
}

// 获取保单/订单详情
export function queryPolicyById(params, isEdit = false) {
  return request({
    url: `${constant.queryPolicyById}${params}?edit=${isEdit}`,
    method: 'get'
  })
}

// 获取表单头部列表
export function getPolicyExportList(params) {
  return request({
    url: constant.getPolicyExportList,
    method: 'post',
    data: querystring(params)
  })
}

// 提交自定义头部
export function commitExportField(params) {
  return request({
    url: constant.commitExportField,
    method: 'post',
    data: params
  })
}

// 报价列表
export function queryQuoteList(params) {
  return request({
    url: constant.queryQuoteList,
    method: 'post',
    data: params
  })
}

// 获取报价详情
export function queryQuoteDetail(policyId) {
  return request({
    url: `${constant.queryQuoteDetail}${policyId}`,
    method: 'get'
  })
}

// 立即同步
export function synchronize(id) {
  return request({
    url: `${constant.synchronize}`,
    method: 'get',
    params: {
      id
    }
  })
}

// 更新保单或订单
export function updatePolicyOrOrder(params) {
  return request({
    url: constant.updatePolicyOrOrder,
    method: 'post',
    data: params
  })
}

// 获取出单工号
export function getChannelNames(params) {
  return request({
    url: constant.getChannelNames,
    method: 'post'
  })
}

// 导出保单
export function exportPolicy(params) {
  return request({
    url: constant.exportPolicy,
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

// 获取出单机构列表
export function getBelongCompanyList(sourceCode, areaCode) {
  return request({
    url: `${constant.getBelongCompanyList}${sourceCode}/${areaCode}`,
    method: 'get'
  })
}

// 获取业务员
export function getPolicySalesman(params) {
  return request({
    url: constant.policySalesmanUrl,
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取所属渠道
export function getPolicyChannelList() {
  return request({
    url: constant.getPolicyChannelList,
    method: 'get'
  })
}

// 获取保险公司
export function getPolicyCompanysList(params) {
  return request({
    url: `${constant.getPolicyCompanysList}${params}`,
    method: 'post'
  })
}

// 录入保单出单工号列表
export function getPolicyNumberList(sourceCode, companyId) {
  return request({
    url: `${constant.getPolicyNumberList}${sourceCode}/${companyId}`,
    method: 'post'
  })
}

// 录入保单获取机构列表
export function getPolicyOrgList(sourceCode) {
  return request({
    url: `${constant.getPolicyOrgList}${sourceCode}`,
    method: 'get'
  })
}

// 获取出单员
export function getPolicyOrdererList(teamId) {
  return request({
    url: constant.getPolicyOrdererList,
    method: 'post',
    data: qs.stringify({ teamId })
  })
}

// 获取车辆相关基础信息字典
export function getCarInfoList() {
  return request({
    url: constant.getCarInfoList,
    method: 'get'
  })
}

// 手动录单时调用取回空字段
export function getPolicyFiled() {
  return request({
    url: constant.getPolicyFiled,
    method: 'get'
  })
}

// 手动录单保存
export function updateOrSavePolicy(data) {
  return request({
    url: constant.updateOrSavePolicy,
    method: 'post',
    data
  })
}

// 根据渠道获取保险公司，用于保单查询条件
export function getCompanyByChannel(params) {
  return request({
    url: constant.getCompanyByChannel,
    method: 'post',
    data: qs.stringify(params)
  })
}

// 根据保险公司查询出单工号
export function getNumberByCompany(params) {
  return request({
    url: constant.getNumberByCompany,
    method: 'post',
    data: qs.stringify(params)
  })
}

// 导出全部订单
export function exportAllOrder(params) {
  return request({
    url: constant.exportAllOrder,
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}
