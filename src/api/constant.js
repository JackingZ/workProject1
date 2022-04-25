const BASE_URL = process.env.SERVER_URL + process.env.API_ENV
// const BASE_URL = '//192.168.199.129:18069'
console.log(process.env)
console.log('process.env', process.env.SERVER_URL, process.env.API_ENV)
import businessManagement from '@/api/constant/businessManagement'
import graphic from '@/api/constant/graphic'
export default {
  salesRoleCount: `${BASE_URL}/oauth/user/sales-role-count`, // 获取业务员角色个数
  userLogin: `${BASE_URL}/oauth/token`,
  userInfo: `${BASE_URL}/oauth/check_token`,
  userToken: `${BASE_URL}/oauth/user-link-company/query-by-token`,
  getTokenByUserId: `${BASE_URL}/oauth/mock/token/`, // 获取业务员登录token
  issueProperty: `${BASE_URL}/issue/property/query-by-type/`, // 出单中心属性
  insureImageCenter: `${BASE_URL}/issue/property/query-by-type/00013`, // 车险出单中心
  insureDataCenter: `${BASE_URL}/issue/insure-company-channel/query-by-token`, // 车险出单中心
  insureBadgeList: `${BASE_URL}/issue/insure-company-channel-link-bind/query-by-page`, // 工单管理数据
  badgeDisable: `${BASE_URL}/issue/insure-company-channel/disable`, // 工单禁用
  badgeRecovery: `${BASE_URL}/issue/insure-company-channel/recovery`, // 工单禁用
  badgeInsert: `${BASE_URL}/issue/insure-company-channel/insert`, // 工单新增
  badgeUpdate: `${BASE_URL}/issue/insure-company-channel/update`, // 工单编辑
  offLineBindCompany: `${BASE_URL}/issue/insure-company-channel-link-bind/query-by-company-ids`, // 线下绑定保险公司
  insureCompanyInfo: `${BASE_URL}/icars/auth/emplNumber/getSynCompany`, // 工单保险公司信息
  badgeDelEffect: `${BASE_URL}/finance/strategy/exist-effect`, // 工单删除
  badgeDelete: `${BASE_URL}/issue/insure-company-channel/delete-status`, // 工单删除
  bindChannel: `${BASE_URL}/issue/company/query-with-tree-by-channel`, // 工单机构查询
  bindChannelId: `${BASE_URL}/issue/insure-company-channel-bind/query-by-insure-company-channel-id`, // 工单机构查询id
  bindChannelParents: `${BASE_URL}/issue/company/query-parents`, // 工单机构父级
  bindChannelInsert: `${BASE_URL}/issue/insure-company-channel-bind/insert-list`, // 工单机构父级
  policyEffective: `${BASE_URL}/oauth/company/query-with-tree-and-filter-team-company-by-id`, // 政策机构
  policyTeamEffective: `${BASE_URL}/oauth/company/query-with-tree-by-id`, // 政策团队
  policySalesEffective: `${BASE_URL}/oauth/user/query-by-id-name-or-phone-filter-company-id`, // 政策业务员
  // policyEffective: `${BASE_URL}/oauth/company/query-company-type-children-tree-of-effective`, // 政策机构
  // policySalesEffective: `${BASE_URL}/oauth/company/query-team-type-children-tree-with-sales-of-effective`, // 政策业务员
  policyAllCompany: `${BASE_URL}/finance/iccompany/query-all`, // 政策公司
  policyInsureCompany: `${BASE_URL}/finance/strategy/query-insure-company-channel-with-effective`, // 政策保险公司
  // policyInsureView: `${BASE_URL}/oauth/company/query-all-with-tree-filter-by-id-and-other`, // 政策视角
  policyInsureView: `${BASE_URL}/oauth/company/query-channel-company-with-tree-by-company-id`, // 政策视角
  policyQuery: `${BASE_URL}/finance/strategy/query`, // 政策查询
  policySelect: `${BASE_URL}/finance/strategy/query-with-page`, // 政策选择
  policySubID: `${BASE_URL}/finance/sub-strategy/query-by-strategy-id`, // 政策子机构查询
  policySubInfo: `${BASE_URL}/finance/sub-strategy/query-full-with-title`, // 政策子机构信息
  policyAddCompany: `${BASE_URL}/issue/channel/queryByCompany`, // 政策新增公司
  policyAddBelongCompany: `${BASE_URL}/issue/channel/queryByBelongCompanys`, // 政策新增公司
  policyExistTime: `${BASE_URL}/finance/strategy/exist-time-overlapping`, // 政策时间校验
  policyParentsTree: `${BASE_URL}/oauth/company/query-all-parents-tree`, // 政策可见树
  policySeeCompany: `${BASE_URL}/finance/strategy-visible-company/query-by-strategy-id`, // 政策可见公司
  policySee: `${BASE_URL}/finance/strategy-visible-company/insert-list`, // 政策可见
  policyAdd: `${BASE_URL}/finance/strategy/insert`, // 政策新增确定
  policyCopy: `${BASE_URL}/finance/strategy/copy`, // 政策复制提交
  policyEdit: `${BASE_URL}/finance/strategy/update`, // 政策复制提交
  policyDelete: `${BASE_URL}/finance/strategy/delete`, // 政策复制提交
  policyStatus: `${BASE_URL}/finance/property/query-by-type/00002`, // 政策状态
  policyform: `${BASE_URL}/finance/property/query-tree-by-type/00003`, // 子政策表单选项
  policyRates: `${BASE_URL}/finance/property/query-by-type/00011`, // 子政策表单费率
  subPolicyInsert: `${BASE_URL}/finance/sub-strategy/insert`, // 子政策新增确定
  subPolicyUpdate: `${BASE_URL}/finance/sub-strategy/update`, // 子政策编辑确定
  subPolicyDelete: `${BASE_URL}/finance/sub-strategy/delete`, // 子政策删除
  subPolicyCompanyId: `${BASE_URL}/oauth/company/querys`, // 子政策编辑下机构团队id对应的信息
  subPolicyEditInfo: `${BASE_URL}/finance/sub-strategy-match-cause/query-by-sub-strategy-id`, // 子政策编辑信息
  subPolicyEditRates: `${BASE_URL}/finance/sub-strategy-rate/query-by-sub-strategy-id-and-company-id`, // 子政策编辑费率
  channelEffective: `${BASE_URL}/oauth/channel/query-all-of-effective`, // 渠道机构
  channelDetail: `${BASE_URL}/oauth/channel/query-by-code`, // 渠道信息
  companyEffective: `${BASE_URL}/oauth/company/query-all-with-tree-of-effective`, // 所属机构
  limitCompanyEffective: `${BASE_URL}/oauth/company/query-all-with-tree-of-effective-filter-team-company`, // 管辖机构
  companyChoiceEffective: `${BASE_URL}/oauth/company/query`, // 选中的公司机构
  financeBindNum: `${BASE_URL}/issue/channel/queryByBindingCompanys`, // 台账---获取工号
  financeComNum: `${BASE_URL}/issue/channel/queryByCompany`, // 台账---获取工号
  // financeIdsNum: `${BASE_URL}/issue/insure-company-channel-link-bind/query-by-company-ids`, // 台账---获取工号
  financePage: `${BASE_URL}/finance/bill/query-with-page`, // 台账---查询
  financeExporte: `${BASE_URL}/finance/bill/exporte`, // 台账---导出
  financeCountExporte: `${BASE_URL}/finance/bill/countResultexporte`, // 台账---对账
  financeBatchUpdate: `${BASE_URL}/finance/bill/batchUpdate`, // 台账---修正
  financeEdit: `${BASE_URL}/finance/bill/query-by-id`, // 台账---编辑
  financeUpdate: `${BASE_URL}/finance/bill/update`, // 台账---编辑确定
  financeInsert: `${BASE_URL}/finance/bill/insert`, // 台账---新增确定
  financeBatchDown: `${BASE_URL}/spa/commonManagerTest/assets/template`, // 台账---下载模板
  financeSaler: `${BASE_URL}/oauth/user-link-company/query-sales-by-company-id`, // 台账---编辑业务员
  financeOneSaler: `${BASE_URL}/oauth/user/querys`, // 台账---编辑单个业务员
  financeCompany: `${BASE_URL}/finance/iccompany/query-all`, // 获取所有财务结算保险公司
  queryByBindingCompanys: `${BASE_URL}/issue/channel/queryByBindingCompanys`, // 上游结算---获取工号列表
  querySettlementList: `${BASE_URL}/finance/settlement/query-with-page`, // 上游结算---结算列表
  queryTotalFormality: `${BASE_URL}/finance/settlement/query-total-formality`, // 上游结算---统计佣金
  settlementExport: `${BASE_URL}/finance/settlement/exporte`, // 上游结算---结算导出
  settlementInsert: `${BASE_URL}/finance/settlement-record/insert`, // 上游结算---结算
  querySettlementRecordById: `${BASE_URL}/finance/settlement-record/query-by-bill-id`, // 通过id查询结算记录
  upBatchSettlement: `${BASE_URL}/finance/settlement-record/parent-rate-import`, // 上游批量结算
  batchSettlement: `${BASE_URL}/finance/settlement-record/import`, // 非上游批量结算
  financeRecord: `${BASE_URL}/finance/consume-record/query-total`, // 财务管理---获取记录统计
  financeBalance: `${BASE_URL}/finance/channel-balance/query-by-channel-code`, // 财务管理---获取记录统计
  financeCount: `${BASE_URL}/finance/consume-record/query-count-with-page`, // 财务管理---账单管理
  financeType: `${BASE_URL}/finance/property/query-by-type`, // 财务管理---账单明细的类型
  financeDetail: `${BASE_URL}/finance/consume-record/query-with-page`, // 财务管理---账单明细
  userCompanyLinked: `${BASE_URL}/oauth/user-link-company/query`, // 账单管理---编辑状态初始化账户信息
  userRoleIDLinked: `${BASE_URL}/oauth/user-relate-role/query-by-user-id`, // 账单管理---角色初始化数据
  roleQueryLinked: `${BASE_URL}/oauth/role-link-role-relate-permission/query`, // 角色管理---角色权限初始化选择
  roleinsertLinked: `${BASE_URL}/oauth/role-link-role-relate-permission/insert`, // 角色管理---新增角色
  roleUpdatedLinked: `${BASE_URL}/oauth/role-link-role-relate-permission/update`, // 角色管理---修改角色
  rolePermissionTree: `${BASE_URL}/oauth/permission/query-by-type-with-tree`, // 角色管理---角色权限树
  channelPermissionTree: `${BASE_URL}/oauth/permission/query-by-channel-code-with-tree`, // 角色管理---渠道权限树
  roleTemplate: `${BASE_URL}/oauth/role/query-template`, // 角色管理---角色权限树
  financeUserNameCheck: `${BASE_URL}/oauth/user/exist-by-user-name`, // 财务管理---新增账号校验
  userLinked: `${BASE_URL}/oauth/user-linked/query-with-page`, // 账号管理---表格内容
  userUpdateLinked: `${BASE_URL}/oauth/user-linked/update`, // 账号管理---编辑保存
  userInsertLinked: `${BASE_URL}/oauth/user-linked/insert-user`, // 账号管理---新增保存
  roleChannelCode: `${BASE_URL}/oauth/role/query-by-channel-code`, // 账号管理---获取角色
  roleLinked: `${BASE_URL}/oauth/role/query-with-page`, // 角色管理---表格内容
  roleChannelAllCodes: `${BASE_URL}/oauth/role/query-by-channel-codes`, // 角色管理---获取角色
  roleChannelCodes: `${BASE_URL}/oauth/role/query-by-channel-code`, // 角色管理---获取角色
  roleChannelpermissionCodes: `${BASE_URL}/oauth/permission/query-by-channel-code`, // 角色管理---渠道角色
  roleDelete: `${BASE_URL}/oauth/role/delete`, // 角色管理---删除角色
  roleStatus: `${BASE_URL}/oauth/role/update`, // 角色管理---状态
  userLoginDisable: `${BASE_URL}/oauth/user/disable`, // 账号管理---禁止账号
  userLoginRecovery: `${BASE_URL}/oauth/user/recovery`, // 账号管理---恢复账号
  userResetPassword: `${BASE_URL}/oauth/user/reset-password`, // 账号管理---重置密码
  userDelete: `${BASE_URL}/oauth/user/delete`, // 账号管理---删除账号
  userRoleCount: `${BASE_URL}/oauth/user/user-role-count`, // 角色数量
  emplnumber: `${BASE_URL}/issue/channel/queryChannelByPage`, // 工号列表
  acountAddress: `${BASE_URL}/issue/channelUrl/queryByPage`, // 工号地址
  deleteAccountAddr: `${BASE_URL}/issue/channelUrl/delete`, // 删除工号地址
  addAccountAddr: `${BASE_URL}/issue/channelUrl/insertOrUpdate`, // 新增工号地址
  replaceAccountAddr: `${BASE_URL}/issue/channelUrl/batchUpdate`, // 工号地址批量替换
  getAccountUrl: `${BASE_URL}/issue/channelUrl/getUrls`, // 获取工号请求代理地址
  getInfoConfig: `${BASE_URL}/issue/property/query-by-type-des`, // 获取工号请求代理地址
  getTypeCodeUrl: `${BASE_URL}/issue/property-type/query-all`, // 获取编号类型
  insertInfoConfig: `${BASE_URL}/issue/property/insert`, // 新增配置信息
  updateInfoConfig: `${BASE_URL}/issue/property/update-by-id`, // 编辑配置信息
  deleteInfoConfig: `${BASE_URL}/issue/property/delete`, // 删除配置信息
  getSysLogs: `${BASE_URL}/issue/logs`, // 获取操作日志
  getSysLogsById: `${BASE_URL}/issue/logs/`, // 查看操作日志详细信息

  updateFeedback: `${BASE_URL}/issue/auth/feedfback/mRplyById`, // 编辑保存
  getInformlist: `${BASE_URL}/issue/notice/listNotice`, // 查看通知列表
  getInformChannel: `${BASE_URL}/issue/channel/getSources`, // 获取所有渠道
  getInformCompany: `${BASE_URL}/issue/channel/queryComByLevel`, // 获取保险公司
  getInformOrgan: `${BASE_URL}/issue/channel/queryComTreeById`, // 获取所属机构
  addInformData: `${BASE_URL}/issue/notice/mAddNotice`, // 获取所属机构
  getInformDetail: `${BASE_URL}/issue/notice/getNoticeInfoById`, // 获取通知详情
  getFeedbackList: `${BASE_URL}/issue/auth/feedfback/mGetFeedfbackByList`, // 查看意见反馈
  queryFeedbackById: `${BASE_URL}/issue/auth/feedfback/mFeedfbackById`, // 通过id查看详情

  switchStatus: `${BASE_URL}/icars/auth/emplNumber/switchStatus`, // 工号开关
  getOrgList: `${BASE_URL}/oauth/company/query-company-tree-of-effective`, // 获取组织机构列表
  disableOrg: `${BASE_URL}/oauth/company/disable/`, // 禁用机构
  enableOrg: `${BASE_URL}/oauth/company/recovery/`, // 启用机构
  checkOrg: `${BASE_URL}/oauth/company/exist`, // 检查机构代码是否存在
  sortOrg: `${BASE_URL}/oauth/company/sort`, // 机构列表排序
  checkOrgUser: `${BASE_URL}/oauth/user-link-user-relate-company/exist-user/`, // 检查机构是否存在用户
  checkOrgExistUser: `${BASE_URL}/oauth/user/exist-by-user-name-and-channel-code`, // 查询渠道下是否存在指定用户名
  querySalesList: `${BASE_URL}/oauth//user-linked/query-sales-with-page`, // 查询业务员列表
  insertSalesUser: `${BASE_URL}/oauth/user-linked/insert-sales`, // 添加个人业务员
  insertChannelSalesUser: `${BASE_URL}/oauth/user-linked/insert-channel-sales`, // 添加渠道业务员
  checkExistAgentCode: `${BASE_URL}/oauth/user/exist-by-agent-code-and-channel-code`, // 检查业务员编码是否存在
  updateUserInfo: `${BASE_URL}/oauth/user-linked/update`, // 更新业务员信息
  deleteUserInfo: `${BASE_URL}/oauth/user/delete/`, // 删除业务员信息
  resetUserPwd: `${BASE_URL}/oauth/user/reset-password`, // 重置业务员密码
  deleteOrg: `${BASE_URL}/oauth/company/delete/`, // 删除机构
  updateOrg: `${BASE_URL}/oauth/company-link-web-config/update`, // 更新机构信息
  addOrg: `${BASE_URL}/oauth/company-link-web-config/insert`, // 新增机构
  queryProvinceList: `${BASE_URL}/oauth/policy-area/query-all`, // 获取省份地区列表
  queryAreaList: `${BASE_URL}/oauth/district/query-tree-with-province-and-city`, // 查询地区列表
  queryAreaAll: `${BASE_URL}/issue/city/getAll`, // 查询省市区
  queryAreaByChannel: `${BASE_URL}/issue/city/getAll2/`, // 查询省市区
  queryByType: `${BASE_URL}/oauth/property/query-by-type?typeCode=`, // 字典查询
  queryOrgInfo: `${BASE_URL}/oauth/company/query/`, // 查询机构信息
  queryOrgConfig: `${BASE_URL}/oauth/guest/web-config/query/`, // 查询机构配置
  updateOrgInfo: `${BASE_URL}/oauth/company-link-web-config/update`, // 更新机构信息
  queryOrgUser: `${BASE_URL}/oauth/user/query-parent-company-user-by-company-id`, // 获取机构业务员
  queryPersonSales: `${BASE_URL}/oauth/user-linked/query-person-sales-with-page`, // 查询个人业务员信息
  queryChannelSales: `${BASE_URL}/oauth/user-linked/query-channel-sales-with-page`, // 查询渠道业务员信息
  queryChannelByCode: `${BASE_URL}/oauth/channel/query-sales-channel/`, // 根据渠道渠道code查询关联的分销渠道
  queryPermissionDict: `${BASE_URL}/oauth/permission/query-by-type/`, // 查询某类权限点
  queryPermissionByUserId: `${BASE_URL}/oauth/sales-channel-permission/query-by-user-id/`, // 查询用户权限
  getAllChannel: `${BASE_URL}/oauth/channel/query-all-of-effective`, // 所属渠道下拉框
  getAllOrg: `${BASE_URL}/oauth/company/query-with-tree-by-channel`, // 所属机构下拉框
  getPolicyAreas: `${BASE_URL}/issue/area/getPolicyAreas`, // 获取保监地区列表
  getCompanys: `${BASE_URL}/icars/auth/common/getCompanys`, // 获取保险公司
  deleteById: `${BASE_URL}/issue/channel/deleteById`, // 删除工号
  getChannelsById: `${BASE_URL}/issue/channel/getChannelsById/`, // 获取工号关联渠道
  getPermissions: `${BASE_URL}/issue/channel/getPermissions`, // 获取工号权限
  bindingAllSource: `${BASE_URL}/issue/channel/bindingAllSource`, // 保存绑定机构工号信息
  getCompanyByArea: `${BASE_URL}/issue/channel/getCompanyByArea`, // 查询机构
  bindingInstitution: `${BASE_URL}/issue/channel/bindingInstitution`, // 绑定机构
  getFieldByCompanyId: `${BASE_URL}/icars/auth/emplNumber/getFieldByCompanyId`, // 查询保险公司属性
  saveOrUpdate: `${BASE_URL}/icars/auth/emplNumber/saveOrUpdate`, // 新增或更新工号
  getDetailsById: `${BASE_URL}/icars/auth/emplNumber/getDetailsById`, // 获取工号详情
  mGetDictionary: `${BASE_URL}/oauth/property/query-by-type`, // 查询某类字典数据
  queryWithPage: `${BASE_URL}/oauth/channel-link-balance/query-with-page`, // 获取渠道
  mCharge: `${BASE_URL}/finance/balance/charge`, // 提交渠道充值
  closeChannel: `${BASE_URL}/oauth/channel/disable/`, // 禁用渠道
  openChannel: `${BASE_URL}/oauth/channel/recovery/`, // 禁用渠道
  queryWebConfig: `${BASE_URL}/oauth/guest/web-config/query/`, // 查询前端配置
  mInsertList: `${BASE_URL}/oauth/web-config/insert-list`, // 提交渠道添加配置
  channelLinked: `${BASE_URL}/oauth/channel-linked/query/`, // 查询渠道和管理员
  updateChannelLinked: `${BASE_URL}/oauth/channel-linked/update`, // 更新渠道和管理员
  insertChannelLinked: `${BASE_URL}/oauth/channel-linked/insert`, // 添加渠道和管理员
  querySettlementRecord: `${BASE_URL}/finance/settlement-record/query-page`, //  查询上游手续费结算记录
  revokeSettlementRecord: `${BASE_URL}/finance/settlement-record/cancel/`, // 撤销手续费结算记录
  exportRecordExcel: `${BASE_URL}/finance/settlement-record/export`, //  导出结算记录excel表
  querySettlementDetail: `${BASE_URL}/finance/settlement-record-bill/query-page-by-record-id`, // 查询结算明细
  queryStatistics: `${BASE_URL}/finance/settlement-record/query-statistics/`, // 查询结算明细总额
  exportBillExcel: `${BASE_URL}/finance/settlement-record-bill/export/`, // 导出excel
  deleteRecord: `${BASE_URL}/finance/settlement-record/delete/`, // 删除结算记录
  updatePassword: `${BASE_URL}/oauth/user/change-password`, // 修改密码
  checkChannelCode: `${BASE_URL}/oauth/channel/exist`, // 检查渠道编码是否冲突
  getFindPassCode: `${BASE_URL}/oauth/guest/verification-code/send-with-username/`, // 获取用户手机验证码
  subFindPass: `${BASE_URL}/oauth/guest/verification-code/change-password-with-username`, // 提交找回密码
  getSynCompany: `${BASE_URL}/icars/auth/emplNumber/getSynCompany`, // 获取公司名称
  deleteStrategyRate: `${BASE_URL}/finance/sub-strategy-rate/delete`, // 删除机构佣金政策
  deleteStrategySee: `${BASE_URL}/finance/strategy-visible-company/delete-by-strategy-id`, // 删除政策可见
  getOperatorType: `${BASE_URL}/issue/channel/operatorType`, // 获取工号日志操作类型，操作对象
  getLogsByPage: `${BASE_URL}/issue/channel/getLogsByPage`, // 分页获取操作日志
  queryByChannelCode: `${BASE_URL}/oauth/permission/query-by-type-with-tree/`, // 查询渠道拥有权限的树形数据
  queryAuthChannel: `${BASE_URL}/issue/channel/queryAuthChannel`, // 查询机构可过滤团队

  getCompanyData: `${BASE_URL}/icars/auth/policy/belongCompanys`, // 公司下拉列表 工号列表就是在后面添加公司id
  getorganization_tree: `${BASE_URL}/icars/auth/policy/organization_tree`, // 出单机构树形菜单获取
  querySalesByCompanyId: `${BASE_URL}/icars/auth/policy/querySalesByCompanyId`, // 获取业务员 后面要添加渠道树形机构的id
  getbaseInfo: `${BASE_URL}/icars/auth/policy/baseInfo`, // 获取表单下拉明细
  getConfigData: `${BASE_URL}/icar/common/queryConfigData`, // 获取表单下拉明细
  policyExist: `${BASE_URL}/icars/auth/policy/policyExist`, // 保单是否重复
  // 续保专员
  getPlateInfo: `${BASE_URL}/dealer/auth/renewal/getPlateInfo`, // 续保专员看台数据
  getTaskList: `${BASE_URL}/dealer/auth/renewal/getTaskList`, // 续保专员任务列表查询
  getQuoteInfo: `${BASE_URL}/dealer/auth/renewal/getQuoteInfo`, // 获取续保专员报价详情
  getInsureCompanysList: `${BASE_URL}/dealer/auth/renewal/getInsureCompanysList`, // 保险公司列表
  getTaskDispatch: `${BASE_URL}/dealer/auth/renewal/taskDispatch`, // 指派任务
  getUsersOnCondition: `${BASE_URL}/dealer/auth/renewal/getUsersOnCondition`, // 获取弹窗列表
  getUnreadMsgsSumByUId: `${BASE_URL}/dealer/auth/msg/getUnreadMsgsSumByUId`, // 滚动信息列表 获取用户的未读消息总数
  getMsgsPageByUId: `${BASE_URL}/dealer/auth/msg/getMsgsPageByUId`, // 滚动信息列表 分页返回
  getMessageList: `${BASE_URL}/dealer/auth/renewal/getMessageList`, // 滚动信息列表
  readMsgByIds: `${BASE_URL}/dealer/auth/msg/readMsgByIds`, // 任务通知点击已读
  deleteMsgByIds: `${BASE_URL}/dealer/auth/msg/deleteMsgByIds`, // 任务通知点击删除
  deleteAllMsgByUId: `${BASE_URL}/dealer/auth/msg/deleteAllMsgByUId`, // 任务通知全部清空
  putApplyInsurance: `${BASE_URL}/dealer/auth/renewal/applyInsurance`, // 申请出单
  refreshQuotation: `${BASE_URL}/dealer/auth/renewal/refreshQuotation`, // 刷新报价
  autoQuotation: `${BASE_URL}/dealer/auth/renewal/autoQuotation`, // 自动报价
  getAllOfferRecords: `${BASE_URL}/dealer/auth/renewal/getAllOfferRecords`, // 获取当前用户所有报价记录，（申请出单弹窗里面的保险公司）
  newCarApplyOffer: `${BASE_URL}/dealer/auth/renewal/applyOffer`, // 申请报价有证件照上传的提交
  // 出单员
  getInsurePlateInfo: `${BASE_URL}/dealer/auth/insure/getPlateInfo`, // 出单员看台数据
  getInsureListPage: `${BASE_URL}/dealer/auth/insure/getListPage`, // 出单员列表
  addQuoteInfo: `${BASE_URL}/dealer/auth/insure/addQuoteInfo`, // 添加报价
  getInsuredCompany: `${BASE_URL}/dealer/auth/renewal/getInsureCompanysList`, // 保险公司
  getQuoteUserListByKey: `${BASE_URL}/dealer/auth/insure/getQuoteUserListByKey`, // 出单员里面的任务转派查询
  redeployQuoteUser: `${BASE_URL}/dealer/auth/insure/redeployQuoteUser`, // 出单员里面的任务转派保存
  getBdinput: `${BASE_URL}/icars/auth/policy/input`, // 录入保单提交
  putOneCapture: `${BASE_URL}/icars/auth/crawler/captureOne`, // 单个抓单
  // 进店车辆
  getVehiclePlateInfo: `${BASE_URL}/dealer/auth/arrivalVehicle/getPlateInfo`, // 进店车辆看台数据
  getVehiclePlateInfoNew: `${BASE_URL}/dealer/auth/arrivalVehicle/getArrivalVehiclePlateInfo`, // 进店车辆看台数据new
  getArrivalVehicleList: `${BASE_URL}/dealer/auth/arrivalVehicle/getArrivalVehicleList`, // 进店车辆
  getArrivalVehicleListNew: `${BASE_URL}/dealer/auth/arrivalVehicle/getArrivalVehicleListNew`, // 进店车辆new
  getQuetoInfoList: `${BASE_URL}/dealer/auth/arrivalVehicle/getQuetoInfoList`, // 进店车辆的获取详情
  enterCarEditInfo: `${BASE_URL}/dealer/auth/customer/selectCustomerInfoByLicenseNo`, // 进店车辆编辑信息
  enterCarInsertOrUpdate: `${BASE_URL}/dealer/auth/arrivalVehicle/insertOrUpdateWithPicture`, // 进店车辆编辑信息
  distributeRenewalPeople: `${BASE_URL}/dealer/auth/customer/distributeRenewalPeople`, // 任务分配
  carDistributeRenewalPeople: `${BASE_URL}/dealer/auth/arrivalVehicle/distributeRenewalPeople`, // 进店车辆的任务分配
  // 客户管理
  customerCarStoreEffective: `${BASE_URL}/oauth/company/query-all-with-tree-filter-by-id-and-other`, // 获取管理员组织机构树
  customerGetConfig: `${BASE_URL}/dealer/auth/customer/getChannelConfig`, // 获取管理员分配状态
  customerSetConfig: `${BASE_URL}/dealer/auth/customer/updateChannelConfig`, // 设置管理员分配状态
  customerPage: `${BASE_URL}/dealer/auth/customer/getCustomerPage`, // 获取分页客户信息列表
  customerSelectId: `${BASE_URL}/dealer/auth/customer/selectById`, // 编辑时查询客户基本信息
  customerDeleteId: `${BASE_URL}/dealer/auth/customer/deleteById`, // 删除客户
  customerInsertOrUpdate: `${BASE_URL}/dealer/auth/customer/insertOrUpdate`, // 新增或修改客户
  customerInsertOrUpdateImgs: `${BASE_URL}/dealer/auth/customer/insertOrUpdateWithPicture`, // 新增或修改客户和证件照片
  customerCarType: `${BASE_URL}/icar/auth/core/queryVehicleModel`, // 车型
  customerDetailById: `${BASE_URL}/dealer/auth/customer/selectCustomerDetailById`, // 客户详情页面
  // customerExport: `http://192.168.1.65:18089/dealer/auth/customer/exportCustomer`, // 导出
  customerExport: `${BASE_URL}/dealer/auth/customer/exportCustomer`, // 导出
  customerImport: `${BASE_URL}/dealer/auth/customer/importCustomer`, // 导入
  customerEnterPage: `${BASE_URL}/dealer/auth/arrivalVehicle/getArrivalVehiclePage`, // 进站记录分页列表
  customerEnterState: `${BASE_URL}/dealer/auth/customer/updateState`, // 更新跟进状态
  customerFollowSaler: `${BASE_URL}/dealer/auth/customer/distributeRenewalPeople`, // 分配续保员
  customerUpdateInsure: `${BASE_URL}/dealer/auth/batchRenewal/getRenewalByCarFlag`, // 刷新续保
  customerRecallInsure: `${BASE_URL}/dealer/auth/customer/recallIssue`, // 撤回出单
  carStoreStatistic: `${BASE_URL}/dealer/auth/plateform/statistics`, // 数据统计
  carStoreYearData: `${BASE_URL}/dealer/auth/plateform/statistics/dataOverView`, // 年度数据
  carStoreSalesFunnel: `${BASE_URL}/dealer/auth/plateform/statistics/saleFunnel`, // 销售漏斗
  carStoreInsureFee: `${BASE_URL}/dealer/auth/plateform/statistics/insuranceFee`, // 保费
  carStoreNewCustomer: `${BASE_URL}/dealer/auth/plateform/statistics/newCustomer`, // 新客户
  carStoreInsuranceRates: `${BASE_URL}/dealer/auth/plateform/statistics/insuranceRatesPreview`, // 提前投保天数
  carStoreArrivalVehicle: `${BASE_URL}/dealer/auth/plateform/statistics/arrivalVehicleStatistics`, // 进站统计
  carStoreCustomerFail: `${BASE_URL}/dealer/auth/plateform/statistics/customerFailStatistics`, // 战败统计
  carStoreDetailPreview: `${BASE_URL}/dealer/auth/plateform/statistics/detailPreview`, // 详细数据
  idUrl: `${process.env.SERVER_URL}/upload?uploadHandle=http://120.27.21.67${
    process.env.API_ENV
  }/icar/ocr/identityCard`, // 身份证识别接口
  licenseUrl: `${
    process.env.SERVER_URL
  }/upload?uploadHandle=http://120.27.21.67${
    process.env.API_ENV
  }/icar/ocr/drivingLicense`, // 行驶证识别接口
  idlicenseUrl: `${
    process.env.SERVER_URL
  }/upload?uploadHandle=http://120.27.21.67${
    process.env.API_ENV
  }/dealer/guest/uploadCallback`, // 身份证行驶证上传接口

  // 新的客户管理
  newCustomerFollowUp: `${BASE_URL}/oauth/customer-follow-up`, // 添加客户录入信息
  queryCustomerStatus: `${BASE_URL}/oauth/property/query-by-type`, // 查询客户状态
  addCustomerInfo: `${BASE_URL}/oauth/customer`, // 添加客户信息
  queryCustomerDetail: `${BASE_URL}/oauth/customer-detail/`, // 查询客户详情
  deleteCustomers: `${BASE_URL}/oauth/customers`, // 查询客户详情
  updateCustomer: `${BASE_URL}/oauth/customer`, // 更新客户信息
  queryCustomerPage: `${BASE_URL}/oauth/customer-page`, // 客户管理分页查询
  queryCustomerSaleman: `${BASE_URL}/oauth/user/query-by-current-company-ids`, // 查询业务员
  queryNoDistriCustomer: `${BASE_URL}/oauth/customer-non-allocation-id`, // 查询未分配的客户id
  queryCustomerOrgan: `${BASE_URL}/oauth/company/query-all-with-tree-of-effective`, // 查询客户机构树
  getCustomerQuoteRecord: `${BASE_URL}/issue/policy/quoteDetail_/`, // 查询客户报价记录
  // getPreviInsured: `${BASE_URL}/user/auth/customer/queryRenewal`, // 查询往年报价
  distributeCustomers: `${BASE_URL}/oauth/customers`, // 提交客户分配
  refreshCustomerRenew: `${BASE_URL}/icar/auth/core/queryRenewal`, // 刷新续保
  getQuoteShareData: `${BASE_URL}/user/auth/policy/queryPolicy`, // 获取分享报价的报价记录数据
  getPreviInsure: `${BASE_URL}/icar/policy/latest`, // 获取往年投保数据
  getPreviInsureRisk: `${BASE_URL}/icar/policy/latest/`, // 获取往年投保数据险种详情
  getCustomerTokenByUserId: `${BASE_URL}/oauth/mock/token_self_channel/`, // 获取客户模拟登录业务员id

  // 批量续保
  getBatchList: `${BASE_URL}/dealer/auth/batch/getBatchList`, // 批量续保 按条件分页上传文件列表
  exportBathRenwalList: `${BASE_URL}/dealer/auth/batch/exportBathRenwalList`, // 批量续保 下载文件
  getTodayUplodSum: `${BASE_URL}/dealer/auth/batch/getTodayUplodSum`, // 批量续保 获取批续数
  deleteBatchById: `${BASE_URL}/dealer/auth/batch/deleteBatchById`, // 批量续保 删除续保文件
  cancelBatchByBatchNo: `${BASE_URL}/dealer/auth/batch/cancelBatchByBatchNo`, // 批量续保 取消上传续保文件
  getBatchRenewalListPage: `${BASE_URL}/dealer/auth/batchRenewal/getBatchRenewalListPage`, // 批量续保列表详情 获取批量导入查询续保的车辆列表
  getInsureStatistics: `${BASE_URL}/dealer/auth/statistics/getInsureStatistics`, // 看台 续保统计分析
  getInsureConversionRate: `${BASE_URL}/dealer/auth/statistics/getInsureConversionRate`, // 看台 续保转化率分析
  getCompanyInsureConversionRate: `${BASE_URL}/dealer/auth/statistics/getCompanyInsureConversionRate`, // 看台 保险公司续保分析
  getRenewalUserStatistics: `${BASE_URL}/dealer/auth/statistics/getRenewalUserStatistics`, // 看台 续保专员续保分析
  getOverview: `${BASE_URL}/dealer/auth/statistics/getOverview`, // 看台 应用概述
  getInsureConversionRateList: `${BASE_URL}/dealer/auth/statistics/getInsureConversionRateList`, // 看台 续保转化率分析Plus
  getRenewalData: `${BASE_URL}/dealer/auth/insure/getChannelRenewalDaysConfig`, // 批续 续保期
  // 其他的
  dealerDefaultPermission: `${BASE_URL}/oauth/permission/query-car-dealer-default-permission`, // 查询车商渠道默认权限
  getChannelInfo: `${BASE_URL}/oauth/channel/query-by-code/`, // 通过渠道号查询渠道信息
  querySbtById: `${BASE_URL}/oauth/company/query-sbt-info-by-company-id/`, // 通过机构id查询深保通账号信息
  queryInnerCode: `${BASE_URL}/oauth/channel/query-inner-code/`, // 查询内部渠道号
  getLoginAddress: `${BASE_URL}/icars/auth/emplNumber/queryChannelLandingUrl/`, // 获取登陆地址
  // 业务管理
  ...businessManagement(BASE_URL),
  // 批量抓单
  getPolicyChannel: `${BASE_URL}/issue/crawler/sourceCode`, // 获取抓单页的所属渠道
  judgeNetWorkUrl: `${BASE_URL}/issue/crawler/judgeNetWork/`, // 获取抓单页的判断是网点还是地区
  getPolicyAreaUrl: `${BASE_URL}/issue/crawler/area/`, // 获取抓单页的投保地区
  policyNetWorkUrl: `${BASE_URL}/issue/crawler/netWork`, // 获取抓单页的机构网点
  policyOrganUrl: `${BASE_URL}/issue/policy/belongCompany/`, // 获取抓单页的所属机构
  getPolicyCompany: `${BASE_URL}/issue/crawler/companys`, // 获取抓单页的保险公司
  policyAccountUrl: `${BASE_URL}/issue/crawler/channels`, // 获取抓单页的出单工号
  policyOperatorUrl: `${BASE_URL}/issue/crawler/operator`, // 获取抓单页的出单员
  policySalesmanUrl: `${BASE_URL}/issue/crawler/salesman`, // 获取抓单页的业务员
  getPolicyListUrl: `${BASE_URL}/issue/crawler/policy`, // 获取抓单页提交
  getPolicyDetailUrl: `${BASE_URL}/issue/crawler/detail/`, // 获取抓单页返回详情
  policyRecordUrl: `${BASE_URL}/issue/crawler/record`, // 获取抓单记录页面
  // 代理地址
  getReqUrl: `${BASE_URL}/icars/auth/emplNumber/queryReqUrl`, // 获取代理地址和请求地址列表
  // 数据报表
  countAddSale: `${BASE_URL}/oauth/user/count-add-sales`, // 统计新增业务员数量
  channelStatistics: `${BASE_URL}/oauth/channel/statistics`, // 渠道数据统计
  homeTopData: `${BASE_URL}/icar/stat/home/data`, // 首页环比数据
  homeOrderChange: `${BASE_URL}/icar/stat/home/chart`, // 首页出单波动
  getCompanyStat: `${BASE_URL}/icar/stat/company/list`, // 获取保险公司业绩分布
  homeCustomer: `${BASE_URL}/icar/stat/home/customer`, // 首页客户到期分布
  homeCompany: `${BASE_URL}/icar/stat/home/company`, // 保险公司地区分布
  businessData: `${BASE_URL}/icar/stat/business/data`, // 业务统计环比数据
  businessListData: `${BASE_URL}/icar/stat/business/list`, // 业务统计列表数据
  getSaleStat: `${BASE_URL}/icar/stat/user/list`, // 获取业务员业绩分布
  funnelData: `${BASE_URL}/icar/stat/funnel/data`, // 移动出单转化漏斗
  getPerformance: `${BASE_URL}/icar/stat/performance/chart`, // 业绩分析
  companyExoprtstat: `${BASE_URL}/icar/stat/company/export`, // 导出保险公司业绩
  userExportstat: `${BASE_URL}/icar/stat/user/export`, // 业务员业绩导出
  businessExport: `${BASE_URL}/icar/stat/business/export`, // 业务统计导出

  getNumberAddFiled: `${BASE_URL}/issue/channel/addWorkNo`, // 添加工号时获取空值字段
  queryCompanysList: `${BASE_URL}/issue/companies/getCompanys`, // 获取保险公司
  queryCompanysListByChannelCode: `${BASE_URL}/issue/companies/getCompanys2/`, // 获取保险公司根据渠道编码
  getSynCompanyList: `${BASE_URL}/issue/channel/getSynCompany`, // 获取保险公司编码
  getReqUrlList: `${BASE_URL}/issue/channelUrl/queryReqUrl`, // 获取请求地址代理地址登陆地址及自定义字段
  saveOrupdateJobNumber: `${BASE_URL}/issue/channel/saveOrUpdate`, // 新增或更新工号
  getJobNumberById: `${BASE_URL}/issue/channel/getDetailsById/`, // 获取工号详情
  getJobNumberDictionary: `${BASE_URL}/issue/channel/getChannelDictionary/`, // 获取编辑工号所需的字典
  batchNumber: `${BASE_URL}/issue/channel/batchUpdate`, // 批量操作工号

  getDefaultPermissions: `${BASE_URL}/oauth/guest/config/query-by-type/`, // 添加渠道获取默认权限
  queryBusinessLeaderList: `${BASE_URL}/oauth/user-simple-info`, // 查询商务负责人
  // 移动出单相关
  getTokenBySalesId: `${BASE_URL}/oauth/mock/token_self_channel/`, // 获取(非管路员也可用) 业务员登录token
  postSalesmanID: `${BASE_URL}/oauth/user/query-by-current-company-ids-and-filter-disable`, // 获取业务员账号（选择后可登录）
  postRealSalesmanID: `${BASE_URL}/oauth/user/query-by-current-company-ids-and-filter-sale-role`, // 2019-04-16 new 获取业务员账号（选择后可登录）
  getCurrentChannel: `${BASE_URL}/oauth/channel/query-all-of-effective`, // 查询权限内的所有渠道 （选择当前所属渠道）
  postCurrentOrgan: `${BASE_URL}/oauth/company/query-with-tree-by-channel`, // 查询权限内机构节点，可通过渠道编码或者保监地编码或者机构层级进行过滤 （选择当前所属机构）
  ...graphic(BASE_URL),
  queryAreaByOrg: `${BASE_URL}/issue/channel/queryCompanyid/`, // 根据所属机构查询地区
  queryAreaByOrgAndChannel: `${BASE_URL}/issue/channel/queryCompanyid2/` // 根据所属机构查询和渠道地区

}
