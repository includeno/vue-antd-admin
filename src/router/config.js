import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login/Login')
    },
    {
      path: '/register',
      name: '注册页',
      component: () => import('@/pages/login/Register')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'workplace',
              name: '工作台',
              meta: {
                page: {
                  closable: false
                }
              },
              component: () => import('@/pages/dashboard/workplace'),
            },
            {
              path: 'analysis',
              name: '分析页',
              component: () => import('@/pages/dashboard/analysis'),
            }
          ]
        },

        {
          path: 'copyright',
          name: '版权信息管理',
          meta: {
            icon: 'table',
            page: {
              cacheAble: false
            }
          },
          component: PageView,
          children: [
            {
              path: 'add',
              name: '版权请求信息填写',
              component: () => import('@/views/copyrightcommit/form/CopyrightCommitForm'),
              meta: {
                icon: 'form',
                page: {
                  cacheAble: false
                }
              },
            },
            {
              path: 'list',
              name: '版权请求信息列表',
              meta: {
                icon: 'table',
              },
              component: () => import('@/views/copyrightcommit/list/CopyrightCommitQueryList'),
            },
          ]
        },
        {
          path: 'user',
          name: '用户管理',
          meta: {
            icon: 'table',
            authority: {
              role:["admin"],
            },
          },
          component: PageView,
          children: [
            {
              path: 'add',
              name: '用户信息填写',
              component: () => import('@/views/user/form'),
              meta: {
                icon: 'form',
                page: {
                  cacheAble: false
                },
                authority: {
                  role:["admin"],
                  permission:["user:add"]
                },
              },
            },
            {
              path: 'list',
              name: '用户列表',
              meta: {
                icon: 'table',
                page: {
                  cacheAble: false
                },
                authority: {
                  role:["admin"],
                  permission:["user:list"]
                },
              },
              component: () => import('@/views/user/list/UserQueryList'),
            },
            {
              path: 'detail/:id',
              name: '查询详情',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/Demo')
            }
          ]
        },
        {
          path: 'verify',
          name: '审核管理',
          meta: {
            icon: 'table',
            authority: {
              role:["admin","audit"],
            },
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '审核列表',
              component: () => import('@/views/verify/list/VerifyQueryList'),
              meta: {
                icon: 'table',
                page: {
                  cacheAble: false
                },
                authority: {
                  role:["admin","audit"],
                  permission:["request:updatestatus"]
                },
              },
            },
            {
              path: 'log/list',
              name: '审核日志列表',
              meta: {
                icon: 'table',
                page: {
                  cacheAble: false
                },
                authority: {
                  role:["admin"],
                },
              },
              component: () => import('@/views/verify/loglist/VerifyLogQueryList'),
            },
            {
              path: 'query/detail/:id',
              name: '查询详情',
              meta: {
                highlight: '/list/query',
                invisible: true
              },
              component: () => import('@/pages/Demo')
            }
          ]
        },

      ]
    },
  ]
}

export default options
