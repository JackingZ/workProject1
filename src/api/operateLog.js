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
// 获取操作日志
export function getOperateLog(params) {
  return request({
    url: constant.getSysLogs,
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
