<template>
  <!-- 文件存储 -->
  <div class="task-item-file-history drawer-right" :class="{animated: visible}" ref="file">
    <div class="back" @click="$emit('update:visible', false)">
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="scroll-content file-wrapper" :style="bottomStyle">
      <div class="file-list" v-if="visible">
        <div class="file-item" v-for="item in list" :key="item.id">
          <div class="inner">
            <el-dropdown
              class="file-dropdown"
              v-if="hasViewAccess"
              @command="handleHistoryFileCommand(arguments[0], item)"
              trigger="click"
            >
              <img
                src="../../../../assets/images/openTop.png"
                style="width:15px;height:18px;cursor:pointer;margin: 5px 15px;"
              >
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="use">使用文件</el-dropdown-item>
                <el-dropdown-item v-if="hasDownloadAccess" command="download">
                  <a :href="item.path | imageUrl" :download="item.file_name">下载文件</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="pic">
              <img :src="item.image_thumb | imageUrl">
              <div class="cover" v-if="item.fileType === 4">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
            <div class="content">
              <h4 :title="item.file_name">{{item.file_name}}</h4>
              <p :title="item.file_remark">{{item.file_remark}}</p>
              <p>{{item.task_name}}</p>
            </div>
          </div>
        </div>
        <infinite-loading :identifier="infiniteId" @infinite="loadMore">
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </div>
    </div>
  </div>
</template>

<script>
// api
import * as api from '@/api/make'
// components
import InfiniteLoading from 'vue-infinite-loading'
export default {
  name: 'TaskItemFile',
  props: {
    visible: { type: Boolean, default: false },
    // 任务ID
    id: String,
    // 文件ID
    fileId: String,
    // 目录
    directory: String,
    // 操作权限
    settings: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: { InfiniteLoading },
  data() {
    return {
      list: [],
      loading: true,
      page: 1,
      infiniteId: +new Date(),
      bottomHeight: null
    }
  },
  watch: {
    fileId() {
      this.init()
    }
  },
  computed: {
    bottomStyle() {
      return `height:${this.bottomHeight}px;`
    },
    // 是否有查看权限
    hasViewAccess() {
      return this.settings.includes('view')
    },
    // 是否有下载权限
    hasDownloadAccess() {
      return this.settings.includes('download')
    }
  },
  methods: {
    init() {
      this.page = 1
      this.list = []
      this.infiniteId += 1
    },
    // 获取历史文件列表
    getHistoryFileList() {
      return api
        .getFileList({
          stage_id: this.id,
          type: 2,
          pid: this.fileId,
          directory: this.directory,
          nowPage: this.page
        })
        .then(response => {
          this.list = [...this.list, ...response.data.data]
          return response
        })
    },
    // 文件存储历史文件滚动加载
    loadMore($state) {
      this.getHistoryFileList().then(response => {
        if (response.data.data.length) {
          this.page += 1
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    },
    // 历史文件下拉
    handleHistoryFileCommand(command, data) {
      switch (command) {
        case 'use':
          // 使用文件
          this.useFile(data)
          break
        case 'download':
          // 下载文件
          // this.downloadFile(data)
          break
      }
    },
    useFile(data) {
      api.useVersion({ id: data.id, pid: data.pid }).then(() => {
        this.$message({ type: 'success', message: '使用成功' })
        this.infiniteId += 1
        this.list = []
        this.page = 1
        this.$emit('update')
      })
    },
    // 设置底部高度
    setBottomHeight() {
      this.$nextTick(function() {
        this.bottomHeight = this.$refs.file
          ? this.$refs.file.offsetHeight - 40
          : null
      })
    }
  },
  updated() {
    this.setBottomHeight()
  }
}
</script>

<style lang="scss">
.task-item-file-history {
  position: absolute;
  top: 59px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 100;

  .back {
    height: 30px;
    margin-bottom: 10px;
    .el-icon-arrow-right {
      font-size: 30px;
      color: #409eff;
      cursor: pointer;
      margin-left: -8px;
    }
  }
}
</style>
