/**
 * Create HLJ by 2018-11-29
 */
import request from '@/utils/request'
import constant from '@/api/constant'
import qs from 'qs'
// 批量续保 获取所有渠道
export function getChannelEffective() {
  return request({
    url: `${constant.channelEffective}?cacheKey=channelQueryAllOfEffective`,
    method: 'get'
  })
}
// 批量续保 按条件分页上传文件列表
export function getBatchList(params) {
  return request({
    url: constant.getBatchList,
    method: 'post',
    data: params
  })
}
// 批量续保 下载文件
export function exportBathRenwalList(batchId) {
  return request({
    url: constant.exportBathRenwalList,
    method: 'post',
    responseType: 'blob',
    data: qs.stringify({
      batchId: batchId
    })
  })
}
// 批量续保 获取批续数
export function getTodayUplodSum(params) {
  return request({
    url: constant.getTodayUplodSum,
    method: 'post'
  })
}
// 批量续保 删除续保文件
export function deleteBatchById(id) {
  return request({
    url: constant.deleteBatchById,
    method: 'post',
    data: qs.stringify({
      id: id
    })
  })
}
// 批量续保 取消上传续保文件
export function cancelBatchByBatchNo(id) {
  return request({
    url: constant.cancelBatchByBatchNo,
    method: 'post',
    data: qs.stringify({
      batchNo: id
    })
  })
}
// 批量续保列表详情 获取批量导入查询续保的车辆列表
export function getBatchRenewalListPage(params) {
  return request({
    url: constant.getBatchRenewalListPage,
    method: 'post',
    data: params
  })
}
// 批量续保 获取机构特定批续天数
export function getRenewalStantandDay() {
  return request({
    url: constant.getRenewalData,
    method: 'get'
  })
}
// 看台 续保统计分析
export function getInsureStatistics(params) {
  return request({
    url: constant.getInsureStatistics,
    method: 'post',
    data: qs.stringify(params)
  })
}
// 看台 续保转化率分析
export function getInsureConversionRate() {
  return request({
    url: constant.getInsureConversionRate,
    method: 'post'
  })
}
// 看台 保险公司续保分析
export function getCompanyInsureConversionRate(params) {
  return request({
    url: constant.getCompanyInsureConversionRate,
    method: 'post',
    data: qs.stringify(params)
  })
}
// 看台 续保专员续保分析
export function getRenewalUserStatistics(params) {
  return request({
    url: constant.getRenewalUserStatistics,
    method: 'post',
    data: qs.stringify(params)
  })
}
// 看台 应用概述
export function getOverview() {
  return request({
    url: constant.getOverview,
    method: 'post'
  })
}
// 看台 续保转化率分析
export function getInsureConversionRateList() {
  return request({
    url: constant.getInsureConversionRateList,
    method: 'post'
  })
}
