<template>
  <section class="project-version">
    <header class="main-header">
      <el-button type="primary" @click="handleClickAdd">新增版本</el-button>
    </header>
    <section class="main-content">
      <template v-for="item in list">
        <version-item
          :data="item"
          :key="item.versionid"
          @update="handleClickUpdate"
          @remove="handleClickRemove"
        ></version-item>
      </template>
      <div class="buttons" v-if="!noMore">
        <el-button type="primary" round @click="loadMore">查看更多</el-button>
      </div>
      <!-- 编辑 -->
      <version-update
        :id="updateOptions.updateId"
        :isUpdate="updateOptions.isUpdate"
        :projectId="pid"
        :visible.sync="updateOptions.visible"
        @update="init"
        v-if="updateOptions.visible"
      />
    </section>
  </section>
</template>

<script>
// api
import * as api from '@/api/project/version'
// components
import VersionUpdate from './update'
import VersionItem from './item'

export default {
  name: 'ProjectVersion',
  components: { VersionUpdate, VersionItem },
  data() {
    return {
      // 项目ID
      pid: '',
      // 当前页
      page: 1,
      // 列表数据
      list: [],
      // 是否有查看更多
      noMore: false,
      updateOptions: {
        // 模态框可见
        visible: false,
        // 是否为修改
        isUpdate: false,
        // 修改的ID
        updateId: ''
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.page = 1
      this.list = []
      this.getVersionList()
    },
    // 获取版本列表
    async getVersionList() {
      let params = { project_id: this.pid, nowPage: this.page }
      let { data } = await api.versionList(params)
      this.list = this.list.concat(data.data)
      this.noMore = this.list.length === data.count
    },
    // 查看更多
    loadMore() {
      if (this.noMore) {
        return false
      }
      this.page += 1
      this.getVersionList()
    },
    // 新建
    handleClickAdd() {
      this.updateOptions.updateId = ''
      this.updateOptions.isUpdate = false
      this.updateOptions.visible = true
    },
    // 修改
    handleClickUpdate(data) {
      this.updateOptions.updateId = data.versionid
      this.updateOptions.isUpdate = true
      this.updateOptions.visible = true
    },
    // 删除
    handleClickRemove(data) {
      this.$confirm('确定删除当前版本吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteVersion(data.versionid)
        })
        .catch(() => {})
    },
    // 删除
    deleteVersion(id) {
      api.deleteVersion({ versionid: id }).then(() => {
        let index = this.list.findIndex(item => item.versionid === id)
        this.list.splice(index, 1)
        this.$message({ type: 'success', message: '删除成功!' })
      })
    }
  },
  created() {
    let { query } = this.$route
    this.pid = query.projectid
  },
  beforeMount() {
    this.init()
  },
  // 取消缓存组件
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'related-task') {
      this.$store.commit('noKeepAlive', from.meta.keepComponent)
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
.main-header {
  min-height: 40px;
  margin: 10px 0 15px;
  padding: 0 102px;
  background-color: #fff;
  .el-button {
    border-radius: 0;
  }
}
.main-content {
  margin: 0 102px;
}
.project-version .buttons {
  text-align: right;
  padding: 90px 0;
}
</style>
