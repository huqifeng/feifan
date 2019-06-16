<template>
  <div id="app">
    <keep-alive :include="keepAliveComponents">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    keepAliveComponents() {
      return this.$store.state.keepAliveComponents
    }
  }
}
</script>

<style lang="scss">
@import './style/main.scss';
@import './style/dialog.scss';
@import './style/button.scss';
@import './style/form.scss';
@import './style/table.scss';
@import './style/tooltip.scss';
body .el-dialog__headerbtn {
  background: url('assets/images/dialogClose.png') no-repeat;
  background-size: 100% 100%;
  width: 24px;
  height: 24px;
}
body .el-dialog__close {
  display: none;
}
</style>
