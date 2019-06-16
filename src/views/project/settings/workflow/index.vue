<template>
  <!-- 流程审核 -->
  <div class="project-settings-content">
    <template v-if="menuList && menuList.length">
      <div class="menu">
        <el-menu :unique-opened="true" :default-active="defaultActive">
          <el-submenu v-for="menu in menuList" :key="menu.stage_type" :index="menu.stage_type">
            <template slot="title">{{menu.stage_type}}</template>
            <el-menu-item
              v-for="item in menu.child"
              :key="item"
              :index="item"
              @click="showView(menu.stage_type, item)"
            >{{item}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="main" v-loading="loading">
        <div class="hd">
          <el-tooltip content="新建">
            <el-button type="primary" icon="el-icon-plus" circle @click="onAdd"></el-button>
          </el-tooltip>
        </div>
        <div class="bd">
          <el-card shadow="hover" class="card">
            <div class="card-hd">
              <h3 class="title">制作者</h3>
              <div class="tools">
                <el-tooltip content="编辑">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-edit"
                    @click="onUpdate(detail.pd, true)"
                  ></el-button>
                </el-tooltip>
              </div>
            </div>
            <div class="card-bd">
              <div class="user">
                <template v-if="detail.pd.producer && detail.pd.producer.length">
                  <p
                    v-for="(item, index) in detail.pd.producer"
                    :key="`${item.target_id}_${index}`"
                  >{{item.realname}}{{item.post_name ? `(${item.post_name})` : ''}}</p>
                </template>
                <p v-else>暂无数据</p>
              </div>
              <div class="status" v-if="detail.pd.status.length">
                <el-tag
                  type="info"
                  v-for="status in detail.pd.status"
                  :key="status"
                  size="mini"
                >{{status}}</el-tag>
              </div>
            </div>
          </el-card>
          <div class="clearfix"></div>
          <template v-if="detail.review && detail.review.length">
            <draggable v-model="detail.review" @change="onChange">
              <transition-group>
                <el-card
                  shadow="hover"
                  v-for="(item, index) in detail.review"
                  :key="item.id"
                  class="card"
                >
                  <i class="el-icon-right right-arrow" v-if="index !== detail.review.length - 1"></i>
                  <div class="card-hd">
                    <h3 class="title">{{item.sortName}}</h3>
                    <div class="tools">
                      <el-tooltip content="编辑">
                        <el-button
                          type="text"
                          size="mini"
                          icon="el-icon-edit"
                          @click="onUpdate(item)"
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip content="删除">
                        <el-button
                          type="text"
                          size="mini"
                          icon="el-icon-delete"
                          @click="onRemove(item)"
                        ></el-button>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="card-bd">
                    <h4>{{item.flow_name}}</h4>
                    <div class="user">
                      <p>{{item.check_uname}}{{item.post ? `(${item.post})` : ''}}</p>
                    </div>
                    <div class="status">
                      <el-tag
                        type="info"
                        v-for="status in item.courseact"
                        :key="status"
                        size="mini"
                      >{{status}}</el-tag>
                    </div>
                  </div>
                </el-card>
              </transition-group>
            </draggable>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="tips">暂无数据，请先到制作任务页面创建任意一条任务，再进行流程设置</p>
    </template>
    <!-- 编辑 -->
    <update
      :visible.sync="updateOptions.visible"
      :isUpdate="updateOptions.isUpdate"
      :pid="pid"
      :isPD="updateOptions.isPD"
      :type="stageType"
      :name="stageName"
      :data="updateOptions.data"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import * as api from '@/api/project/settings'
import Update from './update'
import draggable from 'vuedraggable'

export default {
  components: { Update, draggable },
  data() {
    return {
      pid: '', // 项目id
      menuList: [],
      defaultActive: '',
      loading: true,
      stageType: '',
      stageName: '',
      updateOptions: {
        isPD: false, // 是否是制作者
        visible: false,
        isUpdate: false,
        data: {}
      },
      // 详情数据
      detail: {
        // 制作者
        pd: { producer: [], status: [] },
        // 审核
        review: []
      }
    }
  },
  methods: {
    // 初始化
    init() {
      if (!this.pid) {
        this.$message({
          message: '非正常访问，请输入完整URL',
          type: 'warning'
        })
        return false
      }
      this.getMenu()
    },
    // 左侧菜单
    getMenu() {
      api.workflowMenu({ project_id: this.pid }).then(response => {
        if (!Array.isArray(response.data)) {
          this.loading = false
          return false
        }
        let { data: list = [] } = response
        this.menuList = list
        // 设置默认选中
        let [first = {}] = list
        let [firstName] = first.child || []
        this.defaultActive = firstName
        // 显示详情
        this.showView(first.stage_type, firstName)
      })
    },
    // 右侧内容
    showView(type, name) {
      this.stageType = type
      this.stageName = name
      this.loading = true
      this.detail.review = []
      this.getPD()
      this.getReview()
    },
    // 获取制作者
    getPD() {
      api
        .workflowInfo({
          project_id: this.pid,
          stage_type: this.stageType,
          stage_name: this.stageName
        })
        .then(response => {
          let { producer = [], useStatus: status } = response.data
          this.detail.pd = { producer, status }
          this.loading = false
        })
    },
    // 获取审核人
    getReview() {
      api
        .workflowReviewList({
          project_id: this.pid,
          stage_type: this.stageType,
          stage_name: this.stageName
        })
        .then(response => {
          this.detail.review = response.data || []
          this.loading = false
        })
    },
    // 模态框显示
    showDialog() {
      this.updateOptions.visible = true
    },
    // 添加
    onAdd() {
      this.updateOptions.isPD = false
      this.updateOptions.isUpdate = false
      this.updateOptions.data = {
        project_id: this.pid,
        stage_type: this.stageType,
        stage_name: this.stageName
      }
      this.showDialog()
    },
    // 修改
    onUpdate(data, isPD = false) {
      this.updateOptions.isPD = isPD
      this.updateOptions.isUpdate = true
      if (isPD) {
        this.updateOptions.data = {
          courseact: data.status || [],
          producer: data.producer,
          project_id: this.pid,
          stage_type: this.stageType,
          stage_name: this.stageName
        }
      } else {
        this.updateOptions.data = Object.assign({}, data, {
          project_id: this.pid,
          stage_type: this.stageType,
          stage_name: this.stageName
        })
      }
      this.showDialog()
    },
    // 删除
    onRemove(data) {
      if (this.detail.review.length === 1) {
        this.$alert('当前审核阶段不可删除', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        this.$confirm(
          '删除后会改变对应任务审核流，但不会改变任务状态，确定删除当前审核阶段吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.handleRemove(data)
          })
          .catch(() => {})
      }
    },
    // 移动module
    onChange(e) {
      // 移动
      if (e.moved) {
        this.handleSort()
      }
    },
    handleSort() {
      let params = {
        is_default: 2,
        project_id: this.pid,
        stage_type: this.stageType,
        stage_name: this.stageName,
        id_list: [],
        sort_list: [],
        id_default_list: []
      }
      // 组装排序请求接口数据
      this.detail.review.forEach((item, index) => {
        if (item.is_default === 1) {
          params.is_default = 1
          params.id_default_list.push(item.id)
        }
        params.id_list.push(item.id)
        params.sort_list.push(index)
      })
      api.workflowSort(params).then(() => {
        this.getReview()
        this.$message({
          type: 'success',
          message: '排序成功!'
        })
      })
    },
    // 删除
    handleRemove(data) {
      api
        .workflowDelete(
          Object.assign(
            {
              is_default: data.is_default,
              project_id: this.pid,
              stage_type: data.stage_type,
              stage_name: data.stage_name,
              id: data.id
            },
            { stage_type: this.stageType, stage_name: this.stageName }
          )
        )
        .then(() => {
          this.getReview()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
    },
    // 编辑
    handleUpdate() {
      this.updateOptions.isPD ? this.getPD() : this.getReview()
    }
  },
  created() {
    let { query } = this.$route
    this.pid = query.projectid || '378'
  },
  beforeMount() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.project-settings-content {
  display: flex;
  .tips {
    padding: 20px;
    text-align: center;
  }
}
.menu {
  width: 220px;
}
.main {
  flex: 1;
  padding: 20px;
}
.hd {
  text-align: right;
}
.card {
  position: relative;
  float: left;
  width: 220px;
  margin-right: 60px;
  margin-bottom: 40px;
  background-color: #f2f2f2;
  overflow: unset;
  .tools {
    display: none;
  }
  .card-hd {
    display: flex;
    height: 30px;
    margin-bottom: 10px;
    align-items: center;
  }
  .card-bd {
    height: 180px;
    overflow-y: auto;
    h4 {
      font-weight: normal;
      line-height: 24px;
      margin-bottom: 10px;
    }
  }
  .title {
    flex: 1;
    font-size: 14px;
    line-height: 30px;
    font-weight: normal;
  }
  .user {
    padding: 8px;
    line-height: 24px;
    background-color: #fff;
    border-radius: 4px;
  }
  .status {
    margin-top: 10px;
    padding: 8px;
    line-height: 24px;
    background-color: #fff;
    border-radius: 4px;
    .el-tag {
      margin-right: 5px;
    }
  }
  .right-arrow {
    font-size: 40px;
    position: absolute;
    right: -50px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.card:hover .tools {
  display: block;
}
</style>
