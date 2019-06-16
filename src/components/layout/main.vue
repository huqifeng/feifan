<template>
  <section class="main-wrapper">
    <slot name="header"/>
    <section class="main-container">
      <slot name="main-header"/>
      <slot>
        <router-view></router-view>
      </slot>
      <slot name="main-footer"/>
    </section>
    <slot name="footer"/>
  </section>
</template>

<script>
export default {
  computed: {
    key() {
      return `${this.$route.fullPath}&t=${new Date().getTime()}`
    }
  }
}
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 88px;
  background: #f9f9f9;
}
.main-container {
  flex: 1;
}
</style>
