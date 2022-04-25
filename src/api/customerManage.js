/**
 *Created by Henry on 2019/4/16
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
export function getCompanysData() {
  return request({
    url: constant.getCompanys,
    method: 'get'
  })
}
