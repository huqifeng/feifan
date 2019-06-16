//huqifeng
import http from '@/libs/http'

//获取地址
export function getAdds(data) {
  return http({
    url: '/api/v2.0/region',
    method: 'post',
    data
  })
}

//获取钉钉登陆地址
export function getDingUrl(data) {
  return http({
    url: '/api/v2.0/Signin/dingTalkLogin',
    method: 'post',
    data
  })
}

//获取钉钉登陆code
export function getDingUrlCode(data) {
  return http({
    url: '/api/v2.0/deploy/collocation',
    method: 'post',
    data
  })
}

//极客验证人机识别API
export function getjk(data) {
  return http({
    url: '/api/v2.0/Identify/getCaptchaServlet',
    method: 'post',
    data
  })
}

//用户登陆
export function loginAction(data) {
  return http({
    url: '/api/v2.0/Signin/loginAction',
    method: 'post',
    data
  })
}

//获取验证码
export function sendSms(data) {
  return http({
    url: '/api/v2.0/identify/sendSms',
    method: 'post',
    data
  })
}

//企业注册
export function registerAction(data) {
  return http({
    url: '/api/v2.0/Signin/registerAction',
    method: 'post',
    data
  })
}

//企业注册
export function forgetPwdAction(data) {
  return http({
    url: '/api/v2.0/Signin/forgetPwdAction',
    method: 'post',
    data
  })
}

//钉钉绑定手机号
export function bindPhone(data) {
  return http({
    url: '/api/v2.0/Signin/bindingMobileAction',
    method: 'post',
    data
  })
}

//校验用户是否可以操作
export function getAccountStatus(data) {
  return http({
    url: '/api/v2.0/identify/getAccountStatus',
    method: 'post',
    data
  })
}

//collocation
export function collocation(data) {
  return http({
    url: '/api/v2.0/deploy/collocation',
    method: 'post',
    data
  })
}
