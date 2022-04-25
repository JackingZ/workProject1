class ApplicationStorageService {
  /**
   * 是否浏览器应用
   */
  isApplication() {
    return window.SetLocalString
  }

  setData(value) {
    window.SetLocalString(value)
  }

  /**
   * 从应用提取信息
   */
  getData() {
    return window.GetLocalString()
  }
  /**
   * 清除应用信息
   */
  clear() {
    this.setData('{}')
  }
}

const applicationStorageService = new ApplicationStorageService()
export default applicationStorageService
