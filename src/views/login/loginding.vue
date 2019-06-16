<template>
  <div class="wrapper">
    <section class="loginWrap">
      <div class="loginding">
        <h4 class="title">钉钉登陆</h4>
        <div class="imgBox" id="login_container"></div>
        <p class="tips">请使用钉钉扫描二维码登录</p>
      </div>
      <login-footer></login-footer>
    </section>
  </div>
</template>
<script src="//g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js"></script>
<script>
import * as api from '@/api/login'
import loginFooter from './loginFooter'
import '../../assets/js/ddLogin'
export default {
  data() {
    return {
      data: {}
    }
  },
  methods: {
    hanndleMessage(event) {
      let that = this
      var origin = event.origin

      if (origin == 'https://login.dingtalk.com') {
        var loginTmpCode = event.data
        location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${
          that.data.appId
        }&response_type=code&scope=snsapi_login&state=${
          that.data.state
        }&redirect_uri=${decodeURIComponent(
          that.data.redirect_url
        )}&loginTmpCode=${loginTmpCode}`
      }
    }
  },
  mounted() {
    api.getDingUrlCode().then(res => {
      this.data = res.data

      var goto = encodeURIComponent(
        `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${
          res.data.appId
        }&response_type=code&scope=snsapi_login&state=${
          res.data.state
        }&redirect_uri=${decodeURIComponent(res.data.redirect_url)}`
      )

      var obj = DDLogin({
        id: 'login_container',
        goto: goto,
        style: 'border:none;background-color:#FFFFFF;',
        width: '380',
        height: '380'
      })
    })

    if (typeof window.addEventListener != 'undefined') {
      window.addEventListener('message', this.hanndleMessage, false)
    } else if (typeof window.attachEvent != 'undefined') {
      window.attachEvent('onmessage', this.hanndleMessage)
    }
  },
  components: { loginFooter }
}
</script>
<style lang="scss">
.wrapper {
  width: 100%;
  min-height: 100vh;
  background: url(../../assets/images/login/loginBj.jpg) no-repeat center center;
  zoom: 1;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px 0 10px;
  box-sizing: border-box;
}
.loginWrap {
  margin: auto;
}
.loginding {
  width: 380px;
  height: 480px;
  background: #fff;
  box-shadow: 0px 17px 30px 0px rgba(4, 60, 103, 0.2);
  border-radius: 10px;
  zoom: 1;
  overflow: hidden;
  .title {
    width: 100%;
    height: 20px;
    font-size: 20px;
    line-height: 20px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
    color: rgba(23, 155, 255, 1);
    margin: 50px auto 15px;
    text-align: center;
  }
  .imgBox {
    width: 380px;
    margin: 0 auto;
  }
  .tips {
    text-align: center;
    height: 15px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-top: 35px;
  }
}
</style>




