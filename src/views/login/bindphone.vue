<template>
  <div class="wrapper">
    <section class="loginWrap">
      <div class="bondPhone">
        <div class="bondPhoneWrap">
          <h4 class="title">绑定已有手机号</h4>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="account" class="el-item">
              <el-input
                minlength="11"
                maxlength="11"
                onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                v-model="ruleForm.account"
                placeholder="请输入手机号"
              >
                <i slot="prefix" class="iconfont icon-shouji"></i>
              </el-input>
            </el-form-item>
            <el-form-item class="el-item">
              <Jike msg-jikeid="userLoginJike6" @jike="jikeYanzheng" ref="childJk"></Jike>
            </el-form-item>
            <el-form-item prop="code" class="el-item getCodeBox">
              <el-input
                onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                minlength="6"
                maxlength="6"
                class="codeInput"
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
            <el-form-item class="el-item bottomUi">
              <el-button class="bindBtn" size="medium" round type="primary" @click="submitForm">完成</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <login-footer></login-footer>
    </section>
  </div>
</template>
<script>
import * as api from '@/api/login'
import loginFooter from './loginFooter'

import Jike from './jike'
import GetCode from './getCode'

export default {
  data() {
    //账号校验
    let getAccountStatus = () => {
      api
        .getAccountStatus({
          account: this.ruleForm.account,
          purpose: 'binding',
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
    return {
      ruleForm: {
        account: '',
        code: ''
      },
      result: '',
      genre: 'message',
      purpose: 'binding',
      rules: {
        account: [{ validator: validatePhone, trigger: 'blur' }],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      },
      urlCode: {},
      accountIsok: false
    }
  },
  methods: {
    jikeYanzheng(ev) {
      this.result = ev
    },
    jkClear() {
      this.$refs.childJk.clickme()
      this.result = this.result2 = ''
      this.accountIsok = false
    },
    submitForm() {
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
            .bindPhone({
              ...this.ruleForm,
              ...this.urlCode
            })
            .then(() => {
              this.$router.push({ path: '/login' })
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
  created() {
    const { query } = this.$route
    this.urlCode = query
  },
  components: { loginFooter, Jike, GetCode }
}
</script>
<style lang="scss">
.wrapper {
  width: 100%;
  min-height: 100vh;
  background: url(../../assets/images/login/loginBj2.jpg) no-repeat center
    center;
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
.bondPhone {
  width: 630px;
  height: 480px;
  background: #fff;
  box-shadow: 0px 17px 30px 0px rgba(4, 60, 103, 0.2);
  border-radius: 10px;
  zoom: 1;
  overflow: hidden;
  .bondPhoneWrap {
    width: 382px;
    margin: 0 auto;
  }
  .title {
    width: 100%;
    height: 20px;
    font-size: 20px;
    line-height: 20px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
    color: rgba(23, 155, 255, 1);
    margin: 50px auto 41px;
    text-align: center;
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
  .el-form-item.is-error
    .el-input__inner
    .el-form-item.is-success
    .el-input__inner {
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
    .bindBtn {
      width: 90px;
    }
  }
}
</style>




