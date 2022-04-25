// 渠道业务统计
const type0Card = [
  {
    title: '新增业务员',
    type: 1
  },
  {
    title: '报价次数',
    type: 8
  },
  {
    title: '报价成功车牌量',
    type: 15
  },
  {
    title: '成交车牌量',
    type: 20
  },
  {
    title: '出单件数',
    type: 23
  },
  {
    title: '成交保费',
    type: 28
  },
  {
    title: '件均保费',
    type: 31
  }
]

const type0Table = [
  {
    key: 'totalUser',
    name: '业务员总数'
  },
  {
    key: 'newUser',
    name: '新增业务员'
  },
  {
    key: 'quoteCount',
    name: '报价次数'
  },
  {
    key: 'quoteSucceedLicenseNo',
    name: '报价成功车牌量'
  },
  {
    key: 'issueLicenseNo',
    name: '成交车牌量'
  },
  {
    key: 'issueCount',
    name: '出单件数'
  },
  {
    key: 'issuePremium',
    name: '成交保费（元） '
  },
  {
    key: 'avgPremium',
    name: '件均保费（元）'
  }
]

// 运维业务员统计
const type1Card = [
  {
    title: '新增业务员',
    type: 1
  },
  {
    title: '续保查询人数',
    type: 2
  },
  {
    title: '报价人数',
    type: 3
  },
  {
    title: '核保人数',
    type: 4
  },
  {
    title: '出单人数',
    type: 5
  }
]

const type1Table = [
  {
    key: 'totalUser',
    name: '业务员总数'
  },
  {
    key: 'newUser',
    name: '新增业务员'
  },
  {
    key: 'renewalUser',
    name: '续保查询人数（去重）'
  },
  {
    key: 'quoteUser',
    name: '报价人数（去重）'
  },
  {
    key: 'insureUser',
    name: '核保人数（去重）'
  },
  {
    key: 'issueUser',
    name: '出单人数（去重）'
  }
]

// 运维次数统计
const type2Card = [
  {
    title: '续保查询次数',
    type: 6
  },
  {
    title: '续保查询成功次数',
    type: 7
  },
  {
    title: '报价次数',
    type: 8
  },
  {
    title: '报价成功次数',
    type: 9
  },
  {
    title: '核保次数',
    type: 10
  },
  {
    title: '核保成功次数',
    type: 11
  }
]

const type2Table = [
  {
    key: 'renewalCount',
    name: '续保查询次数'
  },
  {
    key: 'renewalSucceedCount',
    name: '续保查询成功次数'
  },
  {
    key: 'quoteCount',
    name: '报价次数'
  },
  {
    key: 'quoteSucceedCount',
    name: '报价成功次数'
  },
  {
    key: 'insureCount',
    name: '核保次数'
  },
  {
    key: 'insureSucceedCount',
    name: '核保成功次数'
  }
]

// 运维车牌量统计
const type3Card = [
  {
    title: '续保查询车牌量',
    type: 12
  },
  {
    title: '续保查询成功车牌量',
    type: 13
  },
  {
    title: '报价车牌量',
    type: 14
  },
  {
    title: '报价成功车牌量',
    type: 15
  },
  {
    title: '核保车牌量',
    type: 16
  },
  {
    title: '核保成功车牌量',
    type: 17
  },
  {
    title: '移动成交车牌量',
    type: 18
  },
  {
    title: '电脑成交车牌量',
    type: 19
  },
  {
    title: '合计成交车牌量',
    type: 20
  }
]

const type3Table = [
  {
    key: 'renewalLicenseNo',
    name: '续保查询车牌量'
  },
  {
    key: 'renewalSucceedLicenseNo',
    name: '续保查询成功车牌量'
  },
  {
    key: 'renewalSuccessRate',
    name: '续保查询成功率'
  },
  {
    key: 'quoteLicenseNo',
    name: '报价车牌量'
  },
  {
    key: 'quoteSucceedLicenseNo',
    name: '报价成功车牌量'
  },
  {
    key: 'quoteSuccessRate',
    name: '报价成功率'
  },
  {
    key: 'insureLicenseNo',
    name: '核保车牌量'
  },
  {
    key: 'insureSucceedLicenseNo',
    name: '核保成功车牌量'
  },
  {
    key: 'insureSuccessRate',
    name: '核保成功率'
  },
  {
    key: 'issueLicenseNo',
    name: '移动成交车牌量'
  },
  {
    key: 'issueLicenseNoPc',
    name: '电脑成交车牌量'
  },
  {
    key: 'issueLicenseNoTotal',
    name: '合计成交车牌量'
  }
]

// 运维车牌量统计
const type4Card = [
  {
    title: '移动出单件数',
    type: 21
  },
  {
    title: '电脑出单件数',
    type: 22
  },
  {
    title: '合计出单件数',
    type: 23
  },
  {
    title: '报价出单率',
    type: 24
  },
  {
    title: '车辆出单率',
    type: 25
  },
  {
    title: '移动成交保费（元）',
    type: 26
  },
  {
    title: '电脑成交保费（元）',
    type: 27
  },
  {
    title: '合计成交保费（元）',
    type: 28
  },
  {
    title: '人均产能（元）',
    type: 29
  },
  {
    title: '有效人均件数',
    type: 30
  },
  {
    title: '件均保费（元）',
    type: 31
  }
]

const type4Table = [
  {
    key: 'issueCount',
    name: '移动出单件数'
  },
  {
    key: 'issueCountPc',
    name: '电脑出单件数'
  },
  {
    key: 'issueTotal',
    name: '合计出单件数'
  },
  {
    key: 'quoteIssueRate',
    name: '报价出单率'
  },
  {
    key: 'vehicleIssueRate',
    name: '车辆出单率'
  },
  {
    key: 'issuePremium',
    name: '移动成交保费（元）'
  },
  {
    key: 'issuePremiumPc',
    name: '电脑成交保费（元）'
  },
  {
    key: 'issuePremiumTotal',
    name: '合计成交保费（元）'
  },
  {
    key: 'perCapitaCapacity',
    name: '人均产能（元）'
  },
  {
    key: 'perCapitaValidCount',
    name: '有效人均件数'
  },
  {
    key: 'avgPremium',
    name: '件均保费（元）'
  }
]

export function getDataByType(apiType) {
  switch (apiType) {
    case 0:
      return type0Card
    case 1:
      return type1Card
    case 2:
      return type2Card
    case 3:
      return type3Card
    case 4:
      return type4Card
  }
}

export function getListByType(apiType) {
  switch (apiType) {
    case 0:
      return type0Table
    case 1:
      return type1Table
    case 2:
      return type2Table
    case 3:
      return type3Table
    case 4:
      return type4Table
  }
}
