/**
 *Created by Jhonor on 2019/3/8.
 */
import { getPolicyChannelList,
  getPolicyCompanysList,
  getPolicyNumberList,
  getPolicyOrdererList,
  getCarInfoList,
  getPolicySalesman,
  getBelongCompanyList
} from '@/api/policy_management'
import { isLicense, isVin } from '@/utils/validate'

export const formmixin = {
  data() {
    const disconutValidate = (rule, value, callback) => {
      if (value > 1) {
        callback(new Error('折扣系数不能大于1'))
      } else {
        callback()
      }
    }
    const isLicenseValidate = (rule, value, callback) => {
      if (!isLicense(value)) {
        callback(new Error('车牌号不符合规则'))
      } else {
        callback()
      }
    }
    const isframeNoValidate = (rule, value, callback) => {
      if (!isVin(value)) {
        callback(new Error('车架号不符合规则'))
      } else {
        callback()
      }
    }
    return {
      // belongCompanyList: [], // 所属机构list
      // policySalesmanList: [], // 业务员list
      policyStatusList: [
        // 订单状态list
        { key: 0, value: '报价失败' },
        { key: 1, value: '报价成功' },
        { key: 2, value: '下发修改' },
        { key: 3, value: '人工审核' },
        { key: 4, value: '核保成功' },
        { key: 5, value: '支付失败' },
        { key: 6, value: '支付成功' },
        { key: 7, value: '承保失败' },
        { key: 8, value: '已承保' },
        { key: 9, value: '已撤单' }
      ],
      policyTypeList: [
        // 投保类型list
        { key: 1, value: '单交强' },
        { key: 2, value: '单商业' },
        { key: 3, value: '交商共保' }
      ],
      businessTypeList: [
        // 业务类型list
        { key: 1, value: '新保' },
        { key: 2, value: '续保' },
        { key: 3, value: '转保' },
        { key: 4, value: '旧车首保' }
      ],
      isOfflineList: [
        // 录入来源list
        { key: 0, value: '线上移动出单' },
        { key: 1, value: '线下保存保单' },
        { key: 2, value: '手动录入保单' },
        { key: 3, value: '手动抓取保单' },
        { key: 4, value: '自动抓取保单' }
      ],
      rickList: [
        { key: -3, value: '三年未出险' },
        { key: -2, value: '两年未出险' },
        { key: -1, value: '上年未出险' },
        { key: 0, value: '新保' },
        { key: 1, value: '出险1次' },
        { key: 2, value: '出险2次' },
        { key: 3, value: '出险3次' },
        { key: 4, value: '出险4次' },
        { key: 5, value: '出险5次及以上' }
      ],
      vehicleNatureList: [
        { key: '0000400002', value: '家用车常规' },
        { key: '0000400003', value: '家用车其他' },
        { key: '0000400004', value: '货车' },
        { key: '0000400005', value: '团车' },
        { key: '0000400006', value: '公户车' }
      ],
      transferList: [{ key: '1', value: '是' }, { key: '0', value: '否' }],
      newOrOldCarList: [
        { key: '1', value: '新车' },
        { key: '2', value: '旧车' }
      ],
      glassTypeList: [{ key: 0, value: '国产' }, { key: 1, value: '进口' }],
      channelSelectList: {
        // 录入保单所属渠道下拉选择
        loading: false,
        data: []
      },
      companyList: {
        // 录入保单保险公司列表
        loading: false,
        data: []
      },
      billingNumberList: {
        // 获取出单工号
        loading: false,
        data: []
      },
      orgList: {
        // 获取所属机构列表
        loading: false,
        data: []
      },
      ordererList: {
        // 获取出单员
        loading: false,
        data: []
      },
      carInfoList: {
        // 获取车辆基础信息字典
        loading: false,
        data: {}
      },
      policySalesList: {
        // 手动录单业务员
        loading: false,
        data: []
      },
      settlementMethodList: [
        { key: -1, value: '请选择' },
        { key: 1, value: '按净保费' },
        { key: 2, value: '按全保费' }
      ],
      policyRules2: {
        'policyExt.organizationId': [
          { required: true, message: '请选择所属机构', trigger: 'blur' }
        ],
        'policyExt.userId': [
          { required: true, message: '请选择业务员', trigger: 'blur' }
        ],
        'policyExt.tciPolicyNo': [
          { required: true, message: '请输入交强险保单号', trigger: 'blur' }
        ],
        'policyExt.vciPolicyNo': [
          { required: true, message: '请输入商业险保单号', trigger: 'blur' }
        ]
      },
      policyRules: {
        'policyExt.sourceCode': [
          { required: true, message: '请选择所属渠道', trigger: 'blur' }
        ],
        'policyExt.companyId': [
          { required: true, message: '请选择保险公司', trigger: 'blur' }
        ],
        'policyExt.organizationId': [
          { required: true, message: '请选择所属机构', trigger: 'blur' }
        ],
        'policyExt.userId': [
          { required: true, message: '请选择业务员', trigger: 'blur' }
        ],
        'policyExt.operatorId': [
          { required: true, message: '请选择出单员', trigger: 'blur' }
        ],
        'policyExt.policyType': [
          { required: true, message: '请选择投保类型', trigger: 'blur' }
        ],
        'policyExt.isOffline': [
          { required: true, message: '请选择录入来源', trigger: 'blur' }
        ],
        'policyExt.policyStatus': [
          { required: true, message: '请选择订单状态', trigger: 'blur' }
        ],
        'policyExt.policyTime': [
          { required: true, message: '请选择签单时间', trigger: 'blur' }
        ],
        'policyExt.tciPolicyNo': [
          { required: true, message: '请输入交强险保单号', trigger: 'blur' }
        ],
        'policyExt.tciProposalNo': [
          {
            required: true,
            message: '请输入交强险投保单号',
            trigger: 'blur'
          }
        ],
        'policyExt.tciPremium': [
          { required: true, message: '请输入交强险保费', trigger: 'blur' }
        ],
        'policyExt.tciStartDate': [
          {
            required: true,
            message: '请输入交强险保险起期',
            trigger: 'blur'
          }
        ],
        'policyExt.tciEndDate': [
          {
            required: true,
            message: '请输入交强险保险止期',
            trigger: 'blur'
          }
        ],
        'policyExt.vehicleTax': [
          { required: true, message: '请输入车船税', trigger: 'blur' }
        ],
        'policyExt.tciDiscount': [
          { validator: disconutValidate, trigger: 'blur' }
        ],
        'policyExt.vciPolicyNo': [
          { required: true, message: '请输入商业险保单号', trigger: 'blur' }
        ],
        'policyExt.vciProposalNo': [
          {
            required: true,
            message: '请输入商业险投保单号',
            trigger: 'blur'
          }
        ],
        'policyExt.vciPremium': [
          { required: true, message: '请输入商业险保费', trigger: 'blur' }
        ],
        'policyExt.vciStartDate': [
          {
            required: true,
            message: '请选择商业险保险起期',
            trigger: 'blur'
          }
        ],
        'policyExt.vciEndDate': [
          {
            required: true,
            message: '请选择商业险保险止期',
            trigger: 'blur'
          }
        ],
        'policyExt.vciDiscount': [
          { validator: disconutValidate, trigger: 'blur' }
        ],
        'vehicleExt.licenseNo': [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { validator: isLicenseValidate, trigger: 'change' }
        ],
        'vehicleExt.licenseNo1': [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          { validator: isLicenseValidate, trigger: 'change' }
        ],
        'vehicleExt.frameNo': [
          { required: true, message: '请输入车架号', trigger: 'blur' },
          { validator: isframeNoValidate, trigger: 'change' }
        ],
        'vehicleExt.vehicleType_': [
          { required: true, message: '请选择车辆种类', trigger: 'blur' }
        ],
        'vehicleExt.useNature': [
          { required: true, message: '请选择车使用性质', trigger: 'blur' }
        ],
        'vehicleExt.enrollDate': [
          { required: true, message: '请选择初登日期', trigger: 'blur' }
        ],
        'vehicleExt.purchasePrice': [
          { required: true, message: '请输入新车购置价', trigger: 'blur' }
        ],
        'vehicleExt.seatCount': [
          { required: true, message: '请输入核定座位数', trigger: 'blur' }
        ],
        'vehicleExt.transfer': [
          { required: true, message: '请选择车辆过户', trigger: 'blur' }
        ],
        'applicantExt.ownerName': [
          { required: true, message: '请输入车主姓名', trigger: 'blur' }
        ],
        'applicantExt.ownerIdType': [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        'applicantExt.ownerIdNo': [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        'applicantExt.ownerPhone': [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        'applicantExt.insuredName': [
          { required: true, message: '请输入被保人姓名', trigger: 'blur' }
        ],
        'applicantExt.insuredIdType': [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        'applicantExt.insuredIdNo': [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        'applicantExt.insuredPhone': [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        'applicantExt.holderName': [
          { required: true, message: '请输入投保人姓名', trigger: 'blur' }
        ],
        'applicantExt.holderIdType': [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        'applicantExt.holderIdNo': [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        'applicantExt.holderPhone': [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        'policyExt.channelId': [
          { required: true, message: '请选择出单工号', trigger: 'blur' }
        ],
        'vehicleExt.brandName': [
          { required: true, message: '请输入品牌型号', trigger: 'blur' }
        ],
        'vehicleExt.engineNo': [
          { required: true, message: '请输入发动机号', trigger: 'blur' }
        ],
        'vehicleExt.vehicleType': [
          { required: true, message: '请选择交管车辆类型', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onBelongCompanyChange(val) {
      this.policyDetail.policyExt.userId = ''
      this.policyDetail.policySalesmanList = []
      // this.$set(this.policyDetail, 'policySalesmanList', [])
      if (!val) return
      getPolicySalesman({ teamId: val })
        .then(res => {
          // this.$set(this.policyDetail, 'policySalesmanList', res.data)
          this.policyDetail.policySalesmanList = res.data
          this.$forceUpdate()
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取订单状态list
    getPolicyStatusList(status) {
      const policyStatusList = this.policyStatusList
      const left = [status, 4, 8]
      const right = [status, 8]
      let result = []
      // 处理撤单
      if (status === 9) {
        result = policyStatusList.find(item => item.key === 9)
        return result
      }
      if (status < 4) {
        result = policyStatusList.filter(item => left.some(c => item.key === c))
      } else {
        result = policyStatusList.filter(item => right.some(c => item.key === c))
      }
      return result
    },

    // 获取所属渠道
    async getChannel() {
      this.channelSelectList.loading = true
      await getPolicyChannelList()
        .then(res => {
          this.channelSelectList.loading = false
          this.channelSelectList.data = res.data
        })
        .catch(err => {
          this.channelSelectList.loading = false
          console.warn(err)
        })
    },

    // 获取保险公司列表
    getCompanyList(sourceId) {
      this.companyList.loading = true
      getPolicyCompanysList(sourceId)
        .then(res => {
          const { data } = res
          this.companyList.loading = false
          this.companyList.data = data.filter(item => item.isMock === 1)
        })
        .catch(err => {
          this.companyList.loading = false
          console.warn(err)
        })
    },

    // 获取出单工号
    getBillingNumberList(sourceCode, companyId) {
      this.billingNumberList.loading = true
      getPolicyNumberList(sourceCode, companyId)
        .then(res => {
          this.billingNumberList.loading = false
          this.billingNumberList.data = res.data
        })
        .catch(err => {
          this.billingNumberList.loading = false
          console.warn(err)
        })
    },

    // 获取所属机构列表
    getOrgList(sourceCode) {
      const areaList = this.billingNumberList.data.find(item => item.channelId === this.policyExt.channelId) || {}
      this.orgList.loading = true
      getBelongCompanyList(sourceCode, areaList.areaCode || null)
        .then(res => {
          this.orgList.loading = false
          this.orgList.data = JSON.parse(JSON.stringify(res.data).replace(/title/g, 'label').replace(/key/g, 'value'))
        })
        .catch(err => {
          this.orgList.loading = false
          console.warn(err)
        })
    },

    // 获取出单员
    getOrdererList(teamId) {
      this.ordererList.loading = true
      getPolicyOrdererList(teamId)
        .then(res => {
          this.ordererList.loading = false
          this.ordererList.data = res.data
        })
        .catch(err => {
          this.ordererList.loading = false
          console.warn(err)
        })
    },

    // 获取车辆相关基础信息字典
    getCarInfo() {
      this.carInfoList.loading = true
      getCarInfoList()
        .then(res => {
          this.carInfoList.loading = false
          this.carInfoList.data = res.data
        })
        .catch(err => {
          this.carInfoList.loading = false
          console.warn(err)
        })
    },

    // 获取业务员列表
    getPolicySalesList(teamId) {
      this.policySalesList.loading = true
      getPolicySalesman({ teamId })
        .then(res => {
          this.policySalesList.loading = false
          this.policySalesList.data = res.data
        })
        .catch(err => {
          this.policySalesList.loading = false
          console.warn(err)
        })
    },

    // 判断非空
    isNull(val) {
      return val !== undefined && val !== null && val !== ''
    },

    // 当所属渠道清空时，清除保险公司，出单工号的值
    onChannelClear() {
      this.policyExt.companyId = ''
      this.policyExt.channelId = ''
      this.policyExt.organizationId = ''
    },

    // 当保险公司清除时，清除出单工号的值
    onConpanyClear() {
      this.policyExt.channelId = ''
    },

    // 当所属机构清除时，清除业务员和出单员
    onOrgClear() {
      this.policyExt.userId = ''
      if (this.isSubAdminChannel) {
        this.policyExt.operatorId = ''
      }
    },

    // 上游保司手续费格式化
    settlementFormatter(count) {
      const settlementMethodList = this.settlementMethodList
      const type = settlementMethodList.find(item => item.key === Number(count)) || {}
      return type.value || '--'
    }
  }
}
