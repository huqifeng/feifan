<template>
  <el-dialog title="修改视图表" :visible="visible" class="taskDialog" @close="closeDialogFn">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="视图表名称" :label-width="form.formLabelWidth" prop="episodes">
        <input
          v-model="form.episodes"
          autocomplete="off"
          placeholder="请输入视图表名称"
          maxlength="20"
          class="el-input__inner"
        >
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogFn">取 消</el-button>
      <el-button type="primary" @click="createNumber">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { modifyView } from '@/api/project/task'
export default {
  props: {
    projectId: { type: String, required: false, default: '' },
    visible: { type: Boolean, default: true },
    headViewList: { type: String, required: false, default: '' },
    tv_id: { type: String, required: false, default: '' },
    tv_name: { type: String, required: false, default: '' }
  },
  data() {
    var validateEpisodes = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入任务集数'))
      } else {
        callback()
      }
    }
    return {
      form: {
        episodes: this.tv_name,
        formLabelWidth: '130px'
      },
      taskEpisodes: [],
      rules: {
        episodes: [{ validator: validateEpisodes, trigger: 'blur' }]
      }
    }
  },
  methods: {
    createNumber() {
      this.$refs.form.validate(valid => {
        let params = {
          projectid: this.projectId,
          task_field: this.headViewList,
          title: this.form.episodes,
          tv_id: this.tv_id
        }
        if (valid) {
          modifyView(params).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.$emit('update:visible', false)
              this.$emit('updated')
            }
          })
        } else {
          return false
        }
      })
    },
    closeDialogFn() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    }
  },
  mounted() {},
  beforeMount() {}
}
</script>
<style lang="scss">
</style>
