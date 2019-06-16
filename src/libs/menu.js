import router from '@/router'
import store from '@/store/index.js'

import { getMenuList } from '@/api/base'
const compnents = {
  '/productionTask': () => import('@/views/production/list.vue'),
  layout: () => import('@/views/layout.vue'),
  '/info': () => import('@/views/production/list.vue')
}
const childRoutes = item => {
  return {
    path: item.component,
    name: item.title,
    icon: item.icon,
    component: compnents[item.component],
    meta: {
      isTop: item.isTop ? true : false
    }
  }
}
const formatRoutes = menus => {
  let cRoutes = []
  for (const item of menus) {
    let oRouter = {
      path: item.component,
      name: item.title,
      icon: item.icon,
      component: compnents['layout'],
      meta: {
        isTop: false
      },
      children: []
    }
    let cLen = (item.children && item.children.length) || 0
    let tLen = (item.top && item.top.length) || 0
    let children = cLen ? item.children : item.top || []
    if (tLen) {
      for (const t of item.top) {
        t.isTop = true
      }
      oRouter.meta.hasTop = true
    }
    if (children.length) {
      for (let child of children) {
        oRouter.children.push(childRoutes(child))
      }
    } else {
      oRouter.children.push(childRoutes(item))
    }
    cRoutes.push(oRouter)
  }
  return cRoutes
}
const getMenus = async () => {
  let menus = sessionStorage.getItem('menus')
  ? JSON.parse(sessionStorage.getItem('menus'))
  : ''
  if (!menus || JSON.stringify(menus) == '{}') {
    const res = await getMenuList()
    menus = res.data
    window.sessionStorage.setItem('menus', JSON.stringify(menus))
  } 
  let routes = formatRoutes(menus)
  store.commit('ADD_MENU', menus)
  router.addRoutes(routes)
  router.options.routes = routes
}
export default getMenus
