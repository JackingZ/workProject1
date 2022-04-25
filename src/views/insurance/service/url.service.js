import applicationStorageService from '@/views/insurance/service/application-storage.service'

class UrlService {
  isWeb = true // 为普通浏览器

  constructor() {
    // 判断是否为浏览器应用打开
    if (applicationStorageService.isApplication()) {
      // 为自主浏览器
      this.isWeb = false
    } else {
      this.isWeb = true
    }
  }
  /**
   * 打开url
   */
  open(url, isBlank, id) {
    // 判断是否为浏览器应用打开
    console.log('this.isWeb', this.isWeb, arguments)
    if (!this.isWeb) {
      const hasFunction = !!window.c_fun_set_str
      if (hasFunction) {
        window.c_fun_set_str('GetJsonParam', id)
      }
    }
    url += '?GetJsonParam=' + id
    window.open(url, isBlank ? '_blank' : null)
  }
}

const urlService = new UrlService()
export default urlService
