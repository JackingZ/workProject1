
const system = {
  state: {
    channelID: null
  },
  mutations: {
    'setChannelId'(state, payload) {
      state.channelID = payload
    }
  }
}

export default system
