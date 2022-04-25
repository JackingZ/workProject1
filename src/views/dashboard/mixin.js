import { mapGetters } from 'vuex'
import { getMockLoginFunc } from '@/utils/mobileLogin'
import { initBrowserUtil, openNewProcessUrlWithConfig } from '@/views/insurance/service/browserUtil'
export default {
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  },
  methods: {
    // 初始化移动出单全局方法
    initQuickIssue() {
      const getUrl = getMockLoginFunc(this)
      window.getIssueUrl = (query = {}) => {
        if (!this.$store.state.user.token) return
        return getUrl(query)
      }
      window.openIssueUrl = (query = {}) => {
        if (!this.$store.state.user.token) return
        initBrowserUtil()
        const url = window.getIssueUrl(query)
        if (process.env.BUILD_VER !== 'prod') console.log('openIssueUrl', url)
        window.site_title = '移动出单'

        let height = window.screen.height ? window.screen.height * 0.85 : 700
        height = height > 736 ? 736 : height
        openNewProcessUrlWithConfig(url, `height=${height}, width=414`)
        setTimeout(() => {
          window.site_title = void 0
        }, 500)
      }
    }
  }
}
