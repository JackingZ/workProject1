/**
 *Created by Jhonor on 2019/3/8.
 */
import { getPolicyChannelList,
  getBelongCompanyList
} from '@/api/policy_management'
import {
  queryCustomerStatus,
  getCustomerOrgan
} from '@/api/newCustomer'
import { isLicense, isVin, isMobileOrTel } from '@/utils/validate'
import { getCompanysData } from '@/api/accounturl'
export const formmixin = {
  data() {
    // const disconutValidate = (rule, value, callback) => {
    //   if (value > 1) {
    //     callback(new Error('折扣系数不能大于1'))
    //   } else {
    //     callback()
    //   }
    // }
    const isLicenseValidate = (rule, value, callback) => {
      if (!isLicense(value)) {
        callback(new Error('车牌号不符合规则'))
      } else {
        callback()
      }
    }
    const isframeNoValidate = (rule, value, callback) => {
      if (value && !isVin(value)) {
        callback(new Error('车架号不符合规则'))
      } else {
        callback()
      }
    }
    const isMobileNo = (rule, value, callback) => {
      if (!isMobileOrTel(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
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
      orgDataList: [], // 当前客户所在机构树
      ordererList: {
        // 获取出单员
        loading: false,
        data: []
      },
      // carInfoList: {
      //   // 获取车辆基础信息字典
      //   loading: false,
      //   data: {}
      // },
      policySalesList: {
        // 手动录单业务员
        loading: false,
        data: []
      },
      followStatus: {
        // 跟进状态
        loading: false,
        data: []
      },
      // policyRules2: {
      //   'policyExt.organizationId': [
      //     { required: true, message: '请选择所属机构', trigger: 'blur' }
      //   ],
      //   'policyExt.userId': [
      //     { required: true, message: '请选择业务员', trigger: 'blur' }
      //   ],
      //   'policyExt.tciPolicyNo': [
      //     { required: true, message: '请输入交强险保单号', trigger: 'blur' }
      //   ],
      //   'policyExt.vciPolicyNo': [
      //     { required: true, message: '请输入商业险保单号', trigger: 'blur' }
      //   ]
      // },
      rules1: {
        'name': [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
        'phone': [
          { required: true, message: '客户电话不能为空', trigger: 'blur' },
          { validator: isMobileNo, trigger: 'blur' }],
        'vciEndDate': [{ required: true, message: '商业险止期不能为空', trigger: 'change' }],
        'tciEndDate': [{ required: true, message: '交强险止期不能为空', trigger: 'change' }],
        'salesId': [{ required: true, message: '请选择业务员', trigger: 'change' }
        ],
        'licenseNo': [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { validator: isLicenseValidate, trigger: 'blur' }
        ],
        'insureCompanyId': [
          { required: true, message: '请选择往年投保公司', trigger: 'change' }
        ],
        'organizationId': [
          { required: false, message: '请选择所属机构', trigger: 'change' }
        ]
        // 'carInfo.licenseNo1': [
        //   { validator: isLicenseValidate, trigger: 'change' }
        // ],
      },
      rule1: {
        'name': [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
        'phone': [
          { required: true, message: '客户电话不能为空', trigger: 'blur' },
          { validator: isMobileNo, trigger: 'blur' }],
        'vciEndDate': [{ required: true, message: '商业险止期不能为空', trigger: 'change' }],
        'tciEndDate': [{ required: true, message: '交强险止期不能为空', trigger: 'change' }],
        'salesId': [{ required: true, message: '请选择业务员', trigger: 'change' }
        ],
        'licenseNo': [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { validator: isLicenseValidate, trigger: 'blur' }
        ],
        'insureCompanyId': [
          { required: true, message: '请选择往年投保公司', trigger: 'change' }
        ],
        'organizationId': [
          { required: false, message: '请选择所属机构', trigger: 'change' }
        ]
        // 'carInfo.licenseNo1': [
        //   { validator: isLicenseValidate, trigger: 'change' }
        // ],
      },

      rule3: {
        'licenseNo': [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { validator: isLicenseValidate, trigger: 'blur' }
        ],
        'frameNo': [
          { required: false, trigger: 'blur' },
          { validator: isframeNoValidate, trigger: 'blur' }
        ]
      },
      followUpsRules: {
        status: [
          { required: true, message: '请选择跟进状态', trigger: 'change' }
        ],
        nextFollowUpDate: [
          { required: true, message: '请选择下次跟进时间', trigger: 'change' }
        ]
        // nextFollowType: [
        //   { required: true, message: '请选择下次跟进时间', trigger: 'change' }
        // ]
      }
      // policyRules: {
      //   'policyExt.sourceCode': [
      //     { required: true, message: '请选择所属渠道', trigger: 'blur' }
      //   ],
      //   'policyExt.companyId': [
      //     { required: true, message: '请选择保险公司', trigger: 'blur' }
      //   ],
      //   'policyExt.organizationId': [
      //     { required: true, message: '请选择所属机构', trigger: 'blur' }
      //   ],
      //   'policyExt.userId': [
      //     { required: true, message: '请选择业务员', trigger: 'blur' }
      //   ],
      //   'policyExt.operatorId': [
      //     { required: true, message: '请选择出单员', trigger: 'blur' }
      //   ],
      //   'policyExt.policyType': [
      //     { required: true, message: '请选择投保类型', trigger: 'blur' }
      //   ],
      //   'policyExt.isOffline': [
      //     { required: true, message: '请选择录入来源', trigger: 'blur' }
      //   ],
      //   'policyExt.policyStatus': [
      //     { required: true, message: '请选择订单状态', trigger: 'blur' }
      //   ],
      //   'policyExt.policyTime': [
      //     { required: true, message: '请选择签单时间', trigger: 'blur' }
      //   ],
      //   'policyExt.tciPolicyNo': [
      //     { required: true, message: '请输入交强险保单号', trigger: 'blur' }
      //   ],
      //   'policyExt.tciProposalNo': [
      //     {
      //       required: true,
      //       message: '请输入交强险投保单号',
      //       trigger: 'blur'
      //     }
      //   ],
      //   'policyExt.tciPremium': [
      //     { required: true, message: '请输入交强险保费', trigger: 'blur' }
      //   ],
      //   'policyExt.tciStartDate': [
      //     {
      //       required: true,
      //       message: '请输入交强险保险起期',
      //       trigger: 'blur'
      //     }
      //   ],
      //   'policyExt.tciEndDate': [
      //     {
      //       required: true,
      //       message: '请输入交强险保险止期',
      //       trigger: 'blur'
      //     }
      //   ],
      //   'policyExt.vehicleTax': [
      //     { required: true, message: '请输入车船税', trigger: 'blur' }
      //   ],
      //   'policyExt.tciDiscount': [
      //     { validator: disconutValidate, trigger: 'blur' }
      //   ],
      //   'policyExt.vciPolicyNo': [
      //     { required: true, message: '请输入商业险保单号', trigger: 'blur' }
      //   ],
      //   'policyExt.vciProposalNo': [
      //     {
      //       required: true,
      //       message: '请输入商业险投保单号',
      //       trigger: 'blur'
      //     }
      //   ],
      //   'policyExt.vciPremium': [
      //     { required: true, message: '请输入商业险保费', trigger: 'blur' }
      //   ],
      //   'policyExt.vciStartDate': [
      //     {
      //       required: true,
      //       message: '请选择商业险保险起期',
      //       trigger: 'blur'
      //     }
      //   ],
      //   'policyExt.vciEndDate': [
      //     {
      //       required: true,
      //       message: '请选择商业险保险止期',
      //       trigger: 'blur'
      //     }
      //   ],
      //   'policyExt.vciDiscount': [
      //     { validator: disconutValidate, trigger: 'blur' }
      //   ],
      //   'vehicleExt.licenseNo': [
      //     { required: true, message: '请输入车牌号', trigger: 'blur' },
      //     { validator: isLicenseValidate, trigger: 'change' }
      //   ],
      //   'vehicleExt.licenseNo1': [
      //     { required: true, message: '请输入车牌号', trigger: 'blur' },
      //     { validator: isLicenseValidate, trigger: 'change' }
      //   ],
      //   'vehicleExt.frameNo': [
      //     { required: true, message: '请输入车架号', trigger: 'blur' },
      //     { validator: isframeNoValidate, trigger: 'change' }
      //   ],
      //   'vehicleExt.vehicleType_': [
      //     { required: true, message: '请选择车辆种类', trigger: 'blur' }
      //   ],
      //   'vehicleExt.useNature': [
      //     { required: true, message: '请选择车使用性质', trigger: 'blur' }
      //   ],
      //   'vehicleExt.enrollDate': [
      //     { required: true, message: '请选择初登日期', trigger: 'blur' }
      //   ],
      //   'vehicleExt.purchasePrice': [
      //     { required: true, message: '请输入新车购置价', trigger: 'blur' }
      //   ],
      //   'vehicleExt.seatCount': [
      //     { required: true, message: '请输入核定座位数', trigger: 'blur' }
      //   ],
      //   'vehicleExt.transfer': [
      //     { required: true, message: '请选择车辆过户', trigger: 'blur' }
      //   ],
      //   'applicantExt.ownerName': [
      //     { required: true, message: '请输入车主姓名', trigger: 'blur' }
      //   ],
      //   'applicantExt.ownerIdType': [
      //     { required: true, message: '请选择证件类型', trigger: 'blur' }
      //   ],
      //   'applicantExt.ownerIdNo': [
      //     { required: true, message: '请输入证件号码', trigger: 'blur' }
      //   ],
      //   'applicantExt.ownerPhone': [
      //     { required: true, message: '请输入手机号', trigger: 'blur' }
      //   ],
      //   'applicantExt.insuredName': [
      //     { required: true, message: '请输入被保人姓名', trigger: 'blur' }
      //   ],
      //   'applicantExt.insuredIdType': [
      //     { required: true, message: '请选择证件类型', trigger: 'blur' }
      //   ],
      //   'applicantExt.insuredIdNo': [
      //     { required: true, message: '请输入证件号码', trigger: 'blur' }
      //   ],
      //   'applicantExt.insuredPhone': [
      //     { required: true, message: '请输入手机号', trigger: 'blur' }
      //   ],
      //   'applicantExt.holderName': [
      //     { required: true, message: '请输入投保人姓名', trigger: 'blur' }
      //   ],
      //   'applicantExt.holderIdType': [
      //     { required: true, message: '请选择证件类型', trigger: 'blur' }
      //   ],
      //   'applicantExt.holderIdNo': [
      //     { required: true, message: '请输入证件号码', trigger: 'blur' }
      //   ],
      //   'applicantExt.holderPhone': [
      //     { required: true, message: '请输入手机号', trigger: 'blur' }
      //   ],
      //   'policyExt.channelId': [
      //     { required: true, message: '请选择出单工号', trigger: 'blur' }
      //   ],
      //   'vehicleExt.brandName': [
      //     { required: true, message: '请输入品牌型号', trigger: 'blur' }
      //   ],
      //   'vehicleExt.engineNo': [
      //     { required: true, message: '请输入发动机号', trigger: 'blur' }
      //   ],
      //   'vehicleExt.vehicleType': [
      //     { required: true, message: '请选择交管车辆类型', trigger: 'blur' }
      //   ]
      // }
    }
  },
  methods: {
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
    // 获取车辆相关基础信息字典
    // getCarInfo() {
    //   this.carInfoList.loading = true
    //   getCarInfoList()
    //     .then(res => {
    //       this.carInfoList.loading = false
    //       this.carInfoList.data = res.data
    //       console.log(this.carInfoList.data)
    //     })
    //     .catch(err => {
    //       this.carInfoList.loading = false
    //       console.warn(err)
    //     })
    // },
    // 获取客户类型
    geFollowUpType() {
      this.followStatus.loading = true
      const typeCode = '00201'
      queryCustomerStatus(typeCode).then(res => {
        this.followStatus.loading = false
        this.followStatus.data = res.data
      }).catch(err => {
        this.followStatus.loading = false
        console.warn(err)
      })
    },
    // 获取保险公司列表
    getCompanyList() {
      this.companyList.loading = true
      getCompanysData()
        .then(res => {
          this.companyList.loading = false
          this.companyList.data = res.data
        })
        .catch(err => {
          this.companyList.loading = false
          console.warn(err)
        })
    },
    // 获取机构树数据
    getOrgDataList() {
      getCustomerOrgan().then(res => {
        const result = res.data
        this.orgDataList = result
      })
    },
    // 查找保险公司字典
    companyDict2(id) {
      console.log('查询字典', id)
      this.companyList.data.forEach(item => {
        if (item.id === id) {
          console.log(item.name)
          return item.name
        }
      })
    },
    // 投保公司字典
    companyDict(id) {
      let result
      switch (parseInt(id)) {
        case 0:
          result = '人保.'
          break
        case 1:
          result = '平安.'
          break
        case 2:
          result = '太平洋.'
          break
        case 3:
          result = '富德'
          break
        case 4:
          result = '诚泰'
          break
        case 5:
          result = '华安'
          break
        case 6:
          result = '阳光'
          break
        case 7:
          result = '紫金'
          break
        case 8:
          result = '大地'
          break
        case 9:
          result = '安盛天平'
          break
        case 10:
          result = '人保'
          break
        case 11:
          result = '太平'
          break
        case 12:
          result = '中华'
          break
        case 13:
          result = '天安'
          break
        case 14:
          result = '利宝'
          break
        case 15:
          result = '安心'
          break
        case 16:
          result = '中国人寿'
          break
        case 17:
          result = '永安'
          break
        case 18:
          result = '中煤'
          break
        case 19:
          result = '众安'
          break
        case 20:
          result = '太平洋'
          break
        case 21:
          result = '合众'
          break
        case 22:
          result = '安诚'
          break
        case 23:
          result = '泰山'
          break
        case 24:
          result = '华海'
          break
        case 25:
          result = '华康在线'
          break
        case 26:
          result = '渤海'
          break
        case 27:
          result = '中国人寿..'
          break
        case 28:
          result = '中意'
          break
        case 29:
          result = '燕赵'
          break
        case 30:
          result = '亚太'
          break
        case 31:
          result = '人保..'
          break
        case 34:
          result = '华泰'
          break
        case 35:
          result = '锦泰'
          break
        case 36:
          result = '都邦'
          break
        case 37:
          result = '太平洋..'
          break
        case 38:
          result = '中国人寿..'
          break
        case 39:
          result = '富德.'
          break
        case 41:
          result = '阳光.'
          break
        case 42:
          result = '太平.'
          break
        case 43:
          result = '诚泰.'
          break
        case 44:
          result = '中华.'
          break
        case 45:
          result = '中银.'
          break
        case 46:
          result = '中煤.'
          break
        case 47:
          result = '永诚.'
          break
        case 48:
          result = '安盛天平.'
          break
        case 49:
          result = '利宝.'
          break
        case 50:
          result = '天安.'
          break
        case 51:
          result = '大地.'
          break
        case 52:
          result = '紫金.'
          break
        case 53:
          result = '华安.'
          break
        case 54:
          result = '亚太.'
          break
        case 55:
          result = '中意.'
          break
        case 56:
          result = '永安.'
          break
        case 57:
          result = '中国人寿...'
          break
        case 59:
          result = '人保...'
          break
        default:
          result = '--'
      }
      return result
    },
    // 判断非空
    isNull(val) {
      return val !== undefined && val !== null && val !== ''
    }
  }
}
