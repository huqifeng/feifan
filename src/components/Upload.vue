<template>
  <div class="uploader-wrapper">
    <uploader
      :options="options"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      @complete="onComplete"
      ref="uploader"
    >
      <uploader-drop>
        <uploader-btn>
          <div class="controls">
            <!-- 重新上传 -->
            <el-button round v-if="status === 'pause'" @click.stop.prevent="upload">
              <i class="el-icon-caret-right"></i>
            </el-button>
            <el-progress
              type="circle"
              :percentage="percentage"
              v-else-if="status === 'uploading'"
              style="vertical-align: middle;"
            ></el-progress>
            <i class="el-icon-plus" v-else></i>
          </div>
        </uploader-btn>
      </uploader-drop>
      <!-- <uploader-list></uploader-list> -->
    </uploader>
  </div>
</template>

<script>
import Vue from 'vue'
import uploader from 'vue-simple-uploader'
import SparkMD5 from 'spark-md5'

Vue.use(uploader)
export default {
  name: 'Upload',
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      percentage: 0,
      options: {
        target: '/api/v2.0/Upload/upload',
        chunkSize: '2048000',
        singleFile: true,
        fileParameterName: 'upfile',
        simultaneousUploads: 1, // 并发次数
        maxChunkRetries: 3, // 重试次数
        testChunks: true,
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          let objMessage = {}
          try {
            objMessage = JSON.parse(message)
          } catch (e) {
            console.log(e)
          }
          return (
            (Array.isArray(objMessage.data) ? objMessage.data : []).indexOf(
              chunk.offset + 1
            ) >= 0
          )
        },
        headers: {
          Authorization: this.$store.state.token
        },
        processParams: params => {
          return Object.assign({}, params, this.params)
        },
        processResponse: (response, cb) => {
          try {
            let { code, msg } = JSON.parse(response)
            if (code === 700000) {
              // 上传失败
              this.status = 'pause'
              this.file.bootstrap()
              this.$message({ type: 'error', message: msg })
            } else if (code !== 0) {
              // 其他状态
              this.uploader.cancel()
              this.status = 'cancel'
              this.$message({ type: 'error', message: msg })
              this.$emit('cancel', response)
            }
          } catch (e) {
            // 暂停上传
            this.status = 'pause'
            this.file.bootstrap()
          }
          cb(null, response)
        }
      },
      fileMd5: '',
      status: '' // 上传状态
    }
  },
  computed: {
    // uploader 实例
    uploader() {
      return this.$refs.uploader.uploader
    },
    // 当前file
    file() {
      return this.uploader.getFromUniqueIdentifier(this.fileMd5)
    }
  },
  methods: {
    // 继续上传
    upload() {
      this.uploader.upload()
    },
    onFileAdded(file) {
      // 文件大小-文件名-最后修改时间-用户ID
      file.uniqueIdentifier = SparkMD5.hash(
        file.uniqueIdentifier +
          file.file.lastModified +
          this.$store.state.userid
      )
      this.fileMd5 = file.uniqueIdentifier
      this.$emit('file-added', ...arguments)
    },
    onFileProgress(rootFile, file) {
      this.status = 'uploading'
      this.percentage = Math.floor(file.progress() * 10000) / 100
      this.$emit('file-progress', ...arguments)
    },
    onFileSuccess() {
      this.status = 'success'
      this.$emit('file-success', ...arguments)
    },
    onFileError() {
      this.status = 'error'
      this.$emit('file-error', ...arguments)
    },
    onComplete() {
      // this.status = 'complete'
      this.$emit('complete', ...arguments)
    }
  },
  beforeDestroy() {
    this.uploader.cancel()
  }
}
</script>

<style>
.uploader-wrapper,
.uploader-wrapper .uploader {
  position: relative;
  width: 100%;
  height: 100%;
}
.uploader-wrapper .uploader-drop {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  color: #8c939d;
  text-align: center;
  box-sizing: border-box;
  padding: 0;
  background-color: #fff;
  box-shadow: 0px 0px 15px 0px rgba(1, 102, 178, 0.3);
}
.uploader-wrapper .uploader-drop:hover {
  background-color: #fff;
  border-color: #409eff;
}
.uploader-wrapper .uploader-btn {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  font-size: 28px;
  line-height: 170px;
}
.uploader-wrapper .uploader-btn:hover {
  background-color: transparent;
}
.uploader-wrapper [class^='el-icon-'] {
  font-size: 30px;
}
.uploader-wrapper .controls {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>