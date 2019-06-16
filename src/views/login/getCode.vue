<template>
  <div class="getCodeWrap">
    <p :class="['getCode',accountIsok?'accountIsok':'']" v-if="!isSendCode" @click="getCode">获取验证码</p>
    <p class="getCode getCodeSecond" v-else>重新发送({{second}}s)</p>
  </div>
</template>
<script>
import * as api from '@/api/login'
export default {
  data() {
    return {
      isSendCode: false,
      second: 60,
      timer: null
    }
  },
  methods: {
    getCode() {
      if (this.accountIsok) {
        if (this.account == '') {
          this.$message({
            message: '请填写手机号',
            type: 'warning'
          })
          return
        }
        if (this.result == '') {
          this.$message({
            message: '请完成验证',
            type: 'warning'
          })
          return
        }
        api
          .sendSms({
            account: this.account,
            purpose: this.purpose,
            genre: this.genre,
            ...this.result
          })
          .then(() => {
            this.isSendCode = true
            let that = this
            that.second = 60
            this.timer = setInterval(function() {
              that.second--
              if (that.second <= 0) {
                clearInterval(that.timer)
                that.isSendCode = false
                that.$emit('jkClear')
              }
            }, 1000)
          })
          .catch(() => {
            this.$emit('jkClear')
          })
      } else {
        this.$message.closeAll()
        this.$message({
          message: '请完成验证，并输入正确的手机号或邮箱地址',
          type: 'warning'
        })
      }
    }
  },
  props: ['account', 'purpose', 'result', 'genre', 'accountIsok']
}
</script>
<style scoped>
.getCodeWrap {
  display: inline-block;
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
  background: #179bff !important;
  color: #fff !important;
}
.getCodeActive {
  color: #fff;
  background: #179bff;
}
.accountIsok {
  color: #fff !important;
  background: #179bff !important;
}
</style>


