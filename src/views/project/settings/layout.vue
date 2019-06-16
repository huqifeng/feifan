<template>
  <section class="main-content project-settings-layout">
    <div class="menu topMenu">
      <el-menu :router="true"  mode="horizontal" :default-active="defaultActive">
        <el-menu-item
          v-for="menu in menuList"
          :key="`${menu.path}?${queryString}`"
          :index="`${menu.path}?${queryString}`"
        >
          <span slot="title">{{menu.title}}</span>
        </el-menu-item>
      </el-menu>
      <section class="main">
        <router-view/>
      </section>
    </div>
  </section>
</template>

<script>
import qs from 'qs'

export default {
  data() {
    return {
      menuList: [
        { title: '状态管理', path: '/project/settings/status' },
        { title: '流程审核', path: '/project/settings/workflow' },
        { title: '文件权限', path: '/project/settings/file' },
        { title: '文件存储', path: '/project/settings/store' }
      ]
    }
  },
  computed: {
    defaultActive() {
      return `${this.$route.path}?${this.queryString}`
    },
    queryString() {
      return qs.stringify(this.$route.query)
    }
  }
}
</script>

<style lang="scss" scoped>
.project-settings-layout {
  display: flex;
  .menu {
    /*width: 100px;*/
    border-right: 1px solid #e8e8e8;
    margin:10px 0 0;
    width:100%;
    .el-menu {
      border-right: 0;
      height: 40px;
      padding: 0 102px 0
    }
  }
  .main {
    flex: 1;
    padding: 10px 102px 0px; clear: both; overflow: hidden;
  }
  .el-menu--horizontal{
    border-bottom:none;
    > .el-menu-item.is-active{
      border-bottom:0;
      color: #fff;
      border-color: #c6e2ff;
      background-color: #179bff;
    }
    .el-menu-item{
      border-bottom:0;
      height:40px;
      line-height:38px;
    }
    .el-menu-item:hover{
      color: #fff;
      border-color: #c6e2ff;
      background-color: #6EBFFD;
    }
    .el-menu-item:focus{
      color: #fff;
      border-color: #c6e2ff;
      background-color: #179bff;
    }
  }

}
</style>
