<template>
  <div class="jike">
    <div :id="msgJikeid"></div>
    <div v-show="waitShow" id="wait">正在加载极验...</div>
  </div>
</template>
<script>
import '../../assets/js/gt.js'
import * as api from '@/api/login'
export default {
  data() {
    return {
      waitShow: true,
      captchaObj: {},
      result: ''
    }
  },
  methods: {
    getInitGtTest() {
      api
        .getjk()
        .then(data => {
          window.initGeetest(
            {
              gt: data.gt,
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: data.new_captcha,
              product: 'float',
              width: '100%'
            },
            captchaObj => {
              this.captchaObj = captchaObj
              captchaObj.appendTo(`#${this.msgJikeid}`)
              captchaObj.onReady(() => {
                this.waitShow = false
              })
              captchaObj.onSuccess(() => {
                this.result = captchaObj.getValidate()
                this.$emit('jike', this.result)
              })
              captchaObj.onError(() => {
                this.$Message.error('出错啦, 请稍后重试!')
              })
            }
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    clickme() {
      this.captchaObj.reset()
    }
  },
  created() {
    this.getInitGtTest()
  },
  props: ['msgJikeid']
}
</script>
<style lang="scss" scoped>
#wait {
  width: 100%;
  height: 45px;
  border: 1px solid #dcdfe6;
  text-align: center;
  line-height: 45px;
  border-radius: 5px 5px;
  color: #dcdfe6;
  .geetest_btn {
    display: none !important;
  }
}
.geetest_btn {
  display: none !important;
}
</style>


