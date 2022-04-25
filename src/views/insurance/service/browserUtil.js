// import browserCompatibilityService from '@/views/insurance/service/browser-compatibility.service'
// import injectInfoService from '@/views/insurance/service/inject-info.service'
import proxyInfoService from '@/views/insurance/service/proxy-info.service'
import browserCompatibilityService from '@/views/insurance/service/browser-compatibility.service'
import injectInfoService from '@/views/insurance/service/inject-info.service'
import applicationStorageService from '@/views/insurance/service/application-storage.service'
export function initBrowserUtil() {
  browserCompatibilityService.initCompatibilityFunc()
  browserCompatibilityService.initbrowserInjectPacFunc()
  injectInfoService.initGetInjectInfoFunc()
  injectInfoService.initGetInjectInfoInIframFunc()
  proxyInfoService.generatorGetJsonFunc()
}

// 打开chrome窗口指令
export function openNewProcessUrl(url) {
  // 判断是否为浏览器应用打开
  if (applicationStorageService.isApplication()) {
    window.c_fun_set_str('GetJsonParam', proxyInfoService.openNewProcessKey)
    window.open(`${url}?GetJsonParam=${proxyInfoService.openNewProcessKey}`)
  } else {
    window.open(url)
  }
}

// 打开chrome窗口指令
export function openNewProcessUrlWithConfig(url, config = '') {
  // 判断是否为浏览器应用打开
  if (applicationStorageService.isApplication()) {
    window.c_fun_set_str('GetJsonParam', proxyInfoService.openNewProcessKey)
    window.open(`${url}?GetJsonParam=${proxyInfoService.openNewProcessKey}`, '_blank', config)
  } else {
    window.open(url, '_blank', config)
  }
}
