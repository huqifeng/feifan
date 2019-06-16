<template>
  <div class="findpassword">
    <login-header
      @loginHeaderChange="loginChange"
      msg-logintitle="找回密码"
      msg-leftname="手机找回"
      msg-rightname="邮箱找回"
    ></login-header>
    <div v-if="!isPhone">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="account" class="el-item">
          <el-input
            maxlength="11"
            minlength="11"
            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
            v-model="ruleForm.account"
            placeholder="请输入手机号"
          >
            <i slot="prefix" class="iconfont icon-shouji"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="el-item">
          <Jike msg-jikeid="userLoginJike3" @jike="jikeYanzheng" ref="childJk"></Jike>
        </el-form-item>
        <el-form-item prop="code" class="el-item getCodeBox">
          <el-input
            class="codeInput"
            maxlength="6"
            minlength="6"
            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
            v-model="ruleForm.code"
            placeholder="请输入验证码"
          ></el-input>
          <Get-Code
            v-bind:genre="genre"
            v-bind:purpose="purpose"
            v-bind:account="ruleForm.account"
            v-bind:result="result"
            v-bind:accountIsok="accountIsok"
            @jkClear="jkClear"
          ></Get-Code>
        </el-form-item>
        <el-form-item prop="password" class="el-item">
          <el-input
            type="password"
            v-model="ruleForm.password "
            auto-complete="new-password"
            placeholder="请输入新密码"
          >
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="passwordAgain" class="el-item">
          <el-input
            type="password"
            v-model="ruleForm.passwordAgain"
            auto-complete="new-password"
            placeholder="请再次输入密码"
          >
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="el-item bottomUi">
          <router-link to="/login">
            <el-button class="back" size="medium" round type="info">
              <router-link to="../../login">返回</router-link>
            </el-button>
          </router-link>
          <el-button class="down" size="medium" round type="primary" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <section v-else>
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2">
        <el-form-item prop="account" class="el-item">
          <el-input v-model="ruleForm2.account" placeholder="请输入邮箱地址">
            <i slot="prefix" class="iconfont icon-youjian"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="el-item">
          <Jike msg-jikeid="userLoginJike4" @jike="jikeYanzheng2" ref="childJk"></Jike>
        </el-form-item>
        <el-form-item prop="code" class="el-item getCodeBox">
          <el-input
            class="codeInput"
            v-model="ruleForm2.code"
            placeholder="请输入验证码"
            maxlength="6"
            minlength="6"
            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
          ></el-input>
          <Get-Code
            v-bind:genre="genre2"
            v-bind:purpose="purpose"
            v-bind:account="ruleForm2.account"
            v-bind:result="result2"
            v-bind:accountIsok="accountIsok"
            @jkClear="jkClear"
          ></Get-Code>
        </el-form-item>
        <el-form-item prop="password" class="el-item">
          <el-input
            type="password"
            v-model="ruleForm2.password"
            auto-complete="new-password"
            placeholder="请输入新密码"
          >
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="passwordAgain" class="el-item">
          <el-input
            type="password"
            v-model="ruleForm2.passwordAgain"
            auto-complete="new-password"
            placeholder="请再次输入密码"
          >
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="el-item bottomUi">
          <router-link to="/login">
            <el-button class="back" size="medium" round type="info">
              <router-link to="../../login">返回</router-link>
            </el-button>
          </router-link>
          <el-button class="down" size="medium" round type="primary" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>
<script>
import * as api from '@/api/login'
import loginHeader from '../loginheader'
import Jike from '../jike'
import GetCode from '../getCode'
export default {
  data() {
    //账号校验
    let getAccountStatus = () => {
      api
        .getAccountStatus({
          account: this.ruleForm.account,
          purpose: 'retrieve',
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
    //账号校验
    let getAccountStatus2 = () => {
      api
        .getAccountStatus({
          account: this.ruleForm2.account,
          purpose: 'retrieve',
          genre: 'email'
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
    //邮箱校验

    let validateEmail = (rule, value, callback) => {
      let reg = new RegExp(
        '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
      )
      if (value === '') {
        this.accountIsok = false
        callback(new Error('邮箱不能为空'))
      } else if (!reg.test(value)) {
        this.accountIsok = false
        callback(new Error('邮箱格式错误，请重新输入'))
      } else if (getAccountStatus2()) {
        this.accountIsok = false
        callback(new Error('账号不存在，请重新输入'))
      } else {
        callback()
      }
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
        callback(new Error('手机号不存在，请重新输入'))
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
        callback(new Error('验证码格式错误，请重新输入'))
      } else {
        callback()
      }
    }
    //密码校验
    let validatePassword = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z_!,/.]{8,18}$/i
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('密码格式错误，请重新输入'))
      } else {
        callback()
      }
    }
    //密码再次校验
    let validatePasswordAgain = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z_!,/.]{8,18}$/i
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value != this.ruleForm.password) {
        callback(new Error('两次密码输入不一致，请重新输入'))
      } else if (!reg.test(value)) {
        callback(new Error('密码格式错误，请重新输入'))
      } else {
        callback()
      }
    }

    //密码再次校验
    // let validatePasswordAgain2 = (rule, value, callback) => {
    //   let reg = /^[0-9a-zA-Z_!,/.]{8,18}$/i
    //   if (value === '') {
    //     callback(new Error('密码不能为空'))
    //   } else if (value != this.ruleForm2.password) {
    //     callback(new Error('两次密码输入不一致，请重新输入'))
    //   } else if (!reg.test(value)) {
    //     callback(new Error('密码格式错误，请重新输入'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      isPhone: false,
      ruleForm: {
        account: '',
        code: '',
        password: '',
        passwordAgain: ''
      },
      ruleForm2: {
        account: '',
        code: '',
        password: '',
        passwordAgain: ''
      },
      result: '',
      result2: '',

      purpose: 'retrieve',
      genre: 'message',
      genre2: 'email',
      rules: {
        account: [{ validator: validatePhone, trigger: 'blur' }],
        code: [{ validator: validateCode, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        passwordAgain: [{ validator: validatePasswordAgain, trigger: 'blur' }]
      },
      rules2: {
        account: [{ validator: validateEmail, trigger: 'blur' }],
        code: [{ validator: validateCode, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        passwordAgain: [{ validator: validatePasswordAgain, trigger: 'blur' }]
      },
      accountIsok: false
    }
  },
  methods: {
    loginChange(ev) {
      if (ev == 'left') {
        this.isPhone = false
      } else if (ev == 'right') {
        this.isPhone = true
      }
      this.jkClear()
      this.ruleForm = this.ruleForm2 = {
        account: '',
        code: '',
        password: '',
        passwordAgain: ''
      }
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
            api
              .forgetPwdAction({
                ...this.ruleForm2
              })
              .then(() => {
                this.$message({
                  message: '恭喜您修改密码成功！',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push({ path: '/login' })
                }, 1500)
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
        //手机找回密码
        if (!this.result) {
          this.$message({
            message: '请完成验证',
            type: 'warning'
          })
          return
        }
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            api
              .forgetPwdAction({
                ...this.ruleForm
              })
              .then(() => {
                this.$message({
                  message: '恭喜您修改密码成功！',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push({ path: '/login' })
                }, 1500)
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
    }
  },
  components: { loginHeader, Jike, GetCode }
}
</script>
<style lang="scss" >
.findpassword {
  .back,
  .down {
    width: 90px;
    a {
      text-decoration: none;
      color: #fff;
    }
  }
  .back {
    background: #f1f1f1;
    border: 1px solid #f1f1f1;
    a {
      color: #999 !important;
    }
  }
  .down {
    margin-left: 30px !important;
  }
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
    box-shadow: 0px 0px 29px 1px rgba(23, 155, 255, 0.2) !important;
  }
  .el-form-item.is-error .el-input__inner,
  .el-form-item.is-success .el-input__inner {
    border-color: #dcdfe6;
  }
  .el-form-item__content > .el-input:focus-within .iconfont {
    color: #179bff !important;
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
  .iconfont {
    font-size: 20px !important;
    margin-left: 10px;
    transition: color 0.3s linear;
  }
  .bottomUi {
    text-align: center;
  }
}
</style>


