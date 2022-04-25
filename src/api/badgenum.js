/**
 * Create ZackJack by 2018-9-23
 */
import request from '@/utils/request'
import constant from '@/api/constant'
// 获取渠道
export function getChannelEffective() {
  return request({
    url: `${constant.channelEffective}?cacheKey=channelQueryAllOfEffective`,
    method: 'get'
  })
}
// 所属机构
export function getOrgData(params) {
  return request({
    url: constant.bindChannel,
    method: 'post',
    data: params
  })
}
// 所属机构
export function getcompanyEffective() {
  return request({
    url: constant.companyEffective,
    method: 'get'
  })
}
// 绑定机构
export function getBindChannel(params) {
  return request({
    url: constant.bindChannel,
    method: 'post',
    data: params
  })
}
// 获取绑定机构id
export function getBindChannelId(params) {
  return request({
    url: constant.bindChannelId,
    method: 'post',
    data: params
  })
}
// 绑定机构获取父级
export function getBindChannelParents(params) {
  return request({
    url: constant.bindChannelParents,
    method: 'post',
    data: params
  })
}
// 绑定机构确定更改
export function getBindChannelInsert(params) {
  return request({
    url: constant.bindChannelInsert,
    method: 'post',
    data: params
  })
}
// 获取保监地区列表
export function getPolicyAreasData() {
  return request({
    url: constant.getPolicyAreas,
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

// 获取列表
export function getBadgeList(params) {
  return request({
    url: constant.insureBadgeList,
    method: 'post',
    data: params
  })
}

// 新增列表
export function setBadgeInsert(params) {
  return request({
    url: constant.badgeInsert,
    method: 'post',
    data: params
  })
}

// 编辑列表
export function setBadgeUpdate(params) {
  return request({
    url: constant.badgeUpdate,
    method: 'post',
    data: params
  })
}

// 编辑信息
export function getinsureCompanyInfo(params) {
  return request({
    url: constant.insureCompanyInfo,
    method: 'post',
    data: params
  })
}
// 删除列表
export function setBadgeDelete(params) {
  return request({
    url: constant.badgeDelete,
    method: 'post',
    data: params
  })
}

// 删除列表前
export function setBadgeDelEffect(id) {
  return request({
    url: `${constant.badgeDelEffect}/${id}`,
    method: 'get'
  })
}

// 工号关
export function setBadgeDisable(params) {
  return request({
    url: constant.badgeDisable,
    method: 'post',
    data: params
  })
}
// 工号开
export function setBadgeRecovery(params) {
  return request({
    url: constant.badgeRecovery,
    method: 'post',
    data: params
  })
}
