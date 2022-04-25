/**
 * Create Zengcheng by 2018-11-26
 */
import request from '@/utils/request'
import constant from '@/api/constant'
import qs from 'qs'
// 保险公司下拉
export function policyBelongCompany(params) {
  return request({
    url: constant.getCompanyData,
    method: 'post',
    data: params
  })
}
// 根据公司获取工号列表
export function getChannelListData(params, companyId) {
  return request({
    url: `${constant.getCompanyData}/${companyId}`,
    method: 'post',
    data: params
  })
}
// 获取所属团队的树形菜单
export function getorganization_tree(params) {
  return request({
    url: constant.getorganization_tree,
    method: 'post',
    data: params
  })
}
// 获取业务员
export function getquerySalesByCompanyId(treeid) {
  return request({
    url: `${constant.querySalesByCompanyId}/${treeid}`, // 所属团队的id给
    method: 'post'
  })
}
// 获取表单下拉明细（保险列表，车辆列表等）
export function getbaseInfo(params) {
  return request({
    url: constant.getbaseInfo,
    method: 'get',
    data: params
  })
}
// 验证保单是否存在（是否有相同保单情况）
export function YZpolicyExist(params) {
  return request({
    url: constant.policyExist,
    method: 'post',
    data: params
  })
}
// 保单提交
export function getBdinput(params) {
  return request({
    url: constant.getBdinput,
    method: 'post',
    data: params
  })
}
// 单个抓单
export function putOneCapture(params) {
  return request({
    url: constant.putOneCapture,
    method: 'post',
    data: params
  })
}
// 续保专员看台数据
export function getPlateInfo(params) {
  return request({
    url: constant.getPlateInfo,
    method: 'post',
    data: params
  })
}
// 续保专员任务列表查询
export function getTaskList(params) {
  return request({
    url: constant.getTaskList,
    method: 'post',
    data: params
  })
}
// 续保专员查看报价详情
export function getQuoteInfo(params) {
  return request({
    url: constant.getQuoteInfo,
    method: 'post',
    data: params
  })
}
// 去年投保保险公司下拉
// export function getInsureCompanysList(params) {
//   return request({
//     url: constant.getInsureCompanysList,
//     method: 'post',
//     data: params
//   })
// }
// 保险公司
export function getInsuredCompany(params) {
  return request({
    url: constant.getInsuredCompany,
    method: 'post',
    data: params
  })
}
// 指派任务
export function getTaskDispatch(params) {
  return request({
    url: constant.getTaskDispatch,
    method: 'post',
    data: params
  })
}
// 获取弹窗列表
export function getUsersOnCondition(params) {
  return request({
    url: constant.getUsersOnCondition,
    method: 'post',
    data: params
  })
}
// 滚动信息列表 获取用户的未读消息总数
export function getUnreadMsgsSumByUId() {
  return request({
    url: constant.getUnreadMsgsSumByUId,
    method: 'post'
  })
}
// 滚动信息列表 分页返回
export function getMsgsPageByUId(params) {
  return request({
    url: constant.getMsgsPageByUId,
    method: 'post',
    data: params
  })
}
// 滚动信息列表
export function getMessageList(params) {
  return request({
    url: constant.getMessageList,
    method: 'post',
    data: params
  })
}
// 任务通知点击已读
export function readMsgByIds(ids) {
  return request({
    url: constant.readMsgByIds,
    method: 'post',
    data: qs.stringify({
      ids: ids
    })
  })
}
// 任务通知点击删除
export function deleteMsgByIds(ids) {
  return request({
    url: constant.deleteMsgByIds,
    method: 'post',
    data: qs.stringify({
      ids: ids
    })
  })
}
// 任务通知全部清空
export function deleteAllMsgByUId() {
  return request({
    url: constant.deleteAllMsgByUId,
    method: 'post'
  })
}
// 申请报价
export function putApplyOffer(params) {
  return request({
    url: constant.putApplyOffer,
    method: 'post',
    data: params
  })
}
// 刷新报价
export function refreshQuotation(params) {
  return request({
    url: constant.refreshQuotation,
    method: 'post',
    stopIntercept: true,
    data: params
  })
}
// 自动报价
export function autoQuotation(params) {
  return request({
    url: constant.autoQuotation,
    method: 'post',
    stopIntercept: true,
    data: params
  })
}
// 申请出单
export function putApplyInsurance(params) {
  return request({
    url: constant.putApplyInsurance,
    method: 'post',
    data: params
  })
}
// 申请出单弹窗公司列表
export function getAllOfferRecords(params) {
  return request({
    url: constant.getAllOfferRecords,
    method: 'post',
    data: params
  })
}
// 有图片上传的申请报价确定
export function newCarApplyOffer(params) {
  return request({
    url: constant.newCarApplyOffer,
    method: 'post',
    data: params
  })
}
// 进店车辆 Start
// 进店车辆看台数据
export function getVehiclePlateInfo(params) {
  return request({
    url: constant.getVehiclePlateInfo,
    method: 'post',
    data: params
  })
}
// 看台数据new
export function getArrivalPlateInfoNew(params) {
  return request({
    url: constant.getVehiclePlateInfoNew,
    method: 'post',
    data: params
  })
}
// 看台数据列表
export function getArrivalVehicleList(params) {
  return request({
    url: constant.getArrivalVehicleList,
    method: 'post',
    data: params
  })
}
// 看台数据列表new
export function getArrivalVehicleListNew(params) {
  return request({
    url: constant.getArrivalVehicleListNew,
    method: 'post',
    data: params
  })
}
// 进店车辆查看详情
export function getQuetoInfoList(params) {
  return request({
    url: constant.getQuetoInfoList,
    method: 'post',
    data: params
  })
}
// 进店车辆编辑信息
export function getLicenseNoInfo(params) {
  return request({
    url: `${constant.enterCarEditInfo}/${params}`,
    method: 'get',
    stopIntercept: true
  })
}
// 新增或修改客户和照片
export function setEnterCarEdit(params) {
  return request({
    url: constant.enterCarInsertOrUpdate,
    method: 'post',
    data: params
  })
}
// 任务分配
export function distributeRenewalPeople(params) {
  return request({
    url: constant.distributeRenewalPeople,
    method: 'post',
    data: params
  })
}
// 进店车辆的分配
export function carDistributeRenewalPeople(params) {
  return request({
    url: constant.carDistributeRenewalPeople,
    method: 'post',
    data: params
  })
}
// 出单员
// 出单员看台数据
export function getInsurePlateInfo(params) {
  return request({
    url: constant.getInsurePlateInfo,
    method: 'post',
    data: params
  })
}
// 出单员列表
export function getInsureListPage(params) {
  return request({
    url: constant.getInsureListPage,
    method: 'post',
    data: params
  })
}
// 出单员转派任务查询
export function getQuoteUserListByKey(params) {
  return request({
    url: constant.getQuoteUserListByKey,
    method: 'post',
    data: params
  })
}
// 出单员转派任务保存
export function redeployQuoteUser(params) {
  return request({
    url: constant.redeployQuoteUser,
    method: 'post',
    data: params
  })
}
// 添加报价
export function addQuoteInfo(params) {
  return request({
    url: constant.addQuoteInfo,
    method: 'post',
    data: params
  })
}
