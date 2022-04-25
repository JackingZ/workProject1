// 业务管理
export default function(BASE_URL) {
  return {
    getPolicyByPage: `${BASE_URL}/issue/policy/query_policyno_by_page`, // 获取保单列表
    getOrderByPage: `${BASE_URL}/issue/policy/query_order_by_page`, // 获取保单列表
    getPolicyExportList: `${BASE_URL}/issue/export/policy/init`, // 获取表单头部列表
    commitExportField: `${BASE_URL}/issue/export/policy/commitExportField`, // 提交自定义头部
    queryPolicyById: `${BASE_URL}/issue/policy/queryById/`, // 保单/订单查看
    queryQuoteList: `${BASE_URL}/issue/policy/query_quote_by_page`, // 报价列表
    queryQuoteDetail: `${BASE_URL}/issue/policy/quoteDetail/`, // 获取报价详情
    synchronize: `${BASE_URL}/icars/v1/nPushHeXin`, // 立即同步
    updatePolicyOrOrder: `${BASE_URL}/issue/policy/updatePolicy`, // 更新保单或订单
    getChannelNames: `${BASE_URL}/issue/channel/queryChannelNames`, // 获取出单工号
    exportPolicy: `${BASE_URL}/issue/export/policy/exportPolicy`, // 导出保单
    getBelongCompanyList: `${BASE_URL}/issue/policy/belongCompany/`, // 获取出单机构列表
    getPolicyCompanysList: `${BASE_URL}/issue/policy/input/companys/`, // 录入保单获取保险公司
    getPolicyChannelList: `${BASE_URL}/issue/crawler/sourceCode`, // 录入保单所属渠道列表
    getPolicyNumberList: `${BASE_URL}/issue/policy/input/channels/`, // 录入保单出单工号列表
    getPolicyOrgList: `${BASE_URL}/issue/crawler/tree/`, // 录入保单获取机构列表
    getPolicyOrdererList: `${BASE_URL}/issue/crawler/operator`, // 获取出单员
    getCarInfoList: `${BASE_URL}/issue/policy/vehicleDictory`, // 获取车辆相关基础信息字典
    getPolicyFiled: `${BASE_URL}/issue/policy/input/go`, // 手动录单时调用取回空字段
    updateOrSavePolicy: `${BASE_URL}/issue/policy/input/updateOrSave`, // 手动录单保存
    getCompanyByChannel: `${BASE_URL}/issue/crawler/companys`, // 根据机构获取保险公司，用于保单查询条件
    getNumberByCompany: `${BASE_URL}/issue/crawler/channels`, // 根据保险公司查询出单工号
    exportAllOrder: `${BASE_URL}/issue/policy/exportOrder`, // 导出全部订单
    queryInsuranceList: `${BASE_URL}/issue/policy/grab/getGrabPolicyList`, // 查询保单
    queryInsuranceArea: `${BASE_URL}/issue/channel/getEnableArea`, // 保单地区
    queryInsuranceCompany: `${BASE_URL}/issue/channel/getEnableCompany`, // 保险公司
    queryInsuranceChannel: `${BASE_URL}/issue/channel/getEnableIChannels`, // 出单工号
    queryRecordData: `${BASE_URL}/issue/crawler/queryPolicyList`, // 获取保单记录
    queryRecordList: `${BASE_URL}/issue/crawler/queryPolicyListByPage` // 查询记录
  }
}
