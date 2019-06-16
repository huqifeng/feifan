<template>
  <section class="wrapper">
    <!-- 左侧部分 -->
    <app-sidebar></app-sidebar>
    <!-- 右侧部分 -->
    <app-main>
      <!-- topbar -->
      <template v-slot:header>
        <slot name="header"/>
      </template>
      <!-- 主体头 -->
      <template v-slot:main-header>
        <slot name="main-header"/>
      </template>
      <!-- 路由匹配部分 -->
      <slot/>
      <!-- 主体尾 -->
      <template v-slot:main-footer>
        <slot name="main-footer"/>
      </template>
      <!-- 版权部分 -->
      <template v-slot:footer>
        <slot name="footer">
          <app-footer></app-footer>
        </slot>
      </template>
    </app-main>
  </section>
</template>

<script>
import AppSidebar from './sidebar'
import AppMain from './main'
import AppFooter from './footer'

export default {
  components: { AppSidebar, AppMain, AppFooter }
}
</script>

<style scoped>
.wrapper {
  min-height: 100vh;
}
</style>
