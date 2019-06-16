<template>
  <el-dialog title="新增视图表" :visible="visible" class="taskDialog" @close="closeDialogFn">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="视图表名称" :label-width="form.formLabelWidth" prop="episodes">
        <input
          v-model="form.episodes"
          autocomplete="off"
          placeholder="请输入视图表名称"
          class="el-input__inner"
          maxlength="20"
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
    headViewList: { type: String, required: false, default: '' }
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
      viewId:'',
      form: {
        episodes: '',
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
          title: this.form.episodes
        }
        if (valid) {
          modifyView(params).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.viewId = res.data.viewId;
              window.sessionStorage.setItem('viewType', this.viewId)
              this.$emit('update:visible', false);
              this.$emit('updated',this.viewId)
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
  beforeMount() {}
}
</script>
<style lang="scss">
</style>
