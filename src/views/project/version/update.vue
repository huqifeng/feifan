<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    :lock-scroll="false"
    width="480px"
    @close="handleClose"
  >
    <el-form
      :model="form"
      :rules="rules"
      @submit.native.prevent
      label-width="80px"
      ref="form"
      v-loading="loading"
    >
      <el-form-item label="版本名称" prop="version_name">
        <el-input v-model="form.version_name" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="开始日期" prop="start_date">
        <el-date-picker
          :editable="false"
          placeholder="选择日期"
          style="width:100%;"
          type="datetime"
          v-model="form.start_date"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="end_date">
        <el-date-picker
          :editable="false"
          placeholder="选择日期"
          style="width:100%;"
          type="datetime"
          v-model="form.end_date"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="版本说明" prop="remark">
        <el-input
          type="textarea"
          v-model="form.remark"
          maxlength="500"
          :autosize="{ minRows: 4, maxRows: 6}"
        ></el-input>
      </el-form-item>
      <el-form-item label="关联任务" prop="tasklist">
        <el-button
          type="text"
          @click="handleRelatedTask"
        >{{relatedTaskList.length ? '查看任务' : '选择任务'}}</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button round @click="handleCancel">取 消</el-button>
      <el-button type="primary" round @click="handlePrimary" :loading="submitLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/project/version'
export default {
  name: 'VersionUpdate',
  props: {
    // 版本ID
    id: { type: String },
    // 项目ID
    projectId: { type: String },
    // 是否为修改
    isUpdate: { type: Boolean, default: false },
    // 是否可见
    visible: { type: Boolean, default: false }
  },
  data() {
    let checkDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择开始日期'))
      } else if (new Date(value) < new Date(this.form.start_date)) {
        callback(new Error('结束日期不能早于开始日期'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: this.visible,
      loading: false,
      form: {
        project_id: this.projectId,
        version_name: '',
        start_date: '',
        end_date: '',
        remark: '',
        tasklist: ''
      },
      rules: {
        version_name: [
          { required: true, message: '请输入版本名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        start_date: [
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        end_date: [{ validator: checkDate, trigger: 'blur' }],
        tasklist: [
          { required: true, message: '请选择关联任务', trigger: 'blur' }
        ]
      },
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
    relatedTaskList(list) {
      let ids = list.map(item => item.id)
      this.form.tasklist = ids.join(',')
    }
  },
  computed: {
    title() {
      return this.isUpdate ? '编辑版本' : '新增版本'
    },
    // 关联的任务
    relatedTaskList() {
      return this.$store.state.related.task
    }
  },
  methods: {
    init() {
      if (this.isUpdate) {
        this.getVersion()
        this.getVersionTask()
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
        query: { projectid: this.projectId }
      })
    },
    // 确定关联任务
    handlePrimaryRelatedTask() {},
    handleClose() {
      this.dialogVisible = false
      // 重置表单数据
      this.$refs.form.resetFields()
      // 清空store
      this.$store.dispatch('setRelated', { type: 'task', list: [] })
      this.$emit('update:visible', false)
    },
    // 确定
    handlePrimary() {
      this.$refs.form.validate().then(() => {
        this.isUpdate ? this.updateVersion() : this.addVersion()
      })
    },
    // 取消
    handleCancel() {
      this.handleClose()
    },
    // 创建、修改、删除成功后的回调
    handleSuccess() {
      this.submitLoading = false
      this.handleClose()
      this.$emit('update')
    },
    // 新增版本
    addVersion() {
      this.submitLoading = true
      api.addVersion(this.form).then(() => {
        this.$message({ type: 'success', message: '添加成功!' })
        this.handleSuccess()
      })
    },
    // 修改版本
    updateVersion() {
      this.submitLoading = true
      api.updateVersion(this.form).then(() => {
        this.$message({ type: 'success', message: '修改成功!' })
        this.handleSuccess()
      })
    },
    // 获取版本信息
    getVersion() {
      this.loading = true
      api.versionInfo({ versionid: this.id }).then(response => {
        this.form = Object.assign({}, this.form, response.data)
        this.loading = false
      })
    },
    // 获取版本任务
    getVersionTask() {
      api.versionTaskList({ versionid: this.id }).then(response => {
        this.$store.dispatch('setRelated', {
          type: 'task',
          list: response.data
        })
      })
    }
  }
}
</script>
