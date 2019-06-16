<template>
  <div class="userlogin">
    <login-header
      @loginHeaderChange="loginChange"
      msg-logintitle="用户登录"
      msg-leftname="密码账号登录"
      msg-rightname="手机验证码登录"
    ></login-header>
    <!-- 密码账号登录 -->
    <div v-if="!this.isPhone">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="account" class="el-item">
          <el-input v-model="ruleForm.account" placeholder="请输入手机号/邮箱/用户名">
            <i slot="prefix" class="iconfont icon-denglu1"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="el-item">
          <Jike msg-jikeid="userLoginJike" @jike="jikeYanzheng" ref="childJk"></Jike>
        </el-form-item>
        <el-form-item prop="code" class="el-item el-item-last">
          <el-input
            placeholder="请输入密码"
            type="password"
            auto-complete="new-password"
            v-model="ruleForm.code"
          >
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 手机验证码登录 -->
    <section v-else>
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2">
        <el-form-item prop="account" class="el-item">
          <el-input
            v-model="ruleForm2.account"
            placeholder="请输入手机号"
            maxlength="11"
            minlength="11"
            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
          >
            <i slot="prefix" class="iconfont icon-shouji"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="el-item">
          <Jike msg-jikeid="userLoginJike2" @jike="jikeYanzheng2" ref="childJk"></Jike>
        </el-form-item>
        <el-form-item prop="code" class="el-item el-item-last getCodeBox">
          <el-input
            class="codeInput"
            v-model="ruleForm2.code"
            maxlength="6"
            minlength="6"
            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
            placeholder="请输入验证码"
          ></el-input>
          <Get-Code
            v-bind:genre="genre"
            v-bind:purpose="purpose"
            v-bind:account="ruleForm2.account"
            v-bind:result="result2"
            v-bind:accountIsok="accountIsok"
            @jkClear="jkClear"
          ></Get-Code>
        </el-form-item>
      </el-form>
    </section>

    <div class="mui2">
      <router-link to="/login/findpassword" class="forget">忘记密码</router-link>
      <!-- <router-link to="/register" class="register">企业注册</router-link> -->
      <span class="register" @click="registerGo">企业注册</span>
    </div>
    <el-button type="primary" class="login" @click="submitForm">登录</el-button>
    <!-- 第三方钉钉登录 -->
    <div class="dingLogin">
      <div class="dingLoginTitle">
        <p class="leftLine line"></p>
        <p class="dingLoginTitleText">第三方登录</p>
        <p class="rightLine line"></p>
      </div>
      <!-- <p class="dingdingLogin" @click="dingdingLogin">
        <span>
          <i class="iconfont icon-dingding dingding"></i>
        </span>
      </p>-->
      <p class="dingdingLogin">
        <router-link to="/loginding">
          <span>
            <i class="iconfont icon-dingding dingding"></i>
          </span>
        </router-link>
      </p>
    </div>
  </div>
</template>
<script>
import loginHeader from '../loginheader'
import * as api from '@/api/login'

import Jike from '../jike'
import GetCode from '../getCode'
import Cookies from 'js-cookie'

export default {
  data() {
    //账号校验
    let getAccountStatus = () => {
      api
        .getAccountStatus({
          account: this.ruleForm2.account,
          purpose: 'login',
          genre: 'message'
        })
        .then(res => {
          this.accountIsok = true
          return res.data.valid
        })
        .catch(() => {
          this.accountIsok = false
          return false
        })
    }
    //手机号校验
    let validatePhone = (rule, value, callback) => {
      let reg = /^1\d{10}$/
      if (value === '') {
        this.accountIsok = false
        callback(new Error('手机号不能为空'))
      } else if (!reg.test(value)) {
        this.accountIsok = false
        callback(new Error('手机号格式错误，请重新输入'))
      } else if (getAccountStatus()) {
        this.accountIsok = false
        callback(new Error('手机号不合法，请重新输入'))
      } else {
        callback()
      }
    }

    //验证码校验
    let validateCode = (rule, value, callback) => {
      let reg = /^\d{6}$/
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('验证码输入错误，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      isPhone: false,
      ruleForm: {
        account: '',
        code: ''
      },
      ruleForm2: {
        account: '',
        code: ''
      },
      result: '',
      result2: '',
      genre: 'message',
      purpose: 'login',
      rules: {
        account: [
          {
            required: true,
            message: '手机号/邮箱/用户名不能为空',
            trigger: 'blur'
          }
        ],
        code: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      rules2: {
        account: [{ validator: validatePhone, trigger: 'blur' }],
        code: [{ validator: validateCode, trigger: 'blur' }]
      },
      accountIsok: false,
      url: ''
    }
  },
  methods: {
    // 登录方式切换
    loginChange(ev) {
      this.result = this.result2 = ''
      this.ruleForm = this.ruleForm2 = {
        account: '',
        code: ''
      }
      if (ev == 'left') {
        this.isPhone = false
      } else if (ev == 'right') {
        this.isPhone = true
      }
      this.jkClear()
    },
    // 钉钉登录跳转
    dingdingLogin() {
      api.getDingUrl().then(response => {
        window.location.href = response.data.dingTalkLoginUrl
      })
    },
    jikeYanzheng(ev) {
      this.result = ev
    },
    jikeYanzheng2(ev) {
      this.result2 = ev
    },
    //复位极客验证
    jkClear() {
      this.$refs.childJk.clickme()
      this.result = this.result2 = ''
      this.accountIsok = false
    },
    //提交表单
    submitForm() {
      //验证码登录
      if (this.isPhone) {
        if (!this.result2) {
          this.$message({
            message: '请完成验证',
            type: 'warning'
          })
          return
        }

        this.$refs['ruleForm2'].validate(valid => {
          if (valid) {
            // alert('submit!');
            api
              .loginAction({
                way: 'validate',
                ...this.ruleForm2,
                ...this.result2
              })
              .then(response => {
                this.$store.commit('SET_TOKEN', response.data.token)
                Cookies.set('userid', response.data.userid)
                window.location.href = '/'
              })
              .catch(() => {
                this.jkClear()
              })
          } else {
            this.jkClear()
            return false
          }
        })
      } else {
        //密码登录
        if (!this.result) {
          this.$message.closeAll()
          this.$message({
            message: '请完成验证',
            type: 'warning'
          })
          return
        }
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            // alert('submit!');
            api
              .loginAction({
                way: 'password',
                ...this.ruleForm,
                ...this.result
              })
              .then(response => {
                this.$store.commit('SET_TOKEN', response.data.token)
                Cookies.set('userid', response.data.userid)
                window.location.href = '/'
              })
              .catch(() => {
                this.jkClear()
              })
          } else {
            this.jkClear()
            return false
          }
        })
      }
    },
    registerGo() {
      location.href = this.url
    }
  },
  mounted() {
    api.collocation().then(res => {
      this.url = 'http://' + res.data.domain_name + '/new/register'
    })
  },
  components: { loginHeader, Jike, GetCode }
}
</script>
<style lang="scss">
.userlogin {
  text-align: center;
  font-family: MicrosoftYaHei;
  .el-item {
    height: 50px;
    margin-bottom: 30px;
  }
  .el-item-last {
    margin-bottom: 0px;
  }
  .el-item .el-input__inner {
    height: 50px !important;
    padding-left: 55px !important;
  }
  .el-item .el-input {
    line-height: 50px;
  }
  .el-form-item__content {
    height: 50px;
  }
  .el-form-item__content > .el-input {
    border-radius: 0 !important;
  }

  .el-form-item__content > .el-input > .el-input__inner {
    transition: border 0.3s linear;
  }
  .el-form-item__content > .el-input > .el-input__inner:focus-within {
    border-color: rgba(0, 0, 0, 0) !important;
    box-shadow: 0px 0px 29px 1px rgba(176, 212, 240, 0.2) !important;
  }
  .el-form-item.is-error .el-input__inner,
  .el-form-item.is-success .el-input__inner {
    border-color: #dcdfe6;
  }
  .el-form-item__content > .el-input:focus-within .iconfont {
    color: #179bff !important;
  }
  .iconfont {
    font-size: 20px !important;
    margin-left: 10px;
    transition: color 0.3s linear;
  }
  .mui2 {
    height: 34px;
    line-height: 34px;
    width: 100%;
    font-size: 14px;
    color: #999;
    text-decoration: none;
    margin: 20px 0 8px;
  }
  .mui2 .forget {
    color: #999;
    float: left;
    margin-left: 30px;
    text-decoration: none;
  }
  .mui2 .forget:active {
    color: #179bff;
  }
  .mui2 .register {
    color: #179bff;
    float: right;
    margin-right: 30px;
    text-decoration: none;
    cursor: pointer;
  }
  .login {
    width: 180px;
    height: 60px;
    background: rgba(23, 155, 255, 1);
    border-radius: 30px;
    margin: 0 auto;
    font-weight: bold;
    font-size: 20px;
    padding: 0px 0px !important;
  }

  .dingLoginTitle {
    height: 24px;
    position: relative;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 24px;
    margin-top: 34px;
  }
  .line {
    position: absolute;
    width: 44px;
    height: 1px;
    background: rgba(241, 241, 241, 1);
    top: 12px;
  }
  .leftLine {
    left: 84px;
  }
  .rightLine {
    right: 80px;
  }
  .dingdingLogin a {
    text-decoration: none;
  }
  .dingLoginTitleText {
    display: inline-block;
  }
  .dingdingLink {
    text-decoration: none;
  }
  .dingding {
    color: #179bff;
    font-size: 34px !important;
  }
  .codeInput {
    width: 230px;
    text-align: left;
  }

  .codeInput .el-input__inner {
    padding: 0 20px !important;
    width: 230px !important;
  }
  .getCodeBox {
    text-align: left;
  }
  .getCode {
    height: 48px;
    display: inline-block;
    width: 109px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    color: #999;
    background: #f1f1f1;
    margin-left: 40px;
  }
  .getCodeSecond {
    background: #179bff;
    color: #fff;
  }
  .getCodeActive {
    color: #fff;
    background: #179bff;
  }
  #wait {
    width: 100%;
    height: 45px;
    border: 1px solid #dcdfe6;
    text-align: center;
    line-height: 45px;
    border-radius: 5px 5px;
    color: #dcdfe6;
  }
}
</style>


