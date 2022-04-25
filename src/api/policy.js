/**
 * Create ZackJack by 2018-9-19
 */
import request from '@/utils/request'
import constant from '@/api/constant'

// 获取所有机构
export function getChannelEffective() {
  return request({
    url: `${constant.channelEffective}?cacheKey=channelQueryAllOfEffective`,
    method: 'get'
  })
}
// 获取机构公司
export function getPolicyEffective(params) {
  return request({
    url: constant.policyEffective,
    method: 'post',
    data: params
  })
}
// 获取团队
export function getPolicyTeamEffective(params) {
  return request({
    url: constant.policyTeamEffective,
    method: 'post',
    data: params
  })
}
// 获取业务员
export function getPolicySalesEffective(params) {
  return request({
    url: constant.policySalesEffective,
    method: 'post',
    data: params
  })
}

// 获取保险公司
export function getPolicyAllCompany() {
  return request({
    url: constant.policyAllCompany,
    method: 'get'
  })
}
// 获取政策视角
export function getPolicyInsureView(params) {
  return request({
    url: `${constant.policyInsureView}/${params}`,
    method: 'get'
  })
}

// 获取政策执行公司
export function getPolicyInsureCompany() {
  return request({
    url: constant.policyInsureCompany,
    method: 'get'
  })
}

// 选择政策公司
export function selectPolicy(params) {
  return request({
    url: constant.policySelect,
    method: 'post',
    data: params
  })
}
// 政策可见树
export function policyParentsTree(id, type) {
  return request({
    url: `${constant.policyParentsTree}?companyId=${id}&filterType=${type}`,
    method: 'post'
  })
}
// 政策可见公司
export function policySeeCompany(params) {
  return request({
    url: `${constant.policySeeCompany}/${params}`,
    method: 'get'
  })
}
// 政策可见确定
export function policySee(params) {
  return request({
    url: constant.policySee,
    method: 'post',
    data: params
  })
}
// 查询政策公司
export function queryPolicy(params) {
  return request({
    url: `${constant.policyQuery}/${params}`,
    method: 'get'
  })
}

// 查询子政策公司
export function policySubID(cid, id) {
  return request({
    url: `${constant.policySubID}?companyId=${cid}&id=${id}`,
    method: 'get'
  })
}

// 查询子政策信息
export function policySubInfo(id, cid) {
  return request({
    url: `${constant.policySubInfo}?id=${id}&companyId=${cid}`,
    method: 'POST'
  })
}

// 新增政策公司
export function policyAddCompany(params) {
  return request({
    url: constant.policyAddCompany,
    method: 'post',
    data: params
  })
}
// 新增政策公司
export function policyAddBelongCompany(params) {
  return request({
    url: constant.policyAddBelongCompany,
    method: 'post',
    data: params
  })
}

// 政策时间校验
export function policyExistTime(params) {
  return request({
    url: constant.policyExistTime,
    method: 'post',
    stopIntercept: true,
    data: params
  })
}

// 新增政策确定
export function policyAdd(params) {
  return request({
    url: constant.policyAdd,
    method: 'post',
    data: params
  })
}
// 新增政策复制
export function policyCopy(params) {
  return request({
    url: constant.policyCopy,
    method: 'post',
    data: params
  })
}
// 新增政策编辑
export function policyEdit(params) {
  return request({
    url: constant.policyEdit,
    method: 'post',
    data: params
  })
}
// 新增政策删除
export function policyDelete(params) {
  return request({
    url: `${constant.policyDelete}/${params}`,
    method: 'DELETE'
  })
}
// 政策状态
export function policyStatus() {
  return request({
    url: constant.policyStatus,
    method: 'get'
  })
}
// 子政策表单选项
export function policyform() {
  return request({
    url: constant.policyform,
    method: 'get'
  })
}
// 子政策表单费率
export function policyRates() {
  return request({
    url: constant.policyRates,
    method: 'get'
  })
}
// 子政策新增确定
export function subPolicyInsert(params) {
  return request({
    url: constant.subPolicyInsert,
    method: 'post',
    data: params
  })
}
// 子政策编辑确定
export function subPolicyUpdate(params) {
  return request({
    url: constant.subPolicyUpdate,
    method: 'post',
    data: params
  })
}
// 子政策编辑下机构团队id对应的信息
export function subPolicyCompanyId(params) {
  return request({
    url: constant.subPolicyCompanyId,
    method: 'post',
    data: params
  })
}
// 子政策编辑信息
export function subPolicyEditInfo(params) {
  return request({
    url: `${constant.subPolicyEditInfo}/${params}`,
    method: 'get'
  })
}
// 子政策编辑费率
export function subPolicyEditRates(sId, cId) {
  return request({
    url: `${constant.subPolicyEditRates}?subStrategyId=${sId}&companyId=${cId}`,
    method: 'post'
  })
}
// 子政策删除确定
export function subPolicyDelete(params) {
  return request({
    url: `${constant.subPolicyDelete}/${params}`,
    method: 'DELETE'
  })
}
// 删除机构佣金政策
export function deleteStrategyRate(id) {
  return request({
    url: `${constant.deleteStrategyRate}/${id}`,
    method: 'DELETE'
  })
}

// 删除政策可见
export function deleteStrategySee(id) {
  return request({
    url: `${constant.deleteStrategySee}/${id}`,
    method: 'DELETE'
  })
}

// 查询权限内的所有渠道
export function getCurrentChannel() {
  return request({
    url: `${constant.getCurrentChannel}`,
    method: 'get'
  })
}

// 查询权限内机构节点
export function postCurrentOrgan(params) {
  return request({
    url: `${constant.postCurrentOrgan}`,
    method: 'post',
    data: params
  })
}

// 获取业务员账号列表
export function postSalesmanID(params) {
  return request({
    url: `${constant.postSalesmanID}`,
    method: 'post',
    data: params
  })
}
// 获取实际现有业务员账号列表
export function postRealSalesmanID(params) {
  return request({
    url: `${constant.postRealSalesmanID}`,
    method: 'post',
    data: params
  })
}
