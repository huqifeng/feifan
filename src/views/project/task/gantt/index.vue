<template>
  <div class="task-gantt">
    <gantt
      :tasks="tasks"
      :startTime="startTime"
      :endTime="endTime"
      @click-milestone="handleViewMilestone"
      v-bind="$attrs"
      v-on="$listeners"
      ref="gantt"
    >
      <template v-slot:task>
        <slot></slot>
      </template>
      <template v-slot:header-right>
        <div class="item">
          <el-tooltip content="创建里程碑">
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              size="mini"
              @click="handleAddMilestone"
            ></el-button>
          </el-tooltip>
        </div>
      </template>
    </gantt>
    <!-- 里程碑 -->
    <update
      :projectId="projectId"
      :version="version"
      :visible.sync="updateOptions.visible"
      :isUpdate="updateOptions.isUpdate"
      :id="updateOptions.id"
      @update="handleUpdate"
      v-if="updateOptions.visible"
    />
  </div>
</template>

<script>
import Gantt from '@/components/gantt/gantt'
import Update from './update'

export default {
  components: { Gantt, Update },
  props: {
    projectId: { type: String, required: true },
    tasks: {
      type: Array,
      default() {
        return []
      }
    },
    version: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      startTime: '',
      endTime: '',
      updateOptions: { visible: false, isUpdate: false, id: '' }
    }
  },
  watch: {
    tasks: {
      immediate: true,
      deep: true,
      handler(list) {
        let [first = {}] = list
        this.startTime = first.calendar_start || ''
        this.endTime = first.calendar_end || ''
      }
    }
  },
  computed: {
    gantt() {
      return this.$refs.gantt
    }
  },
  methods: {
    // 创建里程碑
    handleAddMilestone() {
      this.updateOptions = { id: '', visible: true, isUpdate: false }
    },
    // 查看里程碑
    handleViewMilestone({ id }) {
      this.updateOptions = { id, visible: true, isUpdate: true }
    },
    handleUpdate() {
      this.$emit('updated')
    },
    toggleExpand() {
      this.gantt.ganttTable.toggleExpand(...arguments)
      this.$nextTick(function() {
        this.gantt.setHeight()
      })
    }
  }
}
</script>
