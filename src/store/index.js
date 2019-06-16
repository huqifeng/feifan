import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import { getToken, getMenuList, getUserInfo } from '@/api/base.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menu: [],
    user: {},
    token: Cookies.get('token'),
    userid: Cookies.get('userid'),
    // 关联数据
    related: { task: [] },
    // 缓存组件
    keepAliveComponents: []
  },
  getters: {
    menu: state => state.menu
  },
  mutations: {
    SET_MENU(state, menu = []) {
      state.menu = menu
    },
    SET_TOKEN(state, token) {
      state.token = token
      Cookies.set('token', token)
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_RELATED(state, { type, list }) {
      state.related[type] = list
    },
    keepAlive(state, component) {
      !state.keepAliveComponents.includes(component) &&
        state.keepAliveComponents.push(component)
    },
    noKeepAlive(state, component) {
      const index = state.keepAliveComponents.indexOf(component)
      index !== -1 && state.keepAliveComponents.splice(index, 1)
    }
  },
  actions: {
    setRelated({ commit }, items) {
      commit('SET_RELATED', items)
    },
    async setMenu({ commit }) {
      await getMenuList().then(response => {
        commit('SET_MENU', Array.isArray(response.data) ? response.data : [])
      })
    },
    async setUser({ commit }) {
      await getUserInfo().then(response => {
        commit('SET_USER', response.data)
      })
    },
    async setToken({ commit }) {
      await getToken()
        .then(response => {
          commit('SET_TOKEN', response)
        })
        .catch(response => {
          commit('SET_TOKEN', response)
        })
    }
  }
})
