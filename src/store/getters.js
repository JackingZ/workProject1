const ChannelCode = {
  // 悦保
  yuebao: 'yuebao-001',
  // 运维渠道
  subAdmin: 'yuebao-002',
  // 悦保公众号
  yuebaoWeixin: 'yuebao-100',
  // 快保
  daTong: '001'
}
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userAll: state => state.user.userAll,
  userInfo: state => state.user.userInfo,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  visitedViews: state => state.tagsView.visitedViews,
  Authorization: state => state.user.Authorization,
  getLastCompany(state) {
    if (!state.user.userAll) return
    const userInfo = state.user.userAll.data
    if (userInfo.belongCompanys && userInfo.belongCompanys.length === 0) {
      return {}
    }
    return userInfo.belongCompanys.sort((a, b) => b.level - a.level)[0]
  },
  getLastBelongCompany(state) {
    if (!state.user.userAll) return
    const userInfo = state.user.userAll.data
    const companies = userInfo.belongCompanys || []
    return companies[companies.length - 1]
  },
  /**
     * 判断登陆用户是否是管理员渠道
     */
  isAnyAdminChannel(state, getters) {
    return getters.isRootAdminChannel || getters.isSubAdminChannel
  },
  /**
   * 判断登录用户是否是超级管理员渠道
   */
  isRootAdminChannel(state) {
    if (!state.user.userAll) return
    const userInfo = state.user.userAll.data
    return userInfo.channelCode === ChannelCode.yuebao
  },
  /**
   * 判断登陆用户是否是运维管理员渠道
   */
  isSubAdminChannel(state) {
    if (!state.user.userAll) return
    const userInfo = state.user.userAll.data
    return userInfo.channelCode === ChannelCode.subAdmin || userInfo.channelCode === ChannelCode.yuebao
  },

  /**
   * 判断登陆用户是否 非分销渠道
   */
  isDistributionChannel(state) {
    if (!state.user.userAll) return
    const userInfo = state.user.userAll.data
    return userInfo.channelType !== '2'
  }
}
export default getters
