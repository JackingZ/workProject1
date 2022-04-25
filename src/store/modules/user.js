import { login, logout, getInfo, getAll } from '@/api/login'
import { getToken, getPermission, setToken, removeToken, setUserInfo, getUserInfo, setUserAll, getUserAll, getTokenType, setTokenType, removeTokenType } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    token_type: getTokenType(),
    Authorization: `${getTokenType()} ${getToken()}`,
    name: '',
    avatar: 'https://www.ybinsure.com/spa/commonManagerTest/assets/img/avatar.jpg',
    roles: [],
    userInfo: getUserInfo(),
    userAll: getUserAll(), // 从localStorage中获取赋值
    permissions: getPermission()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TOKEN_TYPE: (state, type) => {
      state.token_type = type
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      state.permissions = userInfo.authorities
    },
    SET_USERALL: (state, userAll) => {
      state.userAll = userAll
    },
    SETZ_AUTH: (state, token) => {
      state.Authorization = token
    }
  },

  actions: {
    // 登录
    Login({ commit }, { userInfo, channelCode }) {
      const username = userInfo.username.trim() + '---' + channelCode
      const clientId = 'yuebao-manager'
      const clientSecret = 'c33367701511b4f6020ec61ded352059'
      const grantType = 'password'
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, clientId, clientSecret, grantType).then(response => {
          const access_token = response.access_token
          const token_type = response.token_type
          setToken(access_token)
          setTokenType(token_type)
          commit('SET_TOKEN', access_token)
          commit('SET_TOKEN_TYPE', token_type)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          setUserInfo(response)
          commit('SET_USERINFO', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户全部信息
    GetAll({ commit }) {
      return new Promise((resolve, reject) => {
        getAll().then(response => {
          setUserAll(response)
          commit('SET_USERALL', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_TOKEN_TYPE', '')
          removeToken()
          removeTokenType()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_TOKEN_TYPE', '')
        removeToken()
        removeTokenType()
        resolve()
      })
    }
  }
}

export default user
