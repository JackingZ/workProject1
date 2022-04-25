import permissionCode from '@/utils/permission'
import Layout from '@/views/layout/Layout'

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

export const customerRouterMap = [
  {
    path: '/customermanagement',
    component: Layout,
    redirect: '/customermanagement/bulkRenewal',
    name: '客户管理 ',
    meta: {
      title: '客户管理',
      icon: 'plxb',
      guard: [permissionCode.bulkRenewal]
    },
    alwaysShow: true,
    children: [
      {
        path: 'customerManage',
        name: '客户列表',
        component: () => import('@/views/customermanagement/customerManage'),
        meta: {
          title: '客户列表',
          guard: [permissionCode.mobileManager]
        }
      },
      // {
      //   path: getBusinessUrl(),
      //   name: '客户列表',
      //   meta: {
      //     title: '客户列表',
      //     guard: [permissionCode.mobileManager]
      //   }
      // },
      {
        path: 'customer',
        name: '客户管理',
        component: () => import('@/views/carDealer/customer'),
        meta: {
          title: '客户管理',
          guard: [permissionCode.renewalCustomer]
        }
      },
      {
        path: 'bulkRenewal',
        name: '批量续保',
        component: () =>
                 import('@/views/customermanagement/bulkRenewal/renewal'),
        meta: {
          title: '批量续保',
          guard: [permissionCode.bulkRenewalChildren]
        }
      }
    ]
  }
]
