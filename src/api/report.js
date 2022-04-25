import request from '@/utils/request'
import constant from '@/api/constant'
import querystring from '@/utils/querystring'

const BASE_URL = '//localhost:3333'
const enableLocalMock = false
// 统计新增业务员数量
export function countAddSale(params) {
  return request({
    url: `${constant.countAddSale}`,
    method: 'post',
    data: querystring(params)
  })
}

// 渠道数据统计
export function channelStatistics() {
  return request({
    url: `${constant.channelStatistics}`,
    method: 'get'
  })
}

// 首页环比数据
export function homeTopData(params) {
  const prod = `${constant.homeTopData}`
  const test = BASE_URL + '/homeTopData'
  const url = process.env.NODE_ENV === 'development' && enableLocalMock ? test : prod
  return request({
    url,
    method: 'post',
    data: querystring(params)
  })
}

// 首页出单波动
export function homeOrderChange(params) {
  const prod = `${constant.homeOrderChange}`
  const test = BASE_URL + '/homeOrderChange'
  const url = process.env.NODE_ENV === 'development' && enableLocalMock ? test : prod
  return request({
    url,
    method: 'post',
    data: querystring(params)
  })
}

// 首页出单波动
export function homeCustomer(params) {
  const prod = `${constant.homeCustomer}`
  const test = BASE_URL + '/homeCustomer'
  const url = process.env.NODE_ENV === 'development' && enableLocalMock ? test : prod
  return request({
    url,
    method: 'post',
    data: querystring(params)
  })
}

// 保险公司地区分布
export function homeCompany(params) {
  const prod = `${constant.homeCompany}`
  const test = BASE_URL + '/homeCompany'
  const url = process.env.NODE_ENV === 'development' && enableLocalMock ? test : prod
  return request({
    url,
    method: 'post',
    data: querystring(params)
  })
}

// 业务统计环比数据
export function businessData(params) {
  const prod = `${constant.businessData}`
  const test = BASE_URL + '/businessData'
  const url = process.env.NODE_ENV === 'development' && enableLocalMock ? test : prod
  return request({
    url,
    method: 'post',
    data: querystring(params)
  })
}

// 业务统计列表数据
export function businessListData(params) {
  const prod = `${constant.businessListData}`
  const test = BASE_URL + '/businessListData'
  const url = process.env.NODE_ENV === 'development' && enableLocalMock ? test : prod
  return request({
    url,
    method: 'post',
    data: querystring(params)
  })
}

// 移动出单转化漏斗
export function funnelData(params) {
  const prod = `${constant.funnelData}`
  const test = BASE_URL + '/funnelData'
  const url = process.env.NODE_ENV === 'development' && enableLocalMock ? test : prod
  return request({
    url,
    method: 'post',
    data: querystring(params)
  })
}

// 业务统计导出
export function businessExport(params) {
  return request({
    url: constant.businessExport,
    method: 'post',
    responseType: 'blob',
    data: querystring(params)
  })
}
