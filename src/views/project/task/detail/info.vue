<template>
  <!-- 镜头信息 -->
  <div class="task-item-info">
    <template v-for="(item, index) in list">
      <dl :key="index" v-if="item.title">
        <dt>{{item.title}}：</dt>
        <dd>{{item.content}}</dd>
      </dl>
    </template>
  </div>
</template>

<script>
// api
import * as api from '@/api/project/task'

export default {
  name: 'TaskItemInfo',
  props: {
    visible: Boolean,
    // 任务ID
    id: String,
    // 项目ID
    pid: String
  },
  data() {
    return {
      list: []
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
  methods: {
    init() {
      this.getInfo()
    },
    // 获取任务镜头信息
    getInfo() {
      api
        .getTaskLensInfo({ stageId: this.id, projectId: this.pid })
        .then(response => {
          this.list = response.data || []
        })
    }
  }
}
</script>

<style lang="scss">
.task-item-info {
  dl {
    display: flex;
    margin-bottom: 20px;
  }
  dt {
    width: 80px;
    font-size: 16px;
    text-align: right;
  }
  dd {
    flex: 1;
    font-size: 14px;
    padding-left: 10px;
  }
}
</style>
