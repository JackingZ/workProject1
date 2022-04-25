import dayjs from 'dayjs'
// 计算两个时间之间的差值返回天数（保险剩余时间）
export const getDQDate = (t1, t2) => {
  const today = dayjs(dayjs().format('YYYY-MM-DD 00:00:00')).valueOf()
  let status = ''
  let temp = null
  if (t1 && t2) { // 只要两者中有一过期就过期
    const date1 = dayjs(dayjs(t1).format('YYYY-MM-DD 23:59:59')).valueOf()
    const date2 = dayjs(dayjs(t2).format('YYYY-MM-DD 23:59:59')).valueOf()
    /* if (date1 < today && date2 < today) { // 在当天之前的止期均不计算
      return ''
      // if (date1 >= date2) {
      //   temp = date1
      // } else {
      //   temp = date2
      // }
    } else if (date1 < today && date2 > today) {
      temp = date2
    } else if (date1 > today && date2 < today) {
      temp = date1
    } else {
      if (date1 >= date2) {
        temp = date2
      } else {
        temp = date1
      }
    } */
    const min1 = Math.abs(date1 - today)
    const min2 = Math.abs(date2 - today)
    if (min1 >= min2) {
      temp = date2
    } else {
      temp = date1
    }
  } else if (!t1 && !t2) {
    return ''
  } else if (!t1) {
    temp = dayjs(dayjs(t2).format('YYYY-MM-DD 23:59:59')).valueOf()
  } else {
    temp = dayjs(dayjs(t1).format('YYYY-MM-DD 23:59:59')).valueOf()
  }
  const time = temp - today
  const days = Math.floor(time / (24 * 3600000))
  if (days >= 0 && days <= 90) {
    status = days + '天'
  } else {
    status = ''
  }
  /* if (days >= 0) {
    if (days <= 90) {
      status = days + '天'
    } else {
      status = ''
    }
  } else {
    const count = 365 + (days % 365)
    if (count <= 90) {
      status = count + '天'
    } else {
      status = ''
    }
  } */
  return status
}

// 搜索时先将空字符串转为null
export function clearString(obj) {
  for (const key in obj) {
    if (obj[key] === '') {
      obj[key] = null
    }
  }
}

// 为空判断
export function isNull(param) {
  return (param === null || param === undefined || param === '')
}

/**
 * 获取base64转化的blob
 * // @param basestr base64字符串
 * // @param type 转换类型 图片类型
 * // @returns {*} blob对象
 */
export function getBase64ToBlob(basestr, type) {
  const text = window.atob(basestr.split(',')[1])
  const buffer = new Uint8Array(text.length)
  for (let i = 0; i < text.length; i++) {
    buffer[i] = text.charCodeAt(i)
  }
  return getBlob([buffer], type)
}

/**
 * 获取blob对象的兼容性写法
 * // @param buffer
 * // @param format
 * // @returns {*}
 */
function getBlob(buffer, format) {
  try {
    return new Blob(buffer, {
      type: format
    })
  } catch (e) {
    const bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder)()
    buffer.forEach(function(buf) {
      bb.append(buf)
    })
    return bb.getBlob(format)
  }
}

// 抓单功能
export const zdRrules = {
  companyId: [{
    required: true,
    message: '保险公司不能为空',
    trigger: 'change'
  }],
  channelId: [{
    required: true,
    message: '工号不能为空',
    trigger: 'change'
  }],
  policyType: [{
    required: true,
    message: '险种类型不能为空',
    trigger: 'change'
  }],
  team: [{
    required: true,
    message: '所属团队不能为空',
    trigger: 'change'
  }],
  userId: [{
    required: true,
    message: '业务员不能为空',
    trigger: 'change'
  }],
  arrs: [{
    required: true,
    message: '抓单必填信息不能为空',
    trigger: 'change'
  }]

}
// 录入保单
export const PolicyInfo = () => {
  return {
    policy: {
      companyId: '', // 保险公司Id string
      channelId: '', // 工号 integer
      policyType: 3, // 保单种类
      businessType: '', // 业务类型 string
      receiveAddress: '', // 保单邮寄地址string
      receiveName: '', // 收件人 string
      receivePhone: '', // 收件人联系电话 string
      tciDiscount: '', // 交强险折扣 number
      tciEndDate: '', // 交强险保险止期2018-09-13T02:30:51.657Z
      tciLossOccurredCount: null, // 交强险出险次数 string
      // tciNetPremium: '', // 交强险净保费 number
      tciPolicyNo: '', // 交强保单号 string
      tciPolicyTime: '', // 交强险签单时间 string
      tciPremium: '', // 交强险全保费 number
      tciStartDate: '', // 交强险保险起期 ,string
      team: null, // 所属团队,string
      userId: '', // 业务员,string
      vciDiscount: '', // 商业险折扣 number
      vciEndDate: '', // 商业险保险止期 string
      vciLossOccurredCount: '', // 商业险出险次数string
      vciPolicyNo: '', // 商业保单号 string
      vciPolicyTime: '', // 商业险签单时间string
      vciPremium: '', // 商业险全保费number
      vciProposalNo: '', // string
      vciStartDate: '', // 商业险保险起期 string
      vehicleTax: '', // 车船税number
      organization: '', // 出单机构团队返回值
      common: '' // 备注信息
    },
    vehicle: {
      isNew: 0, // 是否为新车
      licenseNo: '', // 车牌号
      brandName: '', // 厂牌型号
      frameNo: '', // 车架号
      engineNo: '', // 发动机号
      vehicleCategory: '', // 车辆类型
      vehicleType: '', // 交管车辆类型
      plateType: '', // 号牌种类
      plateColor: '', // 号牌底色
      useNature: '', // 使用性质
      attachNature: '', // 使用性质细分
      energyType: '', // 能源类型
      modelCode: '', // 车型编码
      seatCount: 5, // 核定座位数
      tonnage: '', // 核载质量
      curbWeight: '', // 整备质量
      displacement: '', // 排量/功率
      purchasePrice: '', // 新车价格
      enrollDate: '', // 初登日期
      transfer: '', // 是否过户
      transferDate: '' // 过户日期
    },
    applicant: {
      ownerName: '', // 车主
      ownerOptions: [], // 所属性质
      ownerIdType: '', // 车主证件类型
      ownerIdNo: '', // 车主证件号码
      ownerPhone: '', // 车主联系电话
      ownerAddr: '', // 车主联系地址
      ownerSex: null, // 车主性别
      ownerBirthday: '', // 出生日期
      ownerAge: '', // 车主年龄
      linkmanName: '', // 双录执行人姓名
      linkmanIdNo: '', // 双录执行人身份证号
      salesmanName: '', // 销售人员姓名
      salesmanIdNo: '', // 销售人员身份证
      insuredName: '', // 被保人名称
      insuredOptions: [], // 被保人所属性质
      insuredIdType: '', // 被保人证件类型
      insuredIdNo: '', // 被保人证件号码
      insuredBirthday: '', // 被保人出生日期
      insuredAddr: '', // 被保人联系地址
      insuredPhone: '', // 被保人联系电话
      insuredSex: null, // 被保人性别
      insuredAge: '', // 被保人年龄
      holderName: '', // 投保人名称
      holderOptions: [], // 投保人所属性质
      holderIdType: '', // 投保人证件类型
      holderIdNo: '', // 投保人证件号码
      holderBirthday: '', // 投保人出生日期
      holderAddr: '', // 投保人联系地址
      holderPhone: '', // 投保人联系电话
      holderSex: null, // 投保人性别
      holderAge: '' // 投保人年龄
    }
  }
}

export const policyForm = () => {
  return {
    companyId: '', // 保险公司Id string
    channelId: '', // 工号 integer
    policyType: 3, // 保单种类
    businessType: '', // 业务类型 string
    receiveAddress: '', // 单邮寄地址string
    receiveName: '', // 收件人 string
    receivePhone: '', // 收件人联系电话 string
    tciDiscount: '', // 交强险折扣 number
    tciEndDate: '', // 交强险保险止期2018-09-13T02:30:51.657Z
    tciLossOccurredCount: null, // 交强险出险次数 string
    tciPolicyNo: '', // 交强保单号 string
    tciPolicyTime: '', // 交强险签单时间 string
    tciPremium: '', // 交强险全保费 number
    tciStartDate: '', // 交强险保险起期 ,string
    team: null, // 所属团队,string
    userId: '', // 业务员,string
    vciDiscount: '', // 商业险折扣 number
    vciEndDate: '', // 商业险保险止期 string
    vciLossOccurredCount: '', // 商业险出险次数string
    vciPolicyNo: '', // 商业保单号 string
    vciPolicyTime: '', // 商业险签单时间string
    vciPremium: '', // 商业险全保费number
    vciProposalNo: '', // string
    vciStartDate: '', // 商业险保险起期 string
    vehicleTax: '', // 车船税number
    organization: '', // 出单机构团队返回值
    common: '' // 备注信息
  }
}
// 录入保单验证信息
export const policyRrules = {
  'companyId': [{
    required: true,
    message: '请选择保险公司',
    trigger: 'change'
  }],
  'channelId': [{
    required: true,
    message: '请选择选择工号',
    trigger: 'change'
  }],
  'team': [{
    required: true,
    message: '请选择所属团队',
    trigger: 'change'
  }],
  'userId': [{
    required: true,
    message: '续保专员不能为空',
    trigger: 'change'
  }],
  'policyType': [{
    required: true,
    message: '保单种类不能为空',
    trigger: 'change'
  }],
  'tciPolicyNo': [{
    required: true,
    message: '交强险保单号不能为空',
    trigger: 'blur'
  }],
  'tciPremium': [{
    required: true,
    message: '交强险全保费不能为空',
    trigger: 'blur'
  }],
  'vehicleTax': [{
    required: true,
    message: '车船税不能为空',
    trigger: 'change'
  }],
  'tciStartDate': [{
    required: true,
    message: '请选择交强险起保起期',
    trigger: 'change'
  }],
  'tciPolicyTime': [{
    required: true,
    message: '交强险签单时间',
    trigger: 'change'
  }],
  'vciPolicyNo': [{
    required: true,
    message: '商业险保单号不能为空'
  }],
  'vciPremium': [{
    required: true,
    message: '商业险全保费不能为空',
    trigger: 'blur'
  }],
  'vciStartDate': [{
    required: true,
    message: '请选择商业险起保起期',
    trigger: 'change'
  }],
  'vciPolicyTime': [{
    required: true,
    message: '请选择商业险签单时间',
    trigger: 'change'
  }]
}
export const tbdataRrules = {
  'policy.companyId': [{
    required: true,
    message: '请选择保险公司',
    trigger: 'change'
  }],
  'policy.policyType': [{
    required: true,
    message: '保单种类不能为空',
    trigger: 'change'
  }],
  'policy.tciPolicyNo': [{
    required: true,
    message: '交强险保单号不能为空',
    trigger: 'blur'
  }],
  'policy.tciPremium': [{
    required: true,
    message: '交强险全保费不能为空',
    trigger: 'blur'
  }],
  'policy.vehicleTax': [{
    required: true,
    message: '车船税不能为空',
    trigger: 'blur'
  }],
  'policy.tciPolicyTime': [{
    required: true,
    message: '请选择交强险签单时间',
    trigger: 'change'
  }],
  'policy.tciStartDate': [{
    required: true,
    message: '请选择交强险起保起期',
    trigger: 'change'
  }],
  'policy.tciEndDate': [{
    required: true,
    message: '请选择交强险保险止期',
    trigger: 'change'
  }],
  'policy.vciPolicyNo': [{
    required: true,
    message: '商业险保单号不能为空',
    trigger: 'blur'
  }],
  'policy.vciPremium': [{
    required: true,
    message: '商业险全保费不能为空',
    trigger: 'blur'
  }],
  'policy.vciPolicyTime': [{
    required: true,
    message: '请选择商业险签单时间',
    trigger: 'change'
  }],
  'policy.vciStartDate': [{
    required: true,
    message: '请选择商业险起保起期',
    trigger: 'change'
  }],
  'policy.vciEndDate': [{
    required: true,
    message: '请选择商业险保险止期',
    trigger: 'change'
  }],
  'policy.organization': [{
    required: true,
    message: '出单机构不能为空',
    trigger: 'change'
  }],
  'policy.team': [{
    required: true,
    message: '所属团队不能为空',
    trigger: 'change'
  }],
  'policy.userId': [{
    required: true,
    message: '业务员不能为空',
    trigger: 'change'
  }],
  'policy.policyTime': [{
    type: 'date',
    required: true,
    message: '签单日期不能为空'
  }],
  'policy.startDate': [{
    type: 'date',
    required: true,
    message: '保险起期不能为空'
  }],
  'policy.endDate': [{
    type: 'date',
    required: true,
    message: '保险止期不能为空'
  }],
  'policy.premium': [{
    required: true,
    message: '请输入全保费',
    trigger: 'blur'
  }],
  'vehicle.isNew': [{
    required: true,
    message: '是否新车不能为空',
    trigger: 'change'
  }],
  'vehicle.vehicleType': [{
    required: true,
    message: '车辆类型不能为空',
    trigger: 'change'
  }],
  'vehicle.vehicleCategory': [{
    required: true,
    message: '车辆种类不能为空',
    trigger: 'change'
  }],
  'vehicle.useNature': [{
    required: true,
    message: '使用性质不能为空',
    trigger: 'change'
  }],
  'vehicle.attachNature': [{
    required: true,
    message: '使用性质细分不能为空',
    trigger: 'change'
  }],
  'vehicle.frameNo': [{
    required: true,
    message: '车架号不能为空',
    trigger: 'blur'
  }],
  'vehicle.enrollDate': [{
    required: true,
    message: '初登日期不能为空',
    trigger: 'change'
  }],

  'applicant.team': [{
    required: true,
    message: '所属团队不能为空',
    trigger: 'blur'
  }],

  'applicant.ownerName': [{
    required: true,
    message: '车主信息不能为空',
    trigger: 'blur'
  }],
  'applicant.ownerNature': [{
    required: true,
    message: '车辆所属性质不能为空',
    trigger: 'change'
  }],
  'applicant.ownerOptions': [{
    required: true,
    message: '证件类型不能为空',
    trigger: 'change'
  }],
  'applicant.ownerIdNo': [{
    required: true,
    message: '证件号不能为空',
    trigger: 'blur'
  }],
  'applicant.insuredName': [{
    required: true,
    message: '车主信息不能为空',
    trigger: 'blur'
  }],
  'applicant.insuredNature': [{
    required: true,
    message: '车辆所属性质不能为空',
    trigger: 'change'
  }],
  'applicant.insuredOptions': [{
    required: true,
    message: '证件类型不能为空',
    trigger: 'change'
  }],
  'applicant.insuredIdNo': [{
    required: true,
    message: '证件号不能为空',
    trigger: 'blur'
  }],

  'applicant.holderName': [{
    required: true,
    message: '车主信息不能为空',
    trigger: 'blur'
  }],
  'applicant.holderNature': [{
    required: true,
    message: '车辆所属性质不能为空',
    trigger: 'change'
  }],
  'applicant.holderOptions': [{
    required: true,
    message: '证件类型不能为空',
    trigger: 'change'
  }],
  'applicant.holderIdNo': [{
    required: true,
    message: '证件号不能为空',
    trigger: 'blur'
  }],

  'applicant.ownerPhone': [{
    required: true,
    message: '车主联系电话不能为空',
    trigger: 'blur'
  }],
  'applicant.holderPhone': [{
    required: true,
    message: '投保人信息联系电话不能为空',
    trigger: 'blur'
  }],
  'applicant.insuredPhone': [{
    required: true,
    message: '被保人联系电话不能为空',
    trigger: 'blur'
  }],
  'vehicle.purchasePrice': [{
    required: true,
    message: '新车购置价不能为空',
    trigger: 'blur'
  }],
  'policy.businessType': [{
    required: true,
    message: '请选择业务类型',
    trigger: 'change'
  }],
  'vehicle.licenseNo': [{
    required: true,
    message: '车牌号为空或者不正确',
    trigger: 'blur'
  }],
  // 非必填
  'vehicle.seatCount': [{
    required: true,
    message: '核定座位数异常',
    trigger: 'blur'
  }]
}
