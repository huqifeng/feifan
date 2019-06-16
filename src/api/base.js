import http from '@/libs/http'

// 获取左侧菜单
export function getMenuList() {
  return http.post('/api/v2.0/Layouts/getMenu')
}

// 获取token
export function getToken() {
  return http.post('/auth/test/setToken')
}

// 获取获取本公司的组织架构数据
export function getAllUser() {
  return http.post('/api/v2.0/user/getDeptUser')
}

// 获取用户组
export function getUserGroup() {
  return http.post('/api/v2.0/get_user_groups')
}
//获取用户信息
export function getUserInfo(params) {
  return http.get('/api/v2.0/user/getUserInfo', params)
}