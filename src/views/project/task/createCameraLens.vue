<template>
  <el-dialog title="新增镜头" :visible="visible" class="taskDialog" @close="closeDialogFn">
    <el-form :model="form" :rules="rules" ref="form" label-width="130px">
      <el-form-item label="任务集数" prop="taskTemplateId">
        <el-select
          v-model="form.taskTemplateId"
          placeholder="请选择任务集数"
          style="width:100%"
          @change="form.sceneId=''"
        >
          <el-option
            v-for="(item,index) in templates"
            :key="index"
            :label="item.episode"
            :value="item.episode"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="任务场次" prop="sceneId">
        <el-select v-model="form.sceneId" placeholder="请选择任务场次" style="width:100%">
          <template v-for="(item,index) in templatesScene">
            <el-option
              v-if="item.episode==form.taskTemplateId"
              :key="index"
              :label="item.scene"
              :value="item.scene"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>

      <el-form-item label="任务镜头" placeholder prop="episodes">
        <input
          v-model="form.episodes"
          autocomplete="off"
          placeholder="请输入“开始镜头-结束镜头”或单独镜头"
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
import { getTaskTemplate, addProduceTaskLens } from '@/api/make'
export default {
  props: {
    projectId: { type: String, required: true, default: '' },
    visible: { type: Boolean, default: false }
  },
  data() {
    var validateEpisodes = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入任务镜头'))
      } else {
        let reg = /^\d+(-\d+)?$/
        let status = reg.test(value)
        if (!status) {
          callback(new Error('请输入“开始镜头-结束镜头”或单独镜头'))
        } else {
          if (value.indexOf('-') == -1) {
            if (parseInt(value) >= 1000) {
              callback(new Error('镜头小于1000'))
            } else {
              let val = []
              val.push(value)
              this.taskEpisodes = val
            }
          } else {
            let arr = value.split('-')
            let episodesA = []
            if (parseInt(arr[1]) >= 1000) {
              callback(new Error('镜头小于1000'))
            }
            if (parseInt(arr[1]) <= parseInt(arr[0])) {
              callback(new Error('请输入“开始镜头-结束镜头”或单独镜头'))
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
      templates: [],
      templatesScene: [],
      taskEpisodes: [],
      templateBool: true,
      form: {
        projectid: '',
        taskTemplateId: '',
        sceneId: '',
        episodes: ''
      },
      rules: {
        taskTemplateId: [
          { required: true, message: '请选择任务集数', trigger: 'change' }
        ],
        sceneId: [
          { required: true, message: '请选择任务场次', trigger: 'change' }
        ],
        episodes: [{ validator: validateEpisodes, trigger: 'blur' }]
      }
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
        this.templatesScene = res.data.scenes
      })
    },
    add() {
      this.$refs.form.validate(valid => {
        var params = {}
        var episodes = []
        var scenes = []
        episodes.push(this.form.taskTemplateId)
        scenes.push(this.form.sceneId)

        params.projectid = this.projectId
        params.episodes = episodes
        params.scenes = scenes
        params.lens = this.taskEpisodes

        if (valid) {
          addProduceTaskLens(params).then(res => {
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
