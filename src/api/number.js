/**
 *Created by Jhonor on 2018/9/8.
 */
import request from '@/utils/request'
import constant from '@/api/constant'
import qs from 'qs'

const BASE_URL = '//localhost:8099'
const enableLocalMock = false

// 获取工号列表
export function getNumberList(params) {
  return request({
    url: constant.emplnumber,
    method: 'post',
    data: params
  })
}

// 工号开关
export function setNumberStatus(params) {
  return request({
    url: constant.switchStatus,
    method: 'post',
    data: params
  })
}

// 所属渠道下拉选择
export function getAllChannelData() {
  return request({
    url: constant.getAllChannel,
    method: 'get'
  })
}

// 所属机构下拉选择
export function getOrgData(params) {
  return request({
    url: constant.getAllOrg,
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

// 删除工号
export function deleteNumber(params) {
  return request({
    url: constant.deleteById,
    method: 'post',
    data: {
      channelId: params
    }
  })
}

// 获取工号关联渠道
export function getChannelsById(params) {
  return request({
    url: `${constant.getChannelsById}${params}`,
    method: 'get'
  })
}

//  获取工号权限
export function getPermissions() {
  return request({
    url: constant.getPermissions,
    method: 'get'
  })
}

// 保存绑定机构工号信息
export function bindingAllSource(channelId, channels
) {
  return request({
    url: constant.bindingAllSource,
    method: 'post',
    data: {
      channelId,
      channels
    }
  })
}

// 查询机构
export function getCompanyByArea(sourceId, areaCode, channelId, token, bindTypeArrs) {
  return request({
    url: constant.getCompanyByArea,
    method: 'post',
    data: {
      sourceId,
      areaCode,
      channelId,
      token,
      bindTypeArrs
    }
  })
}

//  绑定机构
export function bindingInstitution(channelId, comcodes, companyId, source_code, areaCode, bindType) {
  return request({
    url: constant.bindingInstitution,
    method: 'post',
    data: {
      channelId,
      comcodes,
      companyId,
      source_code,
      areaCode,
      bindType
    }
  })
}

// 查询保险公司属性
export function getFieldByCompanyId(params) {
  return request({
    url: constant.getFieldByCompanyId,
    method: 'post',
    data: {
      companyId: params
    }
  })
}

// 新增或更新工号
export function saveOrUpdate(params) {
  return request({
    url: constant.saveOrUpdate,
    method: 'post',
    data: params
  })
}

// 获取工号详情
export function getDetailsById(params) {
  return request({
    url: constant.getDetailsById,
    method: 'post',
    data: {
      channelId: params
    }
  })
}

// 查询某类字典数据
export function mGetDictionary(params) {
  return request({
    url: `${constant.mGetDictionary}?typeCode=${params}`,
    method: 'get'
  })
}

// 获取渠道
export function queryWithPage(params) {
  return request({
    url: constant.queryWithPage,
    method: 'post',
    data: params
  })
}

// 提交渠道充值
export function mCharge(params) {
  return request({
    url: constant.mCharge,
    method: 'post',
    data: params
  })
}

// 禁用渠道
export function closeChannel(params) {
  return request({
    url: `${constant.closeChannel}${params}`,
    method: 'post'
  })
}

// 开启渠道
export function openChannel(params) {
  return request({
    url: `${constant.openChannel}${params}`,
    method: 'post'
  })
}

// 查询前端配置
export function queryWebConfig(params) {
  return request({
    url: `${constant.queryWebConfig}${params}`,
    method: 'get'
  })
}

// 提交渠道添加配置
export function mInsertList(params) {
  return request({
    url: constant.mInsertList,
    method: 'post',
    data: params
  })
}

// 查询渠道和管理员
export function channelLinked(params) {
  return request({
    url: `${constant.channelLinked}${params}`,
    method: 'get'
  })
}

// 更新渠道和管理员
export function updateChannelLinked(params) {
  return request({
    url: constant.updateChannelLinked,
    method: 'post',
    data: params
  })
}

// 添加渠道和管理员
export function insertChannelLinked(params) {
  return request({
    url: constant.insertChannelLinked,
    method: 'post',
    data: params
  })
}

// 检查渠道编码是否冲突
export function checkChannelCode(params) {
  return request({
    url: constant.checkChannelCode,
    method: 'post',
    data: {
      code: params
    }
  })
}

// 获取用户手机验证码
export function getFindPassCode(params) {
  return request({
    url: `${constant.getFindPassCode}${params}`,
    method: 'get'
  })
}

// 提交找回密码
export function subFindPass(params) {
  return request({
    url: constant.subFindPass,
    method: 'post',
    data: params
  })
}

// 获取公司名称
export function getSynCompany(params) {
  return request({
    url: constant.getSynCompany,
    method: 'post',
    data: params
  })
}

// 查询地区
export function queryAreaList() {
  return request({
    url: constant.queryAreaList,
    method: 'get'
  })
}

// 查询省市区
export function queryAreaAll() {
  return request({
    url: constant.queryAreaAll,
    method: 'get'
  })
}

// 根据渠道查询省市区
export function queryAreaByChannel(code) {
  return request({
    url: `${constant.queryAreaByChannel}${code}`,
    method: 'get'
  })
}

// 获取工号操作类型，操作对象
export function getOperatorType(params) {
  return request({
    url: `${constant.getOperatorType}?channelId=${params}`,
    method: 'get'
  })
}

// 分页查询操作日志
export function getLogsByPage(params) {
  return request({
    url: constant.getLogsByPage,
    method: 'post',
    data: params
  })
}

// 查询渠道拥有权限的树形数据
export function queryByChannelCode(params) {
  return request({
    url: `${constant.queryByChannelCode}${params}`,
    method: 'get'
  })
}

// 查询渠道可过滤团队
export function queryAuthChannel(params) {
  return request({
    url: constant.queryAuthChannel,
    method: 'post',
    data: {
      sourceCode: params
    }
  })
}

export function getCompanyStat(params) {
  const prod = `${constant.getCompanyStat}`
  const test = BASE_URL + '/stat/company/list'
  const url = process.env.NODE_ENV === 'development' && enableLocalMock ? test : prod
  return request({
    url: url,
    method: 'post',
    data: qs.stringify(params)
  })
}

// 导出保险公司业绩
export function companyExoprtstat(params) {
  return request({
    url: constant.companyExoprtstat,
    method: 'post',
    data: qs.stringify(params),
    responseType: 'blob'
  })
}

// 获取业务员业绩分布
export function getSaleStat(params) {
  const prod = `${constant.getSaleStat}`
  const test = BASE_URL + '/stat/user/list'
  const url = process.env.NODE_ENV === 'development' && enableLocalMock ? test : prod
  return request({
    url: url,
    method: 'post',
    data: qs.stringify(params)
  })
}

// 业务员业绩导出
export function userExportstat(params) {
  return request({
    url: constant.userExportstat,
    method: 'post',
    data: qs.stringify(params),
    responseType: 'blob'
  })
}

// 首页出单波动
export function homeCustomer(params) {
  return request({
    url: `${constant.homeCustomer}`,
    method: 'post',
    data: qs.stringify(params)
  })
}

// 业绩分析
export function getPerformance(params) {
  return request({
    url: constant.getPerformance,
    method: 'post',
    data: qs.stringify(params)
  })
}

// 查询车商渠道默认权限
export function dealerDefaultPermission() {
  return request({
    url: constant.dealerDefaultPermission,
    method: 'get'
  })
}

// 获取登陆地址
export function getLoginAddress(companyId, address) {
  return request({
    url: `${constant.getLoginAddress}${companyId}`,
    method: 'post',
    data: address
  })
}

// 获取代理地址和请求地址列表
export function getReqUrl(params) {
  return request({
    url: constant.getReqUrl,
    method: 'post',
    data: params
  })
}

// 添加工号时获取空值字段
export function getNumberAddFiled() {
  return request({
    url: constant.getNumberAddFiled,
    method: 'get'
  })
}

// 添加渠道获取默认权限
export function getDefaultPermissions(type) {
  return request({
    url: `${constant.getDefaultPermissions}${type}`,
    method: 'get'
  })
}

// 获取保险公司
export function queryCompanysList() {
  return request({
    url: constant.queryCompanysList,
    method: 'get'
  })
}

// 根据渠道编码获取保险公司
export function queryCompanysListByChannelCode(channelCode) {
  return request({
    url: `${constant.queryCompanysListByChannelCode}${channelCode}`,
    method: 'get'
  })
}

// 获取保险公司编码
export function getSynCompanyList(company, sourceId) {
  return request({
    url: constant.getSynCompanyList,
    method: 'post',
    data: {
      company,
      sourceId
    }
  })
}

// 获取请求地址代理地址登陆地址及自定义字段
export function getReqUrlList(areaCodeArrs = [], companyId = '', sourceId = '', type = 3) {
  return request({
    url: constant.getReqUrlList,
    method: 'post',
    data: {
      areaCodeArrs,
      companyId,
      sourceId,
      type
    }
  })
}

// 新增或更新工号
export function saveOrupdateJobNumber(params) {
  return request({
    url: constant.saveOrupdateJobNumber,
    method: 'post',
    data: params,
    stopIntercept: true
  })
}

// 获取工号详情
export function getJobNumberById(id) {
  return request({
    url: `${constant.getJobNumberById}${id}`,
    method: 'get'
  })
}

// 获取编辑工号所需的字典
export function getJobNumberDictionary(id) {
  return request({
    url: `${constant.getJobNumberDictionary}${id}`,
    method: 'get'
  })
}

export function queryBusinessLeaderList(channelCode) {
  return request({
    url: `${constant.queryBusinessLeaderList}?channelCode=${channelCode}`,
    method: 'get'
  })
}

// 根据所属机构查询地区
export function queryAreaByOrg(id) {
  return request({
    url: `${constant.queryAreaByOrg}${id}`,
    method: 'get'
  })
}

// 根据所属机构和渠道查询地区
export function queryAreaByOrgAndChannel(id, channel) {
  return request({
    url: `${constant.queryAreaByOrgAndChannel}${id}/${channel}`,
    method: 'get'
  })
}

// 批量操作工号
export function batchNumber(data) {
  return request({
    url: constant.batchNumber,
    method: 'post',
    data
  })
}
