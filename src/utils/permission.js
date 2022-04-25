function PermissionCode() {
  this.login = '0000000000' // 登陆权限点
  this.admin = '0000000001' // 管理渠道
  this.mockLogin = '0020104011' // 权限页面模拟登陆
  this.salesMockLogin = '0010204011' // 人员页面模拟登陆
  // 1
  this.mobile = '0070000000' // 车险出单
  this.mobileWeb = '0070100000' // 移动出单
  this.issueCenter = '0080100000' // 电脑出单
  this.mobileRenewal = '0000000002' // 续保专员
  this.mobileOrder = '0000000003' // 出单专员
  // 2
  this.mobileManager = '0070200000' // 业务管理
  // 3
  this.strategy = '0090000000' // 政策管理
  this.policyStrategy = '0090100000' // 保险政策
  this.policyStrategySearch = '0090101000' // 筛选查询
  this.policyStrategyAdd = '0090102000' // 添加政策
  this.policyStrategyEdit = '0090103000' // 编辑政策
  this.policyStrategyDelete = '0090104000' // 删除政策
  this.policyStrategyDisplay = '0090105000' // 设置可见
  this.policyStrategyCopy = '0090106000' // 复制政策
  this.policySubStrategyView = '0090107000' // 查看子政策
  this.policySubStrategyAdd = '0090108000' // 新增渠道
  this.policySubStrategyEdit = '0090109000' // 编辑子政策
  this.policySubStrategyDelete = '0090110000' // 删除子政策
  this.strategyAll = [
    this.policyStrategySearch,
    this.policyStrategyAdd,
    this.policyStrategyEdit,
    this.policyStrategyDelete,
    this.policyStrategyDisplay,
    this.policyStrategyCopy,
    this.policySubStrategyView,
    this.policySubStrategyAdd,
    this.policySubStrategyEdit,
    this.policySubStrategyDelete
  ] // 所有政策管理权限
  // 4
  this.finance = '0060000000' // 财务管理
  this.balanceCount = '0060100000' // 账单管理
  this.balanceCountFilterSearch = '0060101000' // 账单管理-筛选查询
  this.balanceRecord = '0060200000' // 账单明细
  this.balanceRecordFilterSearch = '0060201000' // 账单明细-筛选查询
  this.billList = '0060300000' // 台账列表
  this.billListQuery = '0060301000' // 台账列表-筛选查询
  this.billListAdd = '0060302000' // 添加台账
  this.billListUpdate = '0060303000' // 编辑台账
  this.billListBatchImport = '0060304000' // 批量导入
  this.billListReconciliations = '0060305000' // 上游手续费对账
  this.billListExport = '0060306000' // 导出台账
  this.billListAll = [
    this.billListQuery,
    this.billListExport,
    this.billListAdd,
    this.billListBatchImport,
    this.billListReconciliations,
    this.billListUpdate
  ] // 所有财务管理权限

  this.settle = '0060400000' // 结算
  this.settleQuery = '0060401000' // 结算-查询
  this.settleExport = '0060402000' // 结算-导出
  this.settleBatch = '0060403000' // 结算-批量结算
  this.settleSettleOperate = '0060404000' // 结算-结算操作
  this.settleQueryRecord = '0060405000' // 结算-查看结算记录
  this.record = '0060500000' // 结算记录
  this.recordQuery = '0060501000' // 查询
  this.recordExport = '0060502000' // 导出
  this.recordCheck = '0060503000' // 查看
  this.recordDelete = '0060504000' // 删除
  this.recordBackout = '0060505000' // 撤销
  this.recordCheckExport = '0060506000' // 查看导出
  // 5
  this.group = '0010000000' // 组织管理
  this.companyManager = '0010100000' // 机构管理
  this.companyManagerReorder = '0010105010' // 机构管理排序
  this.companyManagerS = '0010101000' // 机构管理-查看
  this.companyManagerSDefault = '0010101010' // 机构管理-查看-筛选查看
  this.companyManagerA = '0010102000' // 新增
  this.companyManagerADefault = '0010102010' // 添加机构
  this.companyManagerU = '0010103000' // 修改
  this.companyManagerUDisable = '0010103010' // 启用禁用
  this.companyManagerUEdit = '0010103020' // 编辑机构
  this.companyManagerD = '0010104000' // 删除
  this.companyManagerDDefault = '0010104010' // 删除机构
  this.companyManagerAll = [
    this.companyManagerADefault,
    this.companyManagerUDisable,
    this.companyManagerUEdit,
    this.companyManagerSDefault,
    this.companyManagerDDefault
  ] // 所有组织管理权限
  this.personSales = '0010200000' // 人员管理
  this.personSalesS = '0010201000' // 查看
  this.personSalesSDefault = '0010201010' // 筛选查询
  this.personSalesA = '0010202000' // 新增
  this.personSalesADefault = '0010202010' // 新增人员
  this.personSalesU = '0010203000' // 修改
  this.personSalesUEdit = '0010203010' // 编辑业务员
  this.personSalesUDisable = '0010203020' // 启用禁用
  this.personSalesUReset = '0010203030' // 重置密码
  this.personSalesD = '0010204000' // 删除
  this.personSalesDDefault = '0010204010' // 删除人员
  this.personSalesAll = [
    this.personSalesSDefault,
    this.personSalesADefault,
    this.personSalesUEdit,
    this.personSalesUDisable,
    this.personSalesUReset,
    this.personSalesDDefault
  ] // 所有人员管理权限
  // 6
  this.system = '0020000000' // 系统管理
  this.accountManager = '0020100000' // 账号管理
  this.accountManagerS = '0020101000' // 查看
  this.accountManagerSDefault = '0020101010' // 筛选查找
  this.accountManagerA = '0020102000' // 新增
  this.accountManagerADefault = '0020102010' // 添加账号
  this.accountManagerU = '0020103000' // 修改
  this.accountManagerUDisable = '0020103010' // 启用禁用账号
  this.accountManagerUReset = '0020103020' // 重置账号密码
  this.accountManagerUEdit = '0020103030' // 编辑账号
  this.accountManagerD = '0020104000' // 删除
  this.accountManagerDDefault = '0020104010' // 删除账号
  this.accountManagerAll = [
    this.accountManagerSDefault,
    this.accountManagerADefault,
    this.accountManagerUDisable,
    this.accountManagerUReset,
    this.accountManagerUEdit,
    this.accountManagerDDefault
  ] // 所有账号管理权限
  this.roleManager = '0020200000' // 角色管理
  this.roleManagerS = '0020201000' // 查看
  this.roleManagerSDefault = '0020201010' // 筛选查找角色
  this.roleManagerA = '0020202000' // 新增
  this.roleManagerADefault = '0020202010' // 添加角色
  this.roleManagerU = '0020203000' // 修改
  this.roleManagerUDisable = '0020203010' // 启用禁用角色
  this.roleManagerUEdit = '0020203020' // 编辑角色
  this.roleManagerD = '0020204000' // 删除
  this.roleManagerDDefault = '0020204010' // 删除角色
  this.roleManagerAll = [
    this.roleManagerSDefault,
    this.roleManagerADefault,
    this.roleManagerUDisable,
    this.roleManagerUEdit,
    this.roleManagerDDefault
  ] // 所有角色管理权限
  this.permissionUpdate = '0020204020' // 权限更新
  // 7
  this.ops = '0030000000' // 运维管理
  this.channelManager = '0030100000' // 渠道管理
  this.channelManagerS = '0030101000' // 查看
  this.channelManagerSDefault = '0030101010' // 筛选查看
  this.channelManagerADefault = '0030102010' // 添加渠道
  this.channelManagerUDisable = '0030103010' // 启用禁用
  this.channelManagerUEdit = '0030103020' // 编辑渠道
  this.channelAddConfig = '0030103040' // 添加配置
  this.channelRecharge = '0030103050' // 渠道充值
  this.channelManagerUReset = '0030103030' // 重置管理员密码
  this.channelManagerD = '0030104000' // 删除
  this.channelManagerDDefault = '0030104010' // 删除渠道
  this.channelManagerAll = [
    this.channelManagerSDefault,
    this.channelManagerADefault,
    this.channelManagerUDisable,
    this.channelManagerUReset,
    this.channelManagerUEdit,
    this.channelManagerDDefault
  ] // 所有渠道管理权限
  this.channelSales = '0010300000' // 渠道业务员
  this.channelSalesS = '0010301000' // 查看
  this.channelSalesSDefault = '0010301010' // 筛选查找
  this.channelSalesA = '0010302000' // 新增
  this.channelSalesADefault = '0010302010' // 添加业务员
  this.channelSalesU = '0010303000' // 修改
  this.channelSalesUDisable = '0010303010' // 启用禁用
  this.channelSalesUEdit = '0010303020' // 编辑业务员
  this.channelSalesD = '0010304000' // 删除
  this.channelSalesDDefault = '0010304010' // 删除业务员
  this.channelSalesAll = [
    this.channelSalesSDefault,
    this.channelSalesADefault,
    this.channelSalesUDisable,
    this.channelSalesUEdit,
    this.channelSalesDDefault
  ] // 所有渠道业务员权限

  this.numberManagement = '0030400000' // 工号管理
  this.screen = '0030401000' // 筛选查看
  this.addNumber = '0030402000' // 添加工号
  this.bindingMechanism = '0030403000' // 绑定机构
  this.bindingMechanisms = '0030403010' // 绑定机构
  this.permissionsAllocation = '0030403020' // 权限分配
  this.isOpen = '0030403030' // 是否开启
  this.addAndDel = '0030403040' // 增删操作
  this.editNumber = '0030404000' // 编辑工号
  this.openOrClose = '0030405000' // 启用禁用
  this.delNumber = '0030406000' // 删除工号
  this.queryInsurance = '0040100000' // 查续保
  this.quote = '0040200000' // 报价
  this.underwriting = '0040300000' // 核保
  this.payment = '0040400000' // 支付
  this.queryInsurances = '0050100000' // 查续保
  this.quotes = '0050200000' // 报价
  this.underwritings = '0050300000' // 核保
  this.payments = '0050400000' // 支付

  this.issue = '0080000000'
  this.issueJobNumber = '0080200000' // 工号管理
  this.issueJobNumberSearch = '0080201010' // 工号管理-筛选查看
  this.issueJobNumberAdd = '0080202010' // 工号管理-新增
  this.issueJobNumberUpdate = '0080203010' // 工号管理-修改
  this.issueJobNumberDisable = '0080203020' // 工号管理-启用禁用
  this.issueJobNumberBind = '0080203030' // 工号管理-绑定机构
  this.issueJobNumberDelete = '0080204010' // 工号管理-删除
  this.issueActionLog = '0030407000' // 操作日志
  this.isBatchOperation = '1000001052' // 工号批量操作

  this.accountAddressManager = '1000001000' // 工号地址
  this.queryAccountUrlManager = '1000001001' // 工号-筛选查询
  this.replaceAccountUrlManager = '1000001002' // 工号-批量替换
  this.addAccountUrlManager = '1000001003' // 工号-新增地址
  this.editAccountUrlManager = '1000001004' // 工号-编辑地址
  this.deleteAccountUrlManager = '1000001005' // 工号-删除地址

  this.infoConfigManager = '1000001033' // 配置信息
  this.queryConfigManager = '1000001034' // 筛选查询
  this.insertConfigManager = '1000001035' // 新增配置
  this.editConfigManager = '1000001036' // 编辑配置
  this.deleteConfigManager = '1000001037' // 删除配置
  this.operateLogManager = '1000001038' // 操作日志

  this.notificationManager = '1000001039' // 通知管理
  this.addNotification = '1000001041' // 新增通知
  this.adviceFeedbackManager = '1000001042' // 意见反馈
  this.adviceFeedbackQuery = '1000001043' // 意见查询
  this.adviceFeedbackEdit = '1000001044' // 意见编辑

  this.oilStationManage = '010000000' // 油站管理
  this.jinshanSouthStation = '010000100' // 金山南站
  this.jinshanNouthStation = '010000200' // 金山北站
  this.chishaStation = '010000300' // 赤沙站
  this.foursStationOffer = '0110000000' // 4S进站报价

  this.renewalAdmin = 'ROLE_0000000001' // cs001 车商续保 管理员
  this.renewalIssue = 'ROLE_0000000003' // cs002 车商续保 出单专员
  this.renewalInsurance = 'ROLE_0000000002' // cs003 车商续保 续保专员
  this.renewalCarAdmin = 'ROLE_0000000005' // cs005 车商续保 车商管理员
  this.renewal = '0130000001' // 车商续保
  this.renewalGrandStand = '0130000002' // 车商续保 看台
  this.renewalEnterStore = '0130000003' // 车商续保 进站车辆
  this.renewalCustomer = '0130000004' // 车商续保 客户管理
  this.renewalBatch = '0130000005' // 车商续保 批量续保
  // this.renewalInsuranceTask = '0130000006' // 车商续保 我的任务(续保专员)
  // this.renewalIssueTask = '0130000007' // 车商续保 我的任务(出单专员)
  this.renewalTask = '1000001022' // 车商续保 我的任务
  this.renewalStatistic = '1000001023' // 车商续保 数据统计
  this.renewalInsuranceAll = 'zj0000010222'
  this.renewalIssueAll = 'zj0000010223'
  // this.renewalAll = [
  //   this.renewal,
  //   this.renewalGrandStand,
  //   this.renewalEnterStore,
  //   this.renewalCustomer,
  //   this.renewalBatch,
  //   this.renewalInsurance,
  //   this.renewalIssue
  // ]
  this.bulkRenewal = '1000001024' // 批量续保菜单项
  this.bulkRenewalChildren = '1000001025' // 批量续保子菜单
  this.bulkRenewalInput = '1000001029' // 批量续保 批量导入
  this.bulkRenewalDetail = '1000001027' // 批量续保 查看详情
  this.bulkRenewalUpload = '1000001028' // 批量续保 下载文件
  this.bulkRenewalFilter = '1000001026' // 批量续保 筛选查询
  // this.bulkRenewalAll = [
  //   this.bulkRenewal,
  //   this.bulkRenewalChildren
  //   this.bulkRenewalInput,
  //   this.bulkRenewalDetail,
  //   this.bulkRenewalFilter,
  //   this.bulkRenewalUpload
  // ]
  this.mustNotCarDealer = 'MUST_NOT_CAR_DEALER' // 非车商渠道
  // 报表
  this.reportForm = '0120000001'	// 数据报表
  this.reportFormIndex = '0120000002'	// 首页
  this.businessStatistics = '0120000003'	// 业绩统计
  this.businessAnalyze = '0120000004'	// 业绩分析
  this.companyStatic = '0120000005'	// 保司业绩分布
  this.salesAnalyze = '0120000006'	// 业务员业绩分析
  this.expiredCar = '0120000007'	// 车辆到期分布
  this.mobileConversionRate = '0120000008'	// 移动出单转换漏斗

  // 新业务管理
  this.businessMgrMenu = '1000001021' // 菜单
  this.businessPolicyAccount = '1000001006' // 保单台账
  this.businessPolicySearch = '1000001011' // 筛选查询
  this.businessPolicyCheck = '1000001012' // 查看保单
  this.businessPolicyEdit = '1000001013' // 编辑保单
  this.businessPolicyInfo = '1000001030' // 台账信息
  this.businessPolicyRecord = '1000001014' // 手动录入
  this.businessPolicyExport = '1000001015' // 导出本页
  this.businessPolicyExportAll = '1000001016' // 导出全部
  this.businessPolicySetHead = '1000001017' // 设置表头
  this.businessBatchGrabbing = '1000001007' // 批量抓单
  this.businessCatchRecord = '1000001008' // 抓单记录
  this.businessOrderList = '1000001009' // 订单列表
  this.businessOrderSearch = '1000001018' // 筛选查询
  this.businessOrderCheck = '1000001019' // 查看订单
  this.businessOrderExportAll = '1000001032' // 导出全部订单
  this.businessOrderEdit = '1000001020' // 编辑订单
  this.businessQuoteRecord = '1000001010' // 报价记录
  this.businessPolicyInfoOrder = '1000001031' // 台账信息
  this.businessQueryInsurance = '1000001045' // 查询保单
  this.businessFilterInsurance = '1000001046' // 筛选查询
  this.businessQueryDetail = '1000001047' // 查看详情
  this.businessQueryRecord = '1000001048' // 查询记录
  this.businessFilterRecord = '1000001049' // 筛选查询
  this.businessQueryInsureList = '1000001050' // 获取保单
  this.businessQueryAll = [
    this.businessQueryInsurance,
    this.businessQueryRecord
  ] // 查询保单菜单入口

  // 客户列表（新客户管理）
  this.newCustomerManageQuery = '1000001053'
  this.newCustomerManageInsert = '1000001054'
  this.newCustomerManageAllot = '1000001055'
  this.newCustomerManageDelete = '1000001056'
  this.newCustomerManageRefresh = '1000001057'

  // 图文管理 文章管理
  this.graphicManagement = '1000001058' // 图片管理
  this.graphicManageQuery = '1000001059' // 筛选查询
  this.graphicManageInsert = '1000001060' // 新增图片
  this.graphicManageEdit = '1000001061' // 编辑图片
  this.graphicManageDelete = '1000001062' // 删除图片

  this.articleManagement = '1000001063' // 文章管理
  this.articleManageQuery = '1000001064' // 筛选查询
  this.articleManageInsert = '1000001065' // 新增文章
  this.articleManageEdit = '1000001066' // 编辑文章
  this.graphicManageDelete = '1000001067' // 删除文章
}

const permission = new PermissionCode()
export default permission
