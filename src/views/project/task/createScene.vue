<template>
  <el-dialog title="新增场次" :visible="visible" class="taskDialog" @close="closeDialogFn">
    <el-form :model="form" :rules="rules" ref="form" label-width="130px">
      <el-form-item label="任务集数" prop="taskTemplateId">
        <el-select v-model="form.taskTemplateId" placeholder="请选择任务集数" style="width:100%">
          <el-option
            v-for="(item,index) in templates"
            :key="index"
            :label="item.episode"
            :value="item.episode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务场次" placeholder prop="episodes">
        <input
          v-model="form.episodes"
          autocomplete="off"
          placeholder="请输入“开始场次-结束场次”或单独场次"
          @keyup="form.episodes=form.episodes.replace(/[^\d|-]/g,'')"
          class="el-input__inner"
        >
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogFn">取 消</el-button>
      <el-button type="primary" @click="add()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getTaskTemplate, addProduceTaskScene } from '@/api/make'
export default {
  props: {
    template: {
      type: Array,
      default() {
        return []
      }
    },
    projectId: { type: String, required: true, default: '' },
    visible: { type: Boolean, default: false }
  },
  data() {
    var validateEpisodes = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入任务场次'))
      } else {
        let reg = /^\d+(-\d+)?$/
        let status = reg.test(value)
        if (!status) {
          callback(
            new Error('请输入“开始场次-结束场次”，开始场次需要小于结束场次')
          )
        } else {
          if (value.indexOf('-') == -1) {
            if (parseInt(value) >= 100) {
              callback(new Error('场次小于100'))
            } else {
              let val = []
              val.push(value)
              this.taskEpisodes = val
            }
          } else {
            let arr = value.split('-')
            let episodesA = []
            if (parseInt(arr[1]) >= 100) {
              callback(new Error('场次小于100'))
            }
            if (parseInt(arr[1]) <= parseInt(arr[0])) {
              callback(
                new Error('请输入“开始场次-结束场次”，开始场次需要小于结束场次')
              )
            }
             for (let i = parseInt(arr[0]); i <= parseInt(arr[1]); i++) {
                 episodesA.push(i)
             }
            value = episodesA
            this.taskEpisodes = episodesA
          }
        }
        callback()
      }
    }
    return {
      defaultTemplateId: '',
      taskEpisodes: [],
      templates: [],
      templateBool: true,
      form: {
        projectid: '',
        taskTemplateId: '',
        episodes: ''
      },
      rules: {
        taskTemplateId: [
          { required: true, message: '请选择任务集数', trigger: 'change' }
        ],
        episodes: [{ validator: validateEpisodes, trigger: 'blur' }]
      }
      // dialogVisible: this.visible
    }
  },
  watch: {
    visible: {
      deep: true,
      immediate: true,
      handler() {
        if (this.visible) {
          this.templateBool = false
          this.taskTemplate()
        }
      }
    }
  },
  methods: {
    taskTemplate() {
      let params = {
        projectid: this.projectId
      }
      getTaskTemplate(params).then(res => {
        this.templates = res.data.episodes
      })
    },
    add() {
      this.$refs.form.validate(valid => {
        var params = {}
        let temp = []
        temp.push(this.form.taskTemplateId)
        params.projectid = this.projectId
        params.episodes = temp
        params.scenes = this.taskEpisodes
        if (valid) {
          addProduceTaskScene(params).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.$emit('update:visible', false)
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
  }
}
</script>
<style lang="scss">
</style>
