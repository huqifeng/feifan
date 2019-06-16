<template>
  <div class="select-user-wrapper">
    <slot>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="dialogVisible = true"></el-button>
    </slot>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
      @close="handleClose"
      class="select-user-dialog"
      width="790px"
    >
      <select-user-panel v-bind="$attrs" ref="userPanel" :limitCount="limitCount"></select-user-panel>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="handleCancel">取 消</el-button>
        <el-button type="primary" round @click="handelPrimary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import selectUserPanel from './selectUserPanel'
export default {
  name: 'SelectUser',
  props: {
    title: { type: String, default: '选择用户' },
    limitCount: { type: Number, default: null }
  },
  components: { selectUserPanel },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    userPanel() {
      return this.$refs.userPanel
    }
  },
  methods: {
    // 触发改变
    handleChange() {
      // 数据去重
      let checkedUsers = this.$lodash.uniqBy(this.userPanel.checkedUsers, 'id')
      let ids = checkedUsers.map(user => user.id)
      if (this.userPanel.multiple) {
        this.$emit('change', checkedUsers)
        this.$emit('input', ids)
      } else {
        this.$emit('change', ...checkedUsers)
        this.$emit('input', ...ids)
      }
    },
    // 确定
    handelPrimary() {
      if (this.limitCount) {
        this.userPanel.validateLimit()
        if (this.userPanel.isShowTips) {
          return
        }
      }
      this.handleChange()
      this.dialogVisible = false
    },
    // 取消
    handleCancel() {
      // 还原
      this.userPanel.setChecked(this.userPanel.value)
      this.dialogVisible = false
    },
    // 模态框关闭的时候
    handleClose() {
      this.dialogVisible = false
      this.userPanel.isShowTips = false
    }
  }
}
</script>
<style lang="scss" scoped>
.select-user-dialog {
  /deep/ .el-dialog__body {
    height: 415px;
    padding-top: 10px;
  }
  /deep/ .select-user-tree {
    max-height: auto;
    height: calc(100% - 40px);
  }
  .select-user {
    height: 100%;
  }
}
</style>

