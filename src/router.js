import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const layout = () => import('@/components/layout/layout')

/**
 * 设置end
 */
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', component: layout },
    { path: '/404', component: () => import('@/views/404') },
    {
      path: '/login',
      component: () =>
        import(/* webpackChunkName: "login" */ '@/views/login/loginwrap'),
      children: [
        {
          path: '/',
          component: () =>
            import(/* webpackChunkName: "login" */ '@/views/login/login'),
          meta: { title: '用户登陆', noLogin: true },
          children: [
            {
              path: '/',
              component: () =>
                import(
                  /* webpackChunkName: "login" */ '@/views/login/content/userlogin'
                ),
              meta: { noLogin: true }
            },
            {
              path: 'userlogin',
              component: () =>
                import(
                  /* webpackChunkName: "login" */ '@/views/login/content/userlogin'
                ),
              meta: { noLogin: true }
            },
            {
              path: 'findpassword',
              component: () =>
                import(
                  /* webpackChunkName: "login" */ '@/views/login/content/findpassword'
                ),
              meta: { noLogin: true }
            }
          ]
        }
      ]
    },
    {
      path: '/register',
      component: () =>
        import(/* webpackChunkName: "login" */ '@/views/login/register'),
      meta: { title: '企业注册', noLogin: true }
    },
    {
      path: '/loginding',
      component: () =>
        import(/* webpackChunkName: "login" */ '@/views/login/loginding'),
      meta: { title: '钉钉登陆', noLogin: true }
    },
    {
      path: '/bindphone',
      component: () =>
        import(/* webpackChunkName: "login" */ '@/views/login/bindphone'),
      meta: { title: '绑定手机号', noLogin: true }
    },
    { path: '/productionTask', redirect: 'project/task' },
    {
      path: '/project',
      component: () => import('@/views/project/layout'),
      children: [
        {
          path: 'task',
          component: () =>
            import(
              /* webpackChunkName: "project-task" */ '@/views/project/task'
            ),
          meta: {
            title: '制作任务',
            keepAlive: true,
            keepComponent: 'ProjectLayout'
          }
        },
        {
          path: 'assets',
          component: () =>
            import(
              /* webpackChunkName: "project-assets" */ '@/views/project/assets/index'
            ),
          meta: { title: '项目资产' }
        },
        {
          path: 'dynamic',
          component: () =>
            import(
              /* webpackChunkName: "project-dynamic" */ '@/views/project/dynamic/index'
            ),
          meta: { title: '项目动态' }
        },
        {
          path: 'info',
          component: () =>
            import(
              /* webpackChunkName: "project-info" */ '@/views/project/info/index'
            ),
          meta: { title: '项目信息' }
        },
        {
          path: 'version',
          component: () =>
            import(
              /* webpackChunkName: "project-version" */ '@/views/project/version/index'
            ),
          meta: {
            title: '项目版本',
            keepAlive: true,
            keepComponent: 'ProjectLayout'
          }
        },
        {
          path: 'version/task',
          component: () =>
            import(
              /* webpackChunkName: "project-version" */ '@/views/project/version/task'
            ),
          meta: { title: '项目版本' }
        },
        {
          path: 'settings',
          component: () => import('@/views/project/settings/layout'),
          meta: { title: '设置' },
          redirect: 'settings/status',
          children: [
            {
              path: 'status',
              component: () =>
                import(
                  /* webpackChunkName: "project-settings" */
                  '@/views/project/settings/status'
                ),
              meta: { title: '状态管理' }
            },
            {
              path: 'workflow',
              component: () =>
                import(
                  /* webpackChunkName: "project-settings" */
                  '@/views/project/settings/workflow'
                ),
              meta: { title: '流程审核' }
            },
            {
              path: 'file',
              component: () =>
                import(
                  /* webpackChunkName: "project-settings" */
                  '@/views/project/settings/file'
                ),
              meta: {
                title: '文件权限'
              }
            },
            {
              path: 'store',
              component: () =>
                import(
                  /* webpackChunkName: "project-settings" */
                  '@/views/project/settings/store'
                ),
              meta: {
                title: '文件存储'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'related',
      path: '/related',
      component: layout,
      children: [
        {
          name: 'related-task',
          path: 'task',
          component: () =>
            import(/* webpackChunkName: "related" */ '@/views/related/task')
        }
      ]
    },
    {
      path: '/project',
      component: layout,
      children: [
        {
          path: 'index',
          component: () =>
            import(
              /* webpackChunkName: "project" */ '@/views/project/index/index'
            )
        },
        {
          path: 'create',
          component: () =>
            import(
              /* webpackChunkName: "project" */ '@/views/project/index/create'
            )
        }
      ]
    }
  ]
})
