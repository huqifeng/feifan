<template>
  <section class="task-detail drawer-right" :class="{animated: visible}" ref="task">
    <div class="close">
      <i class="close-icon" @click="handleClose"></i>
    </div>
    <div class="task-detail-inner" v-if="visible">
      <!-- 基本信息 -->
      <div class="hd info">
        <div class="pic">
          <a :href="(detail.path || detail.image_thumb) | imageUrl" target="_blank">
            <el-image :src="detail.image_thumb | imageUrl" fit="contain"></el-image>
          </a>
        </div>
        <div class="content">
          <ul class="field__top">
            <li>{{detail.episode}}集</li>
            <li v-if="detail.movie_scene">{{detail.movie_scene}}场</li>
            <li v-if="detail.lens">{{detail.lens}}镜</li>
            <li v-if="detail.task_name">{{detail.task_name}}</li>
            <li>{{detail.state}}</li>
          </ul>
          <div class="field__bottom">
            <dl v-for="item in infoOptions.fieldGroup" :key="item.value">
              <dt>{{item.label}}：</dt>
              <dd>{{detail[item.value]}}</dd>
            </dl>
          </div>
        </div>
      </div>
      <!-- 选项卡 -->
      <div class="bd">
        <el-tabs v-model="activeName" @tab-click="handleTabClick" class="detailsTab">
          <el-tab-pane label="文件存储" name="first">
            <div class="scroll-content" :style="bottomStyle">
              <task-item-file
                :id="id"
                :pid="pid"
                :data="data"
                :detail="detail"
                :visible="activeName === 'first'"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="备注" name="second">
            <div class="scroll-content" :style="bottomStyle">
              <task-item-remark :id="id" :visible="activeName === 'second'"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="相关环节" name="third">
            <div class="scroll-content" :style="bottomStyle" :visible="activeName === 'third'">
              <task-item-link :id="id" :pid="pid"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="镜头信息" name="fourth">
            <div class="scroll-content" :style="bottomStyle">
              <task-item-info :id="id" :pid="pid" :visible="activeName === 'fourth'"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="历史操作" name="fifth">
            <div class="scroll-content" :style="bottomStyle">
              <task-item-history :id="id" :visible="activeName === 'fifth'"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </section>
</template>

<script>
// api
import * as api from '@/api/project/task'
// compoents
import TaskItemFile from './file'
import TaskItemRemark from './remark'
import TaskItemLink from './link'
import TaskItemInfo from './info'
import TaskItemHistory from './history'

const infofieldGroup = [
  { label: '所属版本', value: 'version_name' },
  { label: '制作时长', value: 'productionTime' },
  { label: '当前审核时长', value: 'auditTime' },
  { label: '总时长', value: 'totalTime' }
]

export default {
  name: 'TaskItem',
  props: {
    visible: { type: Boolean, default: false },
    // 任务ID
    id: { type: String },
    // 项目ID
    pid: { type: String },
    // 版本ID
    versionId: { type: String },
    data: {
      type: Object,
      default() {
        return {
          pts_token: '3fb85c63e10dc869c592dc5e3ab8d2c2'
        }
      }
    }
  },
  components: {
    TaskItemFile,
    TaskItemRemark,
    TaskItemLink,
    TaskItemInfo,
    TaskItemHistory
  },
  data() {
    return {
      // 基本信息
      infoOptions: { fieldGroup: infofieldGroup },
      // 详情内容
      detail: {},
      // 选项卡选中项
      activeName: 'first',
      // 底部的高度
      bottomHeight: null
    }
  },
  watch: {
    id() {
      this.visible && this.init()
    },
    visible(value) {
      value && this.setBottomHeight()
    }
  },
  computed: {
    bottomStyle() {
      return `height:${this.bottomHeight}px;`
    }
  },
  methods: {
    // 初始化
    init() {
      this.activeName = 'first'
      this.getTaskInfo()
    },
    // 获取任务信息
    getTaskInfo() {
      api
        .getTaskInfo({ stage_id: this.id, version_id: this.versionId })
        .then(response => {
          this.detail = response.data
        })
    },
    // 选项卡切换
    handleTabClick() {
      this.infiniteId += 1
    },
    // 设置底部高度
    setBottomHeight() {
      this.$nextTick(function() {
        let el = this.$refs.task
        let scrollElement = el.querySelector('.scroll-content')
        let rect = scrollElement.getBoundingClientRect()
        this.bottomHeight = el.offsetHeight - rect.top - 20
      })
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
.drawer-right {
  transform: translate3d(100%, 0, 0);
  transition: transform 0.5s ease-in-out;
}
.drawer-right.animated {
  transform: translate3d(0, 0, 0);
}
.task-detail {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 710px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 15px 0px rgba(1, 102, 178, 0.3);
  z-index: 999;
  .task-detail-inner {
    position: relative;
    height: 100%;
  }
}
.task-detail .info {
  display: flex;
  margin-right: 30px;
  .pic {
    width: 160px;
    height: 200px;
    overflow: hidden;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    flex: 1;
    padding-left: 22px;
  }
  .field__top {
    li {
      display: inline-block;
      font-size: 16px;
      font-weight: bold;
      padding-right: 20px;
    }
  }
  .field__bottom {
    dl {
      display: flex;
      margin-top: 18px;
      font-size: 16px;
    }
    dt {
      width: 120px;
      font-weight: bold;
      text-align: right;
    }
    dd {
      flex: 1;
      color: #333;
    }
  }
}
.task-detail {
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
    z-index: 100;
  }
  .close-icon {
    width: 24px;
    height: 24px;
    display: block;
    background: url('~@/assets/images/detail-icon.png') no-repeat 0 0;
  }
  .close-icon:hover {
    background-position: -34px 0;
  }
  .scroll-content {
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
