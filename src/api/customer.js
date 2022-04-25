/**
 * Create ZackJack by 2018-11-27
 */
import request from '@/utils/request'
import constant from '@/api/constant'
// 保险公司
export function getInsuredCompany(params) {
  return request({
    url: constant.getInsuredCompany,
    method: 'post',
    data: params
  })
}
// 获取管理员组织机构树
export function getCustomerCarStoreEffective(id) {
  return request({
    url: `${constant.customerCarStoreEffective}/${id}`,
    method: 'get'
  })
}
// 获取管理员分配状态
export function getCustomerConfig() {
  return request({
    url: constant.customerGetConfig,
    method: 'post'
  })
}
// 设置管理员分配状态
export function setCustomerConfig(num) {
  return request({
    url: `${constant.customerSetConfig}/${num}`,
    method: 'post'
  })
}
// 获取列表
export function getCustomerTable(params) {
  return request({
    url: constant.customerPage,
    method: 'post',
    data: params
  })
}
// 编辑时查询客户基本信息
export function getCustomerSelectId(id) {
  return request({
    url: `${constant.customerSelectId}/${id}`,
    method: 'post'
  })
}
// 删除客户
export function setCustomerDeleteId(id) {
  return request({
    url: `${constant.customerDeleteId}/${id}`,
    method: 'post'
  })
}
// 新增或修改客户
export function setCustomerEdit(params) {
  return request({
    url: constant.customerInsertOrUpdate,
    method: 'post',
    data: params
  })
}
// 新增或修改客户和照片
export function setCustomerEditImgs(params) {
  return request({
    url: constant.customerInsertOrUpdateImgs,
    method: 'post',
    data: params
  })
}
// 车型
export function getCustomerCarType(params) {
  return request({
    url: constant.customerCarType,
    method: 'post',
    data: params
  })
}
// 交管车辆类型
export function getControlCarType(params) {
  return request({
    url: constant.getbaseInfo,
    method: 'get',
    data: params
  })
}
// 客户详情页面
export function getCustomerDetailById(id) {
  return request({
    url: `${constant.customerDetailById}/${id}`,
    method: 'post'
  })
}
// 报价详情记录
export function getQuoteInfo(params) {
  return request({
    url: constant.getQuoteInfo,
    method: 'post',
    data: params
  })
}
// 分配中查询续保专员
export function getUsersOnCondition(params) {
  return request({
    url: constant.getUsersOnCondition,
    method: 'post',
    data: params
  })
}
// 分配续保员提交
export function getCustomerFollowSaler(params) {
  return request({
    url: constant.customerFollowSaler,
    method: 'post',
    data: params
  })
}
// 续保刷新
export function setCustomerUpdateInsure(params) {
  return request({
    url: constant.customerUpdateInsure,
    method: 'post',
    data: params
  })
}
// 导出
export function getCustomerExport(params) {
  return request({
    url: constant.customerExport,
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
// 导入
export function getCustomerImport(params) {
  return request({
    url: constant.customerImport,
    method: 'post',
    data: params
  })
}
// 进站记录列表
export function getCustomerEnterPage(params) {
  return request({
    url: constant.customerEnterPage,
    method: 'post',
    data: params
  })
}
// 跟进状态更新
export function getCustomerEnterState(params) {
  return request({
    url: constant.customerEnterState,
    method: 'post',
    data: params
  })
}
// 撤回出单
export function getCustomerRecallInsure(params) {
  return request({
    url: constant.customerRecallInsure,
    method: 'post',
    data: params
  })
}
// 身份证识别信息
export function getIdInfo(params) {
  return request({
    url: constant.idUrl,
    method: 'post',
    data: params
  })
}
// 行驶证识别信息
export function getLicenseInfo(params) {
  return request({
    url: constant.licenseUrl,
    method: 'post',
    data: params
  })
}
// 保存身份证行驶证照片
export function setIdLicenseImg(params) {
  return request({
    url: constant.idlicenseUrl,
    method: 'post',
    data: params
  })
}

// 年度数据
export function getStatisticYearData(params) {
  return request({
    url: constant.carStoreYearData,
    method: 'post',
    data: params
  })
}
// 销售漏斗
export function getStatisticSalesFunnel(params) {
  return request({
    url: constant.carStoreSalesFunnel,
    method: 'post',
    data: params
  })
}
// 保费
export function getStatisticInsureFee(params) {
  return request({
    url: constant.carStoreInsureFee,
    method: 'post',
    data: params
  })
}
// 新客户
export function getStatisticNewCustomer(params) {
  return request({
    url: constant.carStoreNewCustomer,
    method: 'post',
    data: params
  })
}
// 提前投保天数
export function getStatisticInsuranceRates(params) {
  return request({
    url: constant.carStoreInsuranceRates,
    method: 'post',
    data: params
  })
}
// 进站统计
export function getStatisticArrivalVehicle(params) {
  return request({
    url: constant.carStoreArrivalVehicle,
    method: 'post',
    data: params
  })
}
// 战败统计
export function getStatisticCustomerFail(params) {
  return request({
    url: constant.carStoreCustomerFail,
    method: 'post',
    data: params
  })
}
// 详细数据
export function getStatisticDetailPreview(params) {
  return request({
    url: constant.carStoreDetailPreview,
    method: 'post',
    data: params
  })
}
