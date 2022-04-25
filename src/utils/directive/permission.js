import Vue from 'vue'
import { checkPermissions } from '@/router/guard'

/* eslint-disable */
Vue.directive('permission', {
  inserted(el, binding, vnode) {
    const { value } = binding
    if (value) {
      const hasPermission = checkPermissions(value)
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // throw new Error(`need hasPermission! Like v-permission="[permissionList.companyManagerDDefault,permissionList.companyManagerADefault]"`)
    }
  }
})
