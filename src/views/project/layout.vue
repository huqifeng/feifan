<template>
  <layout>
    <template v-slot:header>
      <section class="topbar">
        <h1 class="header-title">{{title}}</h1>
        <el-menu :default-active="defaultActive" router mode="horizontal" class="topMenu">
          <el-menu-item
            v-for="item in menu"
            :index="`${item.component}?${queryString}`"
            :key="`${item.component}?${queryString}`"
          >{{item.title}}</el-menu-item>
        </el-menu>
        <!-- <div class="main-search">
          <el-input placeholder="请输入关键字检索" v-model="check" suffix-icon="el-icon-search"></el-input>
        </div>-->
      </section>
    </template>
  </layout>
</template>

<script>
import qs from 'qs'
import Layout from '@/components/layout/layout'
import * as api from '@/api/project/projectIndex'
export default {
  name: 'ProjectLayout',
  components: { Layout },
  data() {
    return {
      defaultActive: '',
      check: '',
      pid: '',
      title: ''
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        let found = this.menu.find(item => to.path.includes(item.component))
        if (found) {
          this.defaultActive = `${found.component}?${this.queryString}`
        }
      }
    }
  },
  computed: {
    menu() {
      let { menu } = this.$store.state
      let found = menu.find(item => item.component.includes('/project/index'))
      return found ? found.top : []
    },
    queryString() {
      let { query } = this.$route
      return qs.stringify({ projectid: query.projectid })
    }
  },
  methods: {
    // 初始化
    init() {
      this.getProject()
    },
    // 获取项目详情
    getProject() {
      api.getProjectInfo({ project_id: this.pid }).then(response => {
        this.title = response.data.base.p_title
      })
    }
  },
  created() {
    this.pid = this.$route.query.projectid
  },
  beforeMount() {
    this.init()
  }
}
</script>

<style lang="scss">
.topbar {
  display: flex;
  align-items: center;
  padding: 0 102px;
  background-color: #fff;
  border-bottom: solid 1px #e6e6e6;
  .header-title {
    font-size: 16px;
    font-weight: normal;
    margin-right: 20px;
    max-width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .el-menu {
    flex: 1;
    .el-menu-item {
      width: 90px;
      text-align: center;
      padding: 0;
      color: #333333;
      font-size: 16px;
      /*padding: 0 10px;*/
      /*margin: 0 10px;*/
    }
    .el-menu-item:hover {
      color: #179bff;
    }
    .el-menu-item.is-active {
      font-size: 18px;
      color: #179bff;
      font-weight: bold;
    }
  }
  .main-search {
    .el-input {
      width: 300px;
    }
    .el-input .el-input__inner {
      height: 30px;
      line-height: 35px;
      border-radius: 0;
      background: #f8f8f8;
      font-size: 12px;
      color: #333333;
      border: 1.5px solid #fff;
    }
  }
}
</style>

