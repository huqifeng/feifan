<template>
  <section class="main-content project-mana-wrap">
    <div class="tab">
      <el-form :inline="true" :model="filterForm" @submit.native.prevent>
        <el-form-item>
          <el-dropdown trigger="click" @command="changeLayout">
            <el-button>布局</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">网格布局</el-dropdown-item>
              <el-dropdown-item command="2">列表布局</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button @click="createFn">新建</el-button>
        </el-form-item>
        <el-form-item class="keyword-search rightInput rightInput1">
          <el-input v-model="filterForm.search" placeholder="请输入关键词搜索" @change="keywordSearch"></el-input>
          <i class="el-icon-search"></i>
        </el-form-item>
      </el-form>
    </div>
    <card-list
      v-loading="loading"
      :data="projectList"
      @changeStatus="changeStatus"
      @deleteProject="deleteProject"
      v-if="layout==='1'"
    ></card-list>
    <tile-list
      v-loading="loading"
      :data="projectList"
      @changeStatus="changeStatus"
      @deleteProject="deleteProject"
      :statusDialogVisible="statusDialogVisible"
      @changeVisible="changeVisible"
      v-else-if="total !==0"
    ></tile-list>
    <el-pagination
      background
      :current-page="currentPage"
      @current-change="changePage"
      :page-sizes="[20, 50, 100]"
      :page-size="pageSize"
      layout="prev, pager, next,sizes, jumper"
      :total="total"
      v-if="total !==0"
      @size-change="sizeChange"
    ></el-pagination>
    <div class="null-data-wrap" v-if="isShowNull">
      <img src="@/assets/images/search-result.png">
      <p>点击左上角“新建”创建新项目</p>
    </div>
    <el-dialog title="删除提示" :visible.sync="deleteVisible" class="taskDialog delete-tips-dialog">
      <p class="tips-text">
        删除当前项目后，项目内所有内容（包含报价单、合同、日志、
        任务等）都会被删除且不可恢复，确定删除吗？
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </div>
    </el-dialog>
    <freeze
      :visible.sync="freezeVisible"
      :data="changeStatusParam"
      @reload="renderList"
      @changeVisible="changeVisible"
    ></freeze>
    <place-file
      :visible.sync="fileVisible"
      :data="changeStatusParam"
      @reload="renderList"
      @changeVisible="changeVisible"
    ></place-file>
  </section>
</template>

<script>
import CardList from './cardList'
import TileList from './tileList'
import Freeze from './freeze'
import PlaceFile from './placeFile'
import {
  getProjectIndex,
  updateStatus,
  deletProject,
  getSchedule
} from '@/api/project/projectIndex'
export default {
  components: { CardList, TileList, Freeze, PlaceFile },
  data() {
    return {
      filterForm: {
        search: ''
      },
      publicPath: process.env.BASE_URL,
      loading: true,
      currentPage: 1, // 当前分页
      pageSize: 20, //每页显示条数
      total: 0, //总条目数
      layout: '1', // 布局类型
      deleteVisible: false, // 删除提示
      projectItem: {},
      freezeVisible: false, // 冻结提示框
      fileVisible: false, // 归档说明
      projectList: {},
      changeStatusParam: {}, // 更改状态参数
      clientW: document.documentElement.clientWidth,
      isShowNull: false, // 无数据时进行显示
      statusDialogVisible: false
    }
  },
  methods: {
    // 初始化
    init() {
      this.currentPage = 1
      this.renderList()
    },
    // 渲染列表
    renderList() {
      let param = {
        page: this.currentPage,
        pageSize: this.pageSize,
        search: this.filterForm.search
      }
      getProjectIndex(param).then(res => {
        if (res.code === 0) {
          this.projectList = res.data
          this.total = parseInt(res.data.count)
          this.isShowNull = this.total === 0
          if (this.layout === '1') {
            for (let item of res.data.list) {
              if (this.clientW > 1600 && item.title.length > 20) {
                item.newTitle = `${item.title.substring(0, 20)}...`
                item.showTip = false
              } else if (this.clientW <= 1600 && item.title.length > 10) {
                item.newTitle = `${item.title.substring(0, 10)}...`
                item.showTip = false
              } else {
                item.newTitle = item.title
                item.showTip = true
              }
              getSchedule({ project_id: item.project_id }).then(res => {
                if (res.code === 0) {
                  item.progress = res.data * 100
                }
              })
            }
            this.loading = false
            return
          }
          this.loading = false
        }
      })
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
    // 修改布局
    changeLayout(command) {
      this.layout = command
    },
    createFn() {
      this.$router.push('/project/create')
    },
    // 修改状态
    changeStatus(status, id) {
      this.changeStatusParam = {
        project_id: id,
        state: status
      }
      switch (status) {
        case String(this.projectList.freeze):
          this.freezeVisible = true
          break
        case String(this.projectList.place_file):
          this.fileVisible = true
          break
        default:
          updateStatus(this.changeStatusParam).then(res => {
            if (res.code === 0) {
              this.$message({
                customClass: 'custom-message',
                message: '修改成功',
                type: 'success',
                center: true
              })
            }
            this.statusDialogVisible = false
            this.renderList()
          })
          break
      }
    },
    // 删除项目
    deleteProject(item) {
      this.deleteVisible = true
      this.projectItem = item
    },
    confirmDelete() {
      let param = {
        project_id: this.projectItem.project_id,
        state: this.projectItem.state
      }
      deletProject(param).then(res => {
        if (res.code === 0) {
          this.$message({
            customClass: 'custom-message',
            message: '删除成功',
            type: 'success',
            center: true
          })
          this.deleteVisible = false
          this.renderList()
        }
      })
    },
    // 关键词搜索
    keywordSearch() {
      this.init()
    },
    reload() {
      this.init()
    },
    changeVisible(val) {
      this.statusDialogVisible = val
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss">
.project-mana-wrap {
  .null-data-wrap {
    font-size: 16px;
    color: #999;
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    margin-top: -28px;
    transform: translate(-50%, -50%);
    p {
      margin-top: 30px;
      font-size: 12px;
    }
  }
  .el-pagination {
    text-align: center;
  }
  .keyword-search {
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
}
.custom-message {
  width: 270px;
  min-width: 0;
  height: 100px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 15px 0px rgba(1, 102, 178, 0.3);
  border-radius: 8px;
  border: none;
  &.el-message--success {
    .el-message__content {
      font-size: 24px;
      font-weight: 400;
      color: rgba(23, 155, 255, 1);
      line-height: 30px;
    }
    .el-icon-success {
      background: transparent url('~@/assets/images/success.png') no-repeat
        scroll 0 0;
      width: 38px;
      height: 38px;
      &::before {
        display: none;
      }
    }
  }
}
.project-tooltip {
  max-width: 200px;
}
</style>



