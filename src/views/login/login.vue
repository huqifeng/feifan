<template>
  <section class="loginContent">
    <div class="loginImgBox">
      <div class="loginImg">
        <img src="../../assets/images/login/loginImg.jpg" alt>
      </div>
    </div>
    <div class="loginMain">
      <div class="loginMainContent">
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      msg: '登陆'
    }
  }
}
</script>
<style scoped>
.loginContent {
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgba(40, 120, 255, 0.25);
  border-radius: 10px 10px;
}
@media screen and (max-width: 1899px) {
  .loginContent {
    width: 960px;
    height: auto;
  }
  .loginImg {
    width: 450px;
    height: 600px;
    margin: auto;
  }
}
@media screen and (min-width: 1900px) {
  .loginContent {
    width: 1200px;
    height: auto;
  }
  .loginImg {
    width: 495px;
    height: 650px;
    margin: auto;
  }
}

.loginImgBox,
.loginMain {
  width: 50%;
  height: auto;
  display: inline-block;
  height: auto;
  vertical-align: top;
}
.loginImgBox {
  height: 650px;
}
.loginImg {
  margin: auto;
}
.loginMainContent {
  width: 382px;
  margin: 50px auto;
}
</style>


