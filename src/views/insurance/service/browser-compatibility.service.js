import {
  getProperty,
  IssuePropertyTypeCodeEnum
} from '@/views/insurance/service/issue-property.service'
import { texts } from '@/views/insurance/service/issue-property'
import cryptService from '@/views/insurance/service/crypt.service'
class BrowserCompatibilityService {
  /**
   * 注入浏览器兼容性地址到全局作用域
   */
  initCompatibilityFunc() {
    getProperty(IssuePropertyTypeCodeEnum.browserCompatibility).then(
      response => {
        const addressInfos = texts(response.data)
        window.getCompatibilityAddress = () => {
          return cryptService.enCrypt(JSON.stringify(addressInfos))
        }
      }
    )
  }

  /**
   * 注入浏览器新打开窗口是否注入代理址到全局作用域
   */
  initbrowserInjectPacFunc() {
    getProperty(IssuePropertyTypeCodeEnum.browserInjectPac)
      .then(response => {
        const addressInfos = texts(response.data)
        window.getBrowserInjectPac = () => {
          return cryptService.enCrypt(JSON.stringify(addressInfos))
        }
      })
  }
}
const browserCompatibilityService = new BrowserCompatibilityService()
export default browserCompatibilityService
