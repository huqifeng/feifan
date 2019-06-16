<template>
  <td v-bind="$attrs">
    <div class="cell">
      <slot>
        <div class="task-cell" :style="style" v-if="isSame(start, column.value)">
          <el-popover trigger="hover" placement="right">
            <div class="gantt-tips">
              <p>开始时间：{{row.start}}</p>
              <p>结束时间：{{row.end}}</p>
              <p>任务名称：{{row.title}}</p>
              <p>进度：{{row.progress * 100}}%</p>
            </div>
            <div class="task-item" slot="reference" :class="taskClasses">
              <div class="task-progress" :style="progressStyle"></div>
            </div>
          </el-popover>
        </div>
        <template v-if="hasMilestone">
          <template v-for="(milestone, index) in row.milestones">
            <!-- 里程碑 -->
            <template v-if="isSame(milestone.date, column.value)">
              <div class="milestone" :key="index" @click="clickMilestone(milestone)">
                <i class="el-icon-s-flag"></i>
              </div>
            </template>
          </template>
        </template>
      </slot>
    </div>
  </td>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'TableCell',
  inject: ['tableRoot', 'gantt'],
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    column: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    hasMilestone() {
      return this.gantt.milestoneVisible
    },
    taskClasses() {
      return {
        'is-task-io': this.row.category === 'IO',
        'is-task-duang': this.row.category === '特效',
        'is-task-voice': this.row.category === '声音',
        'is-task-color': this.row.category === '调色',
        'is-task-clip': this.row.category === '剪辑'
      }
    },
    // 默认样式
    style() {
      return `width:${this.diff * 100}%;`
    },
    // 计算进度样式
    progressStyle() {
      return `width:${this.row.progress * 100}%;`
    },
    // 开始时间转换成当天时间戳
    start() {
      return dayjs(this.row.start).isValid()
        ? dayjs(this.row.start).valueOf()
        : null
    },
    // 结束时间转换成当天时间戳
    end() {
      return dayjs(this.row.end).isValid()
        ? dayjs(this.row.end).valueOf()
        : null
    },
    // 开始到结束总共有多少天
    diff() {
      return dayjs(this.end).diff(dayjs(this.start), 'day') || 1
    }
  },
  methods: {
    isSame(date1, date2) {
      return dayjs(date1).isSame(dayjs(date2), 'day')
    },
    // 显示里程碑
    clickMilestone(milestone) {
      this.gantt.clickMilestone(milestone)
    }
  }
}
</script>

<style lang="scss">
.gantt-table {
  td {
    position: relative;
    height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;
    vertical-align: middle;
  }
  .cell {
    text-align: center;
    max-height: 40px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .is-group-row .cell {
    margin-left: 10px;
    text-align: left;
  }
  .task-cell {
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    z-index: 1;
    background-color: #e9ecef;
  }
  .task-item {
    height: 100%;
  }
  .task-progress {
    height: 100%;
    background-color: #669cfe;
  }
  .is-task-io .task-progress {
    background-color: #dc87ae;
  }
  .is-task-duang .task-progress {
    background-color: #65ccf9;
  }
  .is-task-voice .task-progress {
    background-color: #f3e840;
  }
  .is-task-color .task-progress {
    background-color: #64e6c0;
  }
  .is-task-clip .task-progress {
    background-color: #fa8a3f;
  }
  .task-name .cell {
    min-width: 120px;
    max-width: 200px;
    height: 40px;
    padding: 0 10px;
    line-height: 40px;
    background-color: #f9f9f9;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .milestone {
    position: relative;
    display: inline-block;
    z-index: 100;
    cursor: pointer;
    color: #f75c4c;
  }
}
.gantt-tips {
  font-size: 12px;
  line-height: 22px;
}
</style>
