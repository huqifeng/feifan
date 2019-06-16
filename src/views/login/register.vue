<template>
  <div class="wrapper">
    <section class="registerWrap">
      <div class="registerContent">
        <h2 class="title">企业注册</h2>
        <el-form label-width="94px" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="username" label="企业名称">
            <el-input
              v-model="ruleForm.username"
              placeholder="请输入企业名称"
              maxlength="50"
              minlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="所在行业" prop="region">
            <el-select v-model="ruleForm.region" class="industry" placeholder="请选择活动区域">
              <el-option label="CDA/预演" value="CDA/预演"></el-option>
              <el-option label="商业/广告" value="商业/广告"></el-option>
              <el-option label="电影/电视" value="电影/电视"></el-option>
              <el-option label="教育" value="教育"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在地址">
            <el-form-item prop="province" class="addsLi">
              <el-select
                v-model="ruleForm.province"
                placeholder="请选择省"
                class="address_select"
                @change="getcity(ruleForm.province,true)"
              >
                <el-option
                  v-for="item in adds2.provinces"
                  :key="item.id"
                  :label="item.province"
                  :value="item.provinceid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="city" class="addsLi">
              <el-select
                v-model="ruleForm.city"
                placeholder="请选择市"
                class="address_select"
                @change="getarea(ruleForm.city,true)"
              >
                <el-option
                  v-for="item in adds2.cities"
                  :key="item.id"
                  :label="item.city"
                  :value="item.cityid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="areas" class="addsLi">
              <el-select v-model="ruleForm.areas" placeholder="请选择区" class="address_select">
                <el-option
                  v-for="item in adds2.areas"
                  :key="item.id"
                  :label="item.area"
                  :value="item.areaid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item prop="domain" label="企业域名" class="domain">
            <el-input
              v-model="ruleForm.domain"
              placeholder="设置企业专属域名，如sky.movtile.com"
              maxlength="50"
              class="domainText"
            ></el-input>
            <span class="domianCom">.movtile.com</span>
          </el-form-item>
          <el-form-item prop="phone" label="手机号" class="phoneInput">
            <el-input
              maxlength="11"
              minlength="11"
              onkeypress="return event.keyCode>=48&&event.keyCode<=57"
              v-model="ruleForm.phone"
            >
              <i slot="prefix" class="phoneTips">+86</i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <Jike msg-jikeid="userLoginJike5" @jkClear="jkClear" @jike="jikeYanzheng" ref="childJk"></Jike>
          </el-form-item>
          <el-form-item prop="code" class="el-item getCodeBox" label="验证码">
            <el-input
              maxlength="6"
              minlength="6"
              onkeypress="return event.keyCode>=48&&event.keyCode<=57"
              class="codeInput"
              v-model="ruleForm.code"
              placeholder="请输入验证码"
            ></el-input>
            <Get-Code
              v-bind:genre="genre"
              v-bind:purpose="purpose"
              v-bind:account="ruleForm.phone"
              v-bind:result="result"
              v-bind:accountIsok="accountIsok"
              @jkClear="jkClear"
            ></Get-Code>
          </el-form-item>
          <el-form-item prop="password" label="设置密码">
            <el-input
              type="password"
              v-model="ruleForm.password"
              auto-complete="new-password"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passwordAgain" label="再次输入">
            <el-input
              type="password"
              v-model="ruleForm.passwordAgain"
              auto-complete="new-password"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="checkedBox" prop="type" label-width="125px">
            <el-checkbox class="checked" v-model="ruleForm.type"></el-checkbox>
            <p class="checkedText">
              同意“
              <span :class="['service']" @click="showService">服务条款</span>”和“
              <span :class="['privacy']" @click="showPrivacy">隐私相关政策</span>"
            </p>
          </el-form-item>
          <el-form-item>
            <router-link to="/login">
              <el-button class="back button" size="medium" round type="info">
                <router-link to="../../login">返回</router-link>
              </el-button>
            </router-link>
            <el-button
              class="down button"
              size="medium"
              round
              type="primary"
              @click="submitForm('ruleForm')"
            >完成</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <login-footer></login-footer>
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
          account: this.ruleForm.phone,
          purpose: 'register',
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

    //企业名称长度校验
    let EnterpriseNameLength = function(str) {
      var realLength = 0,
        len = str.length,
        charCode = -1
      for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128) realLength += 1
        else realLength += 2
      }
      return realLength
    }

    //企业名称校验
    let validateEnterpriseName = (rule, value, callback) => {
      let str = value.replace(/(^\s*)|(\s*$)/g, '')
      let reg = /^[\u4e00-\u9fa5A-Za-z]+$/
      if (str === '') {
        callback(new Error('请输入企业名称'))
      } else if (!reg.test(str)) {
        callback(new Error('企业名称输入错误'))
      } else if (EnterpriseNameLength(str) > 50) {
        callback(new Error('企业名称长的有误'))
      } else {
        this.ruleForm.username = str
        callback()
      }
    }

    //企业域名校验
    let validateDomain = (rule, value, callback) => {
      let reg = /^[a-zA-Z\d]+(-?[a-zA-Z\d]+)*$/
      if (value === '') {
        callback(new Error('企业域名不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('企业域名格式有误'))
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
    //密码校验
    let validatePassword = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z_!,/.]{8,18}$/i
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('密码输入格式有误，请重新输入'))
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
        callback(new Error('密码输入格式有误，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        region: 'CDA/预演',
        province: '',
        city: '',
        areas: '',
        domain: '',
        phone: '',
        code: '',
        password: '',
        passwordAgain: '',
        type: []
      },
      rules: {
        username: [{ validator: validateEnterpriseName, trigger: 'change' }],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        province: [
          { required: true, message: '省不能为空', trigger: 'change' }
        ],
        city: [{ required: true, message: '市不能为空', trigger: 'change' }],
        areas: [{ required: true, message: '区不能为空', trigger: 'change' }],
        domain: [{ validator: validateDomain, trigger: 'blur' }],
        phone: [
          // { required: true, message: '请输入手机号', trigger: 'blur' },
          // { min: 11, max: 11, message: '长度为11个数字', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        code: [{ validator: validateCode, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        passwordAgain: [{ validator: validatePasswordAgain, trigger: 'blur' }],
        type: [
          {
            type: 'array',
            required: true,
            message: '请同意隐私政策和平台服务协议并勾选',
            trigger: 'change'
          }
        ]
      },
      adds: {},
      adds2: {
        provinces: {},
        cities: {},
        areas: {}
      },
      result: '',
      genre: 'message',
      purpose: 'register',
      accountIsok: false
    }
  },
  methods: {
    getcity(ev) {
      let city = {}
      for (let key in this.adds.cities) {
        if (this.adds.cities[key].provinceid == ev) {
          city[key] = this.adds.cities[key]
        }
      }
      this.adds2.cities = city
    },
    getarea(ev) {
      let area = {}

      for (let key in this.adds.areas) {
        if (this.adds.areas[key].cityid == ev) {
          area[key] = this.adds.areas[key]
        }
      }
      this.adds2.areas = area
    },
    //显示服务条款
    showService() {
      this.$alert(
        '您的信任对我们非常重要，我们深知个人信息对您的重要性，我们将按法律法规要求，采取相应安全保护措施，尽力保护您的个人信息安全可控。有鉴于此，非凡科技公司运营的非凡科技产品和服务提供者（或简称“我们”）制定本《隐私政策》（下称“本政策”）并提醒您：',
        '提示条款：',
        {
          confirmButtonText: '确定',
          callback: () => {}
        }
      )
    },
    //显示隐私条款
    showPrivacy() {
      this.$alert(
        '您的信任对我们非常重要，我们深知个人信息对您的重要性，我们将按法律法规要求，采取相应安全保护措施，尽力保护您的个人信息安全可控。有鉴于此，非凡科技公司运营的非凡科技产品和服务提供者（或简称“我们”）制定本《隐私政策》（下称“本政策”）并提醒您：',
        '提示条款：',
        {
          confirmButtonText: '确定',
          callback: () => {}
        }
      )
    },
    //设置极客验证码
    jikeYanzheng(ev) {
      this.result = ev
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.registerAction()
        } else {
          return false
        }
      })
    },
    //复位极客验证
    jkClear() {
      this.$refs.childJk.clickme()
      this.result = ''
    },
    //提交注册
    registerAction() {
      let data = {
        companyName: this.ruleForm.username,
        trade: this.ruleForm.region,
        provinceId: this.ruleForm.province,
        cityId: this.ruleForm.city,
        areaId: this.ruleForm.areas,
        domainName: this.ruleForm.domain,
        account: this.ruleForm.phone,
        code: this.ruleForm.code,
        password: this.ruleForm.password
      }
      api
        .registerAction(data)
        .then(() => {
          this.$message({
            message: '恭喜您注册成功！',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push({ path: '/login' })
          }, 1500)
        })
        .catch(() => {
          this.jkClear()
        })
    }
  },
  watch: {
    //监听地址选择的前两项的改变
    'ruleForm.province': function() {
      this.ruleForm.city = ''
      this.ruleForm.areas = ''
      this.adds2.areas = {}
    },
    'ruleForm.city': function() {
      this.ruleForm.areas = ''
    }
  },
  mounted() {
    let that = this
    api.getAdds().then(response => {
      that.adds = response.data
      that.adds2.provinces = response.data.provinces
    })
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
.registerWrap {
  width: 643px;
  height: 936px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 17px 30px 0px rgba(4, 60, 103, 0.2);
  border-radius: 10px;
  font-family: MicrosoftYaHei;
  .back {
    background: #f1f1f1;
    border: 1px solid #f1f1f1;
    a {
      color: #999 !important;
    }
  }
  .el-form-item__content > .el-input > .el-input__inner:focus-within {
    border-color: rgba(0, 0, 0, 0) !important;
    box-shadow: 0px 0px 29px 1px rgba(23, 155, 255, 0.2) !important;
  }
  .el-form-item.is-error .el-input__inner,
  .el-form-item.is-success .el-input__inner {
    border-color: #dcdfe6;
  }
  .registerContent {
    width: 476px;
    margin: 0 auto;
    .title {
      text-align: center;
      font-size: 24px;
      height: 64px;
      line-height: 64px;
      margin-top: 10px;
      font-weight: 400;
      color: #179bff;
    }
    .industry {
      width: 382px !important;
    }
    .address_select {
      width: 120px !important;
      margin-right: 10px;
    }
    .address_select:last-child {
      margin-right: 0px;
    }
    .el-form-item > .el-form-item__label {
      font-size: 16px !important;
      font-family: MicrosoftYaHei !important;
      font-weight: 400 !important;
      color: #333;
    }
    .el-form-item .el-input__inner,
    .el-form-item .el-form-item__label {
      height: 45px;
      line-height: 45px;
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
      height: 50px;
      display: inline-block;
      width: 110px;
      text-align: center;
      line-height: 50px;
      font-size: 14px;
      color: #999;
      background: #f1f1f1;
      margin-left: 40px;
    }
    .getCodeActive {
      color: #fff;
      background: #179bff;
    }
    .el-form-item {
      margin-bottom: 29px;
    }
    .radio {
      margin-left: 25px;
    }
    .back a {
      text-decoration: none;
      color: #fff;
    }
    .button {
      width: 90px;
      height: 35px;
      margin-left: 38px;
    }
    .checked {
      margin-right: 21px;
    }
    .checkedText {
      display: inline-block;
      span {
        cursor: pointer;
        &:hover {
          color: #179bff;
          text-decoration: underline;
        }
      }
    }
    .domain {
      position: relative;
      .domainText {
        width: 282px;
      }
      .domianCom {
        font-size: 14px;
        display: inline-block;
        margin-left: 4px;
      }
      .tips {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        color: #999;
        font-weight: 400;
        position: absolute;
        left: 0;
        top: 45px;
      }
    }
    .phoneInput .el-input__inner {
      padding-left: 50px;
    }
    .phoneTips {
      font-size: 12px;
      color: #999;
      font-family: MicrosoftYaHei;
      font-style: normal;
      line-height: 45px;
      margin-left: 10px;
    }
    .el-form-item__label:before {
      content: '' !important;
    }
    .addsLi {
      width: 120px !important;
      margin-right: 10px;
      float: left;
      margin-bottom: 0px !important;
    }
    .addsLi:last-child {
      margin-right: 0px;
    }
  }
}
</style>


