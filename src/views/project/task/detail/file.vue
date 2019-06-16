<template>
  <!-- 文件存储 -->
  <div class="task-item-file" ref="file">
    <el-tabs v-model="activeName" @tab-click="resetFile" class="detailsTab1">
      <el-tab-pane v-for="tab in tabs" :key="tab.key" :label="tab.value" :name="tab.key"></el-tab-pane>
    </el-tabs>
    <div class="scroll-content file-wrapper" ref="fileList" :style="bottomStyle">
      <div class="file-list" v-if="hasViewAccess">
        <div class="file-item" v-if="hasUploadAccess">
          <task-upload
            :data="data"
            :directory="activeName"
            :file-name="detail.file_name"
            @file-success="onFileSuccess"
            style="height:100%"
          ></task-upload>
        </div>
        <div class="file-item" v-for="item in list" :key="item.id">
          <div class="task-update-upload" v-if="item.upload" :style="uploadStyle">
            <task-upload
              :data="data"
              :directory="activeName"
              :file-name="detail.file_name"
              :pid="item.pid"
              :type="2"
              @cancel="onCancel"
              @file-error="onFileError"
              @file-progress="onFileProgress"
              @file-success="onFileSuccess"
              @start="onStart"
              ref="uploader"
            ></task-upload>
          </div>
          <div class="inner">
            <el-dropdown
              class="file-dropdown"
              @command="handleFileCommand(arguments[0], item)"
              trigger="click"
            >
              <img
                src="../../../../assets/images/openTop.png"
                style="width:15px;height:18px;cursor:pointer;margin: 5px 15px;"
              >
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="hasUploadAccess"
                  icon="el-icon-refresh"
                  command="update"
                >更新版本</el-dropdown-item>
                <el-dropdown-item icon="el-icon-document" command="history">历史文件</el-dropdown-item>
                <el-dropdown-item
                  v-if="hasDownloadAccess"
                  icon="el-icon-download"
                  command="download"
                >
                  <a :href="item.path | imageUrl" :download="item.file_name">下载文件</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="pic" @click="handlePreview(item)">
              <img :src="item.image_thumb | imageUrl">
              <div class="cover" v-if="item.fileType === 4">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
            <div class="content">
              <h4 :title="item.file_name">{{item.file_name}}</h4>
              <p :title="item.file_remark" style="margin:5px 0 3px;">{{item.file_remark}}</p>
              <p>{{data.title}}</p>
            </div>
            <div class="button">使用中</div>
          </div>
        </div>
        <infinite-loading :identifier="infiniteId" @infinite="fileLoadMore">
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </div>
      <div v-else>
        <div class="no-prmission__tips">
          <img src="../../../../assets/images/lock.png">
          <span>暂无相关权限</span>
        </div>
      </div>
    </div>
    <!-- 历史文件 -->
    <task-file-history
      :visible.sync="historyVisible"
      :id="id"
      :file-id="historyId"
      :directory="activeName"
      :settings="currentSettingsAccess"
      @update="resetFile"
    />

    <!-- 预览 -->
    <el-dialog
      :append-to-body="true"
      :class="{ mp3: playOptions.type==5 }"
      :visible.sync="dialogVisible"
      @close="handleCose"
      class="play-dialog"
      top="50px"
      width="80%"
    >
      <template v-if="playOptions.type == 1 || playOptions.type == 3">
        <div class="preview-box">
          <img :src="playOptions.url" ref="img">
        </div>
        <div class="review-buttons">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleReview"></el-button>
        </div>
      </template>
      <template v-if="playOptions.type == 2">
        <div class="preview-box" style="margin-bottom:60px;">
          <multiple-image-preview :urls="playOptions.urls" ref="multipleImage"></multiple-image-preview>
        </div>
        <div class="review-buttons">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleReview()"></el-button>
        </div>
      </template>
      <template v-if="playOptions.type == 4">
        <div class="preview-box">
          <video
            :src="playOptions.url"
            controls
            controlslist="nodownload"
            ref="taskVideo"
            style="width: 100%"
          ></video>
        </div>
        <div class="review-buttons">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleReview"></el-button>
        </div>
      </template>
      <template v-if="playOptions.type == 5">
        <div class="preview-box">
          <audio
            :src="playOptions.url"
            controls
            controlslist="nodownload"
            ref="taskAudio"
            style="width: 100%"
          ></audio>
        </div>
      </template>
    </el-dialog>

    <!-- 文件批注 -->
    <file-review
      :fileId="playOptions.fileId"
      :pid="id"
      :type="playOptions.type"
      :url="playOptions.url"
      :urls="playOptions.urls"
      :visible.sync="reviewVisible"
      v-if="reviewVisible"
    />
  </div>
</template>

<script>
// api
import * as api from '@/api/make'
// components
import InfiniteLoading from 'vue-infinite-loading'
import TaskUpload from './taskUpload'
import TaskFileHistory from './fileHistory'
import FileReview from './fileReview'

export default {
  name: 'TaskItemFile',
  props: {
    visible: Boolean,
    // 任务ID
    id: String,
    // 项目ID
    pid: String,
    // 列表当前任务的数据
    data: Object,
    // 任务详情数据
    detail: Object
  },
  components: { InfiniteLoading, TaskUpload, TaskFileHistory, FileReview },
  data() {
    return {
      loading: true,
      infiniteId: +new Date(),
      historyVisible: false,
      historyId: null,
      dialogVisible: false, //视频的播放窗口
      activeName: '', // 当前选中的tab
      tabs: [], // 所有的tab item
      accessTabs: [], // 有权限的tab
      accessSettings: {}, // 操作权限
      page: 1, //文件当前页
      list: [], // 文件列表数据
      uploading: false, // 是否更新中
      uploadIndex: -1, // 当前更新的索引
      playOptions: {
        type: null,
        fileId: '',
        url: '',
        urls: []
      },
      reviewVisible: false,
      bottomHeight: null
    }
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.init()
      }
    }
  },
  computed: {
    bottomStyle() {
      return `height:${this.bottomHeight}px;`
    },
    // 当前点击的tab是否有权限
    hasTabAccess() {
      return this.accessTabs.includes(this.activeName)
    },
    // 当前操作权限
    currentSettingsAccess() {
      return this.accessSettings[this.activeName] || []
    },
    // 是否有查看权限
    hasViewAccess() {
      return this.currentSettingsAccess.includes('view')
    },
    // 是否有上传权限
    hasUploadAccess() {
      return this.currentSettingsAccess.includes('upload')
    },
    // 是否有下载权限
    hasDownloadAccess() {
      return this.currentSettingsAccess.includes('download')
    },
    uploadStyle() {
      return this.uploading ? '' : `height:0px;overflow:hidden;`
    }
  },
  methods: {
    init() {
      // 重置数据
      this.resetFile()
      // 获取tab
      this.getFileTabs()
    },
    // 文件选项卡
    resetFile() {
      // 清空数据
      this.page = 1
      this.list = []
      // 隐藏历史文件
      this.historyVisible = false
      // 获取文件列表
      this.infiniteId += 1
    },
    // 获取文件选项卡表头
    getFileTabs() {
      api
        .getFileMenu({
          subjects: ['ftypes'],
          project_id: this.pid
        })
        .then(res => {
          let fileType = res.data.ftypes
          let tabs = []
          for (let key in fileType) {
            tabs.push({ key: key, value: fileType[key] })
          }
          let [first] = tabs
          this.tabs = tabs
          this.activeName = first.key
          this.getFilePermission(Object.keys(fileType))
        })
    },
    // 获取权限
    getFilePermission(arr) {
      api
        .getAccess({
          project_id: this.pid,
          pts_token: this.data.pts_token,
          ftypes: arr
        })
        .then(response => {
          let { ftypes = [], ftype_settings = [] } = response.data
          // 有权限的tab
          this.accessTabs = ftypes
          // 操作权限
          this.accessSettings = {}
          ftype_settings.forEach(item => {
            this.accessSettings[item.ftype] = item.foptions || []
          })
        })
    },
    // 获取文件列表
    getFileList() {
      return api
        .getFileList({
          stage_id: this.id,
          project_id: this.pid,
          type: 1,
          directory: this.activeName,
          nowPage: this.page
        })
        .then(response => {
          this.list = [...this.list, ...response.data.data]
          return response
        })
    },
    // 文件存储滚动加载
    fileLoadMore($state) {
      if (this.activeName === '') {
        return false
      }
      this.getFileList().then(response => {
        if (response.data.data.length) {
          this.page += 1
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    },
    // 预览
    handlePreview(file) {
      this.playOptions.type = file.fileType
      if (!file.preview) {
        this.$message({ message: '不可预览', type: 'error' })
        return false
      }
      if (file.need_code) {
        api.checkVcodec({ file_id: file.file_id }).then(response => {
          if (response.data.url) {
            this.showFile(response.data)
          } else {
            this.$alert(
              `<div class="preview-loading-tips__content"><i class="el-icon-loading"></i>${
                response.msg
              }</div>`,
              '',
              {
                customClass: 'preview-loading-tips',
                center: true,
                dangerouslyUseHTMLString: true,
                showConfirmButton: false
              }
            )
          }
        })
      } else {
        file.url && this.showFile(file)
      }
    },
    // 显示文件
    showFile(file) {
      this.playOptions.fileId = file.file_id
      if (this.playOptions.type === 2) {
        // 序列帧
        let urls = file.jobs.reduce((results, item) => {
          for (let index = 0; index < item.limit; index++) {
            let url = `${this.localUrl}${file.url}/${item.job_index}/${
              item.job_index
            }_${index}.${file.vcode_suffix}`
            results.push(url)
          }
          return results
        }, [])
        this.playOptions.urls = urls
      } else {
        this.playOptions.url = file.url
      }
      this.dialogVisible = true
    },
    // 文件下拉
    handleFileCommand(command, data) {
      switch (command) {
        case 'update':
          // 更新版本
          this.showUpdateVersion(data)
          break
        case 'history':
          // 历史文件
          this.showHistory(data.pid)
          break
      }
    },
    // 显示更新版本
    showUpdateVersion(data) {
      // 隐藏之前的状态
      if (this.uploadIndex !== -1) {
        this.list[this.uploadIndex].upload = false
      }
      this.uploadIndex = this.list.findIndex(item => item.id === data.id)
      if (this.uploadIndex === -1) {
        return false
      }
      this.$set(data, 'upload', true)
      this.$nextTick(function() {
        let component = this.$refs.uploader[0]
        setTimeout(function() {
          let btn = component.$el.querySelector('.uploader-btn input')
          btn.click()
        }, 500)
        // this.$refs.uploader.uploader
      })
    },
    // 历史文件
    showHistory(pid) {
      this.historyVisible = true
      this.historyId = pid
    },
    onFileProgress(rootFile) {
      if (rootFile.aborted) {
        this.hideUpdateUpload()
      } else {
        this.uploading = true
      }
    },
    onStart() {
      this.uploading = true
    },
    onFileError() {
      this.hideUpdateUpload()
    },
    onCancel() {
      this.hideUpdateUpload()
    },
    // 文件上传成功
    onFileSuccess() {
      this.hideUpdateUpload()
      this.resetFile()
    },
    // 隐藏更新上传
    hideUpdateUpload() {
      this.uploading = false
      if (this.uploadIndex !== -1) {
        this.list[this.uploadIndex].upload = false
      }
      this.uploadIndex = -1
    },
    // 关闭dialog
    handleCose() {
      this.playOptions.url = ''
      this.$nextTick(() => {
        this.$refs.taskAudio && this.$refs.taskAudio.pause()
        this.$refs.taskVideo && this.$refs.taskVideo.pause()
      })
    },
    // 批注
    handleReview() {
      // 暂停播放
      this.$refs.taskAudio && this.$refs.taskAudio.pause()
      this.$refs.taskVideo && this.$refs.taskVideo.pause()
      this.reviewVisible = true
    },
    // 设置底部高度
    setBottomHeight() {
      this.$nextTick(function() {
        this.bottomHeight = this.$refs.file
          ? this.$refs.file.offsetHeight - this.$refs.fileList.offsetTop
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
.task-item-file {
  position: relative;
  height: 100%;
}
.file-list {
  height: 100%;
  overflow-y: auto;
}
.file-item {
  position: relative;
  float: left;
  width: 170px;
  height: 220px;
  padding-right: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  overflow: hidden;
  .inner {
    border: 1px solid #ddd;
  }
  .file-dropdown {
    position: absolute;
    right: 5px;
    top: 5px;
    .el-icon-more {
      width: 28px;
      font-size: 28px;
      color: #303133;
      transform: rotate(90deg);
      cursor: pointer;
    }
  }
  .pic {
    position: relative;
    height: 100px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .cover {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      cursor: pointer;
      .iconfont {
        font-size: 32px;
        color: #fff;
      }
    }
  }
  .content {
    height: 83px;
  }
  h4 {
    margin-top: 5px;
    padding: 0 10px;
    font-size: 16px;
    height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  p {
    color: #333;
    padding: 0 10px;
    font-size: 14px;
    line-height: 20px;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .button {
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #409eff;
    color: #fff;
    margin-left: -1px;
    margin-right: -1px;
  }
}

.history-wrapper {
  position: absolute;
  left: -15px;
  right: 0;
  top: 40px;
  z-index: 1000;
  .file-list {
    height: calc(100% - 40px);
  }
  .file-item {
    height: auto;
  }
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
.slider.subSlider {
  left: 0;
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  height: 400px;
}
// 历史操作
.history {
  .title {
    line-height: 30px;
    text-align: right;
    color: #606266;
  }
}
.task-update-upload {
  position: relative;
  z-index: 99999;
}

.play-dialog .preview-box {
  position: relative;
  height: 600px;
}
.mp3.play-dialog .preview-box {
  height: 85px;
}
.play-dialog .preview-box img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
}

.sliderShow {
  transform: translate3d(0, 0, 0);
}
.el-dropdown-menu a {
  color: inherit;
  text-decoration: none;
}
.review-buttons {
  padding-top: 10px;
  text-align: right;
}
.uploader-wrapper .uploader-drop {
  box-shadow: none;
  border-radius: 0;
  border: none;
  background: rgba(248, 248, 248, 1);
  .uploader-btn {
    background: url('../../../../assets/images/slice.png') no-repeat;
    background-size: 100% 100%;
    width: 46px;
    height: 46px;
    margin: 80px auto;
  }
  .el-icon-plus {
    display: none;
  }
}
.uploader-wrapper .uploader-drop:hover {
  background: #fff;
  border: 2px solid #f2f2f2;
  .uploader-btn {
    background: url('../../../../assets/images/sliceRight.png') no-repeat;
    background-size: 100% 100%;
    width: 46px;
    height: 46px;
    margin: 80px auto;
  }
}

.preview-loading-tips {
  width: 300px;
}
.preview-loading-tips .preview-loading-tips__content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-loading-tips .preview-loading-tips__content i {
  font-size: 24px;
  margin-right: 10px;
  color: #179bff;
}
.no-prmission__tips {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
}
.no-prmission__tips img {
  width: 20px;
  margin-right: 10px;
}
</style>
