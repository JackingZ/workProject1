import {
  getProperty,
  IssuePropertyTypeCodeEnum
} from '@/views/insurance/service/issue-property.service'
import { texts } from '@/views/insurance/service/issue-property'
import cryptService from '@/views/insurance/service/crypt.service'
class InjectInfoService {
  /**
   * 注入脚本页面信息到全局作用域
   */
  initGetInjectInfoFunc() {
    getProperty(IssuePropertyTypeCodeEnum.inject).then(response => {
      const injectInfos = texts(response.data)
      window.getInjectInfo = () => {
        return cryptService.enCrypt(JSON.stringify(injectInfos))
      }
    })
  }

  /**
   * 注入initGetInjectInfoInIframFunc 脚本页面信息到全局作用域
   */
  initGetInjectInfoInIframFunc() {
    getProperty(IssuePropertyTypeCodeEnum.injectIfram).then(response => {
      const injectInfos = texts(response.data)
      window.getInjectIframInfo = () => {
        return cryptService.enCrypt(JSON.stringify(injectInfos))
      }
    })
  }
}

const injectInfoService = new InjectInfoService()
export default injectInfoService
