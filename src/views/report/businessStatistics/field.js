export function getFields(isAnyAdminChannel) {
  if (isAnyAdminChannel) {
    return [
      {
        name: '业务员总数',
        check: true
      },
      {
        name: '新增业务员',
        check: true
      },
      {
        name: '续保查询人数(去重)',
        check: true
      },
      {
        name: '报价人数(去重)',
        check: true
      },
      {
        name: '核保人数(去重)',
        check: true
      },
      {
        name: '出单人数(去重)',
        check: true
      },
      {
        name: '续保查询次数',
        check: true
      },
      {
        name: '续保查询成功次数',
        check: true
      },
      {
        name: '报价次数',
        check: true
      },
      {
        name: '报价成功次数',
        check: true
      },
      {
        name: '核保次数',
        check: true
      },
      {
        name: '核保成功次数',
        check: true
      },
      {
        name: '续保查询车牌量',
        check: true
      },
      {
        name: '续保查询成功车牌量',
        check: true
      },
      {
        name: '续保查询成功率',
        check: true
      },
      {
        name: '报价车牌量',
        check: true
      },
      {
        name: '报价成功车牌量',
        check: true
      },
      {
        name: '报价成功率',
        check: true
      },
      {
        name: '核保车牌量',
        check: true
      },
      {
        name: '核保成功车牌量',
        check: true
      },
      {
        name: '核保成功率',
        check: true
      },
      {
        name: '移动出单件数',
        check: true
      },
      {
        name: '电脑出单件数',
        check: true
      },
      {
        name: '合计出单件数',
        check: true
      },
      {
        name: '报价出单率',
        check: true
      },
      {
        name: '车辆出单率',
        check: true
      },
      {
        name: '移动成交保费(元)',
        check: true
      },
      {
        name: '电脑成交保费(元)',
        check: true
      },
      {
        name: '合计成交保费(元)',
        check: true
      },
      {
        name: '人均产能(元)',
        check: true
      },
      {
        name: '有效人均件数',
        check: true
      },
      {
        name: '件均保费(元)',
        check: true
      }
    ]
  } else {
    return [
      {
        name: '新增业务员',
        check: true
      },
      {
        name: '报价次数',
        check: true
      },
      {
        name: '报价成功车牌量',
        check: true
      },
      {
        name: '成交车牌量',
        check: true
      },
      {
        name: '出单件数',
        check: true
      },
      {
        name: '成交保费',
        check: true
      },
      {
        name: '件均保费',
        check: true
      }
    ]
  }
}
