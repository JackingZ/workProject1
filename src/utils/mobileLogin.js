export function getMockLoginFunc(ctx) {
  return function(query = {}, params) {
    const version = process.env.BUILD_VER
    function getPrefix() {
      switch (version) {
        case 'prod':
          return 'newCar'
        case 'test':
          return 'newCarTest'
        case 'test2':
          return 'newCarTest2'
      }
    }
    const prefix = getPrefix()
    const host = process.env.NODE_ENV === 'production' ? '' : '//ybinsure.com'
    // const userState = ctx.$store.state.user
    // const userType = userState.userAll.data.userType
    // 判断是否业务员
    // const routePath = userType === '3' ? 'mockLogin' : ''
    // const otherParams = userType === '3' ? `&token=${ctx.$store.state.user.token}` : ''
    // yuebao-001渠道打开移动出单恢复为当前渠道了，改回原来使用的悦保车险移动出单链接，渠道号【yuebao-100】 yuebao-100 === 100，
    let channelCode = ctx.$store.getters.userAll.data.channelCode
    let otherParams = `&token=${ctx.$store.state.user.token}`
    let operatorId = ctx.$store.getters.userAll.data.id
    if (params) {
      channelCode = params.channelCode
      operatorId = params.operatorId
      otherParams = `&token=${params.token}`
    }
    const isLoginByUser = /^(yuebao-001)$/.test(channelCode) // 大童，悦保用户 需要手动登录
    // const routePath = isLoginByUser ? '' : 'mockLogin' // 是否需要手动登录
    console.log(otherParams)
    // 车商参数
    let dealerParams = ''
    if (query.carDealerId) {
      dealerParams += `&carDealerId=${query.carDealerId}`
    }
    if (query.carLicense) {
      dealerParams += `&carLicense=${query.carLicense}`
    }
    if (query.frameNo) {
      dealerParams += `&frameNo=${query.frameNo}`
    }
    const carDealer = ctx.$store.getters.userAll.data.carDealer
    // console.log('carDealer', carDealer)
    const isCarDealer = carDealer === 0 // 是否车商渠道帐号
    if (isCarDealer) {
      dealerParams += `&isCarDealer=true`
    }
    if (isLoginByUser) {
      switch (channelCode) {
        case 'yuebao-001':
          return `${host}/spa/${prefix}/mockLogin?s=100&enableLogout=yes&operatorId=${operatorId}${otherParams}${dealerParams}#`
        default:
          return `${host}/spa/${prefix}/mockLogin?s=${channelCode}&enableLogout=yes&operatorId=${operatorId}${otherParams}${dealerParams}#`
      }
    } else {
      return `${host}/spa/${prefix}/mockLogin?s=${channelCode}&enableLogout=yes&operatorId=${operatorId}${otherParams}${dealerParams}#`
    }
    // return `${host}/spa/${prefix}/${routePath}?s=${channelCode}&enableLogout=yes&operatorId=${operatorId}${otherParams}${dealerParams}#`
  }
}
