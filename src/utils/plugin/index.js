import { Message } from 'element-ui'
import PermissionList from '@/utils/permission'
import { checkPermissions } from '@/router/guard'
import MySwitch from '@/components/MySwitch/index'
import { AppFormGroup } from '@/components/Customform'
import { AppFormItem } from '@/components/Customform'
import { AppRootForm } from '@/components/Customform'
import Scrollactive from '@/components/Scrollactive'

const MyPlugin = {}
MyPlugin.install = function(Vue, options) {
  // 3. 注入组件
  Vue.mixin({
    computed: {
      permissionList() {
        return PermissionList
      }
    },
    methods: {
      checkPermissions(permission) {
        return checkPermissions(permission)
      },
      showAlertMsg(msg, type) {
        Message({
          message: msg,
          type: type || 'success',
          duration: 2 * 1000
        })
      }
    }
  })
  Vue.filter('fixTwo', function(value) {
    if (value === void 0 || value === null) return ''
    if (!value && value < 0) return ''
    return parseFloat(value).toFixed(2)
  })

  Vue.filter('filternulls', function(val) {
    if (val === null || val === undefined || val === '') return '--'
    if (val === '@') return ''
    return val
  })

  Vue.component('MySwitch', MySwitch)
  Vue.component('AppFormGroup', AppFormGroup)
  Vue.component('AppFormItem', AppFormItem)
  Vue.component('AppRootForm', AppRootForm)
  Vue.component('scrollactive', Scrollactive)
}
export default MyPlugin
