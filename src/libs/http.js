import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import store from '../store'
// 默认配置
// 超时
axios.defaults.timeout = 30000
// 默认url，开发环境vue.config.js 有代理
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = location.origin
}

// 请求拦截
axios.interceptors.request.use(
  config => {
    if (
      config.method === 'post' &&
      config.data &&
      config.headers['Content-Type'] !== 'application/json' &&
      config.headers['Content-Type'] !== 'multipart/form-data'
    ) {
      config.data = qs.stringify(config.data)
    }
    config.headers.Authorization = store.state.token
    // config.headers.Authorization = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6ImZlZWxmaW5lIn0.eyJpc3MiOiJmZWVsZmluZS5jb20uY24iLCJhdWQiOiJmZWVsZmluZS5jb20uY24iLCJqdGkiOiJmZWVsZmluZSIsImlhdCI6MTU2MDIzMTEzOCwiZXhwIjoxNTYwODM1OTM4LCJuYmYiOjE1NjAyMzExMzksImNvbXBhbnlfa2V5Ijoia3QiLCJwb3J0Ijo4MCwidWlkIjoiMTU1MSJ9.mdlUdcx-YXCOHwsZV2QCl1I6o3mFz3PgHQlI6Vdyey0"
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  response => {
    let code = response.data.code
    let whitelist = [0, 700001, 700002]
    if (whitelist.includes(code) || response.data.success == 1) {
      return response.data
    } else if (
      !(response.data instanceof Object) ||
      response.headers['content-type'] === 'application/octet-stream'
    ) {
      return response
    }
    /**
     * 500000 缺少TOKEN参数
     * 500003 TOKEN参数格式错误
     **/
    let requiredTokenCode = [500000, 500002, 500003, 600000, 150000]
    if (requiredTokenCode.includes(code)) {
      // 如果token过期跳转到登录页
      sessionStorage.removeItem('menus')
      location.href = `${location.origin}${process.env.BASE_URL}login`
    }
    Message({ type: 'error', message: response.data.msg })
    return Promise.reject(response.data)
  },
  error => {
    Message({ type: 'error', message: error })
    return Promise.reject(error)
  }
)

export default axios
