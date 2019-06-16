<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="阶段名称" prop="flow_name" v-if="!isPD">
        <el-input v-model="ruleForm.flow_name" :maxlength="20"></el-input>
      </el-form-item>
      <!-- 制作者 -->
      <el-form-item v-if="isPD" label="制作者">
        <template v-if="ruleForm.producer && ruleForm.producer.length">
          <div class="user" v-for="user in ruleForm.producer" :key="user.target_id">
            <div class="pic">
              <img :src="user.avatar | imageUrl">
            </div>
            <div class="name">{{user.realname}}</div>
          </div>
        </template>
        <template v-else>暂无数据</template>
      </el-form-item>
      <!-- 审核人 -->
      <el-form-item v-else label="审核人" prop="check_uid">
        <div class="user" v-show="ruleForm.check_uid">
          <div class="pic">
            <img :src="ruleForm.avatar | imageUrl">
          </div>
          <div class="name">{{ruleForm.check_uname}}</div>
        </div>
        <select-user title="选择审核人" @change="handleUserChange"></select-user>
      </el-form-item>
      <el-form-item label="可使用状态" prop="courseact">
        <el-select v-model="ruleForm.courseact" multiple placeholder="请选择" style="width:100%">
          <el-option v-for="item in useStatus" :key="item.id" :label="item.action" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onPrimary">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import SelectUser from '@/components/selectUser/selectUser'
import * as api from '@/api/project/settings'
export default {
  components: { SelectUser },
  props: {
    visible: { type: Boolean, default: false },
    isPD: { type: Boolean, default: false },
    pid: { type: String, default: '' },
    isUpdate: { type: Boolean, default: false },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      // 使用状态
      useStatus: [],
      defaultForm: {
        flow_name: '',
        check_uid: '',
        check_uname: '',
        courseact: []
      },
      ruleForm: {},
      rules: {
        flow_name: [
          { required: true, message: '请输入阶段名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        check_uid: [
          { required: true, message: '请选择审核人', trigger: 'change' }
        ],
        courseact: [
          {
            type: 'array',
            required: true,
            message: '请选择可用状态',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(value) {
        value && this.init()
      }
    }
  },
  computed: {
    title() {
      if (this.isUpdate) {
        return this.isPD ? '编辑制作者权限' : '编辑审核阶段'
      } else {
        return '新建'
      }
    }
  },
  methods: {
    init() {
      this.dialogVisible = true
      this.ruleForm = Object.assign({}, this.defaultForm, this.data)
      // 移除表单校验结果
      this.$nextTick(function() {
        this.$refs.ruleForm.clearValidate()
      })
      this.isPD ? this.getPDStatus() : this.getUseStatus()
    },
    // 审核状态
    getUseStatus() {
      api.taskStatusList({ project_id: this.pid }).then(response => {
        this.useStatus = response.data
      })
    },
    // 制作者状态
    getPDStatus() {
      api.taskPDStatusList({ project_id: this.pid }).then(response => {
        this.useStatus = response.data
      })
    },
    // 模态框关闭
    handleClose() {
      this.dialogVisible = false
      // 重置表单数据
      this.$refs.ruleForm.resetFields()
      this.$emit('update:visible', false)
    },
    // 模态框取消
    onCancel() {
      this.handleClose()
    },
    // 模态框确定
    onPrimary() {
      this.$refs.ruleForm.validate().then(() => {
        this.isUpdate ? this.handleUpdate() : this.handleAdd()
      })
    },
    handleUserChange(data) {
      this.ruleForm.check_uid = data.id
      this.ruleForm.check_uname = data.name
      this.ruleForm.avatar = data.avatar
    },
    // 添加
    handleAdd() {
      api.workflowAdd(this.ruleForm).then(() => {
        this.handleClose()
        this.$emit('update')
      })
    },
    // 修改
    handleUpdate() {
      this.isPD ? this.handlePDUpdate() : this.handleReviewUpdate()
    },
    // 制作者修改
    handlePDUpdate() {
      let params = {
        stage_type: this.ruleForm.stage_type,
        stage_name: this.ruleForm.stage_name,
        project_id: this.ruleForm.project_id,
        status_use: this.ruleForm.courseact
      }
      api.workflowPDUpdate(params).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.handleClose()
        this.$emit('update')
      })
    },
    // 审核人修改
    handleReviewUpdate() {
      api.workflowUpdate(this.ruleForm).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.handleClose()
        this.$emit('update')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  float: left;
  margin-right: 10px;
  .pic {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    background: #f2f2f2;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .name {
    text-align: center;
    line-height: 24px;
  }
}
</style>
