import permissionCode from '@/utils/permission'
import Layout from '@/views/layout/Layout'

export const renewalRouterMap = [
  {
    path: '/carDealer',
    component: Layout,
    redirect: '/carDealer/grandstand',
    name: '车商续保',
    meta: {
      title: '车商续保',
      icon: 'khgl',
      guard: [permissionCode.renewal]
    },
    alwaysShow: true,
    children: [
      {
        path: 'grandstand',
        name: '看台',
        component: () =>
        import('@/views/carDealer/grandstand'),
        meta: {
          title: '看台',
          guard: [permissionCode.renewalGrandStand]
        }
      },
      {
        path: 'myTask02',
        name: '我的任务（续保专员）',
        component: () =>
          import('@/views/carDealer/myTask02'),
        meta: {
          title: '我的任务',
          guard: [permissionCode.renewalInsuranceAll]
        }
      },
      {
        path: 'myTask',
        name: '我的任务（出单员）',
        component: () =>
          import('@/views/carDealer/myTask'),
        meta: {
          title: '我的任务',
          guard: [permissionCode.renewalIssueAll]
        }
      },
      {
        path: 'enterstore',
        name: '车辆进店',
        component: () =>
          import('@/views/carDealer/enterstore'),
        meta: {
          title: '车辆进店',
          guard: [permissionCode.renewalEnterStore]
        }
      },
      // {
      //   path: 'renewal',
      //   name: '批量续保',
      //   component: () =>
      //     import('@/views/carDealer/renewal'),
      //   meta: {
      //     title: '批量续保',
      //     guard: [permissionCode.renewalBatch]
      //   }
      // },
      // {
      //   path: 'customer',
      //   name: '客户管理',
      //   component: () =>
      //     import('@/views/carDealer/customer'),
      //   meta: {
      //     title: '客户管理',
      //     guard: [permissionCode.renewalCustomer]
      //   }
      // },
      {
        path: 'customerDetail',
        hidden: true,
        name: '客户详情',
        component: () =>
          import('@/views/carDealer/customerDetail'),
        meta: {
          title: '客户详情'
        }
      },
      {
        path: 'statistic',
        name: '数据统计',
        component: () =>
          import('@/views/carDealer/statistic'),
        meta: {
          title: '数据统计',
          guard: [permissionCode.renewalStatistic]
        }
      }
    ]
  }
]
