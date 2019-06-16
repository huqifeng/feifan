<template>
  <aside class="main-sidebar">
    <el-scrollbar class="side-bar">
      <el-menu
        :collapse="true"
        :default-active="$route.path"
        background-color="#fff"
        text-color="#333"
        menu-trigger="click"
        router
        class="feelfine-menu"
      >
        <template v-for="(item, index) in menu">
          <el-menu-item
            v-if="!item.children || !item.children.length"
            :index="item.component"
            :key="`${item.title}_${index}`"
          >
            <i :class="item.icon"></i>
            <p class="title-text">{{item.title}}</p>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
          <el-submenu v-else :index="item.title" :key="`${item.title}_${index}`">
            <template slot="title">
              <i :class="item.icon"></i>
              <p class="title-text">{{item.title}}</p>
              <span slot="title">{{item.title}}</span>
            </template>
            <el-menu-item-group>
              <template v-for="child in item.children">
                <!-- 项目管理 -->
                <template v-if="projectSubRoutes.includes(child.component)">
                  <el-menu-item
                    :index="`${child.component}?${queryString}`"
                    :key="child.title"
                    v-if="hasProjectId"
                  >{{child.title}}</el-menu-item>
                </template>
                <el-menu-item v-else :index="child.component" :key="child.title">{{child.title}}</el-menu-item>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>
        <li class="user-wrap">
          <span>
            <img :src="user.avatar" :alt="user.realname">
          </span>
        </li>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>
<script>
import qs from 'qs'

export default {
  name: 'Sidebar',
  data() {
    return {
      // 项目子路由，以下路由必须要有projectid
      projectSubRoutes: [
        '/project/task',
        'originalUrl/project/contract/contractlist',
        'originalUrl/project/business/quotationlist',
        '/project/info',
        'originalUrl/project/logs/index',
        'originalUrl/project/customer/edit'
      ]
    }
  },
  computed: {
    // 菜单
    menu() {
      return this.$store.state.menu
    },
    // 用户
    user() {
      return this.$store.state.user
    },
    // 是否显示项目子菜单
    hasProjectId() {
      let query = this.$route.query
      return !!query.projectid
    },
    queryString() {
      return qs.stringify(this.$route.query)
    }
  },
  methods: {
    // 生成项目子菜单url
    genProjectUrl() {}
  },
  created() {
    this.$store.dispatch('setUser')
  }
}
</script>

<style lang="scss">
.main-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}
.el-aside {
  overflow: visible;
}
.side-bar {
  box-shadow: 5px 0 8px 0px rgba(40, 120, 255, 0.1);
  height: 100%;
  width: 87px;
  .el-scrollbar__view {
    height: 100%;
    margin-top: 40px;
  }
  .el-scrollbar__wrap {
    overflow-x: auto;
  }
  .el-menu {
    text-align: center;
    border: none;
    > li {
      margin-top: 27px;
    }
    [class*='icon-menu'] {
      background: transparent url('~@/assets/images/menu-icon.png') no-repeat
        scroll 0 0;
      display: inline-block;
      width: 24px;
      height: 24px;
    }
    .icon-menu-home {
      background-position: 0px 0px;
      &:hover {
        background-position: 0px -34px;
      }
      &:active {
        background-position: 0px -68px;
      }
    }
    .icon-menu-workbench {
      background-position: -34px 0px;
      &:hover {
        background-position: -34px -34px;
      }
      &:active {
        background-position: -34px -68px;
      }
    }
    .icon-menu-msg {
      background-position: -68px 0px;
      &:hover {
        background-position: -68px -34px;
      }
      &:active {
        background-position: -68px -68px;
      }
    }
    .icon-menu-production {
      background-position: -102px 0px;
      &:hover {
        background-position: -102px -34px;
      }
      &:active {
        background-position: -102px -68px;
      }
    }
    .icon-menu-business {
      background-position: -136px 0px;
      &:hover {
        background-position: -136px -34px;
      }
      &:active {
        background-position: -136px -68px;
      }
    }
    .icon-menu-schedule {
      background-position: -170px 0px;
      &:hover {
        background-position: -170px -34px;
      }
      &:active {
        background-position: -170px -68px;
      }
    }
    .icon-menu-customer {
      background-position: -204px 0px;
      &:hover {
        background-position: -204px -34px;
      }
      &:active {
        background-position: -204px -68px;
      }
    }
    .icon-menu-assets {
      background-position: -238px 0px;
      &:hover {
        background-position: -238px -34px;
      }
      &:active {
        background-position: -238px -68px;
      }
    }
    .icon-menu-report {
      background-position: -272px 0px;
      &:hover {
        background-position: -272px -34px;
      }
      &:active {
        background-position: -272px -68px;
      }
    }
    .icon-menu-members {
      background-position: -306px 0px;
      &:hover {
        background-position: -306px -34px;
      }
      &:active {
        background-position: -306px -68px;
      }
    }
    .icon-menu-setting {
      background-position: -340px 0px;
      &:hover {
        background-position: -340px -34px;
      }
      &:active {
        background-position: -340px -68px;
      }
    }
    &.feelfine-menu {
      height: 100%;
    }
    &.el-menu--collapse {
      width: 87px;
      > .el-menu-item [class^='el-icon-'],
      > .el-submenu > .el-submenu__title [class^='el-icon-'] {
        margin-top: 10px;
        color: #ffffff;
      }
    }
    .el-menu-item,
    .el-submenu__title {
      background-color: #ffffff !important;
      padding: 0 15px !important;
      height: 46px;
    }
    .el-submenu__title,
    .el-menu-item,
    .title-text {
      line-height: normal;
    }
    .title-text {
      margin: 5px 0 0;
      font-size: 12px;
    }
    .user-wrap {
      margin-bottom: 20px;
      span {
        background: #ffffff;
        border: 1px #eee solid;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        line-height: 40px;
        display: block;
        margin: 0 auto;
        overflow: hidden;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
}
</style>