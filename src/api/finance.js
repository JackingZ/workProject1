
import request from '@/utils/request'
import constant from '@/api/constant'

// 获取所有财务结算保险公司
export function financeCompany() {
  return request({
    url: `${constant.financeCompany}`,
    method: 'get'
  })
}

// 获取工号列表
export function queryByBindingCompanys(data) {
  return request({
    url: `${constant.queryByBindingCompanys}`,
    method: 'post',
    data
  })
}

// 获取线下工号列表
export function offLineBindCompany(data) {
  return request({
    url: `${constant.offLineBindCompany}`,
    method: 'post',
    data
  })
}

// 结算列表
export function querySettlementList(data) {
  return request({
    url: `${constant.querySettlementList}`,
    method: 'post',
    data
  })
}

// 统计佣金
export function queryTotalFormality(data) {
  return request({
    url: `${constant.queryTotalFormality}`,
    method: 'post',
    data
  })
}

// 结算导出
export function settlementExport(data) {
  return request({
    url: `${constant.settlementExport}`,
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 结算导出
export function settlementInsert(data) {
  return request({
    url: `${constant.settlementInsert}`,
    method: 'put',
    data
  })
}

// 通过id查询结算记录
export function querySettlementRecordById(params) {
  return request({
    url: `${constant.querySettlementRecordById}`,
    method: 'get',
    params
  })
}

// 上游批量结算
export function upBatchSettlement(data, params) {
  return request({
    url: `${constant.upBatchSettlement}`,
    method: 'post',
    data,
    params
  })
}

// 获取上游手续费结算记录
export function querySettlementRecord(params) {
  return request({
    url: constant.querySettlementRecord,
    method: 'post',
    data: params
  })
}

// 撤销手续费结算记录
export function revokeSettlementRecord(params) {
  return request({
    url: `${constant.revokeSettlementRecord}${params}`,
    method: 'post'
  })
}

// 导出结算记录excel表
export function exportRecordExcel(params) {
  return request({
    url: constant.exportRecordExcel,
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

// 查询结算明细
export function querySettlementDetail(params) {
  return request({
    url: constant.querySettlementDetail,
    method: 'post',
    data: params
  })
}

// 查询结算明细总额
export function queryStatistics(params) {
  return request({
    url: `${constant.queryStatistics}${params}`,
    method: 'get'
  })
}

// 导出结算明细弹窗excel
export function exportBillExcel(params) {
  return request({
    url: `${constant.exportBillExcel}${params}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 删除结算记录
export function deleteRecord(params) {
  return request({
    url: `${constant.deleteRecord}${params}`,
    method: 'delete'
  })
}

// 非上游批量结算
export function batchSettlement(data, params) {
  return request({
    url: `${constant.batchSettlement}`,
    method: 'post',
    data,
    params
  })
}
