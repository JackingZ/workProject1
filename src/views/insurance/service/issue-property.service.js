import request from '@/utils/request'
import constant from '@/api/constant'

// 出单中心属性
export function issueProperty(code) {
  return request({
    url: `${constant.issueProperty}${code}`,
    method: 'get'
  })
}

export const IssuePropertyTypeCodeEnum = {
  inject: '00001', // 脚本注入页面
  insureUrl: '00002', // 保险公司页面
  carKind: '00003', // 车辆种类
  carProperty: '00004', // 车辆性质
  carUseProperty: '00005', // 车辆使用性质
  identityType: '00006', // 证件类型
  interfaceType: '00007', // 日志接口分类
  kernel: '00008', // 日志接口分类
  sex: '00009', // 性别
  feedbackType: '00010', // 反馈类型
  riskCode: '00011', // 险种编码
  productCodeType: '00012', // 产品编码
  insureCompanySource: '00013', // 保险公司
  policyStatus: '00014', // 保单状态
  insureCompanyLevel: '00015', // 保险公司级别
  insureCompanyScript: '00016', // 保险公司脚本
  companyRole: '00017', // 机构权限
  browserConfig: '00018', // 浏览器配置
  channelMap: '00019', // 渠道映射
  browserCompatibility: '00020', // 浏览器兼容性地址
  injectIfram: '00021', // 在Ifram 脚本注入
  browserInjectPac: '00022' // 在新打开的窗口 注入pac
}

/**
 * 根据类型查询属性
 */
export function getProperty(type) {
  return issueProperty(type)
}
