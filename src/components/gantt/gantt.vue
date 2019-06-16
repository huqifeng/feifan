<template>
  <div>
    <div class="gantt-wrapper" v-if="ganttVisible && tasks.length">
      <div class="gantt-header">
        <slot name="header">
          <div class="panel-left">
            <slot name="header-left">
              <!-- <div class="item">
                <el-switch v-model="taskVisible" active-text="任务"></el-switch>
              </div>
              <div class="item">
                <el-switch v-model="milestoneVisible" active-text="里程碑"></el-switch>
              </div>-->
            </slot>
          </div>
          <div class="panel-right">
            <slot name="header-right"></slot>
          </div>
        </slot>
      </div>
      <div class="gantt-body" :style="panelStyle">
        <template v-if="taskVisible">
          <split-pane split="vertical" :min-percent="10">
            <template slot="paneL">
              <div class="gantt-task-table">
                <slot name="task"></slot>
              </div>
            </template>
            <template slot="paneR">
              <gantt-table
                :default-expand-all="true"
                :columns="dates"
                :data="tasks"
                v-on="$listeners"
                ref="ganttTable"
              ></gantt-table>
            </template>
          </split-pane>
        </template>
        <template v-else>
          <gantt-table
            :default-expand-all="true"
            :columns="dates"
            :data="tasks"
            v-on="$listeners"
            ref="ganttTable"
          ></gantt-table>
        </template>
      </div>
    </div>
    <!-- 只有任务 -->
    <template v-else>
      <slot name="task"></slot>
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import GanttTable from './table'
import splitPane from 'vue-splitpane'

export default {
  components: { GanttTable, splitPane },
  provide() {
    return {
      gantt: this
    }
  },
  props: {
    // 任务列表
    tasks: {
      type: Array,
      default() {
        return []
      }
    },
    // 项目开始时间
    startTime: { type: String },
    // 项目结束时间
    endTime: { type: String },
    // 里程碑
    hasMilestone: { type: Boolean, default: true },
    // 显示任务
    hasTask: { type: Boolean, default: true },
    // 显示gantt
    ganttVisible: { type: Boolean, default: false }
  },
  data() {
    return {
      height: 0,
      bufferDay: 7,
      taskVisible: this.hasTask,
      milestoneVisible: this.hasMilestone
    }
  },
  watch: {
    tasks: {
      immediate: true,
      deep: true,
      handler(dataList) {
        dataList && dataList.length && this.render()
      }
    },
    ganttVisible(value) {
      value && this.setHeight()
    }
  },
  computed: {
    dates() {
      let weekdays = ['日', '一', '二', '三', '四', '五', '六']
      return this.genDates().map(date => {
        let day = dayjs(date).day()
        return {
          value: date,
          day: day,
          week: weekdays[day],
          isToday: dayjs().isSame(dayjs(date), 'days')
        }
      })
    },
    panelStyle() {
      return `height: ${this.height || 600}px;`
    },
    ganttTable() {
      return this.$refs.ganttTable
    }
  },
  methods: {
    render() {
      this.genDates()
      this.$nextTick(function() {
        this.setHeight()
      })
    },
    setHeight() {
      // let elLeft = document.querySelector('.gantt-wrapper .gantt-task-table')
      // let leftHeight = elLeft ? elLeft.offsetHeight : 0
      let elRight = this.$refs.ganttTable && this.$refs.ganttTable.$el
      this.height = elRight ? elRight.offsetHeight : 0
      // 取最大值
      // this.height = Math.max(leftHeight, rightHeight)
    },
    // 生成日期，根据开始时间、结束时间，前后有一周的缓冲时间
    genDates() {
      let results = []
      let { start, end } = this.duration()
      start = dayjs(start)
        .startOf('week')
        .subtract(this.bufferDay - 1, 'days')
        .valueOf()
      end = dayjs(end)
        .endOf('week')
        .add(this.bufferDay + 1, 'days')
        .valueOf()
      let currentDay = start
      while (currentDay < end) {
        results.push(dayjs(currentDay).valueOf())
        currentDay = dayjs(currentDay)
          .add(1, 'days')
          .valueOf()
      }
      return results
    },
    // 持续日期
    duration() {
      // 有项目时间
      if (this.startTime && this.endTime) {
        return { start: this.startTime, end: this.endTime }
      }
      let dates = this.tasks.reduce(
        (result, item) => {
          item.start && result.start.push(dayjs(item.start).valueOf())
          item.end && result.end.push(dayjs(item.end).valueOf())
          return result
        },
        { start: [], end: [] }
      )
      let start = this.$lodash.min(dates.start)
      let end = this.$lodash.max(dates.end)
      end = start < end ? end : start
      return { start, end }
    },
    // 点击里程碑
    clickMilestone(milestone) {
      this.$emit('click-milestone', milestone)
    }
  }
}
</script>

<style lang="scss">
.gantt-wrapper {
  .el-table thead th,
  .group-table th {
    height: 122px;
  }
  .el-table .cell {
    max-height: 40px;
    overflow: hidden;
  }
  .el-table td {
    height: 40px;
  }
  .gantt-header {
    display: flex;
    height: 60px;
    align-items: center;
    .panel-left {
      flex: 1;
      display: flex;
    }
    .panel-right {
      display: flex;
    }
    .item {
      margin-right: 10px;
    }
  }
  .gantt-body {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid #ebeef5;
  }
}
.gantt-table-wrapper {
  position: relative;
  width: 100%;
  overflow-x: scroll;
  // border: 1px solid #ebeef5;
  box-shadow: 0px 0px 12px 0px rgba(1, 102, 178, 0.3);
}
// 兼容IE edge
@supports (-ms-ime-align: auto) {
  .gantt-wrapper .el-table thead th,
  .gantt-wrapper .group-table th {
    height: 123px;
  }
}
</style>
 