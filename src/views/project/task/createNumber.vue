<template>
  <el-dialog title="新增集数" :visible="visible" class="taskDialog" @close="closeDialogFn">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item
        label="任务集数"
        :label-width="form.formLabelWidth"
        placeholder="请创建任务集数"
        prop="episodes"
      >
        <input
          v-model="form.episodes"
          autocomplete="off"
          placeholder="请输入“开始集-结束集”或“单集集数”"
          @keyup="form.episodes=form.episodes.replace(/[^\d|-]/g,'')"
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
import { addProduceTaskEpisode } from '@/api/make'
export default {
  props: {
    projectId: { type: String, required: false, default: '' },
    visible: { type: Boolean, default: true }
  },
  data() {
    var validateEpisodes = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入任务集数'))
      } else {
        let reg = /^\d+(-\d+)?$/
        let status = reg.test(value)
        if (!status) {
          callback(new Error('请输入“开始集-结束集”，开始集需要小于结束集'))
        } else {
          if (value.indexOf('-') == -1) {
            if (parseInt(value) >= 200) {
              callback(new Error('集数小于200'))
            } else {
              let val = []
              val.push(value)
              this.taskEpisodes = val
            }
          } else {
            let arr = value.split('-')
            let episodesA = []
            if (parseInt(arr[1]) >= 200) {
              callback(new Error('集数小于200'))
            }
            if (parseInt(arr[1]) <= parseInt(arr[0])) {
              callback(new Error('请输入“开始集-结束集”，开始集需要小于结束集'))
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
        var params = {}
        params.projectid = this.projectId
        params.episodes = this.taskEpisodes
        if (valid) {
          addProduceTaskEpisode(params).then(res => {
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
  },
  beforeMount() {}
}
</script>
<style lang="scss">
</style>
