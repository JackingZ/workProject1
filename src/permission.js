import router from '@/router'
// import store from '@/store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { checkPermissions } from '@/router/guard'

const whiteList = ['/login', '/findpassword', '/mocklogin'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  const hasGuard = to.meta && to.meta.guard
  // console.log('hasGuard', hasGuard)
  if (getToken()) {
    if (to.path === '/findpassword') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (hasGuard) {
        if (checkPermissions(hasGuard)) next()
        else next('/')
        // next()
      } else next()
    }
  } else {
    sessionStorage.clear()
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
