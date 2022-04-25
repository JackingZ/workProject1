import 'babel-polyfill'
import Vue from 'vue'
// import 'ant-design-vue/dist/antd.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from '@/App'
import router from '@/router'
import store from '@/store'

import '@/icons' // icon
import '@/permission' // permission control
// import Antd from 'ant-design-vue'
import '@/utils/directive/index'
import MyPlugin from '@/utils/plugin/index'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// Vue.use(Antd)
import HeadInfo from '@/components/Headinfo/headinfo.vue'
import { scrollAnimation } from '@/utils/scrollanimation'

import echarts from 'echarts'
import pricePrint from '@/utils/pricePrint'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import imageview from '@/components/imageview'

import VCharts from 'v-charts'
import ElTreeGrid from 'element-tree-grid'
import '@/assets/iconfont/iconfont.css'
import smoothscroll from 'smoothscroll-polyfill'
smoothscroll.polyfill()

Vue.prototype.$scrollTo = scrollAnimation // 滚动条滚动动画
Vue.prototype.$echarts = echarts

Vue.component('HeadInfo', HeadInfo)
Vue.component(ElTreeGrid.name, ElTreeGrid)
Vue.component(VueQrcode.name, VueQrcode)

Vue.use(ElementUI, { locale })
Vue.use(MyPlugin)
Vue.use(imageview)
Vue.use(pricePrint)
Vue.use(VCharts)

Vue.config.productionTip = false

if (process.env.NODE_ENV !== 'development') {
  window.console.log = function() {}
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
