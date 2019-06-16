<template>
  <div class="main-content task-list-wrap">
    <div class="tab">
      <el-form
        :inline="true"
        :model="taskFilterForm"
        class="task-filter-form"
        @submit.native.prevent
      >
        <el-form-item class="taskInput">
          <div class="task-opt">
            <el-dropdown class="new-task" @command="createFn" trigger="click">
              <el-button>
                新建
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">新建任务</el-dropdown-item>
                <el-dropdown-item command="2">新建集数</el-dropdown-item>
                <el-dropdown-item command="3">新建场次</el-dropdown-item>
                <el-dropdown-item command="4">新建镜头</el-dropdown-item>
                <el-dropdown-item command="5">新建任务（特效）</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown
              v-if="taskList.versionInfo"
              class="new-task"
              @command="operateName"
              trigger="click"
            >
              <el-button>
                发行版本
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="opt in taskList.versionInfo"
                  :command="opt.v_id"
                  :key="opt.v_id"
                >{{opt.v_title}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown
              class="new-task"
              @command="operateView"
              trigger="click"
              @visible-change="visibleChange"
            >
              <el-button>
                视图
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" @mouseout="operateOut">
                <el-dropdown-item command="1" :disabled="defaultShow">保存</el-dropdown-item>
                <el-dropdown-item command="2">另存为</el-dropdown-item>
                <el-dropdown-item command="3" :disabled="defaultShow">修改</el-dropdown-item>
                <el-dropdown-item command="4" :disabled="defaultShow">删除</el-dropdown-item>
                <el-dropdown-item command="5" style="position:relative;">
                  <span style="display:block" @mouseover="operateHover">我的</span>
                  <div v-show="screenShow" class="screenView">
                    <ul>
                      <li
                        @click="operateViewClick(opt.tv_id,opt.tv_title,opt.is_default)"
                        v-for="opt in taskList.taskView"
                        :key="opt.tv_id"
                        :title="opt.tv_title"
                      >
                        <div></div>
                        {{opt.tv_title}}
                      </li>
                    </ul>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-form-item>
        <el-form-item class="taskInput">
          <el-dropdown class="new-task" @command="operateGroup" trigger="click">
            <el-button>
              分组
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">取消分组</el-dropdown-item>
              <el-dropdown-item command="episode">集数</el-dropdown-item>
              <el-dropdown-item command="taskType">任务类型</el-dropdown-item>
              <el-dropdown-item command="taskState">任务状态</el-dropdown-item>
              <el-dropdown-item command="producer">制作者</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="new-task" trigger="click" @command="operateMotor">
            <el-button>
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="2">导入</el-dropdown-item>
              <el-dropdown-item command="3">导出</el-dropdown-item>
              <el-dropdown-item command="1">批量删除</el-dropdown-item>
              <!--<el-dropdown-item command="3">批量导出</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
          <el-switch v-model="gantt.visible" active-text="甘特图" @change="handleChangeGantt"></el-switch>
          <!-- <el-dropdown class="new-task" trigger="click" @command="operateMap">
            <el-button>
              甘特图
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">甘特图</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
          <!--<el-select v-model="taskFilterForm.taskView" @change="handleUpdated">-->
          <!--<el-option-->
          <!--v-for="opt in taskList.taskView"-->
          <!--:label="opt.tv_title"-->
          <!--:value="opt.tv_id"-->
          <!--:key="opt.tv_id"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
        </el-form-item>
        <!--<el-form-item v-if="taskList.versionInfo" class="taskInput">-->
        <!--<el-select v-model="taskFilterForm.versionInfo" @change="handleUpdated">-->
        <!--<el-option-->
        <!--v-for="opt in taskList.versionInfo"-->
        <!--:label="opt.v_title"-->
        <!--:value="opt.v_id"-->
        <!--:key="opt.v_id"-->
        <!--&gt;</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item class="task-type-list1 rightInput rightInput1">
          <el-input
            v-model="taskFilterForm.overallSearch"
            placeholder="请输入关键词搜索"
            @change="keywordSearchTask"
          ></el-input>
          <i class="el-icon-search"></i>
        </el-form-item>
      </el-form>
    </div>
    <div class="mainTable" id="mainTable">
      <task-gantt
        :projectId="projectid"
        :tasks="gantt.tasks"
        :version="taskList.versionInfo"
        :gantt-visible="gantt.visible"
        @updated="handleUpdated"
        @toggle-expand="handleGroupToggleExpand(...arguments, 'gantt')"
        ref="taskGantt"
      >
        <editable-table
          @show="showUpdate"
          ref="editableTable"
          class="table-part motorTable"
          style="width: 100%"
        >
          <template v-if="!isGroup">
            <el-table
              ref="taskList"
              :data="taskList.projectTaskList"
              tooltip-effect="dark"
              style="width: 100%"
              v-loading="listLoading"
              :empty-text="emptyText"
              @selection-change="selectedTaskList"
              @header-contextmenu="headerContextMenu"
              @row-click="detailShow"
            >
              <el-table-column type="selection" align="center" width="94"></el-table-column>
              <template v-for="(item, index) in taskList.taskField">
                <el-table-column
                  :prop="item.key"
                  :label="item.name"
                  :key="`${item.key}_${index}`"
                  align="center"
                  style="width: 100%"
                  :width="182"
                >
                  <template slot-scope="scope">
                    <editable-td
                      :id="scope.row.id"
                      :value="scope.row[item.key]"
                      :fieldName="item.key"
                      :isEditable="!!item.edit"
                      :rowCode="scope.row.state"
                      :statusList = "statusList"
                    >
                      <slot v-slot:append>
                        <el-tooltip
                          popper-class="yellow-tooltip"
                          :visible-arrow="false"
                          effect="light"
                          content="该用户已被禁封"
                          placement="right"
                          v-if="item.key == 'target_id' && scope.row.identity==1"
                        >
                          <i class="el-icon-warning identity-disabled"></i>
                        </el-tooltip>
                      </slot>
                    </editable-td>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </template>
          <template v-else>
            <group-table
              ref="taskGroupList"
              :data="taskList.projectTaskList"
              :default-expand-all="true"
              :head="taskList.taskField"
              style="width: 100%"
              v-loading="listLoading"
              @selection-change="selectedTaskList"
              @header-contextmenu="headerContextMenu"
              @row-click="detailShow"
              @toggle-expand="handleGroupToggleExpand(...arguments, 'task')"
            >
              <group-table-column type="selection"></group-table-column>
              <template v-for="item in taskList.taskField">
                <group-table-column
                  :prop="item.key"
                  :label="item.name"
                  :key="item.key"
                  align="center"
                  style="width: 100%"
                  :width="140"
                >
                  <template slot-scope="scope">
                    <editable-td
                      :id="scope.row.id"
                      :value="scope.row[item.key]"
                      :fieldName="item.key"
                      :isEditable="!!item.edit"
                      :rowCode="scope.row.state"
                      :statusList = "statusList"
                    >
                      <slot v-slot:append>
                        <el-tooltip
                          popper-class="yellow-tooltip"
                          :visible-arrow="false"
                          effect="light"
                          content="该用户已被禁封"
                          placement="right"
                          v-if="item.key == 'target_id' && scope.row.identity==1"
                        >
                          <i class="el-icon-warning identity-disabled"></i>
                        </el-tooltip>
                      </slot>
                    </editable-td>
                  </template>
                </group-table-column>
              </template>
            </group-table>
          </template>
        </editable-table>
      </task-gantt>
    </div>
    <el-pagination
      background
      :current-page="currentPage"
      @current-change="changePage"
      :page-sizes="[20, 50, 100]"
      :page-size="pageSize"
      layout="prev, pager, next,sizes, jumper"
      :total="total"
      @size-change="sizeChange"
    ></el-pagination>
    <context-menu
      :projectid="projectid"
      :viewid="taskFilterForm.taskView"
      :userId="userId"
      :isShow="contextMenuShow"
      :rightEvent="rightEvent"
      :filterParam="filterParam"
      :headItems="oldField"
      :checkShow="taskList.taskField"
      ref="contentMenu"
      @reloadTask="reloadTask"
      @sortParams="sortParams"
      @hideColumn="hideColumn"
      @hideAllColumn="hideAllColumn"
      @changeShowMenu="changeShowMenu"
      @hideContextMenu="hideContextMenu"
    ></context-menu>
    <!-- 任务详情 -->
    <task-detail
      :visible.sync="detailOptions.visible"
      :id="detailOptions.data.id"
      :pid="projectid"
      :versionId="taskFilterForm.versionInfo"
      :data="detailOptions.data"
    ></task-detail>
    <!-- 修改任务 -->
    <task-update
      :data="taskList.projectTaskList"
      :fields="taskList.taskField"
      :fieldName="updateOptions.fieldName"
      :ids="updateOptions.ids"
      :projectId="projectid"
      :versionId="taskFilterForm.versionInfo"
      :isSearch="isSearch"
      :visible.sync="updateOptions.visible"
      @hide="hideUpdate"
      @updated="handleUpdated"
    />
    <!-- 新建任务 -->
    <create-task
      :visible.sync="createTaskOptions.dialogFormVisible"
      :templates="createTaskOptions.data.taskTemplates"
      :projectId="projectid"
      :projectTemplate="projectTemplate"
      ref="newRef"
      @updated="handleUpdated"
    ></create-task>

    <create-number
      :visible.sync="createNumberOptions.dialogFormVisible"
      :projectId="projectid"
      @updated="handleUpdated"
    ></create-number>

    <create-scene
      :visible.sync="createSceneOptions.dialogFormVisible"
      :projectId="projectid"
      @updated="handleUpdated"
    ></create-scene>

    <create-cameraLens
      :visible.sync="createCameraLensOptions.dialogFormVisible"
      :projectId="projectid"
      @updated="handleUpdated"
    ></create-cameraLens>

    <!-- 新建特效-->
    <create-special
      :templates="createTaskOptions.data.taskTemplates"
      :visible.sync="createSpecialOptions.dialogFormVisible"
      :projectId="projectid"
      @updated="handleUpdated"
      :projectTemplate="projectTemplate"
      v-if="createSpecialOptions.dialogFormVisible"
    ></create-special>

    <!-- 导入 -->
    <task-import
      :visible.sync="importOptions.visible"
      :pid="projectid"
      :versionId="taskFilterForm.versionInfo"
      v-if="importOptions.visible"
      @updated="handleUpdated"
    ></task-import>

    <!--新增视图表-->
    <create-ctrl
      :visible.sync="addOptions.visible"
      :projectId="projectid"
      :headViewList="headViewList"
      ref="viewCtrl"
      @updated="handleUpdated"
    ></create-ctrl>

    <!--修改视图表-->
    <modify-ctrl
      :visible.sync="modifyOptions.visible"
      :projectId="projectid"
      :headViewList="headViewList"
      :tv_id="taskFilterForm.taskView"
      :tv_name="taskName"
      @updated="handleUpdated"
    ></modify-ctrl>
    <el-dialog title="导出提示" :visible.sync="exportVisible" class="taskDialog" @close="closeDialogFn">
      <el-form>
        <el-form-item>
          <div class="exportTip">系统将批量导出{{total}}条任务，请确认</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogFn">取 消</el-button>
        <el-button type="primary" @click="importOut">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { delTask, getTaskList, groupTaskList } from '@/api/make'
import { getTaskGanttList, deleteView, modifyView,exportTask } from '@/api/project/task'
import { projectStatusList} from '@/api/project/settings';
import utils from '@/libs/blob'
import ContextMenu from './contextMenu'
import TaskDetail from './detail/index'
import CreateTask from './createTask'
import CreateNumber from './createNumber'
import CreateScene from './createScene'
import CreateCameraLens from './createCameraLens'
import CreateSpecial from './createSpecial'
import TaskUpdate from './taskUpdate'
import TaskImport from './import/index'
import TaskGantt from './gantt'
import CreateCtrl from './createCtrl'
import ModifyCtrl from './modifyCtrl'
import Bus from '@/libs/bus'
// 修改相关
import { EditableTable, EditableTd } from '@/components/editable'
// 分组
import { GroupTable, GroupTableColumn } from '@/components/groupTable'
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

export default {
  name: 'projectTask',
  components: {
    TaskDetail,
    CreateTask,
    CreateNumber,
    CreateScene,
    CreateSpecial,
    CreateCameraLens,
    ContextMenu,
    EditableTable,
    EditableTd,
    TaskUpdate,
    TaskImport,
    TaskGantt,
    GroupTable,
    GroupTableColumn,
    CreateCtrl,
    ModifyCtrl
  },
  data() {
    return {
      activeNames: ['1'],
      headViewList: '',
      exportVisible: false,
      contextMenuShow: false, //是否显示右键菜单
      defaultShow: true,
      screenShow: false,
      ctrlVisible: false,
      modifyVisible: false,
      isSort: false,
      projectTemplate: '',
      info: {
        detailBoolean: false,
        detailId: '',
        episode: '',
        taskName: '',
        url: '',
        version: '',
        projectid: '',
        projectname: ''
      },
      modifyParams: {
        projectid: '',
        tv_id: '',
        title: ''
      },
      statusList:[], //状态序列
      // 分组
      isGroup: false,
      //甘特图数据
      ganttData: {},
      // 新建任务的配置
      createTaskOptions: {
        data: {},
        dialogFormVisible: false,
        templateBool: true
      },
      // 新建集数的配置
      createNumberOptions: {
        dialogFormVisible: false
      },
      // 新建场次的配置
      createSceneOptions: {
        dialogFormVisible: false
      },
      // 新建镜头的配置
      createCameraLensOptions: {
        dialogFormVisible: false
      },
      // 新建特效的配置
      createSpecialOptions: {
        dialogFormVisible: false
      },
      errorTxt: '',
      formLabelWidth: '120px',
      keywordSearch: '',
      currentPage: 1, //当前分页
      pageSize: 20, //每页显示条数
      total: 0, //总条目数
      taskFilterForm: {
        //全局搜索
        versionInfo: '',
        keyword: '',
        taskView: '',
        groupType: '' //分组
      },
      taskName: '',
      taskList: {
        projectTaskList: []
      }, //任务列表数据
      oldField: [], //存储的全部数据
      rightEvent: {}, //右键菜单位置
      selectedTask: [], //勾选的任务
      projectid: null, //项目id
      projectname: '',
      taskType: 'ts', //列表类型
      filterParam: {},
      // 数据修改的配置
      updateOptions: {
        visible: false, // 显示、隐藏
        fieldName: '', // 要修改的字段
        ids: [] // 要修改的id
      },
      // 详情的配置
      detailOptions: {
        visible: false, // 显示、隐藏
        data: {}
      },
      emptyText: '查询无结果',
      listLoading: false,
      isSearch: false,
      // 导入的配置
      importOptions: {
        visible: false
      },
      // 新增视图表
      addOptions: {
        visible: false
      },
      // 修改视图表
      modifyOptions: {
        visible: false
      },
      // 甘特图
      gantt: {
        visible: false,
        tasks: []
      },
      columnKey: '', // 当前列字段
      sortParam: [],
      stateColumn: [
        { name: '驳回', color: '#FE676E' },
        { name: '组长驳回', color: '#FE676E' },
        { name: '制片驳回', color: '#FE676E' },
        { name: '总监驳回', color: '#FE676E' },
        { name: '通过', color: '#79CEED' },
        { name: '组长通过', color: '#79CEED' },
        { name: '制片通过', color: '#79CEED' },
        { name: '总监通过', color: '#79CEED' },
        { name: '已完成', color: '#39C596' },
        { name: '制作完成', color: '#39C596' },
        { name: '项目归档', color: '#B6B6B6' },
        { name: '项目冻结', color: '#6F89A4' },
        { name: '等待派发', color: '#60EFDB' },
        { name: '等待制作', color: '#BFF3E7' },
        { name: '制作中', color: '#C6E6F1' },
        { name: '审核完成', color: '#39C596' }
      ]
      // currentView: 'CreateNumber' //新建-tab
    }
  },
  computed: {
    userId() {
      return this.$store.state.userid || 'user'
    }
  },
  methods: {
    // 初始化
    init() {
      this.currentPage = 1
      this.renderList()
    },
    // 状态序列
    nintState(){
        let params = {
            pro_id:this.projectid
        };
        projectStatusList(params).then(res => {
            if (res.code == 0) {
                this.statusList = Array.from(res.data);
            }
        })
    },
    // 渲染列表
    renderList() {
      this.isGroup ? this.getGroupTaskList() : this.getTaskList()
      // 获取甘特图数据
      this.gantt.visible && this.getGanttList()
    },
    // 展开、折叠
    handleGroupToggleExpand(_index, type) {
      if (type === 'gantt' && this.$refs.taskGroupList) {
        this.$refs.taskGroupList.toggleExpand(_index - 1, false)
        this.$nextTick(function() {
          this.$refs.taskGantt.gantt.setHeight()
        })
      }
      if (type === 'task' && this.$refs.taskGantt) {
        this.gantt.visible &&
          this.$refs.taskGantt.toggleExpand(_index + 1, false)
      }
    },
    // 甘特图切换
    handleChangeGantt(value) {
      value && this.getGanttList()
    },
    // 获取甘特图列表
    getGanttList() {
      //渲染任务列表
      let filterParams = this.getFilterParam()
      let params = Object.assign({}, filterParams, {
        projectid: this.projectid,
        p: this.currentPage,
        num: this.pageSize,
        versionId: this.taskFilterForm.versionInfo,
        viewId: this.taskFilterForm.taskView,
        overallSearch: this.taskFilterForm.overallSearch,
        groupType: this.taskFilterForm.groupType
      })
      getTaskGanttList(params).then(response => {
        let projectTaskList = response.data
        if (this.isGroup) {
          // 分组
          this.gantt.tasks = genTree(projectTaskList.data).concat(
            projectTaskList.parent || []
          )
        } else {
          // 未分组
          this.gantt.tasks = Array.isArray(projectTaskList)
            ? projectTaskList
            : []
        }
      })
    },
    /**
     * 修改任务
     * start
     */
    // 显示修改
    showUpdate(fieldName, ids) {
      this.isSearch = this.taskFilterForm.overallSearch ? true : false
      Object.assign(this.updateOptions, { fieldName, ids, visible: true })
    },
    // 隐藏修改
    hideUpdate() {
      // 取消选中
      this.$refs.editableTable.hideEditable()
      Object.assign(this.updateOptions, {
        fieldName: '',
        ids: [],
        visible: false
      })
    },
    // 修改完成
    handleUpdated() {
      // 刷新列表
      this.renderList()
    },
    /**
     * 修改任务
     * end
     */
    // 批量导出
    importOut() {
      let params = {
        projectid: this.projectid,
        versionId: this.taskFilterForm.versionInfo,
        viewId: '',
        overallSearch: this.taskFilterForm.overallSearch
      }
      this.$nextTick(() => {
        const loading = this.$message({
          customClass: 'loading-message',
          message: '导出中',
          type: 'success',
          center: true,
          duration: 0
        })
        let clickView = ''
        let a = this.defaultShow
        window.sessionStorage.getItem('clickView') === '1'
          ? (clickView = true)
          : (clickView = false)
        let abc = this.$refs.viewCtrl.viewId.toString()
        abc
          ? (this.defaultShow = false)
          : clickView
          ? (this.defaultShow = clickView)
          : (this.defaultShow = a)
        params.viewId = abc ? abc : this.taskFilterForm.taskView
        exportTask(params).then(res => {
          utils.exportFile(res)
          this.exportVisible = false
          loading.close()
          this.$message({
            customClass: 'custom-message',
            message: '导出成功',
            type: 'success',
            center: true
          })
        })
      })
    },
    // 隐藏列
    hideColumn() {
      let arr = this.taskList.taskField
      this.taskList.taskField = arr.filter(item => item.key !== this.columnKey)
      this.contextMenuShow = false
    },

    // 复选框隐藏
    hideAllColumn() {
      // 去头
      let checklist = this.$refs.contentMenu.checkList
      this.taskList.taskField = this.oldField.filter(function(a) {
        let num = 0
        checklist.forEach(function(b) {
          if (b === a.key) {
            num++
          }
        })
        return num > 0
      })
    },

    hideContextMenu() {
      //滚动隐藏菜单
      this.contextMenuShow = false
    },
    changeShowMenu(val) {
      //点击字段管理隐藏菜单
      this.contextMenuShow = val
    },
    headerContextMenu(column, event) {
      this.columnKey = column.property || column.prop
      this.$refs.contentMenu.isShowChild = false
      //右键菜单
      let retrieval = this.columnKey
      let isDefault = 0
      //获取表头类型
      this.taskList.taskField.forEach(item => {
        if (item.key === retrieval) {
          isDefault = item.isDefault
        }
      })
      this.contextMenuShow = true
      this.rightEvent = event
      this.filterParam = {
        retrieval,
        isDefault
      }
      event.preventDefault()
    },

    sizeChange(val) {
      //监听每页显示条数
      this.pageSize = val
      this.currentPage = 1
      this.renderList()
    },
    changePage(val) {
      this.currentPage = val
      this.renderList()
    },
    // 重构列表数据
    getNintList(data) {
      let datas = Array.isArray(data.projectTaskList)
        ? data.projectTaskList
        : data.projectTaskList.data
      datas.forEach(function(item) {
        if (
          item.state === '驳回' ||
          item.state === '组长驳回' ||
          item.state === '制片驳回' ||
          item.state === '总监驳回'
        ) {
          item.state =
            '<span class="widthColor classOne" >' + item.state + '</span>'
        } else if (
          item.state === '通过' ||
          item.state === '组长通过' ||
          item.state === '制片通过' ||
          item.state === '总监通过'
        ) {
          item.state =
            '<span class="widthColor classTwo" >' + item.state + '</span>'
        } else if (item.state === '已完成' || item.state === '制作完成') {
          item.state =
            '<span class="widthColor classThree" >' + item.state + '</span>'
        } else if (item.state === '项目归档') {
          item.state =
            '<span class="widthColor classFour" >' + item.state + '</span>'
        } else if (item.state === '项目冻结') {
          item.state =
            '<span class="widthColor classFive" >' + item.state + '</span>'
        } else if (item.state === '等待派发') {
          item.state =
            '<span class="widthColor classSix" >' + item.state + '</span>'
        } else if (item.state === '等待制作') {
          item.state =
            '<span class="widthColor classSeven" >' + item.state + '</span>'
        } else if (item.state === '制作中') {
          item.state =
            '<span class="widthColor classEight" >' + item.state + '</span>'
        } else if (item.state === '审核完成') {
          item.state =
            '<span class="widthColor classNine" >' + item.state + '</span>'
        }
      })
      return data
    },
    // 任务分组列表
    getGroupTaskList() {
      if (!this.projectid) return
      this.listLoading = true
      let filterParams = this.getFilterParam()
      let param = {
        projectid: this.projectid,
        p: this.currentPage,
        num: this.pageSize,
        versionId: this.taskFilterForm.versionInfo,
        viewId: '',
        overallSearch: this.taskFilterForm.overallSearch,
        groupType: this.taskFilterForm.groupType
      }
      this.$nextTick(() => {
        let clickView = ''
        let a = this.defaultShow
        window.sessionStorage.getItem('clickView') === '1'
          ? (clickView = true)
          : (clickView = false)
        let abc = this.$refs.viewCtrl.viewId.toString()
        abc
          ? (this.defaultShow = false)
          : clickView
          ? (this.defaultShow = clickView)
          : (this.defaultShow = a)
        param.viewId = abc ? abc : this.taskFilterForm.taskView
        let params = {}
        if (this.isSort) {
          params = Object.assign({}, filterParams, param, {
            keywordSort: this.sortParam
          })
        } else {
          params = Object.assign({}, filterParams, param)
        }
        groupTaskList(params).then(res => {
          this.$refs.viewCtrl.viewId = ''
          window.sessionStorage.removeItem('clickView')
          this.taskList = res.data
          let projectTaskList = res.data.projectTaskList
          this.taskList.projectTaskList = genTree(projectTaskList.data).concat(
            projectTaskList.parent
          )
          // 项目版本
          let [firstVersion] = res.data.versionInfo
          this.taskFilterForm.versionInfo = firstVersion.v_id || ''

          this.total = parseInt(res.data.count)
          this.detailOptions.visible = false
          this.createTaskOptions.data.taskTemplates = res.data.taskTemplate
          this.projectTemplate = res.data.projectTemplate
          this.listLoading = false
          if (this.createTaskOptions.templateBool) {
            this.createTaskOptions.templateBool = false
          }
        })
      })
    },

    // 任务列表
    getTaskList() {
      if (!this.projectid) return
      this.listLoading = true
      //渲染任务列表
      let filterParams = this.getFilterParam()
      let param = {
        projectid: this.projectid,
        p: this.currentPage,
        num: this.pageSize,
        versionId: this.taskFilterForm.versionInfo,
        viewId: '',
        overallSearch: this.taskFilterForm.overallSearch
      }
      this.$nextTick(() => {
        let clickView = ''
        let a = this.defaultShow
        window.sessionStorage.getItem('clickView') === '1'
          ? (clickView = true)
          : (clickView = false)
        let abc = this.$refs.viewCtrl.viewId.toString()
        abc
          ? (this.defaultShow = false)
          : clickView
          ? (this.defaultShow = clickView)
          : (this.defaultShow = a)
        param.viewId = abc ? abc : this.taskFilterForm.taskView
        let params = {}
        if (this.isSort) {
          params = Object.assign({}, filterParams, param, {
            keywordSort: this.sortParam
          })
        } else {
          params = Object.assign({}, filterParams, param)
        }
        getTaskList(params)
          .then(res => {
            this.$refs.viewCtrl.viewId = ''
            window.sessionStorage.removeItem('clickView')
            this.taskList = res.data
            this.oldField = res.data.taskField
            // 项目版本
            let [firstVersion] = res.data.versionInfo
            this.taskFilterForm.versionInfo = firstVersion.v_id || ''

            this.total = parseInt(this.taskList.count)
            this.detailOptions.visible = false
            this.createTaskOptions.data.taskTemplates = res.data.taskTemplate
            this.projectTemplate = res.data.projectTemplate
            this.listLoading = false
            if (this.createTaskOptions.templateBool) {
              this.createTaskOptions.templateBool = false
            }
            Bus.$emit('setProjectName', this.taskList.projectName)
          })
          .catch(response => {
            if (response.code === 200001) {
              // 项目不存在
              this.$router.replace('/project/index')
            }
          })
      })
    },
    selectedTaskList(selection) {
      //获取选择任务的列表
      this.selectedTask = selection
    },
    batchDelTask() {
      //删除任务
      let len = this.selectedTask.length
      let stage_id = []
      if (len) {
        this.$confirm('确认删除吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.selectedTask.forEach(item => {
              stage_id.push(item.id)
            })
            let params = {
              stage_id: stage_id.join(),
              version_id: this.taskFilterForm.versionInfo
            }
            if (this.taskFilterForm.overallSearch) {
              params.source = 'search'
            }
            delTask(params).then(res => {
              if (res.code == 0) {
                let totalPage = Math.ceil(this.total / this.pageSize)
                if (this.currentPage == totalPage && this.currentPage != 1) {
                  let allCheckLen = this.total % this.pageSize || this.pageSize
                  if (stage_id.length == allCheckLen) {
                    this.currentPage--
                  }
                }
                this.selectedTask = []
                // 刷新列表
                this.renderList()
                this.$message({ type: 'success', message: res.msg })
              }
            })
          })
          .catch(() => {})
      }
    },
    detailShow(row, column, event) {
      if (
        event.ctrlKey ||
        event.target.classList.contains('editable-cell-pencil')
      ) {
        return false
      }
      this.detailOptions.visible = true
      this.detailOptions.data = Object.assign(
        { projectid: this.projectid, projectname: this.taskList.projectName },
        row
      )
    },
    getFilterParam() {
      let fliterInfo = JSON.parse(window.localStorage.getItem(this.userId))
      let param = []
      if (fliterInfo) {
        for (let item in fliterInfo) {
          if (fliterInfo[item].searchValues.length) {
            param.push(fliterInfo[item])
          }
        }
      }
      return { keywordSearch: param }
    },
    keywordSearchTask() {
      this.currentPage = 1
      this.isSort = false
      this.renderList()
    },
    // 排序参数
    sortParams(a, b) {
      //右键菜单
      let retrieval = this.columnKey
      let isDefault = 0
      let sortOrder = a
      //获取表头类型
      this.taskList.taskField.forEach(item => {
        if (item.key === retrieval) {
          isDefault = item.isDefault
        }
      })
      this.sortParam = [{ retrieval }, { isDefault }, { sortOrder }]
      this.isSort = b
      this.reloadTask(this.currentPage)
    },
    reloadTask(val) {
      this.currentPage = val
      this.renderList()
    },
    closeTaskDialog() {
      this.createTaskOptions.dialogFormVisible = false
    },
    createFn(command) {
      switch (parseInt(command)) {
        case 1:
          this.createTaskOptions.dialogFormVisible = true
          // this.refs.newRef.closeChild();
          break
        case 2:
          this.createNumberOptions.dialogFormVisible = true
          break
        case 3:
          this.createSceneOptions.dialogFormVisible = true
          break
        case 4:
          this.createCameraLensOptions.dialogFormVisible = true
          break
        case 5:
          this.createSpecialOptions.dialogFormVisible = true
          break
        default:
        // this.createTaskOptions.dialogFormVisible = true;
      }
    },
    operateGroup(command) {
      if (command === '0') {
        this.taskList.projectTaskList = []
      }
      this.contextMenuShow = false
      this.taskFilterForm.groupType = command
      this.isGroup = command !== '0'
      this.renderList()
    },
    operateMotor(command) {
      if (command == '1') {
        this.batchDelTask()
      } else if (command == '2') {
        this.importOptions.visible = true
      } else {
        this.exportVisible = true
      }
    },
    operateMap(command) {
      console.log(command)
    },
    operateName(command) {
      this.taskFilterForm.versionInfo = command
      this.handleUpdated()
    },
    visibleChange() {
      this.screenShow = false
    },
    operateView(command) {
      this.operateOut()
      this.headViewList = JSON.stringify(
        this.taskList.taskField.map(function(item) {
          return {
            key: item.key,
            isDefault: item.isDefault
          }
        })
      )
      // 保存
      if (command === '1') {
        if (this.taskFilterForm.taskView) {
          let params = {
            projectid: this.projectid,
            task_field: this.headViewList,
            tv_id: this.taskFilterForm.taskView.toString()
          }
          modifyView(params).then(res => {
            if (res.code == 0) {
              // 刷新列表
              this.renderList()
              this.$message({ type: 'success', message: res.msg })
            }
          })
        } else {
          this.$message({ type: 'warning', message: '请选择需要保存的视图' })
        }
        // 删除
      } else if (command === '2') {
        this.addOptions.visible = true
        // 修改
      } else if (command === '3') {
        if (this.taskFilterForm.taskView) {
          this.modifyOptions.visible = true
        } else {
          this.$message({ type: 'warning', message: '请选择视图' })
        }
      } else if (command === '4') {
        if (this.taskFilterForm.taskView) {
          this.$confirm('确认删除当前视图表吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              let params = {
                projectid: this.projectid,
                tv_id: this.taskFilterForm.taskView.toString()
              }
              deleteView(params).then(res => {
                if (res.code == 0) {
                  this.defaultShow = true
                  // 刷新列表
                  this.renderList()
                  this.$message({ type: 'success', message: res.msg })
                }
              })
            })
            .catch(() => {})
        } else {
          this.$message({ type: 'warning', message: '请选择视图' })
        }
        // 另存为
      }
    },
    operateHover() {
      this.screenShow = true
    },
    operateOut() {
      this.screenShow = false
    },
    // 点击我的视图
    operateViewClick(a, b, c) {
      this.taskFilterForm.taskView = a
      window.sessionStorage.setItem('viewType', a)
      if (c != '1') {
        window.sessionStorage.setItem('viewDefault', c)
      } else {
        window.sessionStorage.removeItem('viewDefault')
      }
      this.taskName = b
      c === '1' ? (this.defaultShow = true) : (this.defaultShow = false)
      this.screenShow = false
      window.sessionStorage.setItem('clickView', this.defaultShow ? '1' : '0')
      this.handleUpdated()
    },
    closeDialogFn() {
      this.exportVisible = false
    }
  },
  created() {
    let a = window.sessionStorage.getItem('viewType')
    let b = window.sessionStorage.getItem('viewDefault')
    b ? (this.defaultShow = false) : (this.defaultShow = true)
    this.projectid = this.$route.query.projectid
    this.taskFilterForm.taskView = a ? a : ''
    if (!this.projectid) {
      this.$router.replace('/project/index')
    }
  },
  beforeMount() {
    this.init();
    this.nintState();
  },
  mounted() {
      document.querySelector(".el-table__body-wrapper").style.minHeight = (document.documentElement.clientHeight-300)+'px';
      window.onresize = () => {
        return (() => {
            document.querySelector(".el-table__body-wrapper").style.minHeight = (document.documentElement.clientHeight-300)+'px';
        })()
    };
  },
  destroyed() {
    document.removeEventListener('click', this.hideContextMenu)
  },
  // 取消缓存组件
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'related-task') {
      this.$store.commit('noKeepAlive', from.meta.keepComponent)
    }
    next()
  }
}
</script>
<style lang="scss">
.task-filter-form {
  text-align: left;
}
.task-list-wrap {
  padding: 0;
  /*padding: 0 20px;*/
  margin: 10px 0 0;
  .el-pagination {
    text-align: center;
    margin-top: 10px;
  }
  .task-opt {
    margin-bottom: 10px;
  }
  .task-type-list {
    float: right;
    margin: 10px 90px 0;
    position: relative;
    i {
      position: absolute;
      right: 10px;
      top: 12px;
      color: #d8d8d8;
    }
  }
  .task-type-list1 {
    float: right;
    margin: 0 90px 0;
    position: relative;
    i {
      position: absolute;
      right: 10px;
      top: 12px;
      color: #d8d8d8;
    }
  }
  .el-table em {
    color: #e8e804;
    font-style: normal;
  }
  .identity-disabled {
    margin-left: 5px;
  }
  .mainTable{
    padding:10px 102px 0;
    clear:both;
    overflow:hidden;
  }
}
.yellow-tooltip.el-tooltip__popper {
  border: none;
  background: #fdf6ec;
}
.new-task {
  /*float: right;*/
  /*margin-right: 10px;*/
  vertical-align: top;
  button {
    width: 90px;
  }
}
.error {
  color: #990000;
}
.full-wrapper {
  width: 100%;
  display: flex;
  .full-left {
    flex: 1;
    overflow-x: auto;
  }
  .full-right {
    flex: 1;
    overflow-x: auto;
  }
}
.screenView {
  position: absolute;
  margin-left: 2px;
  left: 100%;
  width: 76px;
  top: 4px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  text-align: center;
  li {
    overflow: hidden;
    padding: 0 5px;
  }
  li:hover {
    background-color: #f1f1f1;
  }
}
</style>