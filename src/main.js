import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/index.js'
import '@/plugins/element.js'
import Directive from '@/libs/loadmore.js'
import * as filters from './libs/filters'
import qs from 'qs'

// Lodash
import lodash from 'lodash'
Object.defineProperty(Vue.prototype, '$lodash', {
  value: lodash
})

Vue.config.productionTip = false
Vue.use(Directive)
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// function checkAuth(to, menu) {
//   console.log(to, menu)
// }
router.afterEach(() => {
  window.scrollTo(0, 0)
})
router.beforeEach((to, from, next) => {
  // title
  let { title = '' } = to.meta
  document.title = `${title ? `${title} - ` : ''}非影科技`
  // 缓存组件
  if (to.meta.keepAlive) {
    store.commit('keepAlive', to.meta.keepComponent)
  }
  // 跳回原项目
  if (to.path.includes('originalUrl')) {
    let queryString = qs.stringify(from.query)
    let origin =
      process.env.NODE_ENV === 'production'
        ? location.origin
        : `//${store.state.user.company_key || 'www'}.feelfine.local`
    let url = to.path.replace(/(.*)originalUrl/, '')
    location.href = `${origin}${url}` + (queryString ? `?${queryString}` : '')
    return false
  }
  // 无需登录
  if (to.meta.noLogin) {
    next()
    return false
  }
  // menu
  let { menu = [] } = store.state
  if (menu.length) {
    // checkAuth(to, store.state.menu)
    next()
  } else {
    // checkAuth(to, store.state.menu)
    store.dispatch('setMenu').then(() => {
      next()
    })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
