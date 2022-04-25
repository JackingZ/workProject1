
const customer = {
  state: {
    customerDetail: {},
    customerQuoteRecord: {},
    previInsureInfo: [],
    customerChannelCode: '', // 客户的所属渠道编码
    refreshData: []
  },
  mutations: {
    setCustomer(state, data) { // 客户信息
      console.log('存数据')
      //   console.log(data)
      state.customerDetail = JSON.parse(data)
      sessionStorage.setItem('customerDetailInfo', data)
    },
    setQuoteRecord(state, data) { // 报价记录
      state.customerQuoteRecord = data
      sessionStorage.setItem('customerQuoteRecord', JSON.stringify(data))
    },
    setPreviInsure(state, data) { // 往年投保数据
      state.previInsureInfo = data
      sessionStorage.setItem('previInsureInfo', JSON.stringify(data))
    },
    setChannelCode(state, data) { // 设置客户渠道编码
      // console.log('设置客户渠道编码', data)
      state.customerChannelCode = data
      sessionStorage.setItem('customerChannelCode', data)
    },
    setRefreshData(state, data) {
      // console.log('刷新续保的数据', data)
      state.refreshData = data.concat()
      sessionStorage.setItem('refreshData', data)
    }
  },
  getters: {
    customerR: state => {
      return state.customerDetail.customer || {}
    },
    applicantR: state => {
      return state.customerDetail.applicant || {}
    },
    carInfoR: state => {
      return state.customerDetail.carInfo || {}
    },
    quoteRecords: state => {
      return state.customerDetail.quoteRecords || {}
    },
    baseInfo: state => {
      return state.customerQuoteRecord.baseInfo || {}
    },
    riskList: state => {
      return state.customerQuoteRecord.riskList || []
    },
    prevRisks: state => { // 往年投保险种列表
      const mainRisk = []
      console.log('险种列表', state.previInsureInfo)
      if (state.previInsureInfo.risks && state.previInsureInfo.risks.length > 0) {
        state.previInsureInfo.risks.forEach(item => {
          if (item.riskCode) {
            mainRisk.push(item)
          }
        })
        return state.previInsureInfo.risks
      } else {
        return []
      }
    },
    prevPolicy: state => {
      return state.previInsureInfo.policy || {}
    },
    refreshList: state => {
      return state.refreshData || []
    },
    previInsureInfo: state => {
      return state.previInsureInfo || []
    },
    customerQuoteRecord: state => { // 客户报价记录
      return state.customerQuoteRecord || {}
    }
    // quotoInfo: state=>{ // 客户报价记录信息
    //   return state.customerQuoteRecord || {}
    // }
  }
}
export default customer
