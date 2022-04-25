/* eslint-disable */
import {
  getProperty,
  IssuePropertyTypeCodeEnum
} from '@/views/insurance/service/issue-property.service'
import request from '@/utils/request'
import constant from '@/api/constant'
import store from '@/store/index'
import {
  Base64
} from 'js-base64'
import ProxyClass from '@/views/insurance/service/proxy'

const defaultCodeSnippet = 'document.documentElement.appendChild(script)'

const Kernel = {
  IE: 'ie',
  CHROME: 'chrome'
}

const splitHostName = url => {
  const a = document.createElement('a')
  a.href = url
  return a.hostname
}

const choose = (code, sources) => {
  for (const item of sources) {
    if (item.code === code) {
      return item.text
    }
  }
  return undefined
}
// 获取保险工号
export function queryByToken() {
  return request({
    url: constant.insureDataCenter,
    method: 'post',
    data: {
      channelCode: store.getters.userAll.data.channelCode,
      companyIds: store.state.user.userInfo.company
    }
  })
}

const InsureCompanySourceCodeEnum = {
  renBao: '0001300001',
  pingAn: '0001300002',
  taiPingYang: '0001300003',
  fuDe: '0001300004',
  chengTai: '0001300005',
  yangGuang: '0001300006',
  ziJin: '0001300007',
  daDi: '0001300008',
  huaAn: '0001300009',
  anShengTianPing: '0001300010',
  taiPing: '0001300011',
  zhongHua: '0001300012',
  tianAn: '0001300013',
  liBao: '0001300014',
  anXin: '0001300015',
  guoShouCai: '0001300016',
  yongAn: '0001300017',
  zhongMei: '0001300018',
  zhongAn: '0001300019',
  heZhong: '0001300020',
  anCheng: '0001300021',
  taiShan: '0001300022',
  huaHai: '0001300023',
  taiKang: '0001300024',
  boHai: '0001300025',
  zhongYi: '0001300026',
  yangZhao: '0001300027',
  yaTai: '0001300028',
  huaTai: '0001300029',
  jinTai: '0001300030'
}
const version = process.env.BUILD_VER
let httpEnv
if (version === 'test' || version === 'test2') {
  httpEnv = '//www.ybinsure.com/static/issueScriptTest'
} else {
  httpEnv = '//www.ybinsure.com/static/issueScript'
}
const scriptHost = httpEnv

// 配置的保险公司代理信息
const configProxyInfo = new Map()
configProxyInfo.set('cpic.com.', {
  companyId: InsureCompanySourceCodeEnum.taiPingYang
}) // 太平洋
configProxyInfo.set('pingan.com.cn', {
  companyId: InsureCompanySourceCodeEnum.pingAn
}) // 平安
configProxyInfo.set('champion-ic.com', {
  companyId: InsureCompanySourceCodeEnum.chengTai
}) // 诚泰
configProxyInfo.set('tpaic.com', {
  companyId: InsureCompanySourceCodeEnum.anShengTianPing
}) // 安盛天平
configProxyInfo.set('58.247.8.4', {
  companyId: InsureCompanySourceCodeEnum.anShengTianPing
}) // 安盛天平
configProxyInfo.set('180.168.192.16', {
  companyId: InsureCompanySourceCodeEnum.anShengTianPing
}) // 安盛天平
configProxyInfo.set('axatp.com', {
  companyId: InsureCompanySourceCodeEnum.anShengTianPing
}) // 安盛天平
configProxyInfo.set('cntaiping.com', {
  companyId: InsureCompanySourceCodeEnum.taiPing
}) // 太平
configProxyInfo.set('sino-life.com', {
  companyId: InsureCompanySourceCodeEnum.fuDe
}) // 富德
configProxyInfo.set('sinosafe.com', {
  companyId: InsureCompanySourceCodeEnum.huaAn
}) // 华安
configProxyInfo.set('libertymutual.com', {
  companyId: InsureCompanySourceCodeEnum.liBao
}) // 利宝
configProxyInfo.set('10.134.138.48', {
  companyId: InsureCompanySourceCodeEnum.renBao
}) // 人保广东
configProxyInfo.set('10.134.131.48', {
  companyId: InsureCompanySourceCodeEnum.renBao
}) // 人保天津
configProxyInfo.set('10.134.130.208', {
  companyId: InsureCompanySourceCodeEnum.renBao
}) // 人保深圳
configProxyInfo.set('10.134.136.48', {
  companyId: InsureCompanySourceCodeEnum.renBao
}) // 人保北京
configProxyInfo.set('10.134.138.80', {
  companyId: InsureCompanySourceCodeEnum.renBao
}) // 人保安徽
configProxyInfo.set('10.134.136.112', {
  companyId: InsureCompanySourceCodeEnum.renBao
}) // 人保江苏
configProxyInfo.set('10.134.136.48', {
  companyId: InsureCompanySourceCodeEnum.renBao
}) // 人保大童本部
configProxyInfo.set('10.134.131.80', {
  companyId: InsureCompanySourceCodeEnum.renBao
}) // 人保陕西
configProxyInfo.set('10.134.138.16', {
  companyId: InsureCompanySourceCodeEnum.renBao
}) // 人保四川

class ProxyInfoService {
  constructor() {
    this.proxyMap = new Map()
    this.kernels = []
    this.insureCompanies = []
    this.openNewProcessKey = 'openNewProcessQwed@@@123'
  }
  /**
   * 查询保险公司工号信息
   */
  async initGetJsonFunc() {
    let issueD = {
      insureCompany: [],
      insureToken: []
    }
    await getProperty(IssuePropertyTypeCodeEnum.kernel)
      .then(res => {
        this.kernels = res.data
        return getProperty(IssuePropertyTypeCodeEnum.insureCompanySource)
      })
      .then(res => {
        this.insureCompanies = res.data
        issueD.insureCompany = res.data
        return queryByToken()
      })
      .then(res => {
        const response = res.data
        issueD.insureToken = res.data
        this.setScript(response)
        this.generateDataBaseProxyMap(response)
        this.generatorConfigProxyMap(response)
        this.generatorGetJsonFunc()
      })
      return Promise.resolve(issueD)
  }

  setScript(insureCompanyChannels) {
    for (const item of insureCompanyChannels) {
      for (const insureCompany of this.insureCompanies) {
        if (item.companyId === insureCompany.code) {
          item.script = `${scriptHost}/js/${insureCompany.extend1}` + "?timestamp=" + new Date().getTime()
          item.pacUrl = insureCompany.extend3
          item.kernel = insureCompany.extend4
          if (insureCompany.extend5) {
            item.codeSnippet = insureCompany.extend5
          } else {
            item.codeSnippet = defaultCodeSnippet
          }
        }
      }
    }
  }

  generateDataBaseProxyMap(insureCompanyChannels) {
    this.proxyMap = new Map()
    let i = 100
    for (const item of insureCompanyChannels) {
      let hostUrl = splitHostName(item.url)
      hostUrl = hostUrl + i
      this.proxyMap.set(hostUrl, this.convertProxy(item))
      i++
    }
  }
  /**
   * 使用配置工号生成代理对象
   */
  generatorConfigProxyMap(insureCompanyChannels) {
    configProxyInfo.forEach((value, key) => {
      for (const item of insureCompanyChannels) {
        if (item.insureCompanySourceId === value.insureCompanySourceId) {
          this.proxyMap.set(key, this.convertProxy(item))
        }
      }
    })
  }

  /**
   * 根据工号信息转换成proxy对象
   * @param {ExtendInsureCompanyChannel} channel
   * @returns {Proxy}
   */
  convertProxy(channel) {
    const proxy = new ProxyClass()
    proxy.kernel = choose(channel.kernel, this.kernels) || Kernel.CHROME
    proxy.proxy = channel.proxyAddress || ''
    proxy.pacUrl = channel.pacUrl || ''
    proxy.jsText = this.generateInjectText(channel)
    proxy.site_title = channel.insureChannelName
    return proxy
  }

  /**
   * 根据工号信息生成脚本注入
   */
  generateInjectText(channel) {
    const user = store.state.user.userAll.data
    const extendInfo = {
      token: store.state.user.token,
      insureCompanyChannelId: channel.id,
      lastCompanyId: this.getLastBelongCompany().id,
      operatorId: user.id,
      userSourceCode: user.channelCode,
      userName: channel.jobNumber,
      password: channel.jobNumberPassword,
      sourceId: channel.sourceId
    }
    const addScriptJson = `function addScript() {var script = document.createElement('script');script.charset='utf-8';script.src = '${
      channel.script
    }';${channel.codeSnippet};};addScript();`
    return `var ybExtendInfo= ${JSON.stringify(extendInfo)};${addScriptJson}`
  }

  /**
   * 获取最后
   */
  getLastBelongCompany() {
    const companies = store.state.user.userAll.data.belongCompanys || [];
    return companies.sort((a, b) => b.level - a.level)[0];
  }

  /**
   * 注册getjson()函数
   */
  generatorGetJsonFunc() {
    window.getjson = (url, jobNumId) => {
      if (jobNumId === 'n4aYXtmchFscmZ') return 'Ij8='
      if (jobNumId === this.openNewProcessKey) {
        let titleParams = {}
        if (window.site_title) titleParams.site_title = window.site_title
        // 使用新进程打开窗口
        const res = {
          kernel: Kernel.CHROME,
          proxy: '',
          pacUrl: '',
          jsText: '',
          ...titleParams
        }
        return this.enCrypt(JSON.stringify(res))
      }
      let result = new ProxyClass()
      if (url) {
        if (jobNumId === '' || jobNumId === undefined) {
          const proxyMap = this.proxyMap
          proxyMap.forEach((value, key) => {
            const s = key.substr(0, key.length - 3)
            if (url.includes(s)) {
              result = value
            }
          })
        } else {
          const proxyMap = this.proxyMap
          proxyMap.forEach((value, key) => {
            const s = key.substr(0, key.length - 3)
            if (url.includes(s) && value.jsText.includes(`"insureCompanyChannelId":"${jobNumId}`)) {
              result = value
            }
          })
        }
      }
      return this.enCrypt(JSON.stringify(result))
    }
  }

  /**
   * 与应用加密方法
   * 先对每个字符进行亦或，然后在进行base64编码
   *
   * @param {string} message
   * @returns {string}
   */
  enCrypt(message) {
    const cryptKey = 'YBKJ#'
    const xorChars = []
    const bytes = this.stringToBytes(message)
    for (let i = 0; i < bytes.length; i++) {
      const code = bytes[i] ^ cryptKey.charCodeAt(i % 5)
      const xorChar = String.fromCharCode(code)
      xorChars.push(xorChar)
    }
    return Base64.btoa(xorChars.join(''))
  }

  stringToBytes(str) {
    const bytes = []
    let len, c
    len = str.length
    for (let i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if (c >= 0x010000 && c <= 0x10ffff) {
        bytes.push(((c >> 18) & 0x07) | 0xf0)
        bytes.push(((c >> 12) & 0x3f) | 0x80)
        bytes.push(((c >> 6) & 0x3f) | 0x80)
        bytes.push((c & 0x3f) | 0x80)
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        bytes.push(((c >> 12) & 0x0f) | 0xe0)
        bytes.push(((c >> 6) & 0x3f) | 0x80)
        bytes.push((c & 0x3f) | 0x80)
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        bytes.push(((c >> 6) & 0x1f) | 0xc0)
        bytes.push((c & 0x3f) | 0x80)
      } else {
        bytes.push(c & 0xff)
      }
    }
    return bytes
  }
}

const proxyInfoService = new ProxyInfoService()
export default proxyInfoService
