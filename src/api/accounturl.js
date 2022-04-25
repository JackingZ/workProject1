/**
 *Created by Henryr on 2018/12/8.
 */
import request from '@/utils/request'
import constant from '@/api/constant'
import qs from 'qs'

// 所属渠道下拉选择
export function getAllChannelData() {
  return request({
    url: constant.getAllChannel,
    method: 'get'
  })
}
// 获取保险公司
export function getCompanysData() {
  return request({
    url: constant.getCompanys,
    method: 'get'
  })
}
// 获取保监地区列表
export function getPolicyAreasData() {
  return request({
    url: constant.getPolicyAreas,
    method: 'get'
  })
}
// 获取工号地址表格数据列表
export function getAcountUrl(params) {
  return request({
    url: constant.acountAddress,
    method: 'post',
    data: params
  })
}
// 删除工号地址
export function deleteAccountAddr(id) {
  return request({
    url: constant.deleteAccountAddr + '?id=' + id,
    method: 'get'
  })
}
// 新增工号地址
export function addAccountAddr(params) {
  return request({
    url: constant.addAccountAddr,
    method: 'post',
    data: params
  })
}
// 工号批量替换
export function replaceAccountAddr(params) {
  return request({
    url: constant.replaceAccountAddr,
    method: 'post',
    data: params
  })
}
// 获取工号请求代理地址
export function getAccountUrl(params) {
  return request({
    url: constant.getAccountUrl,
    method: 'post',
    data: qs.stringify(params)
  })
}
