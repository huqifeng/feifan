<template>
  <rela-container @primary="handlePrimary">
    <template v-slot:header>
      <div class="row">
        <div class="col">
          <el-dropdown @command="handelGroupChange" trigger="click">
            <el-button>分组</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="episode">集数</el-dropdown-item>
              <el-dropdown-item command="producer">制作者</el-dropdown-item>
              <el-dropdown-item command="taskType">任务类型</el-dropdown-item>
              <el-dropdown-item command="taskState">任务状态</el-dropdown-item>
              <el-dropdown-item command="cancel" divided>取消分组</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleVersionChange" trigger="click">
            <el-button>发行版本</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in taskList.version"
                :command="item.v_id"
                :key="item.v_id"
                :disabled="versionDiabled && param.versionId !== item.v_id"
              >{{item.v_title}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="col">
          <el-button @click="handleRemove">批量删除</el-button>
        </div>
      </div>
    </template>
    <div class="row">
      <div class="col">
        <!-- 可选 -->
        <h2 class="title">可选任务</h2>
        <div class="list-body scroll-content" v-loading="loading">
          <!-- 未分组 -->
          <template v-if="!isGroup">
            <el-table
              ref="multipleTable"
              :data="taskList.list"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <template v-for="(item, index) in taskList.field">
                <el-table-column :prop="item.key" :label="item.name" :key="`${item.key}_${index}`"></el-table-column>
              </template>
            </el-table>
          </template>
          <!-- 分组 -->
          <template v-else>
            <group-table
              :data="taskList.list"
              @selection-change="handleSelectionChange"
              ref="multipleTable"
            >
              <group-table-column type="selection"></group-table-column>
              <template v-for="item in taskList.field">
                <group-table-column :prop="item.key" :label="item.name" :key="item.key"></group-table-column>
              </template>
            </group-table>
          </template>
        </div>
        <div class="list-pagination">
          <el-pagination
            background
            :page-sizes="[20, 50, 100]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="page.current"
            :total="page.total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </div>
      </div>
      <div class="col">
        <!-- 已选 -->
        <h2 class="title">已选任务</h2>
        <div class="selected-table scroll-content">
          <el-table
            :data="selectedList"
            style="width: 100%"
            @selection-change="handleSelectedSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="episode" label="集数"></el-table-column>
            <el-table-column prop="lens" label="场次"></el-table-column>
            <el-table-column prop="movie_scene" label="镜头"></el-table-column>
            <el-table-column prop="task_name" label="任务名称"></el-table-column>
            <el-table-column prop="category" label="任务类型"></el-table-column>
            <el-table-column prop="title" label="任务阶段"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </rela-container>
</template>

<script>
import relaContainer from './container'
import { GroupTable, GroupTableColumn } from '@/components/groupTable'
import * as api from '@/api/project/task'

// 生成树结构数据
let genTree = function(arr = []) {
  let output = []
  arr.forEach(item => {
    if (item.children) {
      output.push({
        name: item.keyword,
        children: [...(item.children.parent || [])].concat(
          genTree(item.children.data)
        )
      })
    } else {
      output.push(item)
    }
  })
  return output
}

// 扁平化数据
function flatten(arr = []) {
  let output = []
  arr.forEach(item => {
    if (item.children) {
      output.push({ name: item.name })
      output = [...output, ...flatten(item.children)]
    } else {
      output.push(item)
    }
  })
  return output
}
export default {
  components: { relaContainer, GroupTable, GroupTableColumn },
  data() {
    return {
      loading: false,
      // 参数
      param: {
        // getAllList: 1,
        projectid: '',
        p: 1,
        num: 20,
        versionId: '',
        viewId: '',
        groupType: 'episode',
        exclude: []
      },
      // 是否分组
      isGroup: true,
      taskList: {
        // 发行版本
        version: [],
        // 表头
        field: [],
        // 列表数据
        list: []
      },
      // 翻页
      page: { size: 20, total: 0, current: 1 },
      // 当前页选中的数据
      multipleSelection: [],
      // 全部选中的数据
      selectedList: this.$store.state.related.task || [],
      // 自动选择完成状态
      autoSelectCompleted: false,
      // 已选择的选中项
      selectedMultipleSelection: [],
      message: null,
      versionDiabled: false
    }
  },
  watch: {
    relatedTaskList: {
      immediate: true,
      deep: true,
      handler(list) {
        this.param.exclude = list.map(item => {
          return item.id
        })
      }
    }
  },
  computed: {
    // 关联的任务
    relatedTaskList() {
      return this.$store.state.related.task || []
    }
  },
  methods: {
    // 初始化
    init() {
      this.param.p = 1
      this.page.current = 1
      this.renderList()
    },
    // 确认
    handlePrimary() {
      if (!this.selectedList.length) {
        this.message && this.message.close()
        this.message = this.$message({
          type: 'error',
          message: '请至少选择一条任务'
        })
        return false
      }
      this.$store.dispatch('setRelated', {
        type: 'task',
        list: this.selectedList
      })
      // 返回上一页
      this.$router.back()
    },
    // 多选
    handleSelectionChange(value) {
      this.multipleSelection = value
      if (this.autoSelectCompleted) {
        // 去重
        this.selectedList = this.$lodash.uniqBy(
          this.selectedList.concat(value),
          'id'
        )
        flatten(this.taskList.list).forEach(row => {
          // 当前行是否选中
          let selected = this.multipleSelection.find(item => item.id === row.id)
          // 当前行数据，在所有页选中数据的索引
          let index = this.selectedList.findIndex(item => item.id === row.id)
          if (!selected && index !== -1) {
            this.selectedList.splice(index, 1)
          }
        })
      }
    },
    // 分组
    handelGroupChange(value) {
      if (value === 'cancel') {
        this.taskList.list = []
        this.isGroup = false
        this.param.groupType = ''
      } else {
        this.isGroup = true
        this.param.groupType = value
      }
      this.init()
    },
    // 发行版本
    handleVersionChange(value) {
      this.param.versionId = value
      this.init()
    },
    // 渲染列表
    renderList() {
      this.autoSelectCompleted = false
      // 保留选中的数据
      this.isGroup ? this.getTaskGroupList() : this.getTaskList()
    },
    // 获取任务列表数据
    getTaskList() {
      this.loading = true
      api
        .taskList(this.param)
        .then(response => {
          let {
            versionInfo: version = [],
            taskField: field = [],
            projectTaskList: list = []
          } = response.data
          // 总页数
          this.page.total = response.data.count
          // 列表数据整理
          this.taskList = { version, field, list }
          // 设置选中
          this.$nextTick(function() {
            this.toggleSelection(list)
            this.$refs.multipleTable.doLayout()
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取任务分组数据
    getTaskGroupList() {
      this.loading = true
      api
        .taskGroupList(this.param)
        .then(response => {
          let {
            versionInfo: version = [],
            taskField: field = []
          } = response.data
          // 总页数
          this.page.total = response.data.count
          // 分组数据整理
          let projectTaskList = response.data.projectTaskList
          let list = genTree(projectTaskList.data).concat(
            projectTaskList.parent
          )
          // 列表数据整理
          this.taskList = { version, field, list }
          // 设置选中
          this.$nextTick(function() {
            this.toggleSelection(flatten(list))
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 页码改变
    handleCurrentChange(value) {
      this.param.p = value
      this.renderList()
    },
    // 页数改变
    handleSizeChange(value) {
      this.param.num = value
      this.renderList()
    },
    // 设置选中状态
    toggleSelection(dataList = []) {
      dataList.forEach(row => {
        let found = this.selectedList.find(item => item.id === row.id)
        this.$refs.multipleTable.toggleRowSelection(row, !!found)
      })
      this.autoSelectCompleted = true
    },
    // 已选择的选中项
    handleSelectedSelectionChange(value) {
      this.selectedMultipleSelection = value
    },
    // 批量删除
    handleRemove() {
      this.selectedMultipleSelection.forEach(row => {
        let index = this.selectedList.findIndex(item => item.id === row.id)
        if (index !== -1) {
          this.selectedList.splice(index, 1)
        }
      })
      // 设置可选任务的选中状态
      this.autoSelectCompleted = false
      this.toggleSelection(flatten(this.taskList.list))
    }
  },
  created() {
    let { projectid, version_id, version_disabled } = this.$route.query
    // 项目ID
    this.param.projectid = projectid
    // 版本ID
    this.param.versionId = version_id
    // 版本选择是否禁用
    this.versionDiabled = !!version_disabled
  },
  beforeMount() {
    this.init()
  }
}
</script>
