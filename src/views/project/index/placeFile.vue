<template>
  <el-dialog
    title="归档"
    width="640px"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="taskDialog freeze-dialog"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      :hide-required-asterisk="true"
    >
      <el-form-item
        label="归档说明"
        prop="mark"
      >
        <el-input
          type="textarea"
          rows="6"
          resize="none"
          maxlength="1000"
          v-model.trim="ruleForm.mark"
          placeholder="可以填写成片交付时间或者项目经验等…………"
        ></el-input>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleCancel">取 消</el-button>
      <el-button
        type="primary"
        @click="handlePrimary"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateStatus } from '@/api/project/projectIndex'
export default {
  props: {
    visible: { type: Boolean, default: false },
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
      defaultForm: { mark: '' },
      ruleForm: Object.assign({}, this.ruleForm),

      rules: {
        mark: [
          {
            required: true,
            message: '请输入归档说明',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(value) {
        this.dialogVisible = value
        this.ruleForm = Object.assign({}, this.defaultForm, this.data)
      }
    }
  },
  methods: {
    // 初始化
    init() {},
    // 取消
    handleCancel() {
      this.hideDialog()
    },
    // 确定
    handlePrimary() {
      // 校验通过
      this.$refs.ruleForm.validate().then(() => {
        updateStatus(this.ruleForm).then(res => {
          if (res.code === 0) {
            this.$message({
              customClass: 'custom-message',
              message: '修改成功',
              type: 'success',
              center: true
            })
            this.$emit('changeVisible', false)
            this.$emit('update:visible', false)
            this.$emit('reload')
          }
        })
      })
    },
    // 关闭的时候
    handleClose() {
      this.hideDialog()
    },
    // 隐藏模态框
    hideDialog() {
      this.dialogVisible = false
      // 重置表单数据
      this.$refs.ruleForm.resetFields()
      this.$emit('update:visible', false)
    }
  },
  beforeMount() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.freeze-dialog {
  /deep/ .el-dialog__body {
    padding-left: 50px;
    padding-right: 50px;
  }
}
</style>
