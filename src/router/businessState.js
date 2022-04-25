import permissionCode from '@/utils/permission'
import Layout from '@/views/layout/Layout'
const businessStateRoutes = [
  {
    path: '/businessmanagement',
    component: Layout,
    redirect: '/businessmanagement/policy',
    name: '业务管理',
    meta: {
      title: '业务管理',
      icon: 'xtgl',
      guard: [permissionCode.businessMgrMenu]
    },
    alwaysShow: true,
    children: [
      {
        path: 'policy',
        name: '保单台账',
        component: () => import('@/views/businessmanagement/policy'),
        meta: {
          title: '保单台账',
          guard: [permissionCode.businessPolicyAccount]
        }
      },
      {
        path: 'orderList',
        name: '订单列表',
        component: () =>
          import('@/views/businessmanagement/orderList/index.vue'),
        meta: {
          title: '订单列表',
          guard: [permissionCode.businessOrderList]
        }
      },
      {
        path: 'quoteList',
        name: '报价记录',
        component: () =>
          import('@/views/businessmanagement/quoteList/index.vue'),
        meta: {
          title: '报价记录',
          guard: [permissionCode.businessQuoteRecord]
        }
      },
      {
        path: 'findPolist',
        name: '批量抓单',
        component: () =>
          import('@/views/businessmanagement/findPolicy/index.vue'),
        meta: {
          title: '批量抓单',
          guard: [permissionCode.businessBatchGrabbing, permissionCode.businessCatchRecord]
        }
      },
      {
        path: 'manualRecording',
        name: '录入保单',
        component: () =>
          import('@/views/businessmanagement/policy/recording/index.vue'),
        meta: {
          title: '录入保单',
          guard: [permissionCode.businessPolicyRecord]
        },
        hidden: true
      },
      {
        path: 'queryInsured',
        name: '查询保单',
        component: () =>
          import('@/views/businessmanagement/queryInsured/index.vue'),
        meta: {
          title: '查询保单',
          guard: [permissionCode.businessQueryAll]
        }
      }
    ]
  }
]

export default businessStateRoutes
