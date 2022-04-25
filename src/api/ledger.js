/**
 * Create ZackJack by 2018-9-21
 */
import request from '@/utils/request'
import constant from '@/api/constant'
// 获取机构
export function getCompanyEffective() {
  return request({
    url: constant.companyEffective,
    method: 'get'
  })
}
// 获取保险公司
export function getPolicyAllCompany() {
  return request({
    url: constant.policyAllCompany,
    method: 'get'
  })
}

// 获取绑定工号
export function getFinanceBindNum(params) {
  return request({
    url: constant.financeBindNum,
    method: 'post',
    data: params
  })
}
// // 获取公司工号
// export function getFinanceComNum(params) {
//   return request({
//     url: constant.financeComNum,
//     method: 'post',
//     data: params
//   })
// }
// // 获取id工号
// export function getFinanceIdsNum(params) {
//   return request({
//     url: constant.financeIdsNum,
//     method: 'post',
//     data: params
//   })
// }
// 查询数据
export function getFinancePage(params) {
  return request({
    url: constant.financePage,
    method: 'post',
    data: params
  })
}
// 导出
export function getFinanceExporte(params) {
  return request({
    url: constant.financeExporte,
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

// 编辑跳转
export function getFinanceEdit(bId, cId) {
  return request({
    url: `${constant.financeEdit}?billId=${bId}&commossionId=${cId}`,
    method: 'get'
  })
}
// 编辑确定
export function getFinanceUpdate(params) {
  return request({
    url: constant.financeUpdate,
    method: 'post',
    data: params
  })
}
// 新增确定
export function getFinanceInsert(params) {
  return request({
    url: constant.financeInsert,
    method: 'post',
    data: params
  })
}
// 编辑业务员
export function getFinanceSaler(sId) {
  return request({
    url: `${constant.financeSaler}/${sId}`,
    method: 'get'
  })
}
// 编辑单个业务员
export function getFinanceOneSaler(params) {
  return request({
    url: constant.financeOneSaler,
    method: 'post',
    data: params
  })
}
// 根据用户id查询用户和机构相关信息
export function userCompanyLinked(id) {
  return request({
    url: `${constant.userCompanyLinked}/${id}`,
    method: 'get'
  })
}
// 批量下载模板
export function getFinanceBatchDown(name) {
  return request({
    url: `${constant.financeBatchDown}/${encodeURIComponent(name)}`,
    method: 'get'
  })
}

// 对账
export function getFinanceCountExporte(params) {
  return request({
    url: constant.financeCountExporte,
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

// 修正
export function getFinanceBatchUpdate(params) {
  return request({
    url: constant.financeBatchUpdate,
    method: 'post',
    data: params
  })
}
