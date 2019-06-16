<template>
  <!-- 版本任务 -->
  <div class="main-content">
    <div class="hd">
      <el-page-header @back="handleBack" :content="detail.version_name"/>
    </div>
    <div class="bd">
      <el-table :data="list" style="width: 100%" v-loading="loading">
        <template v-for="item in fields">
          <el-table-column :prop="item.prop" :label="item.label" :key="item.prop"></el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/project/version'
export default {
  data() {
    return {
      loading: false,
      fields: [
        { prop: 'episode', label: '集数' },
        { prop: 'lens', label: '场次' },
        { prop: 'movie_scene', label: '镜头' },
        { prop: 'task_name', label: '任务名称' },
        { prop: 'category', label: '任务类型' },
        { prop: 'title', label: '任务阶段' }
      ],
      list: [],
      detail: {},
      versionId: ''
    }
  },
  methods: {
    // 初始化
    init() {
      this.getVersion()
      this.getVersionTask()
    },
    // 获取版本信息
    getVersion() {
      api.versionInfo({ versionid: this.versionId }).then(response => {
        this.detail = response.data
      })
    },
    // 获取版本任务
    getVersionTask() {
      this.loading = true
      api.versionTaskList({ versionid: this.versionId }).then(response => {
        this.list = response.data.length ? response.data : []
        this.loading = false
      })
    },
    // 返回
    handleBack() {
      this.$router.back()
    }
  },
  created() {
    let { query } = this.$route
    this.versionId = query.version_id
  },
  beforeMount() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  margin: 0 102px;
  padding: 20px 0;
  .hd {
    padding: 24px 10px;
    background-color: #fff;
    border-bottom: 1px solid #ebebeb;
    margin-bottom: 10px;
  }
  .ft {
    padding: 60px 0;
    text-align: right;
  }
}
</style>