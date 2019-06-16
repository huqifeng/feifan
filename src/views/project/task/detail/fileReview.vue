<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="100%"
    :show-close="false"
    :append-to-body="true"
    :fullscreen="true"
    class="review-dialog"
  >
    <section class="file-review">
      <section class="main">
        <div class="back">
          <el-button size="mini" icon="el-icon-back" @click="handleClose">返回</el-button>
        </div>
        <div class="play-container">
          <design :type="previewType" :url="url" :urls="urls" ref="design" v-if="dialogVisible"></design>
        </div>
        <div class="comment">
          <div class="input">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item prop="inputValue">
                <el-input
                  type="textarea"
                  rows="3"
                  resize="none"
                  placeholder="点击小铅笔添加批注，点击回车发送……"
                  :maxlength="200"
                  @keyup.native.enter="primary"
                  v-model.trim="ruleForm.inputValue"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="buttons">
            <el-button type="primary" size="small" @click="primary">发表评论</el-button>
          </div>
        </div>
      </section>
      <aside class="aside remark">
        <remark-item v-for="item in remark.list" :data="item" :key="item.id">
          <remark-form @submit="onAddRemark(...arguments, item.id)"></remark-form>
        </remark-item>
        <infinite-loading :identifier="infiniteId" @infinite="loadMore">
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </aside>
    </section>
  </el-dialog>
</template>

<script>
import * as api from '@/api/project/task'
import InfiniteLoading from 'vue-infinite-loading'
import Design from '@/components/Design'
import RemarkForm from './remarkForm'
import RemarkItem from './remarkItem'

export default {
  components: { InfiniteLoading, Design, RemarkForm, RemarkItem },
  props: {
    pid: { type: String, default: '7916' },
    fileId: { type: String },
    visible: { type: Boolean, default: true },
    type: { type: Number },
    url: { type: String },
    urls: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      ruleForm: {
        inputValue: ''
      },
      rules: {
        inputValue: [
          { required: true, message: '请添加批注', trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ]
      },
      infiniteId: +new Date(),
      // 批注
      remark: {
        list: [], // 数据列表
        currentPage: 1, // 当前第几页
        options: [
          { label: '批注', code: 'content' },
          { label: '文件名称', code: 'file_name' },
          { label: '批注时间', code: 'postil_time' },
          { label: '批注人', code: 'relaname' },
          { label: '记录日期', code: 'create_time' }
        ],
        childOptions: [
          { label: '回复', code: 'content' },
          { label: '发送人', code: 'relaname' },
          { label: '记录日期', code: 'create_time' }
        ]
      }
    }
  },
  computed: {
    video() {
      return this.$refs.video
    },
    previewType() {
      let options = {
        1: 'image',
        2: 'multipleImage',
        3: 'image',
        4: 'video'
      }
      return options[this.type]
    }
  },
  methods: {
    // 确定
    primary() {
      let { sdb, playElement, visible } = this.$refs.design
      this.$refs.ruleForm.validate().then(() => {
        if (sdb && visible) {
          this.onAddRemark(
            this.ruleForm.inputValue,
            0,
            sdb.getImg(),
            playElement.currentTime
              ? this.sec2time(playElement.currentTime)
              : ''
          )
        } else {
          this.onAddRemark(this.ruleForm.inputValue)
        }
      })
    },
    getRemarkList() {
      return api
        .remarkList({
          stage_id: this.pid,
          file_id: this.fileId,
          type: 2,
          nowPage: this.remark.currentPage
        })
        .then(response => {
          this.remark.list = [...this.remark.list, ...response.data.data]
          return response
        })
    },
    // 备注滚动加载
    loadMore($state) {
      this.getRemarkList().then(response => {
        if (response.data.data.length) {
          this.remark.currentPage += 1
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    },
    // 添加备注
    onAddRemark(content, pid = 0, myfile, postilTime) {
      api
        .addRemark({
          stage_id: this.pid,
          file_id: this.fileId,
          pid,
          content,
          type: 2,
          myfile,
          postil_time: postilTime
        })
        .then(() => {
          // 清空表单
          this.$refs.ruleForm.resetFields()
          // 继续播放
          if (this.$refs.design.visible) {
            this.$refs.design.play()
          }
          // 备注初始化
          this.remark.currentPage = 1
          this.remark.list = []
          this.infiniteId += 1
        })
    },
    // 秒转时间
    sec2time(timeInSeconds = 0) {
      let sec_num = parseInt(timeInSeconds, 10) // don't forget the second param
      let hours = Math.floor(sec_num / 3600)
      let minutes = Math.floor((sec_num - hours * 3600) / 60)
      let seconds = sec_num - hours * 3600 - minutes * 60

      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return hours + ':' + minutes + ':' + seconds
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.file-review {
  display: flex;
  height: 100vh;
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .aside {
    width: 600px;
    background: #d7d7d7;
  }
}
.back {
  background: rgba(35, 42, 47, 0.8);
  padding: 10px;
}
.play-container {
  flex: 1;
  position: relative;
  background-color: #232a2f;
  margin-bottom: 56px;
}
.comment {
  height: 134px;
  padding: 10px;
  .buttons {
    text-align: right;
  }
}
.remark {
  padding: 20px;
  overflow-y: auto;
}
</style>
<style lang="scss">
.review-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
