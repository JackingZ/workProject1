/**
 *Created by Jhonor on 2018/9/8.
 */
import request from '@/utils/request'
import constant from '@/api/constant'
// import qs from 'qs'

// 所属渠道下拉选择
export function getAllChannelData() {
  return request({
    url: constant.getAllChannel,
    method: 'get'
  })
}
// 获取保险公司
export function getInfoConfigData(params) {
  return request({
    url: constant.getInfoConfig,
    data: params,
    method: 'post'
  })
}
// 获取编码类型列表
export function getTypeCode() {
  return request({
    url: constant.getTypeCodeUrl,
    method: 'post'
  })
}
// 新增配置信息
export function insetConfig(params) {
  return request({
    url: constant.insertInfoConfig,
    data: params,
    method: 'post'
  })
}
// 编辑配置信息
export function updateConfig(params) {
  return request({
    url: constant.updateInfoConfig,
    data: params,
    method: 'post'
  })
}
// 编辑配置信息
export function deleteConfig(params) {
  return request({
    url: constant.deleteInfoConfig,
    data: params,
    method: 'post'
  })
}
