<template>
  <!-- 里程碑 -->
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    :lock-scroll="false"
    @closed="handleClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="选择版本">
        <el-select :value="currentVersion.v_id" disabled placeholder="请选择">
          <el-option
            :key="item.v_id"
            :label="item.v_title"
            :value="item.v_id"
            v-for="item in version"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联任务" prop="stageIds">
        <el-button
          type="text"
          @click="handleRelatedTask"
        >{{relatedTaskList.length ? '查看任务' : '选择任务'}}</el-button>
      </el-form-item>
      <el-form-item label="结束日期" prop="date">
        <el-date-picker
          type="date"
          v-model="ruleForm.date"
          :editable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="里程碑说明" prop="info">
        <el-input type="textarea" v-model="ruleForm.info" rows="4" resize="none" :maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="参与人员" prop="userids">
        <div class="user-list">
          <div class="user" v-for="(user, index) in userList" :key="`user_${index}`">
            <div class="pic">
              <img
                :src="(user.avatar || user.thumb_avatar) | imageUrl(`${publicPath}images/avatar.png`)"
              >
            </div>
            <div class="name">
              <p :title="user.name || user.realname">{{user.name || user.realname}}</p>
              <p
                :title="user.post || user.post_name"
              >{{user.post ? `(${user.post})` : ''}}{{user.post_name ? `(${user.post_name})` : ''}}</p>
            </div>
          </div>
        </div>
        <select-user
          accordion
          :multiple="true"
          :show-button="true"
          title="选择人员"
          @change="handleUserChange"
        ></select-user>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" plain @click="handleRemove" v-if="isUpdate">删 除</el-button>
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button type="primary" size="medium" @click="handlePrimary" :loading="submitLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/project/task'
import SelectUser from '@/components/selectUser/selectUser'

export default {
  components: { SelectUser },
  props: {
    id: { type: String },
    projectId: { type: String, required: true },
    visible: { type: Boolean, default: false },
    isUpdate: { type: Boolean, default: false },
    version: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      loading: false,
      ruleForm: {
        projectId: this.projectId,
        stageIds: '',
        date: '',
        info: '',
        userids: ''
      },
      rules: {
        stageIds: [{ required: true, message: '请选择任务', trigger: 'blur' }],
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        userids: [
          { required: true, message: '请选择参与人员', trigger: 'blur' }
        ]
      },
      userList: [],
      publicPath: process.env.BASE_URL,
      submitLoading: false
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(value) {
        value && this.init()
      }
    },
    userList(list) {
      let ids = list.map(item => item.id)
      this.ruleForm.userids = ids.join(',')
    },
    relatedTaskList(list) {
      let ids = list.map(item => item.id)
      this.ruleForm.stageIds = ids.join(',')
    }
  },
  computed: {
    title() {
      return this.isUpdate ? '查看里程碑' : '创建里程碑'
    },
    // 关联的任务
    relatedTaskList() {
      return this.$store.state.related.task
    },
    // 当前版本
    currentVersion() {
      let [first = {}] = this.version
      return first
    }
  },
  methods: {
    init() {
      this.dialogVisible = true
      if (this.isUpdate) {
        this.getMilestone()
        this.getMilestoneTask()
      }
    },
    // 选择任务
    handleRelatedTask() {
      if (this.isUpdate) {
        // 查看任务
      } else {
        // 选择任务
      }
      this.$router.push({
        path: '/related/task',
        query: {
          projectid: this.projectId,
          version_id: this.currentVersion.v_id,
          version_disabled: true
        }
      })
    },
    // 确定关联任务
    handlePrimaryRelatedTask() {},
    // 关联参与人员
    handleUserChange(data) {
      this.userList = data
    },
    handleClose() {
      this.dialogVisible = false
      // 重置表单数据
      this.$refs.ruleForm.resetFields()
      // 清空store
      this.$store.dispatch('setRelated', { type: 'task', list: [] })
      this.$emit('update:visible', false)
    },
    // 确定
    handlePrimary() {
      this.$refs.ruleForm.validate().then(() => {
        this.isUpdate ? this.updateMilestone() : this.addMilestone()
      })
    },
    // 取消
    handleCancel() {
      this.handleClose()
    },
    // 删除
    handleRemove() {
      this.$confirm('确定删除当前里程碑吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteMilestone()
        })
        .catch(() => {})
    },
    // 创建、修改、删除成功后的回调
    handleSuccess() {
      this.submitLoading = false
      this.handleCancel()
      this.$emit('update')
    },
    // 查看里程碑
    getMilestone() {
      this.loading = true
      api.getMilestone({ milestoneId: this.id }).then(response => {
        let { date, info, stageIds, users } = response.data
        this.userList = users
        this.ruleForm = Object.assign({}, this.ruleForm, {
          date,
          info,
          stageIds: stageIds.join(',')
        })
        this.loading = false
      })
    },
    // 获取里程碑任务
    getMilestoneTask() {
      api.getMilestoneTask({ milestoneId: this.id }).then(response => {
        this.$store.dispatch('setRelated', {
          type: 'task',
          list: response.data
        })
      })
    },
    // 添加里程碑
    addMilestone() {
      this.submitLoading = true
      api.addMilestone(this.ruleForm).then(() => {
        this.$message({ type: 'success', message: '添加成功!' })
        this.handleSuccess()
      })
    },
    // 修改里程碑
    updateMilestone() {
      this.submitLoading = true
      let params = Object.assign({}, this.ruleForm, { milestoneId: this.id })
      api.updateMilestone(params).then(() => {
        this.$message({ type: 'success', message: '修改成功!' })
        this.handleSuccess()
      })
    },
    // 删除里程碑
    deleteMilestone() {
      api.deleteMilestone({ milestoneId: this.id }).then(() => {
        this.$message({ type: 'success', message: '删除成功!' })
        this.handleSuccess()
      })
    }
  }
}
</script>


<style lang="scss" >
.task-gantt {
  .user {
    float: left;
    width: 80px;
    margin-right: 10px;
    .pic {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      background: #f2f2f2;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>