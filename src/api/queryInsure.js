import request from '@/utils/request'
import constant from '@/api/constant'

// 批量续保 获取所有渠道
export function getChannelEffective() {
  return request({
    url: `${constant.channelEffective}?cacheKey=channelQueryAllOfEffective`,
    method: 'get'
  })
}
// 查询保单
export function getQueryInsure(params) {
  return request({
    url: constant.queryInsuranceList,
    method: 'post',
    data: params
  })
}

// 获取保监地区列表
export function getInsuranceArea(id) {
  return request({
    url: `${constant.queryInsuranceArea}/${id}`,
    method: 'get'
  })
}

// 获取保险公司
export function getInsuranceCompany(id, ad) {
  return request({
    url: `${constant.queryInsuranceCompany}/${id}/${ad}`,
    method: 'get'
  })
}

// 获取出单工号
export function getInsuranceChannel(params) {
  return request({
    url: constant.queryInsuranceChannel,
    method: 'post',
    data: params
  })
}

// 获取保单记录
export function getInsureRecord(params) {
  return request({
    url: constant.queryRecordData,
    method: 'post',
    data: params,
    stopIntercept: true
  })
}

// 查询记录
export function getRecordList(params) {
  return request({
    url: constant.queryRecordList,
    method: 'post',
    data: params
  })
}
