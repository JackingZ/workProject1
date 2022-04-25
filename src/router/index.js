import Vue from 'vue'
import Router from 'vue-router'
import permissionCode from '@/utils/permission'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import { renewalRouterMap } from '@/router/renewalRouter'
import { customerRouterMap } from '@/router/customer'
import businessStateRoutes from '@/router/businessState'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

// function getMobileOrderPath() {
//   let path = ''
//   console.log('mobileRenewal', permissionCode.mobileRenewal)
//   // permissionCode.mobileRenewal permissionCode.mobileOrder
//   const rolesList = JSON.parse(localStorage.getItem('userAll')) ? JSON.parse(localStorage.getItem('userAll')).data.roles : ''
//   let roles
//   if (rolesList.length > 0) {
//     roles = rolesList.filter(item => (item.code === permissionCode.mobileRenewal || item.permissionCode === permissionCode.mobileOrder))
//     if (roles && roles.length === 1) {
//       path = '//quickissue'
//     } else {
//       path = 'quickissueModal'
//     }
//   }
//
//   console.log('pathuy', path)
//   return path
// }

export const constantRouterMap = [{
  path: '/login',
  name: 'login',
  component: () =>
    import('@/views/login/index'),
  hidden: true
},
{
  path: '/findpassword',
  name: 'findpassword',
  component: () =>
      import('@/views/login/findpass'),
  hidden: true
},
{
  path: '/mocklogin',
  name: 'mocklogin',
  component: () =>
      import('@/views/login/mocklogin'),
  hidden: true
},
{
  path: '/404',
  component: () =>
      import('@/views/404'),
  hidden: true
},
{
  path: '/checkPolicyDetails',
  component: () =>
    import('@/views/businessmanagement/checkOrRecord'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  hidden: true,
  children: [{
    path: 'dashboard',
    name: '首页',
    meta: {
      title: '首页',
      icon: 'dashboard'
    },
    component: () =>
        import('@/views/dashboard/index')
  }]
},
{
  path: '//quickissue',
  name: 'Quickissue',
  // component: () =>
  //       import('@/views/insurance/quickissue'),
  meta: {
    title: '移动出单'
    // guard: [permissionCode.mobileWeb]
  }
},
{
  path: '/insurance',
  component: Layout,
  redirect: '/insurance/quickissue',
  name: 'Insurance',
  meta: {
    title: '车险出单',
    icon: 'cxcd',
    guard: [permissionCode.mobile]
  },
  children: [{
    path: 'quickissueModal',
    name: '移动出单',
    component: () =>
          import('@/views/insurance/quickissueModal'),
    meta: {
      title: '移动出单',
      guard: [permissionCode.mobileWeb]
    }
  },
  {
    path: 'issuecenter',
    name: '电脑出单',
    component: () =>
          import('@/views/insurance/issuecenter'),
    meta: {
      title: '电脑出单',
      guard: [permissionCode.issueCenter]
    }
  },
  {
    path: 'number',
    name: '工号',
    component: () =>
          import('@/views/operation/number'),
    meta: {
      title: '工号管理',
      guard: [permissionCode.numberManagement]
    }
  }
    // {
    //   path: 'number',
    //   name: '工号管理',
    //   component: () =>
    //         import('@/views/insurance/number'),
    //   meta: {
    //     title: '工号管理',
    //     guard: [permissionCode.issueJobNumber]
    //   }
    // }
  ]
},
...renewalRouterMap,
// {
//   path: '/business',
//   component: Layout,
//   name: 'Business',
//   meta: {
//     guard: [permissionCode.mobileManager]
//   },
//   children: [{
//     path: getBusinessUrl(),
//     name: '业务管理',
//     meta: {
//       title: '业务管理',
//       icon: 'ywgl',
//       guard: [permissionCode.mobileManager]
//     }
//   }]
// },
...businessStateRoutes,
...customerRouterMap,
{
  path: '/policy',
  component: Layout,
  redirect: '/policy/insurancePolicy',
  name: '政策设置',
  meta: {
    title: '政策设置',
    icon: 'zcgl',
    guard: [permissionCode.strategy]
  },
  alwaysShow: true,
  children: [{
    path: 'insurancePolicy',
    name: '车险政策',
    component: () =>
        import('@/views/policy/insurancePolicy'),
    meta: {
      title: '车险政策',
      guard: [permissionCode.policyStrategy]
    }
  }]
},
{
  path: '/finance',
  component: Layout,
  redirect: '/finance/ledger',
  name: '财务结算',
  meta: {
    title: '财务结算',
    icon: 'cwgl',
    guard: [permissionCode.finance]
  },
  children: [{
    path: 'ledger',
    component: () =>
        import('@/views/finance/ledger'),
    name: '台账列表',
    meta: {
      title: '台账列表',
      guard: [permissionCode.billList]
    }
  },
  {
    path: 'upstream',
    component: () =>
          import('@/views/finance/settlement/upstream'),
    name: '上游手续费结算',
    props: {
      type: 1
    },
    meta: {
      title: '上游手续费结算',
      guard: [permissionCode.settle]
    }
  },
  {
    path: 'upstreamrecord',
    component: () =>
          import('@/views/finance/settlement/upstreamrecord'),
    name: '上游手续费结算记录',
    props: {
      recordType: 1
    },
    meta: {
      title: '上游手续费结算记录',
      guard: [permissionCode.record]
    }
  },
  {
    path: 'orgstream',
    component: () =>
          import('@/views/finance/settlement/orgstream.vue'),
    props: {
      type: 2
    },
    name: '机构佣金结算',
    meta: {
      title: '机构佣金结算',
      guard: [permissionCode.settle]
    }
  },
  {
    path: 'orgupstreamrecord',
    component: () =>
          import('@/views/finance/settlement/upstreamrecord'),
    props: {
      recordType: 2
    },
    name: '机构佣金结算记录',
    meta: {
      title: '机构佣金结算记录',
      guard: [permissionCode.record]
    }
  },
  {
    path: 'salestream',
    component: () =>
          import('@/views/finance/settlement/salestream.vue'),
    props: {
      type: 3
    },
    name: '业务员佣金结算',
    meta: {
      title: '业务员佣金结算',
      guard: [permissionCode.settle]
    }
  },
  {
    path: 'saleupstreamrecord',
    component: () =>
          import('@/views/finance/settlement/upstreamrecord'),
    props: {
      recordType: 3
    },
    name: '业务员佣金结算记录',
    meta: {
      title: '业务员佣金结算记录',
      guard: [permissionCode.record]
    }
  }
  ]
},
{
  path: '/report',
  component: Layout,
  redirect: '/report/index',
  name: '数据报表',
  meta: {
    title: '数据报表',
    icon: 'yunwei',
    guard: [permissionCode.reportForm]
  },
  alwaysShow: true,
  children: [
    {
      path: 'businessState',
      name: '业务统计',
      component: () =>
          import('@/views/report/businessStatistics/index.vue'),
      meta: {
        title: '业务统计',
        guard: [permissionCode.businessStatistics]
      }
    },
    {
      path: 'PerformanceAnalysis',
      name: '业绩分析',
      component: () =>
        import('@/views/report/PerformanceAnalysis'),
      meta: {
        title: '业绩分析',
        guard: [permissionCode.businessAnalyze]
      }
    },
    {
      path: 'icpd',
      name: '保司业绩分布',
      component: () =>
          import('@/views/report/icpd'),
      meta: {
        title: '保司业绩分布',
        guard: [permissionCode.companyStatic]
      }
    },
    {
      path: 'spd',
      name: '业务员业绩分布',
      component: () =>
          import('@/views/report/spd'),
      meta: {
        title: '业务员业绩分布',
        guard: [permissionCode.salesAnalyze]
      }
    },
    {
      path: 'ved',
      name: '车辆到期分布',
      component: () =>
          import('@/views/report/ved'),
      meta: {
        title: '车辆到期分布',
        isAdmin: true, // 管理员渠道才显示
        guard: [permissionCode.expiredCar]
      }
    },
    {
      path: 'conversionFunnel',
      name: '移动出单转化漏斗',
      component: () =>
          import('@/views/report/conversionFunnel/index.vue'),
      meta: {
        title: '移动出单转化漏斗',
        isAdmin: true, // 管理员渠道才显示
        guard: [permissionCode.mobileConversionRate]
      }
    }
  ]
},
{
  path: '/organize',
  component: Layout,
  redirect: '/organize/orgmanage',
  name: '组织管理',
  meta: {
    title: '组织管理',
    icon: 'zzgl',
    guard: [permissionCode.group]
  },
  children: [{
    path: 'orgmanage',
    component: () =>
        import('@/views/organize/orgmanage'),
    name: '机构管理',
    meta: {
      title: '机构管理',
      guard: [permissionCode.companyManager]
    }
  },
  {
    path: 'personnelManager',
    component: () =>
          import('@/views/organize/personnelManager'),
    name: '人员管理',
    meta: {
      title: '人员管理',
      guard: [permissionCode.personSales]
    }
  }
  ]
},
{
  path: '/system',
  component: Layout,
  redirect: '/system/permission',
  name: '系统管理',
  meta: {
    title: '系统管理',
    icon: 'xtgl',
    guard: [permissionCode.system]
  },
  alwaysShow: true,
  children: [{
    path: 'permissionRoles',
    name: '角色设置',
    component: () =>
          import('@/views/system/permissionRoles'),
    meta: {
      title: '角色设置',
      guard: [permissionCode.roleManager]
    }
  },
  {
    path: 'billmanage',
    component: () =>
          import('@/views/finance/billmanage'),
    name: '账单管理',
    meta: {
      title: '账单管理',
      guard: [permissionCode.balanceCount]
    }
  },
  {
    path: 'billdetail',
    component: () =>
          import('@/views/finance/billdetail'),
    name: '账单明细',
    meta: {
      title: '账单明细',
      guard: [permissionCode.balanceRecord]
    }
  }
  ]
},
{
  path: '/operation',
  component: Layout,
  redirect: '/operation/channel',
  name: '运维管理',
  meta: {
    title: '运维管理',
    icon: 'yunwei',
    guard: [permissionCode.ops]
  },
  alwaysShow: true,
  children: [{
    path: 'channel',
    name: '渠道管理',
    component: () =>
        import('@/views/operation/channel'),
    meta: {
      title: '渠道管理',
      guard: [permissionCode.channelManager]
    }
  },
  {
    path: 'accountAddress',
    name: '工号地址',
    component: () =>
          import('@/views/operation/accountAddress'),
    meta: {
      title: '工号地址',
      guard: [permissionCode.accountAddressManager]
    }
  },
  {
    path: 'infoConfig',
    name: '配置信息',
    component: () =>
          import('@/views/operation/infoConfig'),
    meta: {
      title: '配置信息',
      guard: [permissionCode.infoConfigManager]
    }
  },
  {
    path: 'operateLog',
    name: '操作日志',
    component: () =>
          import('@/views/operation/operateLog'),
    meta: {
      title: '操作日志',
      guard: [permissionCode.operateLogManager]
    }
  },
  {
    path: 'notification',
    name: '通知管理',
    component: () =>
          import('@/views/operation/notification'),
    meta: {
      title: '通知管理',
      guard: [permissionCode.notificationManager]
    }
  },
  {
    path: 'adviceFeedback',
    name: '意见反馈',
    component: () =>
          import('@/views/operation/adviceFeedback'),
    meta: {
      title: '意见反馈',
      guard: [permissionCode.adviceFeedbackManager]
    }
  },
  {
    path: 'graphicmanagement',
    name: '图文管理',
    component: () =>
      import('@/views/graphicmanagement/index'),
    meta: {
      title: '图文管理',
      guard: [permissionCode.graphicManagement, permissionCode.articleManagement]
    }
  }
  ]
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

const version = process.env.BUILD_VER

export function getBaseUrl() {
  console.log('getBaseUrl', version)
  switch (version) {
    case 'test':
      return 'spa/carManagerTest/'
    case 'test2':
      return 'spa/carManagerTest2/'
    default:
      return 'spa/carManager/'
  }
}

export function getBusinessUrl() {
  const venv = process.env.BUILD_VER
  switch (venv) {
    case 'test':
      return 'https://ybinsure.com/spa/newManagerTest?token='
    case 'test2':
      return 'https://ybinsure.com/spa/newManagerTest2?token='
    default:
      return 'https://ybinsure.com/spa/newManager?token='
  }
}

export default new Router({
  mode: 'history', // 后端支持可开
  base: getBaseUrl(),
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
