import request from '@/utils/request'
import constant from '@/api/constant'
import qs from 'qs'

// 所属渠道下拉选择
export function getInformChannellist() {
  return request({
    url: constant.getInformChannel,
    method: 'post'
  })
}

// 获取保险公司
export function getCompanysData(params) {
  return request({
    url: constant.getInformCompany,
    method: 'post',
    data: qs.stringify(params)
  })
}
// 获取所属机构
export function getOrganData(params) {
  return request({
    url: constant.getInformOrgan,
    method: 'post',
    data: qs.stringify(params)
  })
}
// 添加通知信息
export function addInformInfo(params) {
  return request({
    url: constant.addInformData,
    method: 'post',
    data: qs.stringify(params)
  })
}
// 添加通知详情
export function getInformDetail(params) {
  return request({
    url: constant.getInformDetail,
    method: 'post',
    data: qs.stringify(params)
  })
}
// 获取通知列表
export function getInformData(params) {
  return request({
    url: constant.getInformlist,
    method: 'post',
    data: params
  })
}
// 通过ID查询日志信息
export function getOperateLogById(id) {
  return request({
    url: constant.getSysLogsById + id,
    method: 'get'
  })
}
