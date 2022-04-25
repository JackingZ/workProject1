/**
 *Created by Jhonor on 2018/9/8.
 */
import request from '@/utils/request'
import constant from '@/api/constant'
import qs from 'qs'

// 获取列表数据
export function getFeedbackData(params) {
  return request({
    url: constant.getFeedbackList,
    method: 'post',
    data: qs.stringify(params)
  })
}
// 查看反馈数据详情
export function queryFeedbackDetail(params) {
  return request({
    url: constant.queryFeedbackById,
    method: 'post',
    data: qs.stringify(params)
  })
}
// 提交编辑数据
export function updateFeedbackData(params) {
  return request({
    url: constant.updateFeedback,
    method: 'post',
    data: qs.stringify(params)
  })
}
