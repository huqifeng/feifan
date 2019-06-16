<template>
  <div class="wrapper">
    <router-view :key="key"></router-view>
    <login-footer></login-footer>
  </div>
</template>
<script>
import loginFooter from './loginFooter'
export default {
  components: { loginFooter },
  data() {
    return {
      msg: '登陆'
    }
  },
  computed: {
    key() {
      return this.$route + new Date().getTime()
    }
  }
}
</script>
<style scoped>
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
</style>

